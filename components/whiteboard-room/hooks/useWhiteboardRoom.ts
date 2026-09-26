"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { applyBoardOp, BoardOp, BoardState, compactStroke, EMPTY_BOARD } from "../boardState";
import type { CanvasCard, RemoteUser, Stroke, ToolType } from "../types";

/**
 * Everything live about a whiteboard room, wired to the same stack as the 3D
 * classroom:
 *   - seat + capacity  → /api/social/cafe/classroom-presence (heartbeat)
 *   - audio + screen   → Tencent RTC (UserSig from /api/tencent/classroom-sig).
 *                        The 3D classroom stays on Agora, so the two room
 *                        types don't depend on the same provider.
 *   - who's here, hands, mic permission → Supabase Realtime presence/broadcast
 *     on the same `classroom_<roomId>` channel name the 3D room uses
 *   - the board + chat → /api/social/cafe/room-events (server-checked writes)
 *     streamed back through Supabase Realtime (postgres_changes)
 */

export interface RoomParticipant {
  id: string;
  name: string;
  isHost: boolean;
  handRaised: boolean;
  canSpeak: boolean;
  micOn: boolean;
  color: string;
  speaking: number;
}

export interface RoomChatMessage {
  id: number;
  userId: string | null;
  name: string;
  text: string;
  isTrainer: boolean;
  at: string;
  mine: boolean;
}

interface EventRow {
  id: number;
  kind: "board" | "chat";
  payload: any;
  author_id: string | null;
  author_name: string | null;
  created_at: string;
}

interface Options {
  roomId: string;
  isHost: boolean;
  userId: string | undefined;
  displayName: string;
}

