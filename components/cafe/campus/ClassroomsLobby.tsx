"use client";

// Classrooms lobby with two views: the blocky 3D campus (default) and the
// original card list. The list is used automatically when the device has no
// WebGL, looks low-end, or the 3D view fails, and the choice is remembered.

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGrid, Box } from 'lucide-react';
import type { Room } from '../types';

const CampusView = dynamic(() => import('./CampusView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[440px] md:h-[580px] rounded-2xl border border-white/[0.08] bg-[#0b1220] flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-sky-500/15 border-t-sky-400 rounded-full animate-spin" />
    </div>
  ),
});

const VIEW_KEY = 'celoris-classrooms-view';
type View = 'campus' | 'list';

function canRun3D(): { ok: boolean; lowEnd: boolean } {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { ok: false, lowEnd: true };
  } catch {
    return { ok: false, lowEnd: true };
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || (navigator.hardwareConcurrency || 4) <= 2;
  return { ok: true, lowEnd };
}

export default function ClassroomsLobby({
  rooms,
  onJoinRoom,
  list,
}: {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  /** The existing card list (RoomsGrid), shown in List view. */
  list: React.ReactNode;
}) {
  const [view, setView] = useState<View | null>(null);
  const [supports3D, setSupports3D] = useState(true);

  useEffect(() => {
    const { ok, lowEnd } = canRun3D();
    setSupports3D(ok);
    let saved: View | null = null;
    try {
      saved = localStorage.getItem(VIEW_KEY) as View | null;
    } catch {
      // storage blocked
    }
    setView(!ok ? 'list' : saved === 'campus' || saved === 'list' ? saved : lowEnd ? 'list' : 'campus');
  }, []);

  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // storage blocked
    }
  };

  return (
    <div className="space-y-4">
      {supports3D && (
        <div className="flex justify-end">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => choose('campus')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                view === 'campus' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> Campus
            </button>
            <button
              onClick={() => choose('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                view === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      )}

      {view === 'campus' && rooms.length > 0 ? (
        <CampusView
          rooms={rooms}
          onJoinRoom={onJoinRoom}
          onFallback={() => {
            setSupports3D(false);
            setView('list');
          }}
        />
      ) : view === null ? null : (
        list
      )}
    </div>
  );
}
