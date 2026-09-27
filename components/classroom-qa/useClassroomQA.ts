"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import {
  SUPER_SPOTLIGHT_MS,
  rowToQuestion,
  sortQuestions,
  type ClassQuestion,
  type QaMe,
  type QaMode,
} from "@/lib/classroom-questions";

/**
 * Live class Q&A for one room: the question list, the trainer's Lecture/Q&A
 * switch, what this person may do (ask, speak, Super Questions), and the
 * Super Question currently in the on-screen spotlight.
 *
 * Reads come from /api/classroom/questions and then stream in through
 * Supabase Realtime (RLS limits them to people admitted to the room). Every
 * write goes through the API, which checks plans, limits and credits.
 */
export function useClassroomQA({ roomId, userId, enabled = true }: { roomId: string; userId?: string | null; enabled?: boolean }) {
  const supabase = useMemo(() => createClient(), []);
  const [questions, setQuestions] = useState<ClassQuestion[]>([]);
  const [mode, setModeState] = useState<QaMode>("qa");
  const [me, setMe] = useState<QaMe | null>(null);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [trainerPresent, setTrainerPresent] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState<ClassQuestion | null>(null);

  const sinceRef = useRef<string>(new Date(0).toISOString());
  const spotQueueRef = useRef<ClassQuestion[]>([]);
  const spotShownRef = useRef<Set<number>>(new Set());
  const spotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spotCurrentRef = useRef<ClassQuestion | null>(null);

  // ---------------------------------------------------------------- spotlight
  const showNext = useCallback(() => {
    if (spotTimerRef.current) clearTimeout(spotTimerRef.current);
    const next = spotQueueRef.current.shift() || null;
    spotCurrentRef.current = next;
    setSpotlight(next);
    if (next) spotTimerRef.current = setTimeout(showNext, SUPER_SPOTLIGHT_MS);
  }, []);

  const queueSpotlight = useCallback(
    (q: ClassQuestion) => {
      if (q.credits <= 0 || q.status !== "open" || spotShownRef.current.has(q.id)) return;
      // Only fresh ones — not everything from earlier in the class after a reload.
      if (Date.now() - Date.parse(q.createdAt) > 2 * 60 * 1000) return;
      spotShownRef.current.add(q.id);
      spotQueueRef.current.push(q);
      if (!spotCurrentRef.current) showNext();
    },
    [showNext]
  );

  const dismissSpotlight = useCallback(() => showNext(), [showNext]);

  // ---------------------------------------------------------------- load
  const load = useCallback(async () => {
    if (!enabled || !roomId) return;
    try {
      const res = await fetch(`/api/classroom/questions?roomId=${encodeURIComponent(roomId)}`, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not load questions");
      sinceRef.current = body.since || sinceRef.current;
      setQuestions((body.questions || []) as ClassQuestion[]);
      setModeState(body.mode === "lecture" ? "lecture" : "qa");
      setMe(body.me || null);
      setTrainerPresent(!!body.trainerPresent);
      if (Array.isArray(body.speakers)) setSpeakers(body.speakers);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e?.message || "Could not load questions");
    } finally {
      setLoaded(true);
    }
  }, [enabled, roomId]);

  useEffect(() => {
    if (!enabled || !userId) return;
    load();
    // Plans, balance, who's here and who may speak change slowly — a light poll covers them.
    const t = setInterval(load, 25000);
    return () => clearInterval(t);
  }, [enabled, userId, load]);

  // ---------------------------------------------------------------- realtime
  useEffect(() => {
    if (!enabled || !userId || !roomId) return;
    const channel = supabase
      .channel(`classroom_qa_${roomId}_${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classroom_questions", filter: `room_id=eq.${roomId}` },
        (payload: any) => {
          const row = payload.new && Object.keys(payload.new).length ? payload.new : null;
          if (!row) return;
          const q = rowToQuestion(row);
          if (Date.parse(q.createdAt) < Date.parse(sinceRef.current)) return;
          setQuestions((prev) => {
            const i = prev.findIndex((x) => x.id === q.id);
            if (i === -1) return [q, ...prev].slice(0, 300);
            const next = prev.slice();
            next[i] = q;
            return next;
          });
          if (payload.eventType === "INSERT") {
            queueSpotlight(q);
            if (q.askerId === userId && q.credits === 0) {
              setMe((m) => (m ? { ...m, freeUsed: m.freeUsed + 1 } : m));
            }
          } else if (q.status !== "open") {
            // Answered or removed → drop it from the spotlight.
            spotQueueRef.current = spotQueueRef.current.filter((x) => x.id !== q.id);
            if (spotCurrentRef.current?.id === q.id) showNext();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classroom_qa_state", filter: `room_id=eq.${roomId}` },
        (payload: any) => {
          const m = payload.new?.mode;
          if (m === "qa" || m === "lecture") setModeState(m);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, userId, roomId, supabase, queueSpotlight, showNext]);

  useEffect(
    () => () => {
      if (spotTimerRef.current) clearTimeout(spotTimerRef.current);
    },
    []
  );

  // ---------------------------------------------------------------- actions
  /** Returns an error message, or null when sent. */
  const ask = useCallback(
    async (text: string, credits = 0): Promise<{ error: string | null; upgrade?: boolean }> => {
      try {
        const res = await fetch("/api/classroom/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, text, credits }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) return { error: body.error || "Could not send your question", upgrade: !!body.upgrade };
        if (typeof body.balance === "number" || typeof body.balance === "string") {
          const bal = Number(body.balance);
          setMe((m) => (m ? { ...m, balance: bal } : m));
        }
        return { error: null };
      } catch {
        return { error: "Couldn't reach Celoris. Check your connection." };
      }
    },
    [roomId]
  );

  const setMode = useCallback(
    async (next: QaMode) => {
      const prev = mode;
      setModeState(next);
      const res = await fetch("/api/classroom/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, mode: next }),
      }).catch(() => null);
      if (!res || !res.ok) setModeState(prev);
      return !!res && res.ok;
    },
    [roomId, mode]
  );

  const setStatus = useCallback(
    async (questionId: number, status: "open" | "answered" | "removed") => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, status, handledAt: status === "open" ? null : new Date().toISOString() } : q))
      );
      if (status !== "open") {
        spotQueueRef.current = spotQueueRef.current.filter((x) => x.id !== questionId);
        if (spotCurrentRef.current?.id === questionId) showNext();
      }
      const res = await fetch("/api/classroom/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, questionId, status }),
      }).catch(() => null);
      if (!res || !res.ok) load();
    },
    [roomId, load, showNext]
  );

  const sorted = useMemo(() => sortQuestions(questions), [questions]);
  const openCount = useMemo(() => questions.filter((q) => q.status === "open").length, [questions]);
  const speakerSet = useMemo(() => new Set(speakers), [speakers]);

  return {
    loaded,
    loadError,
    questions: sorted,
    openCount,
    mode,
    me,
    trainerPresent,
    speakers: speakerSet,
    spotlight,
    dismissSpotlight,
    ask,
    setMode,
    setStatus,
    reload: load,
  };
}

export type ClassroomQA = ReturnType<typeof useClassroomQA>;
