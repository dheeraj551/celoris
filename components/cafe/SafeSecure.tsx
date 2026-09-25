import React from 'react';
import { ShieldCheck, Eye, Scale, CheckCircle2, GraduationCap } from 'lucide-react';

export default function SafeSecure() {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Verified Student & Trainer Badges',
      desc: 'All trainers undergo verified skill and portfolio audits, and learners authenticate with verified student credentials. No bots or unverified guests in live rooms.',
      highlight: '100% Authenticated Cohorts'
    },
    {
      icon: Eye,
      title: 'Supervised Screen & Whiteboard Sharing',
      desc: 'Live session controls ensure clean presenter screens, moderated microphone queues, and orderly doubt-clearing breakouts during class lectures.',
      highlight: 'Distraction-Free Focus'
    },
    {
      icon: Scale,
      title: 'Academic Honor Code',
      desc: 'Zero tolerance for harassment, spam, or disruptive behavior. All collaborative whiteboards and voice discussions adhere to professional learning standards.',
      highlight: 'Honor Code Enforced'
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-4 border-t border-b border-white/[0.08] bg-gradient-to-b from-[#090a0f] via-purple-950/5 to-[#090a0f]">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Academic Integrity</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black italic tracking-tight text-white mb-4">
            A FOCUSED &amp; PROFESSIONAL CLASSROOM ENVIRONMENT
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Education requires focus. Celoris Classrooms are designed from the ground up for hands-on mentorship, active doubt-clearing, and mutual respect among peers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {securityFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0b10] border border-white/[0.08] p-6 hover:border-emerald-500/30 hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300" />

                <div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/15 to-emerald-500/10 border border-white/[0.1] flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 tracking-wide group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/[0.06]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-400/90 font-mono">{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Academic Code of Conduct Banner */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#0d1624] to-[#09101c] border border-white/[0.08] text-center">
          <p className="text-xs md:text-sm text-slate-300 flex items-center justify-center gap-2 flex-wrap">
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
            <span><strong className="text-white">Classroom Policy:</strong> Celoris Classrooms are dedicated spaces for real-time skill education. Any disruption of live batches or violation of mentor guidelines will result in immediate session removal.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
