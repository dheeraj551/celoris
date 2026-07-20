import React from 'react';
import { ShieldCheck, Eye, Scale, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SafeSecure() {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Verified Student Profiles',
      desc: 'All accounts require university email (.edu/.ac.in) or student ID validation. No bots, fake recruiters, or catfishes allowed.',
      highlight: '100% Verified Community'
    },
    {
      icon: Eye,
      title: 'Active Smart Moderation',
      desc: 'AI filters combined with student moderators prevent unsolicited messages, aggressive advances, or inappropriate media.',
      highlight: '24/7 Safer Space Guard'
    },
    {
      icon: Scale,
      title: 'Strict Community Guidelines',
      desc: 'Zero-tolerance policy for harassment, spamming, and sales pitches. Celoris is first and foremost a skill-learning sanctuary.',
      highlight: 'Honor Code Driven'
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-4 border-t border-b border-emerald-950/30 bg-gradient-to-b from-[#090909] via-emerald-950/5 to-[#090909]">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Parent & Student Approved</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black italic tracking-tight text-white mb-4">
            A SAFE & SECURE THIRD PLACE
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Trust is our absolute priority. Unlike typical chatrooms, Celoris is designed specifically for peer learning and genuine mutual growth, so you can study with total peace of mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {securityFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111] to-[#0c0c0c] border border-emerald-950/40 p-6 hover:border-emerald-500/30 hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300"></div>

                <div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_4px_12px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-emerald-950/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-400/90">{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Anti-Dating/Connection clarifying banner */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#0d1e18] to-[#071410] border border-emerald-500/10 text-center">
          <p className="text-xs md:text-sm text-gray-300">
            🔒 <strong className="text-emerald-400">Please Note:</strong> Celoris Café is a skill-sharing and hangout hub, <strong className="text-teal-400">NOT a dating platform</strong>. Any users violating our respectful conduct guidelines will face instant IP bans.
          </p>
        </div>
      </div>
    </section>
  );
}