const PALETTE = ["#6366f1", "#2563eb", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316", "#14b8a6", "#ef4444", "#22c55e", "#f43f5e"];
export function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function mergeUpdates(a: Partial<CanvasCard>, b: Partial<CanvasCard>): Partial<CanvasCard> {
  const merged: any = { ...a, ...b };
  if ((a as any).data || (b as any).data) merged.data = { ...((a as any).data || {}), ...((b as any).data || {}) };
  return merged;
}

function rowToChat(row: EventRow, me: string | undefined): RoomChatMessage {
  return {
    id: row.id,
    userId: row.author_id,
    name: row.author_name || "Someone",
    text: String(row.payload?.text || ""),
    isTrainer: !!row.payload?.isTrainer,
    at: row.created_at,
    mine: !!me && row.author_id === me,
  };
}

export function useWhiteboardRoom({ roomId, isHost, userId, displayName }: Options) {
  const supabase = useMemo(() => createClient(), []);
  const sid = useMemo(() => Math.random().toString(36).slice(2, 12), []);

  // ---------------------------------------------------------------- state
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);
  const [boardLoaded, setBoardLoaded] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [chat, setChat] = useState<RoomChatMessage[]>([]);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<{ message: string; full: boolean } | null>(null);
  const [queueRetryToken, setQueueRetryToken] = useState(0);

  const [presenceState, setPresenceState] = useState<Record<string, any[]>>({});
  const [volumeByUid, setVolumeByUid] = useState<Record<string, number>>({});
  const [micOn, setMicOn] = useState(isHost);
  const [canSpeak, setCanSpeak] = useState(isHost);
  const [handRaised, setHandRaised] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remoteStreamingStrokes, setRemoteStreamingStrokes] = useState<Map<string, Stroke>>(new Map());
  const [trainerCursors, setTrainerCursors] = useState<Record<string, RemoteUser>>({});

  // ---------------------------------------------------------------- refs
  const boardRef = useRef<BoardState>(EMPTY_BOARD);
  boardRef.current = board;
  const seenIdsRef = useRef<Set<number>>(new Set());
  const maxIdRef = useRef(0);
  const loadedRef = useRef(false);
  const bufferRef = useRef<EventRow[]>([]);
  const queueRef = useRef<BoardOp[]>([]);
  const sendingRef = useRef(false);
  const signalRef = useRef<any>(null);
  const eventsChannelRef = useRef<any>(null);
  // Tencent RTC (trtc-sdk-v5) client, its TRTC module, and whether our mic started.
  const trtcRef = useRef<any>(null);
  const trtcModRef = useRef<any>(null);
  const micReadyRef = useRef(false);
  const sharingRef = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hostIdsRef = useRef<Set<string>>(new Set());
  const streamTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const lastStreamSentRef = useRef(0);
  const lastCursorSentRef = useRef(0);
  const selfStateRef = useRef({ handRaised: false, canSpeak: isHost, micOn: isHost });
  selfStateRef.current = { handRaised, canSpeak, micOn };

  // ---------------------------------------------------------------- board log
  const markSeen = (id: number) => {
    seenIdsRef.current.add(id);
    if (id > maxIdRef.current) maxIdRef.current = id;
    if (seenIdsRef.current.size > 20000) seenIdsRef.current = new Set(Array.from(seenIdsRef.current).slice(-10000));
  };

  const dropStreamingStroke = useCallback((strokeId: string) => {
    setRemoteStreamingStrokes((prev) => {
      if (!prev.has(strokeId)) return prev;
      const next = new Map(prev);
      next.delete(strokeId);
      return next;
    });
  }, []);

  const applyRow = useCallback(
    (row: EventRow) => {
      if (seenIdsRef.current.has(row.id)) return;
      markSeen(row.id);
      if (row.kind === "board") {
        const op = row.payload as BoardOp & { sid?: string };
        if (op.type === "stroke_add") dropStreamingStroke(op.stroke.id);
        if (op.sid === sid) return; // our own change, already on screen
        setBoard((b) => applyBoardOp(b, op));
      } else if (row.kind === "chat") {
        setChat((prev) => [...prev, rowToChat(row, userId)].slice(-300));
      }
    },
    [sid, userId, dropStreamingStroke]
  );

  const loadEvents = useCallback(
    async (afterId = 0) => {
      const url = `/api/social/cafe/room-events?roomId=${encodeURIComponent(roomId)}${afterId ? `&afterId=${afterId}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not load the board.");
      return (body.events || []) as EventRow[];
    },
    [roomId]
  );

  /** Full rebuild (first load, or after a failed write). */
  const resync = useCallback(async () => {
    // Buffer live events while we rebuild, then apply whatever is newer.
    loadedRef.current = false;
    try {
      const rows = await loadEvents(0);
      let state = EMPTY_BOARD;
      const chatRows: RoomChatMessage[] = [];
      seenIdsRef.current = new Set();
      maxIdRef.current = 0;
      for (const row of rows) {
        markSeen(row.id);
        if (row.kind === "board") state = applyBoardOp(state, row.payload as BoardOp);
        else chatRows.push(rowToChat(row, userId));
      }
      // Keep any of our own changes that are still waiting to be sent.
      for (const op of queueRef.current) state = applyBoardOp(state, op);
      setBoard(state);
      setChat(chatRows);
      loadedRef.current = true;
      setBoardLoaded(true);
      setBoardError(null);
      const buffered = bufferRef.current;
      bufferRef.current = [];
      buffered.sort((a, b) => a.id - b.id).forEach(applyRow);
    } catch (e: any) {
      setBoardError(e?.message || "Could not load the board.");
    }
  }, [loadEvents, applyRow, userId]);

  /** After a reconnect or an oversized realtime row: fetch what we missed. */
  const catchUp = useCallback(async () => {
    try {
      const rows = await loadEvents(Math.max(1, maxIdRef.current - 200));
      rows.forEach(applyRow);
    } catch {
      // The next reconnect / event will try again.
    }
  }, [loadEvents, applyRow]);

  // Subscribe first, then load, so nothing that happens in between is lost.
  useEffect(() => {
    if (!userId) return;
    loadedRef.current = false;
    const channel = supabase
      .channel(`wbroom_events_${roomId}_${sid}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cafe_room_events", filter: `room_id=eq.${roomId}` },
        (payload: any) => {
          const row = payload.new as EventRow;
          if (!row?.id) return;
          if (!loadedRef.current) {
            bufferRef.current.push(row);
            return;
          }
          if (row.payload == null) {
            catchUp();
            return;
          }
          applyRow(row);
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          if (!loadedRef.current) resync();
          else catchUp();
        }
      });
    eventsChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      eventsChannelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, supabase]);

  // ---------------------------------------------------------------- sending board ops (trainer)
  const drain = useCallback(async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    try {
      while (queueRef.current.length) {
        const op = queueRef.current[0];
        let ok = false;
        let message = "";
        try {
          const res = await fetch("/api/social/cafe/room-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId, kind: "board", op: { ...op, sid } }),
          });
          ok = res.ok;
          if (!ok) message = (await res.json().catch(() => ({}))).error || "The board couldn't save that change.";
        } catch {
          message = "Connection problem — that change wasn't saved.";
        }
        queueRef.current.shift();
        if (!ok) {
          setBoardError(message);
          queueRef.current = [];
          await resync();
          break;
        }
      }
    } finally {
      sendingRef.current = false;
    }
  }, [roomId, sid, resync]);

  const sendOp = useCallback(
    (op: BoardOp) => {
      if (!isHost) return;
      setBoard((b) => applyBoardOp(b, op));
      const q = queueRef.current;
      const tail = q.length > 1 || (q.length === 1 && !sendingRef.current) ? q[q.length - 1] : undefined;
      if (tail && op.type === "card_update" && tail.type === "card_update" && tail.cardId === op.cardId) {
        q[q.length - 1] = { ...tail, updates: mergeUpdates(tail.updates, op.updates) };
      } else if (tail && op.type === "strokes_delete" && tail.type === "strokes_delete") {
        q[q.length - 1] = { type: "strokes_delete", ids: [...tail.ids, ...op.ids] };
      } else {
        q.push(op);
      }
      drain();
    },
    [isHost, drain]
  );

  // ---------------------------------------------------------------- undo / redo (trainer ink only)
  const undoStack = useRef<{ undo: BoardOp; redo: BoardOp; at: number }[]>([]);
  const redoStack = useRef<{ undo: BoardOp; redo: BoardOp; at: number }[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);
  const pushHistory = (undo: BoardOp, redo: BoardOp) => {
    const last = undoStack.current[undoStack.current.length - 1];
    const now = Date.now();
    // One eraser swipe fires many small deletes — undo them as one.
    if (last && redo.type === "strokes_delete" && last.redo.type === "strokes_delete" && undo.type === "strokes_restore" && last.undo.type === "strokes_restore" && now - last.at < 600) {
      last.redo = { type: "strokes_delete", ids: [...last.redo.ids, ...redo.ids] };
      last.undo = { type: "strokes_restore", strokes: [...last.undo.strokes, ...undo.strokes] };
      last.at = now;
    } else {
      undoStack.current.push({ undo, redo, at: now });
      if (undoStack.current.length > 100) undoStack.current.shift();
    }
    redoStack.current = [];
    setHistoryVersion((v) => v + 1);
  };

  const commitStroke = useCallback(
    (stroke: Stroke) => {
      const clean = compactStroke(stroke);
      pushHistory({ type: "strokes_delete", ids: [clean.id] }, { type: "stroke_add", stroke: clean });
      sendOp({ type: "stroke_add", stroke: clean });
      signalRef.current?.send({ type: "broadcast", event: "wb_stream_end", payload: { strokeId: clean.id } });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendOp]
  );

  const deleteStrokes = useCallback(
    (ids: string[]) => {
      const removed = boardRef.current.strokes.filter((s) => ids.includes(s.id));
      if (!removed.length) return;
      pushHistory({ type: "strokes_restore", strokes: removed }, { type: "strokes_delete", ids });
      sendOp({ type: "strokes_delete", ids });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendOp]
  );

  const clearBoard = useCallback(() => {
    const all = boardRef.current.strokes;
    if (!all.length) return;
    pushHistory({ type: "strokes_restore", strokes: all }, { type: "board_clear" });
    sendOp({ type: "board_clear" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendOp]);

  const undo = useCallback(() => {
    const entry = undoStack.current.pop();
    if (!entry) return;
    redoStack.current.push(entry);
    setHistoryVersion((v) => v + 1);
    sendOp(entry.undo);
  }, [sendOp]);

  const redo = useCallback(() => {
    const entry = redoStack.current.pop();
    if (!entry) return;
    undoStack.current.push(entry);
    setHistoryVersion((v) => v + 1);
    sendOp(entry.redo);
  }, [sendOp]);

  const canUndo = historyVersion >= 0 && undoStack.current.length > 0;
  const canRedo = historyVersion >= 0 && redoStack.current.length > 0;

  const addCard = useCallback((card: CanvasCard) => sendOp({ type: "card_create", card }), [sendOp]);
  const updateCard = useCallback(
    (cardId: string, updates: Partial<CanvasCard>) => sendOp({ type: "card_update", cardId, updates }),
    [sendOp]
  );
  const deleteCard = useCallback((cardId: string) => sendOp({ type: "card_delete", cardId }), [sendOp]);
  const setTexture = useCallback((texture: BoardState["texture"]) => sendOp({ type: "background", texture }), [sendOp]);

  // Live preview of the stroke being drawn + the trainer's pointer. These are
  // cosmetic and short-lived (the real stroke arrives through the event log).
  const streamStroke = useCallback(
    (stroke: Stroke) => {
      if (!isHost) return;
      const now = Date.now();
      if (now - lastStreamSentRef.current < 70) return;
      lastStreamSentRef.current = now;
      const pts = stroke.points.length > 400 ? stroke.points.slice(-400) : stroke.points;
      signalRef.current?.send({
        type: "broadcast",
        event: "wb_stream",
        payload: { userId, stroke: compactStroke({ ...stroke, points: pts }) },
      });
    },
    [isHost, userId]
  );

  const sendCursor = useCallback(
    (cursor: { x: number; y: number; isDrawing: boolean; tool: ToolType }) => {
      if (!isHost) return;
      const now = Date.now();
      if (now - lastCursorSentRef.current < 60) return;
      lastCursorSentRef.current = now;
      signalRef.current?.send({
        type: "broadcast",
        event: "wb_cursor",
        payload: { userId, name: displayName, cursor: { x: Math.round(cursor.x), y: Math.round(cursor.y), isDrawing: cursor.isDrawing, tool: cursor.tool } },
      });
    },
    [isHost, userId, displayName]
  );

  // ---------------------------------------------------------------- chat
  const sendChat = useCallback(
    async (text: string): Promise<string | null> => {
      const trimmed = text.trim();
      if (!trimmed) return null;
      try {
        const res = await fetch("/api/social/cafe/room-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, kind: "chat", text: trimmed }),
        });
        if (!res.ok) return (await res.json().catch(() => ({}))).error || "Message not sent.";
        return null;
      } catch {
        return "Message not sent — check your connection.";
      }
    },
    [roomId]
  );

  // ---------------------------------------------------------------- presence, signaling, Tencent RTC
  const trackPresence = useCallback(() => {
    if (!signalRef.current || !userId) return;
    const s = selfStateRef.current;
    signalRef.current.track({
      userId,
      name: displayName,
      isHost,
      handRaised: s.handRaised,
      canSpeak: s.canSpeak,
      micOn: s.micOn,
    });
  }, [userId, displayName, isHost]);

  useEffect(() => {
    trackPresence();
  }, [handRaised, canSpeak, micOn, displayName, trackPresence]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const subscribeSignaling = () => {
      const channel = supabase
        .channel(`classroom_${roomId}`, { config: { presence: { key: userId } } })
        .on("broadcast", { event: "allow_speak" }, ({ payload }: any) => {
          if (payload?.userId !== userId) return;
          setCanSpeak(true);
          setHandRaised(false);
          if (micReadyRef.current && trtcRef.current) {
            trtcRef.current.updateLocalAudio({ mute: false }).catch(() => undefined);
            setMicOn(true);
          }
        })
        .on("broadcast", { event: "revoke_speak" }, ({ payload }: any) => {
          if (payload?.userId !== userId) return;
          setCanSpeak(false);
          if (micReadyRef.current && trtcRef.current) {
            trtcRef.current.updateLocalAudio({ mute: true }).catch(() => undefined);
            setMicOn(false);
          }
        })
        .on("broadcast", { event: "dismiss_hand" }, ({ payload }: any) => {
          if (payload?.userId === userId) setHandRaised(false);
        })
        .on("broadcast", { event: "wb_stream" }, ({ payload }: any) => {
          if (!payload?.stroke?.id || !hostIdsRef.current.has(payload.userId)) return;
          const stroke = payload.stroke as Stroke;
          setRemoteStreamingStrokes((prev) => new Map(prev).set(stroke.id, stroke));
          const timers = streamTimersRef.current;
          const existing = timers.get(stroke.id);
          if (existing) clearTimeout(existing);
          timers.set(
            stroke.id,
            setTimeout(() => {
              timers.delete(stroke.id);
              dropStreamingStroke(stroke.id);
            }, 4000)
          );
        })
        .on("broadcast", { event: "wb_stream_end" }, ({ payload }: any) => {
          if (payload?.strokeId) setTimeout(() => dropStreamingStroke(payload.strokeId), 1500);
        })
        .on("broadcast", { event: "wb_cursor" }, ({ payload }: any) => {
          if (!payload?.userId || !hostIdsRef.current.has(payload.userId) || payload.userId === userId) return;
          setTrainerCursors((prev) => ({
            ...prev,
            [payload.userId]: {
              id: payload.userId,
              name: String(payload.name || "Trainer").slice(0, 40),
              color: "#16a34a",
              avatar: "",
              role: "Teacher",
              cursor: payload.cursor,
            },
          }));
        })
        .on("presence", { event: "sync" }, () => setPresenceState(channel.presenceState()))
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") trackPresence();
        });
      signalRef.current = channel;
    };

    const init = async () => {
      setJoinError(null);
      try {
        const res = await fetch("/api/social/cafe/classroom-presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "join", roomId, role: isHost ? "trainer" : "student" }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const message: string = body.error || "This room is full. Please try again later.";
          if (!cancelled) setJoinError({ message, full: body.queue === true || /full/i.test(message) });
          return;
        }
      } catch {
        if (!cancelled) setJoinError({ message: "Couldn't reach Celoris. Check your connection and try again.", full: false });
        return;
      }
      if (cancelled) return;

      heartbeatRef.current = setInterval(() => {
        fetch("/api/social/cafe/classroom-presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat", roomId, role: isHost ? "trainer" : "student" }),
        }).catch(() => {});
      }, 20000);

      subscribeSignaling();

      try {
        // Voice + screen share on Tencent RTC.
        const sigRes = await fetch("/api/tencent/classroom-sig", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });
        const sig = await sigRes.json().catch(() => ({}));
        if (!sigRes.ok || !sig.userSig) throw new Error(sig.error || "Could not get voice credentials");
        if (cancelled) return;

        // @ts-ignore — trtc-sdk-v5 ships its own types; kept loose here.
        const mod: any = await import("trtc-sdk-v5");
        if (cancelled) return;
        const TRTC = mod.default || mod;
        trtcModRef.current = TRTC;
        const trtc = TRTC.create();
        trtcRef.current = trtc;

        const SUB = TRTC.TYPE.STREAM_TYPE_SUB;
        trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, async (event: any) => {
          if (event.streamType !== SUB) return; // only screen shares are used here
          try {
            // Pull the stream without rendering; the board shows it as a card.
            await trtc.startRemoteVideo({ userId: event.userId, streamType: SUB, view: null });
            const track: MediaStreamTrack | null = trtc.getVideoTrack({ userId: event.userId, streamType: SUB });
            if (track) setScreenStream(new MediaStream([track]));
          } catch (e) {
            console.error("Whiteboard room: couldn't show the shared screen", e);
          }
        });
        trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, (event: any) => {
          if (event.streamType === SUB) setScreenStream(null);
        });
        trtc.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
          sharingRef.current = false;
          setSharingScreen(false);
          setScreenStream(null);
        });
        trtc.on(TRTC.EVENT.AUDIO_VOLUME, (event: any) => {
          const list: any[] = event?.result || [];
          setVolumeByUid((prev) => {
            const next = { ...prev };
            list.forEach((v) => {
              // Our own volume comes back with an empty userId.
              const id = v.userId ? String(v.userId) : String(userId);
              next[id] = Math.min((Number(v.volume) || 0) / 100, 1);
            });
            return next;
          });
        });
        trtc.on(TRTC.EVENT.ERROR, (error: any) => console.error("Whiteboard room: TRTC error", error));

        await trtc.enterRoom({
          sdkAppId: sig.sdkAppId,
          userId: sig.userId,
          userSig: sig.userSig,
          strRoomId: sig.roomId,
          scene: "rtc",
        });
        if (cancelled) {
          trtc.exitRoom().catch(() => {});
          return;
        }
        trtc.enableAudioVolumeEvaluation(500);

        try {
          await trtc.startLocalAudio();
          micReadyRef.current = true;
          if (!isHost) await trtc.updateLocalAudio({ mute: true });
        } catch (deviceErr) {
          console.warn("Whiteboard room: microphone unavailable", deviceErr);
        }
      } catch (err) {
        // The board and chat still work without voice.
        console.error("Whiteboard room: voice/screen share unavailable", err);
      }
      if (!cancelled) setJoined(true);
    };

    init();

    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      fetch("/api/social/cafe/classroom-presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leave", roomId }),
        keepalive: true,
      }).catch(() => {});
      const trtc = trtcRef.current;
      trtcRef.current = null;
      micReadyRef.current = false;
      sharingRef.current = false;
      if (trtc) {
        (async () => {
          try {
            await trtc.exitRoom();
          } catch {
            // already gone
          }
          try {
            trtc.destroy();
          } catch {
            // ignore
          }
        })();
      }
      if (signalRef.current) {
        supabase.removeChannel(signalRef.current);
        signalRef.current = null;
      }
      streamTimersRef.current.forEach((t) => clearTimeout(t));
      streamTimersRef.current.clear();
      setJoined(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, isHost, queueRetryToken]);

  // ---------------------------------------------------------------- participants
  const participants: RoomParticipant[] = useMemo(() => {
    const list = Object.values(presenceState)
      .map((entries) => entries?.[0])
      .filter((p: any) => p && p.userId)
      .map((p: any) => ({
        id: String(p.userId),
        name: String(p.name || (p.isHost ? "Trainer" : "Student")).slice(0, 60),
        isHost: !!p.isHost,
        handRaised: !!p.handRaised,
        canSpeak: !!p.canSpeak,
        micOn: !!p.micOn,
        color: p.isHost ? "#16a34a" : colorForId(String(p.userId)),
        speaking: volumeByUid[String(p.userId)] || 0,
      }));
    list.sort((a, b) => (a.isHost === b.isHost ? a.name.localeCompare(b.name) : a.isHost ? -1 : 1));
    return list;
  }, [presenceState, volumeByUid]);

  useEffect(() => {
    hostIdsRef.current = new Set(participants.filter((p) => p.isHost).map((p) => p.id));
  }, [participants]);

  // Hide a trainer's pointer when they go quiet or leave.
  useEffect(() => {
    const timer = setInterval(() => {
      setTrainerCursors((prev) => {
        const ids = Object.keys(prev).filter((id) => hostIdsRef.current.has(id));
        if (ids.length === Object.keys(prev).length) return prev;
        const next: Record<string, RemoteUser> = {};
        ids.forEach((id) => (next[id] = prev[id]));
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------------- media controls
  const toggleMic = useCallback(async () => {
    const trtc = trtcRef.current;
    if (!canSpeak || !trtc || !micReadyRef.current) return;
    try {
      await trtc.updateLocalAudio({ mute: micOn });
      setMicOn(!micOn);
    } catch (e) {
      console.error("Whiteboard room: mic toggle failed", e);
    }
  }, [canSpeak, micOn]);

  const stopScreenShare = useCallback(async () => {
    const trtc = trtcRef.current;
    if (!sharingRef.current) return;
    sharingRef.current = false;
    try {
      await trtc?.stopScreenShare();
    } catch {
      // already gone
    }
    setScreenStream(null);
    setSharingScreen(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    const trtc = trtcRef.current;
    const TRTC = trtcModRef.current;
    if (!isHost || !trtc || !TRTC || sharingRef.current) return;
    try {
      await trtc.startScreenShare({ option: { profile: "1080p", systemAudio: true } });
      sharingRef.current = true;
      const raw: MediaStreamTrack | null = trtc.getVideoTrack({ streamType: TRTC.TYPE.STREAM_TYPE_SUB });
      if (raw) setScreenStream(new MediaStream([raw]));
      setSharingScreen(true);
    } catch (err: any) {
      const name = String(err?.name || err?.originError?.name || "");
      if (!/NotAllowedError|PermissionDenied/i.test(name) && !/permission|denied|cancel/i.test(String(err?.message || ""))) {
        console.error("Screen share failed", err);
        setBoardError("Screen sharing couldn't start. Check your browser's screen-share permission.");
      }
    }
  }, [isHost]);

  const toggleHand = useCallback(() => setHandRaised((h) => !h), []);

  const allowToSpeak = useCallback(
    (id: string) => isHost && signalRef.current?.send({ type: "broadcast", event: "allow_speak", payload: { userId: id } }),
    [isHost]
  );
  const revokeSpeak = useCallback(
    (id: string) => isHost && signalRef.current?.send({ type: "broadcast", event: "revoke_speak", payload: { userId: id } }),
    [isHost]
  );
  const dismissHand = useCallback(
    (id: string) => isHost && signalRef.current?.send({ type: "broadcast", event: "dismiss_hand", payload: { userId: id } }),
    [isHost]
  );

  return {
    // board
    board,
    boardLoaded,
    boardError,
    clearBoardError: () => setBoardError(null),
    retryBoard: resync,
    commitStroke,
    streamStroke,
    deleteStrokes,
    clearBoard,
    undo,
    redo,
    canUndo,
    canRedo,
    addCard,
    updateCard,
    deleteCard,
    setTexture,
    sendCursor,
    remoteStreamingStrokes,
    trainerCursors: Object.values(trainerCursors),
    // chat
    chat,
    sendChat,
    // people + media
    joined,
    joinError,
    retryJoin: () => setQueueRetryToken((t) => t + 1),
    participants,
    micOn,
    canSpeak,
    handRaised,
    toggleMic,
    toggleHand,
    allowToSpeak,
    revokeSpeak,
    dismissHand,
    sharingScreen,
    screenStream,
    startScreenShare,
    stopScreenShare,
  };
}
