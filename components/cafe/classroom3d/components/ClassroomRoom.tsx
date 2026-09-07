"use client"

import React, { useState, useEffect, useRef } from 'react';
import type { IAgoraRTCClient, IMicrophoneAudioTrack, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { Users, X } from 'lucide-react';

import { ClassroomHeader } from './ClassroomHeader';
import { RightSidebar } from './RightSidebar';
import { Classroom3DCanvas } from './Classroom3DCanvas';
import { StudentActionModal } from './StudentActionModal';
import YouTubeStage, { YouTubeRemoteCommand } from './YouTubeStage';
import { Student, ChatMessage, CameraPreset } from '../types';

let client: IAgoraRTCClient;

interface ClassroomRoomProps {
  roomId: string;
  roomName: string;
  isHost: boolean;
  onLeave: () => void;
}

// Deterministic per-user color, matching the palette style used by the old
// PixiJS seat layer — this new UI doesn't use profile photos at all (the
// desks render name-initial-free colored figures instead), which sidesteps
// the avatar-loading bugs we were chasing on the old layer entirely.
const SEAT_PALETTE = ['#6366f1', '#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6', '#a855f7', '#eab308', '#ef4444', '#22c55e', '#f43f5e'];
function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return SEAT_PALETTE[hash % SEAT_PALETTE.length];
}

