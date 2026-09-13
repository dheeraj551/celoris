import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MessageSquare, Lightbulb, Compass, PlusCircle } from 'lucide-react';
import { DiscussionTopic, UserProfile } from '../types';

interface GuidedDiscussionBannerProps {
  topic?: DiscussionTopic;
  onOpenTopicModal: () => void;
  onQuickRespond: (starterText: string) => void;
  currentUser: UserProfile;
}

export const GuidedDiscussionBanner: React.FC<GuidedDiscussionBannerProps> = ({
  topic,
  onOpenTopicModal,
  onQuickRespond,
  currentUser,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!topic) {
    return (
      <div className="bg-amber-950/30 border border-amber-800/30 rounded-2xl p-3 sm:p-4 mb-4 backdrop-blur-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg border border-amber-500/30">
            🎙️
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-200">
              No Guided Discussion Active
            </div>
            <div className="text-[11px] text-amber-300/70">
              Be the host! Spark a new conversation topic or ask our AI Barista for ideas.
            </div>
          </div>
        </div>
        <button
          onClick={onOpenTopicModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Host Topic</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="guided-discussion-banner"
      className="bg-gradient-to-r from-amber-950/40 via-stone-900/50 to-amber-950/30 border border-amber-700/30 rounded-2xl p-3.5 sm:p-4 mb-4 backdrop-blur-sm shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-sm border border-amber-300/30 flex-shrink-0 mt-0.5">
            🎙️
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                {topic.category}
              </span>
              <span className="text-[10px] text-amber-200/60">
                Hosted by <strong className="text-amber-200">{topic.hostedBy}</strong>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 font-medium">
                ● Open Floor
              </span>
            </div>

            <h2 className="font-serif text-sm sm:text-base font-bold text-amber-100 leading-snug">
              {topic.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
              "{topic.prompt}"
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-black/25 hover:bg-black/40 border border-white/10 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
            title="View discussion icebreakers"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Icebreakers</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenTopicModal}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-700/40 hover:bg-amber-700/60 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-1 transition-all"
            title="Propose or rotate discussion topic"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">New Topic</span>
          </button>
        </div>
      </div>

      {/* Expanded Icebreakers / Starter Questions */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
            <span>💡 Suggested Conversation Starters (click to respond):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {topic.starterQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onQuickRespond(`Re: "${q}" — `)}
                className="text-left p-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/5 hover:border-amber-500/40 text-xs text-stone-200 transition-all group"
              >
                <div className="text-[10px] text-amber-400 font-bold mb-0.5">Prompt {idx + 1}</div>
                <div className="group-hover:text-amber-200 transition-colors">{q}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
