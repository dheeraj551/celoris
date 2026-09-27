"use client";

import React from "react";
import { Check, X, Zap } from "lucide-react";
import { SUPER_SPOTLIGHT_MS, type ClassQuestion } from "@/lib/classroom-questions";

// A Super Question on everyone's screen: a gold card at the top of the stage
// for ~15 seconds (several queue up one after another). The trainer can mark
// it answered right there; anyone can close their own copy.

export const SuperQuestionSpotlight: React.FC<{
  question: ClassQuestion | null;
  isHost: boolean;
  myId?: string | null;
  onClose: () => void;
  onAnswered?: (id: number) => void;
}> = ({ question, isHost, myId, onClose, onAnswered }) => {
  if (!question) return null;
  const mine = !!myId && question.askerId === myId;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-[45] flex justify-center px-3">
      <div
        key={question.id}
        role="status"
        aria-live="polite"
        className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-amber-950 shadow-[0_12px_40px_rgba(245,158,11,0.45)] animate-[superIn_.35s_ease-out]"
      >
        <style>{`@keyframes superIn{from{opacity:0;transform:translateY(-12px) scale(.97)}to{opacity:1;transform:none}}@keyframes superBar{from{width:100%}to{width:0%}}`}</style>
        <div className="flex items-start gap-3 p-3.5 pr-10">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-950/90 text-amber-300 flex flex-col items-center justify-center leading-none">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black mt-0.5">{question.credits}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-black uppercase tracking-wider opacity-80">
              Super Question · {mine ? "you" : question.askerName}
            </div>
            <p className="text-sm font-semibold leading-snug break-words mt-0.5">{question.body}</p>
            {isHost && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold opacity-80">+{question.credits} credits to your wallet</span>
                {onAnswered && (
                  <button
                    onClick={() => onAnswered(question.id)}
                    className="ml-auto h-7 px-2.5 rounded-lg bg-amber-950 text-amber-200 text-[11px] font-bold flex items-center gap-1 hover:bg-black"
                  >
                    <Check className="w-3.5 h-3.5" /> Answered
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 h-7 w-7 rounded-lg flex items-center justify-center hover:bg-amber-950/10" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
        <div className="h-1 bg-amber-950/15">
          <div className="h-full bg-amber-950/50" style={{ animation: `superBar ${SUPER_SPOTLIGHT_MS}ms linear forwards` }} />
        </div>
      </div>
    </div>
  );
};
