"use client";

// The blocky campus lobby: renders CampusScene for the real classrooms and
// shows a room card when a building is tapped. Joining goes through the same
// onJoinRoom flow as the list view (entry codes, queue, seat limits).

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Clock, GraduationCap, Lock, PenLine, Users, X } from 'lucide-react';
import type { Room } from '../types';
import { CampusScene, type CampusRoom } from './campusScene';
import { formatClassTime, nextSession } from '@/lib/class-schedule';

interface Props {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onFallback: () => void;
}

function scheduleOf(room: Room) {
  return nextSession({
    next_class_at: room.nextClassAt ?? null,
    class_duration_minutes: room.classDurationMinutes ?? null,
    repeats_weekly: room.repeatsWeekly ?? null,
  });
}

function toCampusRoom(room: Room): CampusRoom {
  const session = scheduleOf(room);
  const isLive = !!session?.isLive || room.status === 'Live';
  const subtitle = session
    ? `Next: ${formatClassTime(session.start)}`
    : room.nextBatchInfo
      ? room.nextBatchInfo.slice(0, 32)
      : 'Schedule coming soon';
  return {
    id: room.id,
    name: room.name,
    trainer: room.host?.name || 'Celoris trainer',
    subtitle,
    isLive,
    isWhiteboard: room.category === 'whiteboard',
    presentCount: room.onlineCount || 0,
  };
}

export default function CampusView({ rooms, onJoinRoom, onFallback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const campusRooms = useMemo(() => rooms.slice(0, 12).map(toCampusRoom), [rooms]);
  // Rebuild the 3D scene only when something visible on the campus changes.
  const sceneKey = useMemo(
    () => JSON.stringify(campusRooms.map((r) => [r.id, r.name, r.trainer, r.subtitle, r.isLive, r.isWhiteboard, Math.min(5, r.presentCount)])),
    [campusRooms]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let scene: CampusScene | null = null;
    try {
      scene = new CampusScene(el, campusRooms, (id) => setSelectedId(id));
    } catch (err) {
      console.error('[Campus] 3D view failed, showing the list instead:', err);
      onFallback();
    }
    return () => scene?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey]);

  const selected = rooms.find((r) => r.id === selectedId) || null;
  const session = selected ? scheduleOf(selected) : null;
  const seats = selected ? selected.maxStudents || 15 : 0;
  const taken = selected ? Math.min(seats, selected.onlineCount || 0) : 0;

  return (
    <div className="relative w-full h-[440px] md:h-[580px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#8fd0ff]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Hint */}
      <div className="pointer-events-none absolute left-3 bottom-3 rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-[11px] text-slate-200">
        Tap a building to see the class · drag to look around
      </div>

      {rooms.length > 12 && (
        <div className="absolute right-3 bottom-3 rounded-lg bg-slate-950/75 px-2.5 py-1.5 text-[11px] text-amber-300">
          Showing 12 of {rooms.length} rooms — use List view for all
        </div>
      )}

      {/* Room card */}
      {selected && (
        <div className="absolute inset-x-3 bottom-3 md:inset-x-auto md:right-4 md:bottom-4 md:w-[360px] rounded-2xl border border-white/10 bg-[#0b0f17]/95 p-4 text-white shadow-2xl backdrop-blur">
          <button
            onClick={() => setSelectedId(null)}
            className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-purple-200">
              {selected.category === 'whiteboard' ? <PenLine className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {selected.category === 'whiteboard' ? 'Whiteboard room' : '3D classroom'}
            </span>
            {(session?.isLive || selected.status === 'Live') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live now
              </span>
            )}
            {selected.requiresStudentCode && (
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Lock className="w-3 h-3" /> Code
              </span>
            )}
          </div>
          <h3 className="mt-2 pr-6 text-base font-extrabold leading-snug">{selected.name}</h3>
          <p className="text-xs text-slate-400">with {selected.host?.name || 'Celoris trainer'}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Next class
              </p>
              <p className="mt-0.5 font-semibold text-amber-200">
                {session
                  ? session.isLive
                    ? 'In progress'
                    : `${formatClassTime(session.start)} IST`
                  : selected.nextBatchInfo || 'To be announced'}
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                <Users className="w-3 h-3" /> Seats
              </p>
              <p className="mt-0.5 font-semibold">
                {taken}/{seats} · {seats - taken > 0 ? `${seats - taken} left` : 'Full'}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              disabled={selected.status === 'Full'}
              onClick={() => onJoinRoom(selected.id)}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-extrabold"
            >
              {selected.status === 'Full' ? 'Class is full' : 'Enter classroom'}
            </button>
            {selected.courseUrl && (
              <a
                href={selected.courseUrl}
                className="h-10 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold inline-flex items-center gap-1"
              >
                Course <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