export default function ClassroomRoom({ roomId, roomName, isHost, onLeave }: ClassroomRoomProps) {
  const { profile, user } = useAuth();

  const [joined, setJoined] = useState(false);
  const [roomFullError, setRoomFullError] = useState<string | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localScreenTrack, setLocalScreenTrack] = useState<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null>(null);

  const [micOn, setMicOn] = useState(isHost);
  const [screenSharing, setScreenSharing] = useState(false);

  // 'idle' = nothing on the overlay, 'screen'/'youtube' = the live-presentation panel is up
  const [videoOverlayMode, setVideoOverlayMode] = useState<'idle' | 'screen' | 'youtube'>('idle');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [canSpeak, setCanSpeak] = useState(isHost);
  const [handRaisedSelf, setHandRaisedSelf] = useState(false);

  const [presenceState, setPresenceState] = useState<Record<string, any>>({});
  const [volumeByUid, setVolumeByUid] = useState<Record<string, number>>({});

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>(isHost ? 'teacher' : 'student-row1');
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeRemoteCommand, setYoutubeRemoteCommand] = useState<YouTubeRemoteCommand | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const youtubeNonceRef = useRef(0);

  const screenShareRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const AgoraRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingScreenTrackRef = useRef<any>(null);

  const presenceTrack = (overrides: Partial<{ handRaised: boolean; canSpeak: boolean; micOn: boolean }> = {}) => {
    if (!channelRef.current || !user) return;
    channelRef.current.track({
      userId: user.id,
      name: isHost ? (profile?.full_name || 'Trainer') : (profile?.full_name || 'Student'),
      isHost,
      handRaised: overrides.handRaised ?? handRaisedSelf,
      canSpeak: overrides.canSpeak ?? canSpeak,
      micOn: overrides.micOn ?? micOn,
    });
  };

  // 1. Reserve a seat (15-student cap), then initialize Agora and join.
  useEffect(() => {
    const init = async () => {
      if (!user) return;

      try {
        const presenceRes = await fetch('/api/social/cafe/classroom-presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'join', roomId, role: isHost ? 'trainer' : 'student' }),
        });
        if (!presenceRes.ok) {
          const body = await presenceRes.json().catch(() => ({}));
          setRoomFullError(body.error || 'This room is full. Please try again later.');
          return;
        }
      } catch (err) {
        console.error('Failed to reserve a seat:', err);
      }

      heartbeatIntervalRef.current = setInterval(() => {
        fetch('/api/social/cafe/classroom-presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'heartbeat', roomId, role: isHost ? 'trainer' : 'student' }),
        }).catch(() => {});
      }, 20000);

      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRef.current = AgoraRTC;
      client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', (volumes: any[]) => {
        setVolumeByUid((prev) => {
          const next = { ...prev };
          volumes.forEach((v) => { next[String(v.uid)] = Math.min(v.level / 100, 1); });
          return next;
        });
      });

      await joinChannel(user.id, `classroom_${roomId}`);
      subscribeToSignaling();
    };

    init();

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      fetch('/api/social/cafe/classroom-presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', roomId }),
      }).catch(() => {});
      leaveChannelInternal();
      if (client) {
        client.off('user-published', handleUserPublished);
        client.off('user-unpublished', handleUserUnpublished);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // Depend on user?.id (a stable primitive), not the user object itself —
    // AuthProvider hands out a fresh session/user object on every auth
    // event (including the automatic token refresh Supabase fires on tab
    // focus/visibility change), which would otherwise tear this effect
    // down and re-join on every window switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  // Plays the pending screen track once the overlay is actually mounted.
  useEffect(() => {
    if (videoOverlayMode !== 'screen' || !screenShareRef.current) return;
    const track = pendingScreenTrackRef.current;
    if (!track) return;
    if (Array.isArray(track)) track[0].play(screenShareRef.current);
    else track.play(screenShareRef.current);
  }, [videoOverlayMode]);

  // Keep our Presence payload in sync with our own hand/mic state, and
  // re-broadcast once `profile` finishes loading (it's async, so the very
  // first track() call may fire before profile.full_name is available).
  useEffect(() => {
    presenceTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handRaisedSelf, canSpeak, micOn, profile?.full_name]);

  const joinChannel = async (uid: string, channel: string) => {
    try {
      const response = await fetch('/api/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: channel, uid, role: isHost ? 'publisher' : 'subscriber' }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      await client.join(data.appId, channel, data.token, uid);

      const AgoraRTC = AgoraRef.current;
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        if (!isHost) await audioTrack.setMuted(true);
        setLocalAudioTrack(audioTrack);
        await client.publish([audioTrack]);
      } catch (deviceErr) {
        console.warn('Could not access microphone (missing device or permission denied):', deviceErr);
      }

      setJoined(true);
    } catch (err) {
      console.error('Failed to join Classroom Table:', err);
    }
  };

  const leaveChannelInternal = async () => {
    localAudioTrack?.close();
    if (Array.isArray(localScreenTrack)) {
      localScreenTrack[0].close();
      if (localScreenTrack[1]) localScreenTrack[1].close();
    } else if (localScreenTrack) {
      localScreenTrack.close();
    }
    await client?.leave();
    setJoined(false);
  };

  const handleLeave = async () => {
    await leaveChannelInternal();
    onLeave();
  };

  const handleUserPublished = async (remoteUser: any, mediaType: 'audio' | 'video') => {
    await client.subscribe(remoteUser, mediaType);
    if (mediaType === 'audio') remoteUser.audioTrack?.play();
    if (mediaType === 'video' && remoteUser.videoTrack) {
      pendingScreenTrackRef.current = remoteUser.videoTrack;
      if (screenShareRef.current) remoteUser.videoTrack.play(screenShareRef.current);
    }
  };

  const handleUserUnpublished = (_remoteUser: any, _mediaType: 'audio' | 'video') => {};

  const toggleMic = async () => {
    if (!canSpeak || !localAudioTrack) return;
    await localAudioTrack.setMuted(micOn);
    setMicOn(!micOn);
  };

  const setOverlayModeAndBroadcast = (mode: 'idle' | 'screen' | 'youtube') => {
    setVideoOverlayMode(mode);
    channelRef.current?.send({ type: 'broadcast', event: 'video_overlay_mode', payload: { mode } });
  };

  const toggleScreenShare = async () => {
    if (!isHost) return;
    if (screenSharing) {
      if (Array.isArray(localScreenTrack)) {
        await client.unpublish(localScreenTrack);
        localScreenTrack[0].close();
        if (localScreenTrack[1]) localScreenTrack[1].close();
      } else if (localScreenTrack) {
        await client.unpublish(localScreenTrack);
        localScreenTrack.close();
      }
      setLocalScreenTrack(null);
      pendingScreenTrackRef.current = null;
      setScreenSharing(false);
      setOverlayModeAndBroadcast('idle');
    } else {
      try {
        const AgoraRTC = AgoraRef.current;
        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, 'auto');
        await client.publish(screenTrack);
        setLocalScreenTrack(screenTrack);
        pendingScreenTrackRef.current = screenTrack;
        setScreenSharing(true);
        setOverlayModeAndBroadcast('screen');
      } catch (err) {
        console.error('Failed to start screen share', err);
      }
    }
  };

  const handlePlayVideoUrl = () => {
    if (!isHost) return;
    const id = extractYouTubeIdLocal(videoUrlInput);
    if (!id) {
      alert("Couldn't find a YouTube video in that link — paste the full URL or the 11-character video ID.");
      return;
    }
    setYoutubeVideoId(id);
    channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload: { action: 'set', videoId: id } });
    setOverlayModeAndBroadcast('youtube');
  };

  const subscribeToSignaling = () => {
    const channel = supabase.channel(`classroom_${roomId}`, {
      config: { presence: { key: user?.id || Math.random().toString(36).slice(2) } },
    })
      .on('broadcast', { event: 'chat' }, ({ payload }: { payload: any }) => {
        setMessages((prev) => [...prev, payload]);
      })
      .on('broadcast', { event: 'allow_speak' }, ({ payload }: { payload: any }) => {
        if (payload.userId === user?.id) {
          setCanSpeak(true);
          setHandRaisedSelf(false);
          if (localAudioTrack) {
            localAudioTrack.setMuted(false);
            setMicOn(true);
          }
        }
      })
      .on('broadcast', { event: 'revoke_speak' }, ({ payload }: { payload: any }) => {
        if (payload.userId === user?.id) {
          setCanSpeak(false);
          if (localAudioTrack) {
            localAudioTrack.setMuted(true);
            setMicOn(false);
          }
        }
      })
      .on('broadcast', { event: 'dismiss_hand' }, ({ payload }: { payload: any }) => {
        if (payload.userId === user?.id) setHandRaisedSelf(false);
      })
      .on('broadcast', { event: 'youtube' }, ({ payload }: { payload: any }) => {
        if (payload.action === 'set') setYoutubeVideoId(payload.videoId);
        youtubeNonceRef.current += 1;
        setYoutubeRemoteCommand({ ...payload, nonce: youtubeNonceRef.current });
      })
      .on('broadcast', { event: 'video_overlay_mode' }, ({ payload }: { payload: any }) => {
        setVideoOverlayMode(payload.mode);
      })
      .on('presence', { event: 'sync' }, () => {
        setPresenceState(channel.presenceState());
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          channel.track({
            userId: user?.id,
            name: isHost ? (profile?.full_name || 'Trainer') : (profile?.full_name || 'Student'),
            isHost,
            handRaised: false,
            canSpeak: isHost,
            micOn,
          });
        }
      });

    channelRef.current = channel;
  };

  const sendMessage = (text: string) => {
    if (!user) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: profile?.full_name || (isHost ? 'Trainer' : 'Student'),
      isTeacher: isHost,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    channelRef.current?.send({ type: 'broadcast', event: 'chat', payload: msg });
    setMessages((prev) => [...prev, msg]);
  };

  const toggleOwnHand = () => {
    const next = !handRaisedSelf;
    setHandRaisedSelf(next);
    // presenceTrack() picks this up via the effect above; nothing else to broadcast.
  };

  const callOnStudent = (student: Student) => {
    if (!isHost) return;
    channelRef.current?.send({ type: 'broadcast', event: 'allow_speak', payload: { userId: student.id } });
  };

  // Lets the trainer dismiss a raised hand without granting the mic (the
  // modal's "Lower Hand" action). There's no real "prompt to raise hand"
  // equivalent in our signaling model, so that direction stays a no-op.
  const dismissStudentHand = (studentId: string) => {
    if (!isHost) return;
    channelRef.current?.send({ type: 'broadcast', event: 'dismiss_hand', payload: { userId: studentId } });
  };

  const sendPraise = (student: Student, text: string) => {
    if (!isHost) return;
    sendMessage(text);
  };

  // --- Build the real roster from Presence + Agora volume indicators ---
  const students: Student[] = Object.values(presenceState)
    .map((entries: any) => entries[0])
    .filter(Boolean)
    .sort((a: any, b: any) => (a.userId || '').localeCompare(b.userId || ''))
    .map((p: any): Student => ({
      id: p.userId,
      name: p.name || (p.isHost ? 'Trainer' : 'Student'),
      isHandRaised: !!p.handRaised,
      status: 'present',
      row: 0,
      col: 0,
      color: colorForId(p.userId || 'x'),
      isHost: !!p.isHost,
      canSpeak: !!p.canSpeak,
      micOn: !!p.micOn,
      speakingLevel: volumeByUid[p.userId] || 0,
    }));

  const presentCount = students.filter((s) => s.status === 'present').length;
  const handsCount = students.filter((s) => s.isHandRaised).length;

  if (roomFullError) {
    return (
      <div className="flex h-[80vh] w-full rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800 shadow-2xl items-center justify-center p-8">
        <div className="text-center space-y-3 max-w-sm">
          <Users className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-white font-bold">Hall's full</h3>
          <p className="text-xs text-slate-400">{roomFullError}</p>
          <button
            onClick={onLeave}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Back to Café
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[85vh] rounded-2xl overflow-hidden bg-[#070b14] text-slate-100 border border-slate-800 shadow-2xl">
      <ClassroomHeader
        presentCount={presentCount}
        handsCount={handsCount}
        courseTitle={roomName}
        isHost={isHost}
        onSoundToggle={() => setIsSoundMuted((p) => !p)}
        isMuted={isSoundMuted}
        micOn={micOn}
        canSpeak={canSpeak}
        onToggleMic={toggleMic}
        onLeave={handleLeave}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {!joined && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#070b14]">
              <p className="text-slate-500 animate-pulse text-sm">Joining classroom...</p>
            </div>
          )}

          <Classroom3DCanvas
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={(s) => { setSelectedStudentId(s.id); if (isHost) setModalStudent(s); }}
            onClearSelection={() => setSelectedStudentId(null)}
            onCallOnStudent={isHost ? callOnStudent : undefined}
            onToggleStudentHand={(id) => { if (id === user?.id) toggleOwnHand(); }}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
          />

          {/* Real live-presentation overlay (screen-share / YouTube) — flat
              panel over the 3D hall, per the decision to keep the in-world
              board purely decorative rather than texture-mapping live video
              onto the 3D mesh. */}
          {videoOverlayMode !== 'idle' && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[560px] max-w-[90%] rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-black">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0f1d]/95 border-b border-slate-800">
                <span className="text-[11px] font-semibold text-slate-300">
                  {videoOverlayMode === 'screen' ? 'Screen share' : 'Watching together'}
                </span>
                {isHost && (
                  <button
                    onClick={() => (videoOverlayMode === 'screen' ? toggleScreenShare() : setOverlayModeAndBroadcast('idle'))}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="aspect-video bg-black">
                {videoOverlayMode === 'screen' && <div ref={screenShareRef} className="w-full h-full" />}
                {videoOverlayMode === 'youtube' && (
                  <YouTubeStage
                    isHost={isHost}
                    videoId={youtubeVideoId}
                    remoteCommand={youtubeRemoteCommand}
                    onHostSetVideo={(videoId) => {
                      setYoutubeVideoId(videoId);
                      channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload: { action: 'set', videoId } });
                    }}
                    onHostPlay={(time) => channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload: { action: 'play', time } })}
                    onHostPause={(time) => channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload: { action: 'pause', time } })}
                    onHostSeek={(time) => channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload: { action: 'seek', time } })}
                  />
                )}
              </div>
            </div>
          )}
        </main>

        <RightSidebar
          isHost={isHost}
          currentUserId={user?.id || null}
          students={students}
          onToggleOwnHand={toggleOwnHand}
          handRaisedSelf={handRaisedSelf}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
          chatMessages={messages}
          onSendMessage={sendMessage}
          onCallOnStudent={callOnStudent}
          screenSharing={screenSharing}
          onToggleScreenShare={toggleScreenShare}
          videoUrl={videoUrlInput}
          onVideoUrlChange={setVideoUrlInput}
          onPlayVideoUrl={handlePlayVideoUrl}
        />
      </div>

      {isHost && modalStudent && (
        <StudentActionModal
          student={modalStudent}
          onClose={() => setModalStudent(null)}
          onToggleHand={dismissStudentHand}
          onToggleStatus={() => {}}
          onCallOn={callOnStudent}
          onSendPraise={sendPraise}
        />
      )}
    </div>
  );
}

function extractYouTubeIdLocal(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
