import React, { useState } from 'react';
import { ArrowRight, Check, Shield, CheckCircle2 } from 'lucide-react';

interface CtaBannerProps {
  onClaimClick: (subdomain?: string) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onClaimClick }) => {
  const [bottomSubdomain, setBottomSubdomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaimClick(bottomSubdomain || undefined);
  };

  return (
    <section className="py-20 bg-[#050505] border-t border-white/[0.08] relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-[#0D0D0D] border border-emerald-500/30 shadow-2xl shadow-black text-center relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Risk · 100% Free Forever</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Ready to Put Your Website Online?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed [text-wrap:balance]">
              Join thousands of Indian students, design learners, and creators hosting on Celoris Cloud today. No credit card required.
            </p>

            {/* Quick Claim Input Bar */}
            <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#080808] border border-white/15 rounded-2xl focus-within:border-emerald-500/60 transition-colors">
                <div className="flex items-center flex-1 px-3 py-2">
                  <span className="text-neutral-500 font-mono text-xs select-none">https://</span>
                  <input
                    type="text"
                    value={bottomSubdomain}
                    onChange={(e) => setBottomSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="yourname"
                    className="flex-1 bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder:text-neutral-600 px-1 min-w-0"
                  />
                  <span className="text-emerald-400 font-mono text-xs font-semibold select-none">.celoris.in</span>
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Claim Free Site Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Micro Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>No Credit Card Needed</span>
              </span>
              <span className="text-neutral-700">·</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free SSL & NVMe SSD</span>
              </span>
              <span className="text-neutral-700">·</span>
              <span className="text-neutral-300">60-Second Instant Launch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
