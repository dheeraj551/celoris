"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, Crown, Loader2, MessageCircleQuestion, RotateCcw, Send, Sparkles, Trash2, Zap } from "lucide-react";
import { QUESTION_MAX_CHARS, SUPER_AMOUNTS, isPaidTier, type ClassQuestion } from "@/lib/classroom-questions";
import type { ClassroomQA } from "./useClassroomQA";

// The Q&A list for a live class — used by the 3D classroom (dark) and the 2D
// whiteboard room (light). Students ask here; the trainer answers, removes,
// and flips the room between Lecture mode and Q&A.

type Theme = "dark" | "light";

const T = {
  dark: {
    wrap: "text-slate-200",
    heading: "text-slate-400",
    muted: "text-slate-500",
    card: "bg-[#151d2f] border-slate-800",
    cardDone: "bg-[#111726] border-slate-800/60 opacity-60",
    input: "bg-[#141b2a] border-slate-700/70 text-slate-200 placeholder-slate-500 focus:border-blue-500",
    chip: "bg-[#151c2c] border-slate-700/60 text-slate-300 hover:bg-[#1e283d]",
    chipOn: "bg-amber-400 border-amber-300 text-amber-950",
    seg: "bg-[#111726] border-slate-800",
    segOn: "bg-slate-700 text-white",
    segOff: "text-slate-400 hover:text-white",
    iconBtn: "text-slate-400 hover:text-white hover:bg-slate-800",
    lock: "bg-[#131a29] border-slate-800 text-slate-400",
    notice: "bg-sky-950/40 border-sky-800/50 text-sky-200",
  },
  light: {
    wrap: "text-neutral-800",
    heading: "text-neutral-500",
    muted: "text-neutral-500",
    card: "bg-white border-neutral-200",
    cardDone: "bg-neutral-50 border-neutral-200 opacity-60",
    input: "bg-white border-neutral-200 text-neutral-800 placeholder-neutral-400 focus:border-indigo-400",
    chip: "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50",
    chipOn: "bg-amber-400 border-amber-400 text-amber-950",
    seg: "bg-neutral-100 border-neutral-200",
    segOn: "bg-white text-neutral-900 shadow-sm",
    segOff: "text-neutral-500 hover:text-neutral-900",
    iconBtn: "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100",
    lock: "bg-neutral-50 border-neutral-200 text-neutral-500",
    notice: "bg-sky-50 border-sky-200 text-sky-800",
  },
};

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
}

