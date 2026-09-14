import React from 'react';
import { Coffee, ChevronRight, Shield, Sparkles } from 'lucide-react';
import { Room } from './types';

interface LandingHeroProps {
  onEnterCafe: () => void;
  onSeeOnline: () => void;
  activeRooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

export default function LandingHero({ onEnterCafe, onSeeOnline, activeRooms, onJoinRoom }: LandingHeroProps) {
  const stats = [
    { label: 'Skill Learners', value: '12,400+' },
    { label: 'Indian Courses', value: '180+' },
    { label: 'Active Right Now', value: '430+' },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Creative Background Image specific to Hero */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none z-0"
        style={{ backgroundImage: 'url("/celoriscafe.jpg")' }}
      ></div>
      {/* Gradient to blend the image smoothly into the background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/80 to-[#070707] pointer-events-none z-0"></div>

      {/* Background radial effects & ambient grids */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Decorative cyber grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        {/* Badge above headline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
            STUDENT COMMUNITY SPACE
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black italic tracking-tighter text-white mb-6">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-emerald-300">
            CELORIS
          </span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-glow">
            CAFÉ
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Where students hang out, <span className="text-emerald-400 font-medium">learn skills together</span>, and sometimes <span className="text-teal-400 italic">fall in love</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onEnterCafe}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0a0a0a] font-bold text-base transition-all duration-300 hover:scale-[1.03] shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Coffee className="w-5 h-5 text-[#0a0a0a] transition-transform duration-300 group-hover:rotate-12" />
            <span>Enter Café</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Quick Social Verification Anchor */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16 border-t border-b border-emerald-950/30 py-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-xl md:text-2xl font-display font-black text-emerald-400">{stat.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider block mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
