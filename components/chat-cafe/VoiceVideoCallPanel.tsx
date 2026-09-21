'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Users, Loader2 } from 'lucide-react';

interface VoiceVideoCallPanelProps {
  /** The chat_cafe_tables id (e.g. 'vip_lounge') — used as TRTC's strRoomId
      so the room maps 1:1 onto the café table instead of a separate numeric
      id we'd have to invent and keep in sync. */
  roomId: string;
  userId: string;
  userSig: string;
  sdkAppId: number;
  displayName: string;
  onLeave: () => void;
}

interface RemoteParticipant {
  userId: string;
  hasVideo: boolean;
}

/**
 * Live voice + video call for the paid VIP Voice & Video Lounge, backed by
 * Tencent RTC (trtc-sdk-v5). Mounted by ChatCafeApp only once the caller has
 * paid the entry fee and holds join credentials from
 * POST /api/social/chat-cafe/voice-entry — this component itself never
 * touches billing, it only joins/leaves the room.
 *
 * trtc-sdk-v5 is dynamically imported inside the effect (not at module top)
 * because it touches WebRTC/navigator APIs that don't exist during Next.js
 * server-side rendering.
 */
export const VoiceVideoCallPanel: React.FC<VoiceVideoCallPanelProps> = ({
  roomId,
  userId,
  userSig,
  sdkAppId,
  displayName,
  onLeave,
}) => {
  const trtcRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState<Record<string, RemoteParticipant>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // @ts-ignore
        const mod: any = await import('trtc-sdk-v5');
        const TRTC = mod.default || mod;
        const trtc = TRTC.create();
        trtcRef.current = trtc;

        trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, (event: any) => {
          setRemoteParticipants((prev) => ({ ...prev, [event.userId]: { userId: event.userId, hasVideo: false } }));
        });
        trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, (event: any) => {
          setRemoteParticipants((prev) => {
            const next = { ...prev };
            delete next[event.userId];
            return next;
          });
        });
        trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, (event: any) => {
          setRemoteParticipants((prev) => ({
            ...prev,
            [event.userId]: { userId: event.userId, hasVideo: true },
          }));
          trtc
            .startRemoteVideo({ userId: event.userId, streamType: event.streamType, view: `voice-lounge-remote-${event.userId}` })
            .catch((e: any) => console.error('startRemoteVideo failed:', e));
        });
        trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, (event: any) => {
          setRemoteParticipants((prev) => ({
            ...prev,
            [event.userId]: { userId: event.userId, hasVideo: false },
          }));
        });
        trtc.on(TRTC.EVENT.ERROR, (error: any) => {
          console.error('TRTC error:', error);
          if (!cancelled) setErrorMsg(error?.message || 'A call error occurred.');
        });

        // strRoomId (not the numeric roomId) — the café table id is already
        // a stable string, so there's no separate numeric id to invent or
        // keep in sync with chat_cafe_tables.
        await trtc.enterRoom({ sdkAppId, userId, userSig, strRoomId: roomId, scene: 'rtc' });
        if (cancelled) {
          await trtc.exitRoom().catch(() => {});
          return;
        }

        await trtc.startLocalAudio();
        if (!cancelled) setStatus('connected');
      } catch (err: any) {
        console.error('TRTC join failed:', err);
        if (!cancelled) {
          setErrorMsg(err?.message || 'Could not join the call — check your mic/camera permissions.');
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      const trtc = trtcRef.current;
      if (trtc) {
        trtc.exitRoom().catch(() => {});
        trtc.destroy();
        trtcRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, userSig, sdkAppId]);

  const toggleMic = useCallback(async () => {
    const trtc = trtcRef.current;
    if (!trtc) return;
    try {
      if (micOn) await trtc.stopLocalAudio();
      else await trtc.startLocalAudio();
      setMicOn((v) => !v);
    } catch (err) {
      console.error('toggleMic failed:', err);
    }
  }, [micOn]);

  const toggleCam = useCallback(async () => {
    const trtc = trtcRef.current;
    if (!trtc) return;
    try {
      if (camOn) {
        await trtc.stopLocalVideo();
        setCamOn(false);
      } else {
        await trtc.startLocalVideo({ view: localVideoRef.current || 'voice-lounge-local-video' });
        setCamOn(true);
      }
    } catch (err) {
      console.error('toggleCam failed:', err);
    }
  }, [camOn]);

  const handleLeaveClick = useCallback(async () => {
    const trtc = trtcRef.current;
    if (trtc) {
      await trtc.exitRoom().catch(() => {});
      trtc.destroy();
      trtcRef.current = null;
    }
    onLeave();
  }, [onLeave]);

  const participantCount = Object.keys(remoteParticipants).length + 1;

  return (
    <div className="rounded-2xl border border-fuchsia-500/30 bg-[#120819] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-300">
          <Users className="w-3.5 h-3.5" />
          <span>{participantCount} in the call</span>
        </div>
        {status === 'connecting' && (
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Connecting…
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-700/40 rounded-lg px-2.5 py-1.5">{errorMsg}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-fuchsia-500/20">
          <div id="voice-lounge-local-video" ref={localVideoRef} className="w-full h-full" />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-stone-400 text-center px-2">
              {displayName} (camera off)
            </div>
          )}
        </div>
        {Object.values(remoteParticipants).map((p) => (
          <div key={p.userId} className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-fuchsia-500/20">
            <div id={`voice-lounge-remote-${p.userId}`} className="w-full h-full" />
            {!p.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-stone-400">Patron (camera off)</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          onClick={toggleMic}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
          className={`p-2.5 rounded-xl border transition-colors ${
            micOn ? 'bg-fuchsia-950/50 border-fuchsia-500/40 text-fuchsia-300' : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}
        >
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleCam}
          title={camOn ? 'Turn camera off' : 'Turn camera on'}
          className={`p-2.5 rounded-xl border transition-colors ${
            camOn ? 'bg-fuchsia-950/50 border-fuchsia-500/40 text-fuchsia-300' : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}
        >
          {camOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
        <button onClick={handleLeaveClick} title="Leave call" className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors">
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
