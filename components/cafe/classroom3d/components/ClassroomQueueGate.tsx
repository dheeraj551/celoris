"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Users, Clock, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';

interface ClassroomQueueGateProps {
  roomId: string;
  roomName: string;
  /** Fired once the trainer admits this student — the caller (ClassroomRoom)
      retries its own join flow (classroom-presence + Agora) only after this
      fires, since that's the piece that actually reserves a seat. */
  onAdmitted: () => void;
  /** "Leave the queue" — takes them back to the café lobby without ever
      having joined the room. */
  onLeave: () => void;
}

/**
 * Shown by ClassroomRoom in place of the room whenever classroom-presence's
 * 'join' reports the room is full, instead of just a dead-end error. The
 * trainer (already inside the room) admits people one at a time from the
 * Waiting Queue panel in RightSidebar.tsx ("Admit Next" or a specific row's
 * "Admit"), which flips this student's cafe_classroom_queue row to
 * status='admitted'. This component polls for that change (a Realtime
 * subscription isn't viable here — the table's only client-facing RLS grant
 * is SELECT-your-own-row, which a row-id-scoped subscription could in
 * principle use, so it's still wired up as a fast-path, with the poll as
 * the reliable fallback in case that socket drops).
 *
 * A waiting student can also redeem one of the room's boost codes here (see
 * /api/social/cafe/redeem-boost-code) to jump ahead of plain FIFO.
 */
export const ClassroomQueueGate: React.FC<ClassroomQueueGateProps> = ({ roomId, roomName, onAdmitted, onLeave }) => {
  const { user } = useAuth();
  const supabase = createClient();

  const [position, setPosition] = useState<number | null>(null);
  const [totalWaiting, setTotalWaiting] = useState<number | null>(null);
  const [priorityScore, setPriorityScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [boostInput, setBoostInput] = useState('');
  const [redeemingBoost, setRedeemingBoost] = useState(false);
  const [boostError, setBoostError] = useState<string | null>(null);
  const [boostSuccess, setBoostSuccess] = useState<string | null>(null);

  const admittedRef = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<any>(null);

  const refreshStatus = async () => {
    try {
      const res = await fetch(`/api/social/cafe/classroom-queue?roomId=${roomId}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return;
      if (body.myEntry?.status === 'admitted') {
        if (!admittedRef.current) {
          admittedRef.current = true;
          onAdmitted();
        }
        return;
      }
      setPosition(body.myPosition ?? null);
      setTotalWaiting(body.totalWaiting ?? null);
      if (typeof body.myEntry?.priority_score === 'number') {
        setPriorityScore(body.myEntry.priority_score);
      }
    } catch {
      // Non-fatal — the next poll or the realtime subscription will catch up.
    }
  };

  useEffect(() => {
    let cancelled = false;

    const join = async () => {
      setLoading(true);
      setJoinError(null);
      try {
        const res = await fetch('/api/social/cafe/classroom-queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'join', roomId }),
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!res.ok) {
          setJoinError(body.error || 'Could not join the queue.');
          setLoading(false);
          return;
        }

        const entry = body.entry;
        if (entry?.status === 'admitted') {
          admittedRef.current = true;
          onAdmitted();
          return;
        }

        if (typeof entry?.priority_score === 'number') setPriorityScore(entry.priority_score);
        setLoading(false);
        refreshStatus();

        // Realtime fast-path: this student's own queue row only (RLS
        // restricts the SELECT to auth.uid() = user_id, so this is both
        // precise and what RLS allows).
        if (entry?.id) {
          const channel = supabase
            .channel(`classroom-queue-${entry.id}`)
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'cafe_classroom_queue', filter: `id=eq.${entry.id}` },
              (payload: any) => {
                if (payload.new?.status === 'admitted' && !admittedRef.current) {
                  admittedRef.current = true;
                  onAdmitted();
                } else if (typeof payload.new?.priority_score === 'number') {
                  setPriorityScore(payload.new.priority_score);
                  refreshStatus();
                }
              }
            )
            .subscribe();
          channelRef.current = channel;
        }

        heartbeatRef.current = setInterval(() => {
          fetch('/api/social/cafe/classroom-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'heartbeat', roomId }),
          }).catch(() => {});
        }, 20000);

        // Fallback poll in case the realtime socket dropped — cheap and
        // also what keeps the position/total-waiting numbers moving as
        // other students join or get admitted ahead of us.
        pollRef.current = setInterval(refreshStatus, 5000);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to join classroom queue:', err);
          setJoinError('Could not join the queue. Try again.');
          setLoading(false);
        }
      }
    };

    if (user) join();

    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      // Only leave the queue on unmount if we're walking away without ever
      // being admitted — once admitted, this component unmounts BECAUSE the
      // caller is swapping it for the real room, and we don't want to
      // delete the row classroom-presence's retry may still be relying on.
      if (!admittedRef.current) {
        fetch('/api/social/cafe/classroom-queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'leave', roomId }),
        }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  const handleLeaveQueue = () => {
    onLeave();
  };

  const handleRedeemBoost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boostInput.trim()) return;

    setRedeemingBoost(true);
    setBoostError(null);
    setBoostSuccess(null);
    try {
      const res = await fetch('/api/social/cafe/redeem-boost-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, code: boostInput.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setBoostError(body.error || 'Incorrect boost code.');
        setRedeemingBoost(false);
        return;
      }
      setPriorityScore(body.priorityScore ?? priorityScore + (body.boost || 0));
      setBoostSuccess(`+${body.boost} priority applied!`);
      setBoostInput('');
      setRedeemingBoost(false);
      refreshStatus();
    } catch (err) {
      console.error('Boost code redeem failed:', err);
      setBoostError('Something went wrong. Try again.');
      setRedeemingBoost(false);
    }
  };

  return (
    <div className="flex h-[80vh] w-full rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800 shadow-2xl items-center justify-center p-8">
      <div className="text-center space-y-5 max-w-sm w-full">
        {loading ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
            <p className="text-sm text-slate-400">Joining the queue for "{roomName}"...</p>
          </>
        ) : joinError ? (
          <>
            <Users className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="text-white font-bold">Couldn't join the queue</h3>
            <p className="text-xs text-slate-400">{joinError}</p>
            <button
              onClick={handleLeaveQueue}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Back to Café
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">You're in line</h3>
              <p className="text-xs text-slate-400 mt-1">
                "{roomName}" is full — the trainer will admit you as a seat opens up.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 py-2">
              <div>
                <div className="text-2xl font-bold text-white">{position ?? '—'}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Your position</div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <div className="text-2xl font-bold text-white">{totalWaiting ?? '—'}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Waiting total</div>
              </div>
            </div>

            {priorityScore > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{priorityScore} priority applied</span>
              </div>
            )}

            <form onSubmit={handleRedeemBoost} className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 block text-left">
                Have a boost code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={boostInput}
                  onChange={(e) => setBoostInput(e.target.value)}
                  placeholder="Enter code to jump the line"
                  className="flex-1 h-9 px-3 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={redeemingBoost || !boostInput.trim()}
                  className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold"
                >
                  {redeemingBoost ? '...' : 'Apply'}
                </button>
              </div>
              {boostError && <p className="text-[10px] text-red-400 text-left">{boostError}</p>}
              {boostSuccess && <p className="text-[10px] text-emerald-400 text-left">{boostSuccess}</p>}
            </form>

            <button
              onClick={handleLeaveQueue}
              className="w-full h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave queue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassroomQueueGate;
