"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ChevronLeft,
  Users,
  PlayCircle,
  ArrowUpRight,
  Clock,
  Radio,
  Lock,
  PenLine,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';

interface ClassroomsViewProps {
  onBack: () => void;
  onClose: () => void;
}

// Real rooms from the Café's `cafe_classrooms` table (the same list the
// classroom lobby at /social shows). Public read is allowed by RLS for
// active rooms; the entry codes are never selected (and aren't readable).
interface LiveRoom {
  id: string;
  name: string;
  category: string;
  trainer_name: string | null;
  max_students: number | null;
  current_students: number | null;
  class_status: string | null;
  next_batch_info: string | null;
  requires_student_code: boolean | null;
}

// Where every card and the footer button lead: the Café page opened
// straight on the classroom lobby (see the ?tab= handling in app/social/page.tsx).
const CLASSROOM_LOBBY_HREF = '/social?tab=cafe';

export function ClassroomsView({ onBack, onClose }: ClassroomsViewProps) {
  const [rooms, setRooms] = useState<LiveRoom[] | null>(null);
  const [failed, setFailed] = useState(false);
  // The classroom lobby is members-only, so signed-out visitors go to sign in first.
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient() as any;
        supabase.auth
          .getSession()
          .then(({ data }: any) => {
            if (!cancelled) setSignedIn(!!data?.session);
          })
          .catch(() => {});
        const { data, error } = await supabase
          .from('cafe_classrooms')
          .select('id, name, category, trainer_name, max_students, current_students, class_status, next_batch_info, requires_student_code')
          .eq('is_active', true)
          .in('category', ['classroom', 'whiteboard'])
          .order('created_at', { ascending: false })
          .limit(12);
        if (cancelled) return;
        if (error) throw error;
        setRooms((data as LiveRoom[]) || []);
      } catch (err) {
        console.error('[Phone OS] Failed to load classrooms:', err);
        if (!cancelled) {
          setFailed(true);
          setRooms([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lobbyHref = signedIn ? CLASSROOM_LOBBY_HREF : '/login';

  const isLive = (room: LiveRoom) => {
    const s = (room.class_status || '').toLowerCase();
    return s.includes('live') || s.includes('progress');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#0e111a] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Classrooms</span>
          </div>
        </div>

        {rooms && rooms.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[8.5px] font-mono">
            <span>{rooms.length} {rooms.length === 1 ? 'class' : 'classes'}</span>
          </div>
        )}
      </div>

      {/* Banner */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent border-b border-purple-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-purple-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>Live Classes</span>
          </div>
          <p className="text-[10.5px] font-bold text-white">Join a trainer-led class with a small group</p>
        </div>

        {/* Mini animated equalizer */}
        <div className="flex items-center gap-0.5 h-5">
          {[12, 20, 8, 18, 14].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, h, 6, h * 0.7, 4] }}
              transition={{
                duration: 1.1 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-0.5 rounded-full bg-purple-400"
            />
          ))}
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        {rooms === null &&
          [0, 1, 2].map(i => (
            <div key={i} className="h-[86px] rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
          ))}

        {rooms !== null && rooms.length === 0 && (
          <div className="text-center px-4 py-8">
            <GraduationCap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-[11px] font-bold text-white">
              {failed ? "Couldn't load classes right now" : 'No classes are open right now'}
            </p>
            <p className="text-[9.5px] text-slate-400 mt-1">
              Open the classroom lobby to see upcoming batches.
            </p>
          </div>
        )}

        {rooms?.map(room => {
          const seats = room.max_students || 15;
          const taken = Math.max(0, room.current_students ?? 0);
          return (
            <Link
              key={room.id}
              href={lobbyHref}
              onClick={onClose}
              className="block p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-400/40 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-medium">
                      {room.category === 'whiteboard' ? (
                        <>
                          <PenLine className="w-2.5 h-2.5" /> Whiteboard
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-2.5 h-2.5" /> Classroom
                        </>
                      )}
                    </span>
                    {isLive(room) ? (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    ) : room.requires_student_code ? (
                      <span className="inline-flex items-center gap-0.5 text-[8.5px] font-mono text-amber-400">
                        <Lock className="w-2.5 h-2.5" /> Code
                      </span>
                    ) : null}
                  </div>
                  <h4 className="text-[11.5px] font-bold text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
                    {room.name}
                  </h4>
                </div>

                <div
                  className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300 bg-white/[0.04] px-1.5 py-0.5 rounded-md shrink-0"
                  title="Seats taken / total seats"
                >
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>
                    {taken}/{seats}
                  </span>
                </div>
              </div>

              {room.trainer_name && (
                <p className="text-[9.5px] text-slate-400 leading-tight">By {room.trainer_name}</p>
              )}
              {room.next_batch_info && (
                <p className="text-[9px] text-amber-300/90 leading-tight mt-1 flex items-start gap-1">
                  <Clock className="w-2.5 h-2.5 mt-[1px] shrink-0" />
                  <span className="line-clamp-2">{room.next_batch_info}</span>
                </p>
              )}

              <div className="flex items-center justify-end pt-1.5 mt-1.5 border-t border-white/[0.04] text-[9px]">
                <span className="text-purple-400 font-bold group-hover:text-purple-300 flex items-center gap-0.5">
                  Open Classroom <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Hand-off Footer */}
      <div className="p-2.5 bg-[#0e111a] border-t border-white/[0.08]">
        {!signedIn && (
          <p className="text-[9px] text-slate-400 text-center mb-1.5">Free account needed to join a class</p>
        )}
        <Link
          href={lobbyHref}
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-lg shadow-purple-500/20"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>{signedIn ? 'Open All Classrooms' : 'Sign In to Join a Class'}</span>
        </Link>
      </div>
    </div>
  );
}
