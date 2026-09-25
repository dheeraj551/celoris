"use client";

import React, { useState } from 'react';
import { Room } from './types';
import { 
  Users, 
  Lock, 
  Sparkles, 
  Trash2, 
  GraduationCap, 
  ArrowUpRight, 
  PenLine, 
  Box, 
  Clock, 
  Search, 
  Radio, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface RoomsGridProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onCreateRoom?: () => void;
  currentUser?: any;
  onDeleteRoom?: (roomId: string) => void;
}

const CATEGORY_META: Record<string, { label: string; icon: any; color: string; border: string; bg: string }> = {
  classroom: {
    label: '3D Virtual Aula',
    icon: Box,
    color: 'text-purple-300',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/15',
  },
  whiteboard: {
    label: 'Whiteboard Studio',
    icon: PenLine,
    color: 'text-cyan-300',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/15',
  },
  study: {
    label: 'Focus Study Room',
    icon: BookOpen,
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/15',
  },
};

export default function RoomsGrid({ rooms, onJoinRoom, onCreateRoom, currentUser, onDeleteRoom }: RoomsGridProps) {
  const [filterType, setFilterType] = useState<'all' | 'classroom' | 'whiteboard' | 'live'>('all');
  const [search, setSearch] = useState('');

  const isLive = (room: Room) => {
    const s = (room.status || '').toLowerCase();
    return s.includes('live') || s.includes('progress');
  };

  const filteredRooms = rooms.filter(room => {
    if (filterType === 'classroom' && room.category !== 'classroom') return false;
    if (filterType === 'whiteboard' && room.category !== 'whiteboard') return false;
    if (filterType === 'live' && !isLive(room)) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = room.name.toLowerCase().includes(q);
      const matchDesc = room.description?.toLowerCase().includes(q);
      const matchTrainer = room.host?.name?.toLowerCase().includes(q);
      const matchTags = room.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTrainer && !matchTags) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 bg-[#0c0d12] border border-white/[0.08] rounded-2xl">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
          {[
            { id: 'all', label: 'All Classrooms', icon: GraduationCap },
            { id: 'classroom', label: '3D Virtual Aula', icon: Box },
            { id: 'whiteboard', label: 'Whiteboard Studio', icon: PenLine },
            { id: 'live', label: 'Live Sessions', icon: Radio },
          ].map(tab => {
            const Icon = tab.icon;
            const active = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px] md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes, trainers, topics..."
            className="w-full bg-[#131620] text-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-white/[0.08] focus:border-emerald-400/60 focus:outline-none placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid Subheader Stats */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Showing <strong className="text-white font-bold">{filteredRooms.length}</strong> active classroom batches
          </span>
        </div>
        <span className="hidden sm:inline text-slate-500 text-[11px]">
          15 Seats Max • Trainer Podium • Screen Share
        </span>
      </div>

      {/* Classrooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => {
            const meta = CATEGORY_META[room.category] || CATEGORY_META.classroom;
            const CategoryIcon = meta.icon;
            const roomIsLive = isLive(room);
            const seats = room.maxStudents ?? 15;
            const taken = Math.max(0, room.onlineCount ?? 0);
            const percentFilled = Math.min(100, Math.round((taken / seats) * 100));

            return (
              <div
                key={room.id}
                className="group relative overflow-hidden rounded-2xl bg-[#0c0d14] border border-white/[0.08] hover:border-emerald-500/40 p-5 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Subtle Ambient Studio Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono ${meta.bg} ${meta.border} ${meta.color} border`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span>{meta.label}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {currentUser?.id && room.host?.id === currentUser.id && onDeleteRoom && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.id); }}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Classroom"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Live or Status Pill */}
                      {roomIsLive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          READY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Classroom Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5 tracking-wide line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3.5 line-clamp-2">
                    {room.description || 'Hands-on interactive classroom session with live screen sharing and doubts.'}
                  </p>

                  {/* Tags */}
                  {room.tags && room.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {room.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-white/[0.04] text-slate-400 px-2 py-0.5 rounded-md border border-white/[0.06] font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Passcode Required notice */}
                  {room.requiresStudentCode && (
                    <div className="inline-flex items-center gap-1.5 mb-2.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-mono font-semibold">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Class Code Required</span>
                    </div>
                  )}

                  {/* Schedule time notice */}
                  {room.nextBatchInfo && (
                    <div className="mb-3 text-[11px] text-purple-200 bg-purple-500/10 border border-purple-500/25 rounded-xl px-2.5 py-1.5 flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">Next Batch: </span>
                        <span>{room.nextBatchInfo}</span>
                      </div>
                    </div>
                  )}

                  {/* Connected course banner */}
                  {room.courseUrl && (
                    <a
                      href={room.courseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 mb-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/40 transition-colors group/course"
                    >
                      {room.courseImageUrl ? (
                        <img
                          src={room.courseImageUrl}
                          alt={room.courseTitle || 'Connected course'}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block text-[8.5px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Curriculum Module</span>
                        <span className="block text-xs font-semibold text-white truncate">{room.courseTitle || 'View Course'}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 opacity-70 group-hover/course:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-3 border-t border-white/[0.06]">
                  {/* Trainer Details & Live Headcount */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold text-xs">
                        {room.host?.name?.trim().charAt(0).toUpperCase() || 'T'}
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Trainer</span>
                        <span className="text-xs text-white font-medium truncate block">{room.host?.name || 'Verified Faculty'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-300 block">
                        <strong className="text-white font-bold">{taken}</strong>/{seats} Seats
                      </span>
                      <span className="text-[8.5px] font-mono text-emerald-400">
                        {seats - taken > 0 ? `${seats - taken} left` : 'Full'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Seat Capacity Progress Meter */}
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden mb-3.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentFilled >= 100 
                          ? 'bg-red-500' 
                          : percentFilled >= 75 
                          ? 'bg-amber-400' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${Math.max(5, percentFilled)}%` }}
                    />
                  </div>

                  {/* Join Action Button */}
                  <button
                    type="button"
                    disabled={room.status === 'Full'}
                    onClick={() => onJoinRoom(room.id)}
                    className={`
                      w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md
                      ${room.status === 'Full'
                        ? 'bg-zinc-800 text-slate-500 border border-zinc-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/20 hover:scale-[1.02] active:scale-98'}
                    `}
                  >
                    {room.requiresStudentCode ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Enter with Passcode</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        <span>Enter Classroom</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#0c0d14] border border-white/[0.08] rounded-2xl">
          <GraduationCap className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-white text-sm font-bold">No active classrooms match this filter.</p>
          <p className="text-slate-400 text-xs mt-1">Try switching to &quot;All Classrooms&quot; or check back shortly for upcoming batches.</p>
          <button
            type="button"
            onClick={() => { setFilterType('all'); setSearch(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
