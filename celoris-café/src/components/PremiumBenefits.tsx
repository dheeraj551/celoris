import React from 'react';
import { Sparkles, Video, Crown, CalendarClock, ShieldCheck, Zap } from 'lucide-react';

interface PremiumBenefitsProps {
  onUpgrade: () => void;
}

export default function PremiumBenefits({ onUpgrade }: PremiumBenefitsProps) {
  const benefits = [
    {
      id: 'benefit-1',
      icon: Crown,
      title: 'Unlimited Room Access',
      desc: 'Host your own custom themed tables, control who sits in them, and lock study tables with private codes.',
      pricing: 'Free for student hosts'
    },
    {
      id: 'benefit-2',
      icon: Zap,
      title: 'Profile Visibility Boost',
      desc: 'Show off your verified skill badges, highlight your portfolio, and stay on top of the "See Who\'s Online" roster.',
      pricing: 'Included'
    },
    {
      id: 'benefit-3',
      icon: Video,
      title: 'HD Video & Audio Calls',
      desc: 'Stream screens at 1080p for seamless pair-programming, Figma reviews, or sharing trading chart setups with no lag.',
      pricing: 'Unlimited channels'
    },
    {
      id: 'benefit-4',
      icon: CalendarClock,
      title: 'Priority Masterclass Booking',
      desc: 'Book limited seats with our community trainers (like Coach Yash) 48 hours before other members can join.',
      pricing: 'First priority access'
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-4">
      {/* Visual background glows */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">CELORIS PREMIUM</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black italic tracking-tight text-white mb-4">
            ELEVATE YOUR HANGOUT EXPERIENCE
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Upgrade your membership to unlock professional-grade creation modules, persistent virtual offices, and top-tier community privileges.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111] to-[#0c0c0c] border border-emerald-950/40 p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 tracking-wide group-hover:text-emerald-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    {benefit.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-emerald-950/20 mt-auto">
                  <span className="text-[10px] text-emerald-500/80 font-mono font-medium uppercase tracking-wider">
                    {benefit.pricing}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action centered */}
        <div className="text-center">
          <button
            onClick={onUpgrade}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-[#0a0a0a] font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            Upgrade Membership Now
          </button>
          <span className="block text-xs text-gray-500 mt-2.5">
            Starts at just ₹199/month. Pause or cancel anytime. Special student discounts available.
          </span>
        </div>
      </div>
    </section>
  );
}
