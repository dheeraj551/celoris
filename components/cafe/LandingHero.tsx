import React from 'react';
import { 
  GraduationCap, 
  ChevronRight, 
  Users, 
  Sparkles, 
  PenLine, 
  Radio, 
  Box
} from 'lucide-react';
import { Room } from './types';

interface LandingHeroProps {
  onEnterCafe: () => void;
  onEnterClassrooms?: () => void;
  onSeeOnline?: () => void;
  activeRooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

export default function LandingHero({ onEnterCafe, onEnterClassrooms, onSeeOnline, activeRooms, onJoinRoom }: LandingHeroProps) {
  const handleEnter = onEnterClassrooms || onEnterCafe;
  const liveCount = activeRooms.filter(r => (r.status || '').toLowerCase().includes('live')).length;

  const stats = [
    { label: 'Active Classrooms', value: activeRooms.length > 0 ? `${activeRooms.length} Batches` : '6+ Batches' },
    { label: 'Max Batch Size', value: '15 Seats' },
    { label: 'Live Mentorship', value: '100% Real-Time' },
    { label: 'Core Worksheets', value: 'Free Access' },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background Graphic with Dark Gradient Mesh - clean, text-free */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none z-0"
        style={{ backgroundImage: 'url("/hero-space.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/80 to-[#070707] pointer-events-none z-0" />

      {/* Atmospheric Ambient Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-12 right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-8 left-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Tech Blueprint Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        {/* Top Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-purple-300">
            LIVE TRAINER-LED CLASSROOMS
          </span>
          {liveCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-red-400 animate-pulse" />
              {liveCount} Live Now
            </span>
          )}
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black italic tracking-tighter text-white mb-6">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-300">
            CELORIS
          </span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 text-glow">
            CLASSROOMS
          </span>
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="text-base md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Interactive small-group cohorts with <span className="text-emerald-400 font-semibold">expert mentors</span>, real-time whiteboards, and <span className="text-purple-300 font-semibold">3D digital lecture halls</span>.
        </p>

        {/* 3 Classroom Studio Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-medium backdrop-blur-sm">
            <Box className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>3D Virtual Aula &amp; Lectern</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs font-medium backdrop-blur-sm">
            <PenLine className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Realtime Collaborative Whiteboard</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>15-Student Focused Batches</span>
          </div>
        </div>

        {/* Single Centered Action Button */}
        <div className="flex items-center justify-center mb-14">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-[#070707] font-black text-base transition-all duration-300 hover:scale-[1.03] shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-[#070707] transition-transform duration-300 group-hover:scale-110" />
            <span>Enter Live Classrooms</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Academic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12 border-t border-b border-white/[0.08] py-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-xl md:text-2xl font-display font-black text-white">{stat.value}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1 font-mono">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
