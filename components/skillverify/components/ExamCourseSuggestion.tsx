import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { courseSuggestionFor } from '@/lib/exam-courses';

// "Didn't pass? Here's what to learn next" — shown on the exam result screen
// and on the exam card while someone waits for their next attempt.
export const ExamCourseSuggestion: React.FC<{
  examId: string;
  score?: number | null;
  passingScore?: number;
  compact?: boolean;
}> = ({ examId, score, passingScore, compact }) => {
  const s = courseSuggestionFor(examId);
  const gap = typeof score === 'number' && typeof passingScore === 'number' ? Math.max(0, passingScore - score) : null;

  if (compact) {
    const link = s.live || s.free;
    if (!link) return null;
    return (
      <Link
        href={link.href}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2 text-[11px] text-amber-100 hover:bg-amber-400/[0.12] transition-colors"
      >
        <GraduationCap className="w-3.5 h-3.5 shrink-0 text-amber-300" />
        <span className="truncate">
          Prepare with <b className="text-white">{link.title}</b>
        </span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto text-amber-300" />
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-4 text-left space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Get ready for your next attempt</p>
        <p className="mt-1 text-xs text-[#C9BFB4] leading-relaxed">
          {gap !== null && gap > 0
            ? `You were ${gap}% away from passing. These cover exactly what this exam tests:`
            : 'These cover exactly what this exam tests:'}
        </p>
      </div>
      <div className="space-y-2">
        {s.live && (
          <Link
            href={s.live.href}
            className="flex items-center gap-3 rounded-xl bg-amber-400 px-3.5 py-2.5 text-black hover:bg-amber-300 transition-colors"
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="min-w-0">
              <span className="block text-xs font-extrabold truncate">{s.live.title}</span>
              <span className="block text-[10px] font-semibold opacity-75">Learn with a trainer · book a free demo</span>
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 ml-auto" />
          </Link>
        )}
        {s.free && (
          <Link
            href={s.free.href}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[#EDE6DE] hover:bg-white/[0.08] transition-colors"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="min-w-0">
              <span className="block text-xs font-bold truncate">{s.free.title}</span>
              <span className="block text-[10px] text-[#A89C90]">Free recorded course</span>
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 ml-auto text-[#A89C90]" />
          </Link>
        )}
      </div>
    </div>
  );
};
