'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Users, Loader2, Settings2 } from 'lucide-react';
import { UserProfile } from './types';

interface VoiceVideoCallPanelProps {
  /** The chat_cafe_tables id (e.g. 'vip_lounge') — used as TRTC's strRoomId
      so the room maps 1:1 onto the café table instead of a separate numeric
      id we'd have to invent and keep in sync. */
  roomId: string;
  userId: string;
  userSig: string;
  sdkAppId: number;
  displayName: string;
  /** Every patron currently known in this café (the same presence-tracked
      roster the text chat and sidebar use). TRTC's REMOTE_USER_ENTER event
      only ever gives us the other person's raw auth userId, never a name —
      this is how a remote tile turns that id back into "Ananya Jairath"
      instead of the generic "Patron" placeholder it used to always show. */
  patrons: UserProfile[];
  onLeave: () => void;
}

interface RemoteParticipant {
  userId: string;
  hasVideo: boolean;
}

interface DeviceOption {
  deviceId: string;
  label: string;
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
  patrons,
  onLeave,
}) => {
  const trtcRef = useRef<any>(null);
  // The TRTC class itself (not just an instance) — its device-listing and
  // setCurrentSpeaker calls are static, so this is what the device picker
  // below calls into.
  const trtcClassRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState<Record<string, RemoteParticipant>>({});

  // Mic/camera/speaker selection. Nothing here re-binds automatically when
  // the OS or Chrome's site-level default changes mid-call — no WebRTC app
  // does that, since it would mean silently swapping the audio source out
  // from under the other participants. What was actually missing is any way
  // to *choose* a device at all, which is why it looked "stuck" on whatever
  // the browser happened to grab first.
  const [showDevices, setShowDevices] = useState(false);
  const [micList, setMicList] = useState<DeviceOption[]>([]);
  const [cameraList, setCameraList] = useState<DeviceOption[]>([]);
  const [speakerList, setSpeakerList] = useState<DeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');

  const patronNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of patrons) map[p.id] = p.name;
    return map;
  }, [patrons]);

  // Populates the device dropdowns and figures out which mic/camera is
  // actually live right now (via the real MediaStreamTrack's own settings,
  // not a guess), so the picker opens already showing the truth.
  const loadDevices = useCallback(async () => {
    const TRTC = trtcClassRef.current;
    if (!TRTC) return;
    try {
      const [mics, cams, speakers] = await Promise.all([
        TRTC.getMicrophoneList().catch(() => []),
        TRTC.getCameraList().catch(() => []),
        TRTC.getSpeakerList().catch(() => []),
      ]);
      const toOptions = (list: MediaDeviceInfo[], fallback: string): DeviceOption[] =>
        (list || []).map((d) => ({ deviceId: d.deviceId, label: d.label || fallback }));

      setMicList(toOptions(mics, 'Microphone'));
      setCameraList(toOptions(cams, 'Camera'));
      setSpeakerList(toOptions(speakers, 'Speaker'));

      const trtc = trtcRef.current;
      const activeMicId: string | undefined = trtc?.getAudioTrack?.()?.getSettings?.()?.deviceId;
      setSelectedMicId((prev) => activeMicId || prev || mics?.[0]?.deviceId || '');

      const activeCamId: string | undefined = trtc?.getVideoTrack?.()?.getSettings?.()?.deviceId;
      setSelectedCameraId((prev) => activeCamId || prev || cams?.[0]?.deviceId || '');
    } catch (err) {
      console.error('Failed to load call devices:', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // @ts-ignore
        const mod: any = await import('trtc-sdk-v5');
        const TRTC = mod.default || mod;
        trtcClassRef.current = TRTC;
        const trtc = TRTC.create();
        trtcRef.current = trtc;

        // Keeps the device dropdowns honest if a mic/camera is plugged in
        // or unplugged mid-call — it does not auto-switch anything, only
        // refreshes what's listed.
        trtc.on(TRTC.EVENT.DEVICE_CHANGED, () => {
          if (!cancelled) loadDevices();
        });

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
        if (!cancelled) {
          setStatus('connected');
          loadDevices();
        }
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
        await trtc.startLocalVideo({
          view: localVideoRef.current || 'voice-lounge-local-video',
          option: selectedCameraId ? { cameraId: selectedCameraId } : undefined,
        });
        setCamOn(true);
        loadDevices();
      }
    } catch (err) {
      console.error('toggleCam failed:', err);
    }
  }, [camOn, selectedCameraId, loadDevices]);

  const handleMicChange = useCallback(async (deviceId: string) => {
    setSelectedMicId(deviceId);
    const trtc = trtcRef.current;
    if (!trtc) return;
    try {
      await trtc.updateLocalAudio({ option: { microphoneId: deviceId } });
    } catch (err) {
      console.error('Failed to switch microphone:', err);
      setErrorMsg('Could not switch to that microphone.');
    }
  }, []);

  const handleCameraChange = useCallback(async (deviceId: string) => {
    setSelectedCameraId(deviceId);
    const trtc = trtcRef.current;
    if (!trtc || !camOn) return;
    try {
      await trtc.updateLocalVideo({ option: { cameraId: deviceId } });
    } catch (err) {
      console.error('Failed to switch camera:', err);
      setErrorMsg('Could not switch to that camera.');
    }
  }, [camOn]);

  const handleSpeakerChange = useCallback(async (deviceId: string) => {
    setSelectedSpeakerId(deviceId);
    const TRTC = trtcClassRef.current;
    if (!TRTC) return;
    try {
      await TRTC.setCurrentSpeaker(deviceId);
    } catch (err) {
      console.error('Failed to switch speaker:', err);
      setErrorMsg('This browser doesn\'t support switching the output speaker.');
    }
  }, []);

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
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-stone-400 text-center px-2">
                {patronNameById[p.userId] || 'Patron'} (camera off)
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-center gap-2 pt-1">
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
        <button
          onClick={() => {
            const next = !showDevices;
            setShowDevices(next);
            if (next) loadDevices();
          }}
          title="Choose microphone / camera / speaker"
          className={`p-2.5 rounded-xl border transition-colors ${
            showDevices ? 'bg-fuchsia-950/50 border-fuchsia-500/40 text-fuchsia-300' : 'bg-stone-800 border-stone-700 text-stone-400'
          }`}
        >
          <Settings2 className="w-4 h-4" />
        </button>
        <button onClick={handleLeaveClick} title="Leave call" className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors">
          <PhoneOff className="w-4 h-4" />
        </button>

        {showDevices && (
          <div className="absolute bottom-full mb-2 w-64 max-w-[85vw] p-3 rounded-xl bg-stone-950 border border-fuchsia-500/30 shadow-xl space-y-2.5 text-left z-10">
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-stone-500 mb-1">Microphone</label>
              <select
                value={selectedMicId}
                onChange={(e) => handleMicChange(e.target.value)}
                className="w-full text-xs bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-stone-200"
              >
                {micList.length === 0 && <option value="">Default</option>}
                {micList.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-stone-500 mb-1">Camera</label>
              <select
                value={selectedCameraId}
                onChange={(e) => handleCameraChange(e.target.value)}
                className="w-full text-xs bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-stone-200"
              >
                {cameraList.length === 0 && <option value="">Default</option>}
                {cameraList.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                ))}
              </select>
            </div>
            {speakerList.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-stone-500 mb-1">Speaker</label>
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => handleSpeakerChange(e.target.value)}
                  className="w-full text-xs bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-stone-200"
                >
                  {speakerList.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
