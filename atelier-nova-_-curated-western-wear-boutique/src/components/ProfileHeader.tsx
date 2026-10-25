import React from 'react';
import { BadgeCheck, MessageCircle, Calendar, Plus, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
  onOpenStylistDM: () => void;
  onOpenBookingModal: () => void;
  onOpenEmbedModal: () => void;
  onOpenAnalytics: () => void;
  onStoryClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onOpenStylistDM,
  onOpenBookingModal,
  onOpenEmbedModal,
  onOpenAnalytics,
  onStoryClick,
}) => {
  return (
    <section className="pt-6 sm:pt-10 pb-6 border-b border-[#EAE6DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Avatar with Story Ring */}
          <div className="relative group cursor-pointer" onClick={onStoryClick}>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2.5px] story-ring transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full p-[2px] bg-[#FAF9F6]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="ReelCart Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#181716] text-[#FAF9F6] text-[9px] tracking-widest uppercase font-medium px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
              Live Stories
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left">
            {/* Handle & Verified Badge */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#181716]">
                reelcart.studio
              </h1>
              <span className="text-[#8C6239] inline-flex items-center" title="Verified Bespoke Atelier">
                <BadgeCheck className="w-5 h-5 fill-[#8C6239] text-[#FAF9F6]" />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#8E877E] bg-[#EFECE6] px-2 py-0.5 rounded">
                Boutique
              </span>
            </div>

            {/* Metrics Counter Bar */}
            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 text-xs sm:text-sm text-[#181716] mb-4">
              <div>
                <span className="font-semibold tabular-nums">128</span>{' '}
                <span className="text-[#8E877E]">Pieces</span>
              </div>
              <div>
                <span className="font-semibold tabular-nums">48.2k</span>{' '}
                <span className="text-[#8E877E]">Followers</span>
              </div>
              <div>
                <span className="font-semibold tabular-nums">99.4%</span>{' '}
                <span className="text-[#8E877E]">Client Rating</span>
              </div>
            </div>

            {/* Bio & Brand Statement */}
            <div className="text-xs sm:text-sm text-[#524C44] leading-relaxed max-w-xl mb-5 space-y-1">
              <p className="font-serif italic text-base text-[#181716]">
                Modern Western Tailoring & Pure 22-Momme Silks
              </p>
              <p>
                Handcrafted rancher suede, structured wool-linen blazers & bespoke bridal western boots.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 pt-1 text-xs text-[#8E877E]">
                <span>Santa Fe & Worldwide</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8C6239] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Checkout in DM
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <button
                onClick={onOpenStylistDM}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#181716] hover:bg-[#33302C] rounded transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consult Stylist</span>
              </button>

              <button
                onClick={onOpenBookingModal}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#181716] bg-[#EFECE6] hover:bg-[#E2DDD3] rounded transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Fitting</span>
              </button>

              <button
                onClick={onOpenEmbedModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#6B655B] border border-[#D6D0C5] hover:border-[#181716] hover:text-[#181716] rounded transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Embed Reel</span>
              </button>

              <button
                onClick={onOpenAnalytics}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#6B655B] hover:text-[#181716] rounded transition-all cursor-pointer"
                title="Boutique Owner Analytics"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
