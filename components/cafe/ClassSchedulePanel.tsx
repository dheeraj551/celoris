"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Play, Square, Crown, Loader2 } from 'lucide-react';

// Trainer controls for a scheduled free class (see lib/cafe-class-queue.ts):
// set the class time, then press "Start class" to seat the top of the queue.
// Used in both the 3D classroom sidebar (dark) and the whiteboard room (light).

type Phase =
  | { mode: 'open' }
  | { mode: 'not_open'; opensAt: string; startsAt: string }
  | { mode: 'queueing'; opensAt: string; startsAt: string }
  | { mode: 'started'; startsAt: string; startedAt: string; graceEndsAt: string };

interface Settings {
  classStartsAt: string | null;
  queueOpenMinutes: number;
  vipReservedSeats: number;
  vipGraceMinutes: number;
  maxStudents: number;
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const ClassSchedulePanel: React.FC<{ roomId: string; theme?: 'dark' | 'light' }> = ({ roomId, theme = 'dark' }) => {
  const [phase, setPhase] = useState<Phase>({ mode: 'open' });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [waiting, setWaiting] = useState(0);
  const [vipWaiting, setVipWaiting] = useState(0);
  const [editing, setEditing] = useState(false);
  const [startsAt, setStartsAt] = useState(() => toLocalInput(new Date(Date.now() + 60 * 60 * 1000)));
  const [reserved, setReserved] = useState(3);
  const [grace, setGrace] = useState(10);
  const [openMins, setOpenMins] = useState(30);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/social/cafe/classroom-queue?roomId=${encodeURIComponent(roomId)}`, { cache: 'no-store' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return;
      if (body.phase) setPhase(body.phase);
      setWaiting(body.totalWaiting || 0);
      setVipWaiting(body.vipWaiting || 0);
      if (body.settings) {
        setSettings(body.settings);
      }
    } catch {
      /* next poll */
    }
  }, [roomId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const openEditor = () => {
    if (settings) {
      setReserved(settings.vipReservedSeats);
      setGrace(settings.vipGraceMinutes);
      setOpenMins(settings.queueOpenMinutes);
    }
    setMessage(null);
    setEditing(true);
  };

  const control = async (action: 'schedule' | 'start' | 'end') => {
    if (action === 'end' && !window.confirm('End this class? The waiting line will be cleared and the room goes back to normal walk-in mode.')) return;
    setBusy(action);
    setMessage(null);
    try {
      const res = await fetch('/api/social/cafe/class-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          action === 'schedule'
            ? { roomId, action, startsAt: new Date(startsAt).toISOString(), reservedSeats: reserved, graceMinutes: grace, queueOpenMinutes: openMins }
            : { roomId, action }
        ),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(body.error || 'Something went wrong.');
      } else {
        if (action === 'schedule') setEditing(false);
        if (action === 'start') setMessage(`Class started — ${body.admitted ?? 0} student(s) let in from the queue.`);
        if (body.phase) setPhase(body.phase);
        load();
      }
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(null);
    }
  };

  const dark = theme === 'dark';
  const box = dark ? 'p-4 space-y-2.5' : 'rounded-xl border border-indigo-200 bg-indigo-50 p-2.5 space-y-2';
  const title = dark ? 'text-[11px] font-bold uppercase tracking-wider text-slate-400' : 'text-xs font-bold text-indigo-800';
  const text = dark ? 'text-[11px] text-slate-300' : 'text-xs text-indigo-900';
  const muted = dark ? 'text-[10px] text-slate-500' : 'text-[11px] text-indigo-700/80';
  const input = dark
    ? 'w-full h-8 px-2 rounded-lg bg-[#141b2a] border border-slate-700/70 text-[11px] text-slate-200'
    : 'w-full h-8 px-2 rounded-lg bg-white border border-indigo-200 text-xs text-neutral-800';
  const btn = 'h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50';

  let status: React.ReactNode;
  if (phase.mode === 'open') {
    status = <p className={text}>No class scheduled — students walk in until the room is full.</p>;
  } else if (phase.mode === 'not_open') {
    status = (
      <p className={text}>
        Class at <b>{fmtTime(phase.startsAt)}</b>. Waiting line opens at {fmtTime(phase.opensAt)}.
      </p>
    );
  } else if (phase.mode === 'queueing') {
    status = (
      <p className={text}>
        Class at <b>{fmtTime(phase.startsAt)}</b> — line is open. <b>{waiting}</b> waiting
        {vipWaiting > 0 && <> (<Crown className="inline w-3 h-3 text-amber-400" /> {vipWaiting} members)</>}.
      </p>
    );
  } else {
    const inGrace = Date.now() < Date.parse(phase.graceEndsAt);
    status = (
      <p className={text}>
        Class running since {fmtTime(phase.startedAt)}. Seats fill automatically from the line ({waiting} waiting).
        {inGrace && settings && settings.vipReservedSeats > 0 && (
          <> {settings.vipReservedSeats} seat(s) held for late members until {fmtTime(phase.graceEndsAt)}.</>
        )}
      </p>
    );
  }

  return (
    <section className={box}>
      <h2 className={`${title} flex items-center gap-1.5`}>
        <CalendarClock className={`w-3.5 h-3.5 ${dark ? 'text-emerald-400' : 'text-indigo-600'}`} />
        Class schedule
      </h2>
      {status}

      {!editing && (
        <div className="flex flex-wrap gap-1.5">
          {phase.mode !== 'started' && (
            <button
              onClick={() => control('start')}
              disabled={!!busy}
              className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white flex-1`}
              title="Let the top of the waiting line into the room now"
            >
              {busy === 'start' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Start class
            </button>
          )}
          <button
            onClick={openEditor}
            disabled={!!busy}
            className={`${btn} ${dark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-100'}`}
          >
            {phase.mode === 'open' ? 'Schedule class' : 'Reschedule'}
          </button>
          {phase.mode !== 'open' && (
            <button
              onClick={() => control('end')}
              disabled={!!busy}
              className={`${btn} ${dark ? 'bg-slate-800 hover:bg-slate-700 text-rose-300' : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'}`}
            >
              <Square className="w-3 h-3" /> End
            </button>
          )}
        </div>
      )}

      {editing && (
        <div className="space-y-2">
          <label className={`${muted} block`}>
            Class starts at
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={`${input} mt-1`} />
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <label className={muted}>
              Line opens (min before)
              <input type="number" min={0} max={240} value={openMins} onChange={(e) => setOpenMins(Number(e.target.value))} className={`${input} mt-1`} />
            </label>
            <label className={muted}>
              Seats held for members
              <input type="number" min={0} max={50} value={reserved} onChange={(e) => setReserved(Number(e.target.value))} className={`${input} mt-1`} />
            </label>
            <label className={muted}>
              Held for (min)
              <input type="number" min={0} max={120} value={grace} onChange={(e) => setGrace(Number(e.target.value))} className={`${input} mt-1`} />
            </label>
          </div>
          <p className={muted}>Scheduling clears the current waiting line so the new class starts fresh.</p>
          <div className="flex gap-1.5">
            <button
              onClick={() => control('schedule')}
              disabled={!!busy}
              className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white flex-1`}
            >
              {busy === 'schedule' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Save schedule
            </button>
            <button
              onClick={() => setEditing(false)}
              className={`${btn} ${dark ? 'bg-slate-800 text-white' : 'bg-white border border-indigo-200 text-indigo-800'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && <p className={`${muted} ${dark ? '!text-amber-300' : '!text-amber-700'}`}>{message}</p>}
    </section>
  );
};

export default ClassSchedulePanel;
