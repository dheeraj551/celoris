"use client";

// Celoris Chat voice & video calls: the ringing screens, the in-call screen
// and the paywall. The server (/api/celoris-chat/calls) decides everything
// that matters — who may call, billing, time limit, which provider — and this
// component follows the call row it keeps in the database (via Realtime).
//
// Media runs on Tencent RTC or Agora (see callEngines.ts). If joining on one
// fails, the call is moved to the other once, and both people rejoin there.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Coins, Crown, Loader2, Mic, MicOff, Phone, PhoneOff, Video, VideoOff, X } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { createEngine, isDeviceError, type CallEngine, type JoinCredentials, type RemoteState } from "./callEngines";

type Kind = "voice" | "video";
type Status = "ringing" | "connected" | "ended" | "declined" | "missed" | "cancelled";

export interface CallInfo {
  id: string;
  kind: Kind;
  provider: "tencent" | "agora";
  status: Status;
  endReason: string | null;
  role: "caller" | "callee";
  otherId: string;
  createdAt: string;
  connectedAt: string | null;
  endedAt: string | null;
  endsAt: string | null;
  maxMinutes: number;
  ratePerMinute: number;
  billedMinutes: number;
  billedCredits?: number;
  callerBalance?: number;
}

export interface CallStatusInfo {
  canCall: boolean;
  planLabel: string;
  balance: number;
  ratePerMinute: number;
  maxMinutes: number;
  available: boolean;
}

