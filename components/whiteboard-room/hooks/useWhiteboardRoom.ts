"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { createClient } from "@/lib/supabase-client";
import { applyBoardOp, BoardOp, BoardState, compactStroke, EMPTY_BOARD } from "../boardState";
import type { CanvasCard, RemoteUser, Stroke, ToolType } from "../types";

/**
 * Everything live about a whiteboard room, wired to the same stack as the 3D
 * classroom:
 *   - seat + capacity  → /api/social/cafe/classroom-presence (heartbeat)
 *   - audio + screen   → Agora (token from /api/agora/token)
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
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const agoraRef = useRef<any>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null>(null);
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

  // ---------------------------------------------------------------- presence, signaling, Agora
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

    const handleUserPublished = async (remoteUser: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      const client = clientRef.current;
      if (!client) return;
      await client.subscribe(remoteUser, mediaType);
      if (mediaType === "audio") remoteUser.audioTrack?.play();
      if (mediaType === "video" && remoteUser.videoTrack) {
        const track = remoteUser.videoTrack.getMediaStreamTrack();
        if (track) setScreenStream(new MediaStream([track]));
      }
    };
    const handleUserUnpublished = (_u: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      if (mediaType === "video") setScreenStream(null);
    };

    const subscribeSignaling = () => {
      const channel = supabase
        .channel(`classroom_${roomId}`, { config: { presence: { key: userId } } })
        .on("broadcast", { event: "allow_speak" }, ({ payload }: any) => {
          if (payload?.userId !== userId) return;
          setCanSpeak(true);
          setHandRaised(false);
          if (micTrackRef.current) {
            micTrackRef.current.setMuted(false);
            setMicOn(true);
          }
        })
        .on("broadcast", { event: "revoke_speak" }, ({ payload }: any) => {
          if (payload?.userId !== userId) return;
          setCanSpeak(false);
          if (micTrackRef.current) {
            micTrackRef.current.setMuted(true);
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
          if (!cancelled) setJoinError({ message, full: /full/i.test(message) });
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
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        if (cancelled) return;
        agoraRef.current = AgoraRTC;
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
        client.enableAudioVolumeIndicator();
        client.on("volume-indicator", (volumes: any[]) => {
          setVolumeByUid((prev) => {
            const next = { ...prev };
            volumes.forEach((v) => {
              next[String(v.uid)] = Math.min(v.level / 100, 1);
            });
            return next;
          });
        });

        const channelName = `classroom_${roomId}`;
        const tokenRes = await fetch("/api/agora/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelName, uid: userId, role: isHost ? "publisher" : "subscriber" }),
        });
        const tokenBody = await tokenRes.json();
        if (!tokenRes.ok || tokenBody.error) throw new Error(tokenBody.error || "Could not get a voice token");
        if (cancelled) return;
        await client.join(tokenBody.appId, channelName, tokenBody.token, userId);

        try {
          const mic = await AgoraRTC.createMicrophoneAudioTrack();
          if (!isHost) await mic.setMuted(true);
          micTrackRef.current = mic;
          await client.publish([mic]);
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
      micTrackRef.current?.close();
      micTrackRef.current = null;
      const st = screenTrackRef.current;
      if (Array.isArray(st)) st.forEach((t) => t.close());
      else st?.close();
      screenTrackRef.current = null;
      const client = clientRef.current;
      if (client) {
        client.off("user-published", handleUserPublished);
        client.off("user-unpublished", handleUserUnpublished);
        client.leave().catch(() => {});
      }
      clientRef.current = null;
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
    const mic = micTrackRef.current;
    if (!canSpeak || !mic) return;
    await mic.setMuted(micOn);
    setMicOn(!micOn);
  }, [canSpeak, micOn]);

  const stopScreenShare = useCallback(async () => {
    const st = screenTrackRef.current;
    if (!st) return;
    try {
      await clientRef.current?.unpublish(st);
    } catch {
      // already gone
    }
    if (Array.isArray(st)) st.forEach((t) => t.close());
    else st.close();
    screenTrackRef.current = null;
    setScreenStream(null);
    setSharingScreen(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    if (!isHost || !clientRef.current || !agoraRef.current || screenTrackRef.current) return;
    try {
      const track = await agoraRef.current.createScreenVideoTrack({ encoderConfig: "1080p_1" }, "auto");
      await clientRef.current.publish(track);
      screenTrackRef.current = track;
      const video: ILocalVideoTrack = Array.isArray(track) ? track[0] : track;
      video.on("track-ended", () => {
        stopScreenShare();
      });
      const raw = video.getMediaStreamTrack();
      if (raw) setScreenStream(new MediaStream([raw]));
      setSharingScreen(true);
    } catch (err: any) {
      if (err?.name !== "NotAllowedError" && err?.code !== "PERMISSION_DENIED") {
        console.error("Screen share failed", err);
        setBoardError("Screen sharing couldn't start. Check your browser's screen-share permission.");
      }
    }
  }, [isHost, stopScreenShare]);

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