export const QuestionsPanel: React.FC<{
  qa: ClassroomQA;
  isHost: boolean;
  myId?: string | null;
  theme: Theme;
  /** Trainer switched to Lecture mode — e.g. lower every raised hand. */
  onLectureStarted?: () => void;
  className?: string;
}> = ({ qa, isHost, myId, theme, onLectureStarted, className = "" }) => {
  const c = T[theme];
  const [draft, setDraft] = useState("");
  const [superOn, setSuperOn] = useState(false);
  const [amount, setAmount] = useState(SUPER_AMOUNTS[1]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<{ text: string; upgrade?: boolean } | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const me = qa.me;
  const left = me && me.freeLimit !== null ? Math.max(0, me.freeLimit - me.freeUsed) : null;
  const outOfFree = left !== null && left <= 0;
  const canSuper = !!me?.superAllowed;
  const lecture = qa.mode === "lecture";

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    const credits = superOn && canSuper ? amount : 0;
    if (!credits && outOfFree) {
      setError({ text: "You've used your questions for this class.", upgrade: !canSuper });
      return;
    }
    setSending(true);
    setError(null);
    const r = await qa.ask(text, credits);
    setSending(false);
    if (r.error) setError({ text: r.error, upgrade: r.upgrade });
    else {
      setDraft("");
      setSuperOn(false);
      setSent(credits ? `Super Question sent — ${credits} credits to your trainer.` : lecture ? "Sent. Your trainer will take questions at Q&A time." : "Question sent.");
      setTimeout(() => setSent(null), 4000);
    }
  };

  return (
    <section className={`space-y-3 ${c.wrap} ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${c.heading}`}>
          <MessageCircleQuestion className="w-3.5 h-3.5" /> Questions
          {qa.openCount > 0 && <span className="px-1.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px]">{qa.openCount}</span>}
        </h2>

        {isHost ? (
          <div className={`flex items-center p-0.5 rounded-lg border text-[10px] font-bold ${c.seg}`} role="group" aria-label="Class mode">
            <button
              onClick={async () => {
                if (!lecture && (await qa.setMode("lecture"))) onLectureStarted?.();
              }}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${lecture ? c.segOn : c.segOff}`}
              title="Hands go down and questions wait quietly in this list"
            >
              <BookOpen className="w-3 h-3" /> Lecture
            </button>
            <button
              onClick={() => qa.setMode("qa")}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${!lecture ? c.segOn : c.segOff}`}
              title="Open the floor: hands and questions welcome"
            >
              <MessageCircleQuestion className="w-3 h-3" /> Q&amp;A
            </button>
          </div>
        ) : (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${lecture ? "border-sky-500/40 text-sky-500" : "border-emerald-500/40 text-emerald-500"}`}>
            {lecture ? "Lecture — questions wait" : "Q&A open"}
          </span>
        )}
      </div>

      {isHost && lecture && (
        <p className={`text-[11px] leading-snug px-2.5 py-2 rounded-lg border ${c.notice}`}>
          Lecture mode: students can&apos;t raise hands. New questions collect here — switch to Q&amp;A when you&apos;re ready. Super Questions still pop up.
        </p>
      )}

      {/* Ask (students) */}
      {!isHost && me && (
        <form onSubmit={submit} className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            maxLength={QUESTION_MAX_CHARS}
            placeholder={lecture ? "Ask now — your trainer answers at Q&A time" : "Ask the trainer a question"}
            className={`w-full resize-none rounded-lg border px-3 py-2 text-xs focus:outline-none transition-colors ${c.input}`}
          />

          {canSuper ? (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setSuperOn((v) => !v)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                  superOn ? "bg-gradient-to-r from-amber-400 to-orange-400 border-amber-300 text-amber-950" : c.chip
                }`}
                aria-pressed={superOn}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Make it a Super Question
                </span>
                <span className="opacity-80">{superOn ? "On" : "Off"}</span>
              </button>
              {superOn && (
                <>
                  <div className="flex flex-wrap gap-1">
                    {SUPER_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAmount(a)}
                        className={`px-2 py-1 rounded-md border text-[11px] font-bold ${amount === a ? c.chipOn : c.chip}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <p className={`text-[10px] leading-snug ${c.muted}`}>
                    Shows on everyone&apos;s screen and goes to the top. All {amount} credits go to your trainer. Wallet: {Math.floor(me.balance)} credits.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] ${c.lock}`}>
              <span className="flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-amber-500" /> Super Questions &amp; speaking come with {me.superPlan}
              </span>
              <Link href="/pricing" className="font-bold text-amber-500 hover:underline shrink-0">
                Upgrade
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] ${c.muted}`}>
              {left === null ? "Unlimited questions" : `${left} of ${me.freeLimit} question${me.freeLimit === 1 ? "" : "s"} left this class`}
            </span>
            <button
              type="submit"
              disabled={!draft.trim() || sending || (!superOn && outOfFree) || (superOn && me.balance < amount)}
              className={`h-8 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors ${
                superOn ? "bg-amber-400 hover:bg-amber-300 text-amber-950" : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : superOn ? <Zap className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              {superOn ? `Send · ${amount}` : "Ask"}
            </button>
          </div>
          {superOn && me.balance < amount && <p className="text-[10px] text-rose-500">Not enough credits for this amount.</p>}
          {superOn && !qa.trainerPresent && <p className="text-[10px] text-amber-500">The trainer isn&apos;t in the room yet — Super Questions open when they join.</p>}
          {error && (
            <p className="text-[11px] text-rose-500">
              {error.text}{" "}
              {error.upgrade && (
                <Link href="/pricing" className="font-bold underline">
                  See plans
                </Link>
              )}
            </p>
          )}
          {sent && <p className="text-[11px] text-emerald-500">{sent}</p>}
        </form>
      )}

      {qa.loadError && !qa.questions.length && <p className={`text-[11px] ${c.muted}`}>Questions are unavailable right now.</p>}

      {/* The list */}
      <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {qa.questions.map((q) => (
          <QuestionRow key={q.id} q={q} isHost={isHost} mine={!!myId && q.askerId === myId} theme={theme} onStatus={qa.setStatus} />
        ))}
        {qa.loaded && qa.questions.length === 0 && (
          <li className={`text-[11px] text-center py-4 ${c.muted}`}>{isHost ? "No questions yet." : "No questions yet — be the first."}</li>
        )}
      </ul>
    </section>
  );
};

const QuestionRow: React.FC<{
  q: ClassQuestion;
  isHost: boolean;
  mine: boolean;
  theme: Theme;
  onStatus: (id: number, s: "open" | "answered" | "removed") => void;
}> = ({ q, isHost, mine, theme, onStatus }) => {
  const c = T[theme];
  const isSuper = q.credits > 0;
  const done = q.status !== "open";
  return (
    <li
      className={`rounded-lg border p-2 text-xs ${
        isSuper && !done
          ? "bg-gradient-to-br from-amber-400/20 to-orange-500/10 border-amber-400/60"
          : done
          ? c.cardDone
          : c.card
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1 text-[10px]">
        <span className="font-semibold truncate">{mine ? "You" : q.askerName}</span>
        {isPaidTier(q.askerTier) && (
          <span className="px-1 rounded bg-amber-500/15 text-amber-500 font-bold uppercase text-[9px]">{q.askerTier}</span>
        )}
        {isSuper && (
          <span className="px-1.5 rounded-full bg-amber-400 text-amber-950 font-black flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5" /> {q.credits}
          </span>
        )}
        <span className={`ml-auto shrink-0 ${c.muted}`}>{q.status === "answered" ? "Answered" : ago(q.createdAt)}</span>
      </div>
      <p className="leading-snug whitespace-pre-wrap break-words">{q.body}</p>
      {isHost && (
        <div className="flex items-center justify-end gap-1 mt-1.5">
          {done ? (
            <button onClick={() => onStatus(q.id, "open")} className={`h-6 px-1.5 rounded-md text-[10px] flex items-center gap-1 ${c.iconBtn}`} title="Back to the open list">
              <RotateCcw className="w-3 h-3" /> Reopen
            </button>
          ) : (
            <>
              <button
                onClick={() => onStatus(q.id, "removed")}
                className={`h-6 w-6 rounded-md flex items-center justify-center ${c.iconBtn}`}
                title={isSuper ? "Remove (the credits stay with you)" : "Remove"}
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onStatus(q.id, "answered")}
                className="h-6 px-2 rounded-md text-[10px] font-bold flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Check className="w-3 h-3" /> Answered
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
};