interface PersonLite {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface CallLayerHandle {
  startCall: (personId: string, kind: Kind) => void;
}

interface Props {
  meId: string;
  people: PersonLite[];
  flash: (kind: "ok" | "error", text: string) => void;
  Avatar: React.ComponentType<{ person: PersonLite; size?: number }>;
  onStatus?: (s: CallStatusInfo) => void;
}

const RING_TIMEOUT_MS = 45_000;
const HEARTBEAT_MS = 20_000;

const isLive = (c: CallInfo | null) => !!c && (c.status === "ringing" || c.status === "connected");

function fromRow(r: any, me: string): CallInfo {
  const isCaller = r.caller_id === me;
  const connectedMs = r.connected_at ? Date.parse(r.connected_at) : null;
  return {
    id: r.id,
    kind: r.kind,
    provider: r.provider,
    status: r.status,
    endReason: r.end_reason,
    role: isCaller ? "caller" : "callee",
    otherId: isCaller ? r.callee_id : r.caller_id,
    createdAt: r.created_at,
    connectedAt: r.connected_at,
    endedAt: r.ended_at,
    endsAt: connectedMs ? new Date(connectedMs + r.max_minutes * 60_000).toISOString() : null,
    maxMinutes: r.max_minutes,
    ratePerMinute: r.rate_per_minute,
    billedMinutes: r.billed_minutes,
    billedCredits: isCaller ? r.billed_credits : undefined,
  };
}

async function post(url: string, body: any): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function mmss(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

// Simple ring tones with WebAudio (no sound files to ship). Browsers may block
// sound until the person has interacted with the page — that's fine, the
// screen still shows the call.
function useRingTone(mode: "incoming" | "outgoing" | null) {
  useEffect(() => {
    if (!mode) return;
    let ctx: AudioContext | null = null;
    let timer: number | null = null;
    try {
      const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      ctx = new Ctx();
      const beep = (freq: number, start: number, dur: number) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(mode === "incoming" ? 0.18 : 0.08, ctx.currentTime + start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.05);
      };
      const ring = () => {
        if (mode === "incoming") {
          beep(880, 0, 0.35);
          beep(660, 0.45, 0.35);
          try {
            navigator.vibrate?.([300, 150, 300]);
          } catch {
            // ignore
          }
        } else {
          beep(440, 0, 1.2);
        }
      };
      ring();
      timer = window.setInterval(ring, mode === "incoming" ? 2000 : 3000);
    } catch {
      // no audio — ignore
    }
    return () => {
      if (timer) window.clearInterval(timer);
      try {
        ctx?.close();
      } catch {
        // ignore
      }
    };
  }, [mode]);
}

const CallLayer = forwardRef<CallLayerHandle, Props>(function CallLayer({ meId, people, flash, Avatar, onStatus }, ref) {
  const [call, setCall] = useState<CallInfo | null>(null);
  const [media, setMedia] = useState<"idle" | "joining" | "joined" | "failed">("idle");
  const [remote, setRemote] = useState<RemoteState>({ present: false, hasVideo: false });
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [paywall, setPaywall] = useState<{ code: "needs_plan" | "needs_credits"; message: string; balance?: number } | null>(null);

  const callRef = useRef<CallInfo | null>(null);
  callRef.current = call;
  const engineRef = useRef<CallEngine | null>(null);
  const joinKeyRef = useRef<string | null>(null);
  const triedBackupRef = useRef<Record<string, boolean>>({});
  const summaryShownRef = useRef<Record<string, boolean>>({});
  // Calls this tab placed, answered or picked back up after a reload. A
  // connected call owned by another tab (same person, two tabs open) is left
  // alone here, so the two tabs don't fight over the same seat in the room.
  const ownedRef = useRef<Record<string, boolean>>({});
  const foreignRef = useRef<Record<string, boolean>>({});
  const localElRef = useRef<HTMLDivElement>(null);
  const remoteElRef = useRef<HTMLDivElement>(null);

  const personOf = useCallback(
    (id: string): PersonLite => people.find((p) => p.id === id) || { id, name: "Celoris friend", avatarUrl: null },
    [people]
  );

  // Merge a new view of a call into state. Ignores rows for other calls
  // unless they're live and we have none.
  const applyCall = useCallback((next: CallInfo) => {
    if (foreignRef.current[next.id]) return;
    setCall((prev) => {
      if (prev && prev.id === next.id) {
        return {
          ...next,
          callerBalance: next.callerBalance ?? prev.callerBalance,
          billedCredits: next.billedCredits ?? prev.billedCredits,
        };
      }
      if (isLive(next) && !isLive(prev)) return next;
      return prev;
    });
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/celoris-chat/calls", { cache: "no-store" });
      if (!res.ok) return;
      const d = await res.json();
      onStatus?.({
        canCall: d.canCall,
        planLabel: d.planLabel,
        balance: d.balance,
        ratePerMinute: d.ratePerMinute,
        maxMinutes: d.maxMinutes,
        available: d.available,
      });
      if (d.call) {
        ownedRef.current[d.call.id] = true;
        applyCall(d.call);
      }
    } catch {
      // ignore
    }
  }, [applyCall, onStatus]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Realtime: calls to me (new + updates) and updates to calls I started.
  useEffect(() => {
    const supabase: any = createClient();
    const onRow = (payload: any) => {
      const row = payload.new;
      if (!row?.id) return;
      applyCall(fromRow(row, meId));
    };
    const channel = supabase
      .channel(`celoris-calls-${meId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "celoris_chat_calls", filter: `callee_id=eq.${meId}` }, onRow)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "celoris_chat_calls", filter: `callee_id=eq.${meId}` }, onRow)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "celoris_chat_calls", filter: `caller_id=eq.${meId}` }, onRow)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [meId, applyCall]);

  // ---------------------------------------------------------------------------
  // Media
  // ---------------------------------------------------------------------------

  const leaveEngine = useCallback(async () => {
    const engine = engineRef.current;
    engineRef.current = null;
    if (engine) await engine.leave().catch(() => {});
    setRemote({ present: false, hasVideo: false });
  }, []);

  const hangUp = useCallback(
    async (reason?: string) => {
      const c = callRef.current;
      if (!c) return;
      try {
        const res = await post(`/api/celoris-chat/calls/${c.id}`, { action: "end", reason });
        if (res.ok && res.data?.call) applyCall(res.data.call);
        else applyCall({ ...c, status: c.status === "ringing" ? "cancelled" : "ended", endReason: reason || "hangup" });
      } catch {
        applyCall({ ...c, status: "ended", endReason: reason || "hangup" });
      }
    },
    [applyCall]
  );

  const join = useCallback(
    async (c: CallInfo) => {
      const key = `${c.id}:${c.provider}`;
      if (joinKeyRef.current === key) return;
      joinKeyRef.current = key;
      await leaveEngine();
      setMedia("joining");
      try {
        const res = await post(`/api/celoris-chat/calls/${c.id}`, { action: "token" });
        if (!res.ok) throw Object.assign(new Error(res.data?.error || "Could not connect"), { server: true, status: res.status });
        if (joinKeyRef.current !== key) return;
        const creds = res.data.credentials as JoinCredentials;
        const engine = createEngine(creds.provider, {
          onRemote: (s) => setRemote(s),
          onError: (m) => console.warn("[call]", m),
        });
        engineRef.current = engine;
        await engine.join(creds, { video: c.kind === "video", localEl: localElRef.current, remoteEl: remoteElRef.current });
        if (joinKeyRef.current !== key) {
          engine.leave().catch(() => {});
          return;
        }
        setMicOn(true);
        setCamOn(c.kind === "video");
        setMedia("joined");
      } catch (err: any) {
        if (joinKeyRef.current !== key) return;
        console.error("[call] join failed", err);
        await leaveEngine();
        if (isDeviceError(err)) {
          setMedia("failed");
          summaryShownRef.current[c.id] = true;
          flash("error", c.kind === "video" ? "Please allow microphone and camera access to join the call." : "Please allow microphone access to join the call.");
          hangUp("device");
          return;
        }
        if (err?.server && err.status === 409) return; // call already over
        if (!triedBackupRef.current[c.id]) {
          // Move the call to the backup provider; both sides rejoin there.
          triedBackupRef.current[c.id] = true;
          joinKeyRef.current = null;
          const sw = await post(`/api/celoris-chat/calls/${c.id}`, { action: "switch", from: c.provider }).catch(() => null);
          if (sw?.ok && sw.data?.call && sw.data.call.provider !== c.provider) {
            applyCall(sw.data.call);
            return;
          }
        }
        setMedia("failed");
        summaryShownRef.current[c.id] = true;
        flash("error", "Couldn’t connect the call. Please check your internet and try again.");
        hangUp("connect_failed");
      }
    },
    [applyCall, flash, hangUp, leaveEngine]
  );

  // Follow the call's status and provider.
  useEffect(() => {
    if (!call) return;
    if (call.status === "connected") {
      if (!ownedRef.current[call.id]) {
        foreignRef.current[call.id] = true;
        setCall(null);
        return;
      }
      join(call);
      return;
    }
    if (call.status === "ringing") return;

    // The call is over.
    joinKeyRef.current = null;
    leaveEngine();
    setMedia("idle");
    if (!summaryShownRef.current[call.id]) {
      summaryShownRef.current[call.id] = true;
      const name = personOf(call.otherId).name;
      const isCaller = call.role === "caller";
      let text = "Call ended";
      let kind: "ok" | "error" = "ok";
      if (call.status === "declined") text = isCaller ? `${name} can’t talk right now` : "Call declined";
      else if (call.status === "missed") text = isCaller ? `${name} didn’t answer` : `Missed call from ${name}`;
      else if (call.status === "cancelled") text = isCaller ? "Call cancelled" : `Missed call from ${name}`;
      else if (call.endReason === "no_credits") {
        text = isCaller ? "Call ended — you ran out of credits" : "Call ended";
        kind = "error";
      } else if (call.endReason === "time_limit") text = `Call ended — ${call.maxMinutes}-minute limit reached`;
      else if (call.endReason === "dropped") {
        text = "Call dropped";
        kind = "error";
      }
      if (isCaller && call.connectedAt && typeof call.billedCredits === "number") {
        text += ` · ${call.billedMinutes} min · ${call.billedCredits} credit${call.billedCredits === 1 ? "" : "s"}`;
      }
      flash(kind, text);
      loadStatus();
    }
    const id = call.id;
    const t = window.setTimeout(() => setCall((c) => (c && c.id === id && !isLive(c) ? null : c)), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call?.id, call?.status, call?.provider]);

  // Heartbeat + billing while connected.
  useEffect(() => {
    if (!call || call.status !== "connected") return;
    const id = call.id;
    const beat = async () => {
      const res = await post(`/api/celoris-chat/calls/${id}`, { action: "heartbeat" }).catch(() => null);
      if (res?.ok && res.data?.call) applyCall(res.data.call);
    };
    const t = window.setInterval(beat, HEARTBEAT_MS);
    return () => window.clearInterval(t);
  }, [call?.id, call?.status, applyCall]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clock for the timer.
  useEffect(() => {
    if (!isLive(call)) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [call]);

  // The caller gives up after the ring timeout.
  useEffect(() => {
    if (!call || call.status !== "ringing" || call.role !== "caller") return;
    const left = RING_TIMEOUT_MS - (Date.now() - Date.parse(call.createdAt));
    const t = window.setTimeout(() => hangUp("no_answer"), Math.max(1000, left));
    return () => window.clearTimeout(t);
  }, [call?.id, call?.status, call?.role, hangUp]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving the page ends the call, so nobody keeps paying for a closed tab.
  useEffect(() => {
    const onHide = () => {
      const c = callRef.current;
      if (!c || !isLive(c)) return;
      try {
        navigator.sendBeacon?.(
          `/api/celoris-chat/calls/${c.id}`,
          new Blob([JSON.stringify({ action: c.status === "ringing" && c.role === "callee" ? "decline" : "end" })], {
            type: "text/plain;charset=UTF-8",
          })
        );
      } catch {
        // ignore
      }
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      engineRef.current?.leave().catch(() => {});
    };
  }, []);

  useRingTone(call?.status === "ringing" ? (call.role === "callee" ? "incoming" : "outgoing") : null);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const startCall = useCallback(
    async (personId: string, kind: Kind) => {
      if (isLive(callRef.current)) {
        flash("error", "You’re already in a call.");
        return;
      }
      if (busy) return;
      setBusy(true);
      try {
        const res = await post("/api/celoris-chat/calls", { to: personId, kind });
        if (res.ok && res.data?.call) {
          ownedRef.current[res.data.call.id] = true;
          applyCall(res.data.call);
          return;
        }
        const code = res.data?.code;
        if (code === "needs_plan" || code === "needs_credits") {
          setPaywall({ code, message: res.data.error, balance: res.data.balance });
        } else {
          flash("error", res.data?.error || "Could not start the call.");
        }
      } catch {
        flash("error", "Could not start the call.");
      } finally {
        setBusy(false);
      }
    },
    [applyCall, busy, flash]
  );

  useImperativeHandle(ref, () => ({ startCall }), [startCall]);

  const answer = async () => {
    const c = callRef.current;
    if (!c || busy) return;
    setBusy(true);
    ownedRef.current[c.id] = true;
    try {
      const res = await post(`/api/celoris-chat/calls/${c.id}`, { action: "answer" });
      if (res.ok && res.data?.call) applyCall(res.data.call);
      else {
        flash("error", res.data?.error || "Could not answer.");
        applyCall({ ...c, status: "missed" });
      }
    } finally {
      setBusy(false);
    }
  };

  const decline = async () => {
    const c = callRef.current;
    if (!c) return;
    const res = await post(`/api/celoris-chat/calls/${c.id}`, { action: "decline" }).catch(() => null);
    if (res?.ok && res.data?.call) applyCall(res.data.call);
    else applyCall({ ...c, status: "declined" });
  };

  const toggleMic = async () => {
    const next = !micOn;
    try {
      await engineRef.current?.setMic(next);
      setMicOn(next);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCam = async () => {
    const next = !camOn;
    try {
      await engineRef.current?.setCamera(next);
      setCamOn(next);
    } catch (e) {
      console.error(e);
      flash("error", "Couldn’t turn on the camera.");
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const other = useMemo(() => (call ? personOf(call.otherId) : null), [call, personOf]);

  const paywallModal = paywall && (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPaywall(null)}>
      <div className="relative w-full max-w-sm rounded-2xl border border-amber-500/25 bg-[#0d1320] p-5 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setPaywall(null)} className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          {paywall.code === "needs_plan" ? <Crown className="w-6 h-6 text-black" /> : <Coins className="w-6 h-6 text-black" />}
        </div>
        <h3 className="mt-3 text-base font-extrabold text-white">
          {paywall.code === "needs_plan" ? "Calls are a premium feature" : "Add credits to call"}
        </h3>
        <p className="mt-1.5 text-sm text-slate-400">
          {paywall.code === "needs_plan"
            ? "Voice and video calls come with Basic, Pro and Max plans. Your friends can answer for free."
            : `${paywall.message}${typeof paywall.balance === "number" ? ` You have ${paywall.balance} credits.` : ""}`}
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex w-full justify-center py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-sm font-extrabold"
        >
          {paywall.code === "needs_plan" ? "See plans" : "Get credits"}
        </Link>
        <p className="mt-2 text-[11px] text-slate-500">Calls cost 1 credit per minute and last up to 60 minutes.</p>
      </div>
    </div>
  );

  if (!call || !other || !isLive(call)) return paywallModal || null;

  // Incoming / outgoing ring screens
  if (call.status === "ringing") {
    const incoming = call.role === "callee";
    return (
      <>
        <div className="absolute inset-0 z-[55] bg-[#05070c]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
            <div className="relative rounded-full ring-4 ring-sky-500/30">
              <Avatar person={other} size={96} />
            </div>
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-white">{other.name}</h2>
          <p className="mt-1 text-sm text-sky-300/90 flex items-center gap-1.5">
            {call.kind === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            {incoming ? `Incoming ${call.kind} call` : "Calling…"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {incoming ? "Free for you to answer" : `${call.ratePerMinute} credit per minute once they answer · up to ${call.maxMinutes} min`}
          </p>
          <div className="mt-10 flex items-center gap-10">
            {incoming ? (
              <>
                <button onClick={decline} className="flex flex-col items-center gap-2 text-xs text-slate-300">
                  <span className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/40">
                    <PhoneOff className="w-7 h-7 text-white" />
                  </span>
                  Decline
                </button>
                <button onClick={answer} disabled={busy} className="flex flex-col items-center gap-2 text-xs text-slate-300">
                  <span className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 animate-pulse">
                    {call.kind === "video" ? <Video className="w-7 h-7 text-white" /> : <Phone className="w-7 h-7 text-white" />}
                  </span>
                  Accept
                </button>
              </>
            ) : (
              <button onClick={() => hangUp()} className="flex flex-col items-center gap-2 text-xs text-slate-300">
                <span className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center">
                  <PhoneOff className="w-7 h-7 text-white" />
                </span>
                Cancel
              </button>
            )}
          </div>
        </div>
        {paywallModal}
      </>
    );
  }

  // In a call (also shown briefly while the call wraps up)
  const connectedMs = call.connectedAt ? Date.parse(call.connectedAt) : now;
  const elapsed = now - connectedMs;
  const remainingMs = call.endsAt ? Date.parse(call.endsAt) - now : Infinity;
  const isCaller = call.role === "caller";
  const lowCredits = isCaller && typeof call.callerBalance === "number" && call.callerBalance < 2 * call.ratePerMinute;
  const showRemoteVideo = call.kind === "video" && remote.hasVideo;

  return (
    <div className="absolute inset-0 z-[55] bg-[#05070c] flex flex-col">
      {/* Remote video (or avatar) */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div ref={remoteElRef} className={`absolute inset-0 ${showRemoteVideo ? "" : "invisible"}`} />
        {!showRemoteVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <Avatar person={other} size={112} />
            <h2 className="mt-4 text-xl font-extrabold text-white">{other.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {media === "joining"
                ? "Connecting…"
                : media === "failed"
                  ? "Couldn’t connect"
                  : remote.present
                    ? call.kind === "video"
                      ? "Camera off"
                      : "On a voice call"
                    : "Waiting for them to join…"}
            </p>
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 p-3 flex items-start justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent">
          <div className="rounded-xl bg-black/40 px-3 py-1.5">
            <p className="text-sm font-bold text-white leading-tight">{other.name}</p>
            <p className="text-[11px] text-slate-300 font-mono">
              {mmss(elapsed)}
              {Number.isFinite(remainingMs) && remainingMs < 5 * 60_000 && (
                <span className="text-amber-300"> · {mmss(remainingMs)} left</span>
              )}
            </p>
          </div>
          {isCaller && (
            <div className={`rounded-xl px-3 py-1.5 text-right ${lowCredits ? "bg-rose-600/80" : "bg-black/40"}`}>
              <p className="text-[11px] font-bold text-white flex items-center gap-1 justify-end">
                <Coins className="w-3 h-3" /> {call.billedCredits ?? 0} used
              </p>
              {typeof call.callerBalance === "number" && (
                <p className="text-[10px] text-slate-200">{lowCredits ? "Low credits — " : ""}{call.callerBalance} left</p>
              )}
            </div>
          )}
        </div>

        {/* Local preview */}
        {call.kind === "video" && (
          <div className="absolute right-3 bottom-3 w-28 h-40 md:w-40 md:h-56 rounded-xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl">
            <div ref={localElRef} className={`w-full h-full ${camOn ? "" : "invisible"}`} />
            {!camOn && <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400">Camera off</div>}
          </div>
        )}

        {media === "joining" && (
          <div className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1 text-[11px] text-slate-200">
            <Loader2 className="w-3 h-3 animate-spin" /> Connecting…
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-center gap-4 py-5 bg-[#0a0e16] border-t border-white/[0.06]">
        <button
          onClick={toggleMic}
          disabled={media !== "joined"}
          title={micOn ? "Mute" : "Unmute"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${
            micOn ? "bg-white/10 hover:bg-white/15 text-white" : "bg-white text-black"
          }`}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        {call.kind === "video" && (
          <button
            onClick={toggleCam}
            disabled={media !== "joined"}
            title={camOn ? "Turn camera off" : "Turn camera on"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${
              camOn ? "bg-white/10 hover:bg-white/15 text-white" : "bg-white text-black"
            }`}
          >
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        )}
        <button
          onClick={() => hangUp()}
          title="End call"
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/40"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
});

export default CallLayer;
