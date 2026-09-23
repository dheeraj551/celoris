"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GraduationCap, Hand, Loader2, Mic, MicOff, Send, UserPlus, X } from "lucide-react";
import type { RoomChatMessage, RoomParticipant } from "./hooks/useWhiteboardRoom";

interface RoomSidePanelProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  isHost: boolean;
  myId?: string;
  chat: RoomChatMessage[];
  onSend: (text: string) => Promise<string | null>;
  participants: RoomParticipant[];
  onAllowSpeak: (id: string) => void;
  onRevokeSpeak: (id: string) => void;
  onDismissHand: (id: string) => void;
}

function timeLabel(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export const RoomSidePanel: React.FC<RoomSidePanelProps> = ({
  open,
  onClose,
  roomId,
  isHost,
  myId,
  chat,
  onSend,
  participants,
  onAllowSpeak,
  onRevokeSpeak,
  onDismissHand,
}) => {
  const [tab, setTab] = useState<"chat" | "people">("chat");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && tab === "chat") listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.length, open, tab]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    setSendError(null);
    const error = await onSend(draft);
    setSending(false);
    if (error) setSendError(error);
    else setDraft("");
  };

  const hands = participants.filter((p) => p.handRaised && !p.isHost);

  return (
    <aside
      className={`absolute top-0 right-0 bottom-0 z-40 w-full sm:w-80 bg-white border-l border-neutral-200 shadow-2xl flex flex-col transition-transform duration-200 ${
        open ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="h-12 shrink-0 px-2 flex items-center gap-1 border-b border-neutral-200">
        {(["chat", "people"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold capitalize ${
              tab === t ? "bg-indigo-50 text-indigo-700" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            {t === "people" ? `People (${participants.length})` : "Class chat"}
            {t === "people" && hands.length > 0 && isHost && (
              <span className="ml-1.5 inline-flex items-center gap-0.5 text-amber-600">
                <Hand className="w-3 h-3" />
                {hands.length}
              </span>
            )}
          </button>
        ))}
        <button onClick={onClose} className="ml-auto h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      {tab === "chat" ? (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-neutral-50">
            {chat.length === 0 && (
              <p className="text-center text-xs text-neutral-400 mt-8">
                No messages yet. Questions and answers typed here are seen by the whole class.
              </p>
            )}
            {chat.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}>
                {!m.mine && (
                  <span className="text-[10px] font-semibold text-neutral-500 mb-0.5 flex items-center gap-1">
                    {m.isTrainer && <GraduationCap className="w-3 h-3 text-emerald-600" />}
                    {m.name}
                    {m.isTrainer && <span className="text-emerald-600">· Trainer</span>}
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm whitespace-pre-wrap break-words ${
                    m.mine
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : m.isTrainer
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-bl-md"
                      : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-neutral-400 mt-0.5">{timeLabel(m.at)}</span>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="shrink-0 p-2 border-t border-neutral-200 bg-white">
            {sendError && <p className="text-[11px] text-rose-600 px-1 pb-1">{sendError}</p>}
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(e as any);
                  }
                }}
                rows={1}
                maxLength={1000}
                placeholder="Message the class…"
                className="flex-1 resize-none max-h-28 rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                className="h-9 w-9 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-40"
                title="Send"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {isHost && <WaitingQueue roomId={roomId} />}

          <ul className="space-y-1.5">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50">
                <span
                  className={`w-8 h-8 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0 ${
                    p.speaking > 0.08 ? "ring-2 ring-emerald-400 ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.trim().slice(0, 1).toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate text-neutral-800">
                    {p.name}
                    {p.id === myId && <span className="text-neutral-400 font-normal"> (you)</span>}
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                    {p.isHost ? "Trainer" : "Student"}
                    {p.handRaised && !p.isHost && (
                      <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Hand className="w-3 h-3" /> hand raised
                      </span>
                    )}
                  </div>
                </div>
                {p.canSpeak && p.micOn ? (
                  <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                )}
                {isHost && !p.isHost && (
                  <div className="flex items-center gap-1 shrink-0">
                    {p.canSpeak ? (
                      <button
                        onClick={() => onRevokeSpeak(p.id)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      >
                        Mute
                      </button>
                    ) : (
                      <button
                        onClick={() => onAllowSpeak(p.id)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Let speak
                      </button>
                    )}
                    {p.handRaised && (
                      <button
                        onClick={() => onDismissHand(p.id)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                        title="Lower their hand"
                      >
                        Lower
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
            {participants.length === 0 && <li className="text-xs text-neutral-400 text-center py-6">Connecting…</li>}
          </ul>
        </div>
      )}
    </aside>
  );
};

interface QueueEntry {
  id: string;
  user_id: string;
  full_name: string | null;
}

/** Same waiting-queue API the 3D classroom's trainer sidebar uses. */
const WaitingQueue: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/social/cafe/classroom-queue?roomId=${encodeURIComponent(roomId)}`, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (res.ok) setQueue(body.queue || []);
    } catch {
      // next poll
    }
  }, [roomId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const admit = async (userId?: string) => {
    setBusy(userId || "next");
    setError(null);
    try {
      const res = await fetch("/api/social/cafe/admit-next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) setError(body.error || "Could not admit that student.");
      else load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  };

  if (queue.length === 0 && !error) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-amber-800">Waiting to join ({queue.length})</span>
        {queue.length > 0 && (
          <button
            onClick={() => admit()}
            disabled={!!busy}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
          >
            Admit next
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-rose-600 mb-1">{error}</p>}
      <ul className="space-y-1">
        {queue.map((q) => (
          <li key={q.id} className="flex items-center justify-between text-xs text-amber-900">
            <span className="truncate">{q.full_name || "Student"}</span>
            <button
              onClick={() => admit(q.user_id)}
              disabled={!!busy}
              className="flex items-center gap-1 text-[10px] font-semibold text-amber-800 hover:underline disabled:opacity-50"
            >
              <UserPlus className="w-3 h-3" /> Admit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
