"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { IAgoraRTCClient, IMicrophoneAudioTrack, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, PhoneOff, Send, MonitorUp, Users, CheckCircle, Hand, Youtube, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import RoomStage, { StageSeat } from './classroom/RoomStage';
import YouTubeStage, { YouTubeRemoteCommand } from './classroom/YouTubeStage';

let client: IAgoraRTCClient;

interface ClassroomTableProps {
  roomId: string;
  roomName: string;
  isHost: boolean;
  onLeave: () => void;
}

const MAX_STUDENTS = 15;

export default function ClassroomTable({ roomId, roomName, isHost, onLeave }: ClassroomTableProps) {
  const { profile, user } = useAuth();

  const [joined, setJoined] = useState(false);
  const [roomFullError, setRoomFullError] = useState<string | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localScreenTrack, setLocalScreenTrack] = useState<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null>(null);

  const [micOn, setMicOn] = useState(isHost); // Host starts with mic on, students muted
  const [screenSharing, setScreenSharing] = useState(false);

  // 'idle' = everyone's just seated (full-size room), 'screen'/'youtube' = a
  // main-stage item is up top and the room becomes a compact seat strip.
  const [stageMode, setStageMode] = useState<'idle' | 'screen' | 'youtube'>('idle');

  // Realtime signaling state (Supabase)
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [speakRequests, setSpeakRequests] = useState<string[]>([]);
  const [canSpeak, setCanSpeak] = useState(isHost);
  const [handRaisedSelf, setHandRaisedSelf] = useState(false);

  // Live roster (name/avatar/hand/mic per person), synced via Supabase
  // Realtime Presence on the same signaling channel — this is what feeds
  // the PixiJS seat layer.
  const [presenceState, setPresenceState] = useState<Record<string, any>>({});
  const [volumeByUid, setVolumeByUid] = useState<Record<string, number>>({});

  // YouTube "watch together" state
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeRemoteCommand, setYoutubeRemoteCommand] = useState<YouTubeRemoteCommand | null>(null);
  const youtubeNonceRef = useRef(0);

  const screenShareRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  // Holds the dynamically-loaded AgoraRTC module (browser only)
  const AgoraRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Whoever's screen track is currently live — held in a ref (not state) so
  // handleUserPublished can stash it the instant it arrives, independent of
  // whether the screenShareRef <div> has mounted yet. A student's client
  // might receive the Agora publish event before it's finished processing
  // the 'stage_mode' broadcast that actually renders that div, so we retry
  // via the effect below rather than assuming ordering.
  const pendingScreenTrackRef = useRef<any>(null);

  const presenceTrack = (overrides: Partial<{ handRaised: boolean; canSpeak: boolean; micOn: boolean }> = {}) => {
    if (!channelRef.current || !user) return;
    channelRef.current.track({
      userId: user.id,
      name: isHost ? (profile?.full_name || 'Host') : (profile?.full_name || 'Student'),
      avatarUrl: profile?.avatar_url || null,
      isHost,
      handRaised: overrides.handRaised ?? handRaisedSelf,
      canSpeak: overrides.canSpeak ?? canSpeak,
      micOn: overrides.micOn ?? micOn,
    });
  };

  // 1. Reserve a seat (enforces the 15-student cap), then initialize Agora and join the channel.
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
        // Non-fatal — if the presence check itself fails, don't block the whole class over it.
      }

      heartbeatIntervalRef.current = setInterval(() => {
        fetch('/api/social/cafe/classroom-presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'heartbeat', roomId, role: isHost ? 'trainer' : 'student' }),
        }).catch(() => {});
      }, 20000);

      // Lazy-load Agora SDK so it never runs on the server
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRef.current = AgoraRTC;
      client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-left', handleUserLeft);
      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', (volumes: any[]) => {
        setVolumeByUid(prev => {
          const next = { ...prev };
          volumes.forEach(v => { next[String(v.uid)] = Math.min(v.level / 100, 1); });
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
      leaveChannel();
      if (client) {
        client.off('user-published', handleUserPublished);
        client.off('user-unpublished', handleUserUnpublished);
        client.off('user-left', handleUserLeft);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // Depend on user?.id (a stable primitive), NOT the user object itself.
    // AuthProvider's onAuthStateChange fires a fresh `session`/`user` object
    // on every auth event — including the TOKEN_REFRESHED event Supabase's
    // client fires automatically when a tab regains focus/visibility (e.g.
    // switching windows or un-minimizing) — even when it's the same logged
    // in person. Depending on the whole object made React treat "same user,
    // refreshed token" as "user changed," tearing the effect down (which
    // calls onLeave(), kicking them out of the room) and rebuilding it from
    // scratch on every focus regain. This was the "kicked out when I
    // switch screens or minimize the window" bug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Plays whatever screen track (local or remote) is pending as soon as the
  // stage is actually in 'screen' mode and its <div> has mounted — avoids
  // the race where .play() gets called against a ref that hasn't rendered
  // yet because the state update it depends on is still in flight.
  useEffect(() => {
    if (stageMode !== 'screen' || !screenShareRef.current) return;
    const track = pendingScreenTrackRef.current;
    if (!track) return;
    if (Array.isArray(track)) track[0].play(screenShareRef.current);
    else track.play(screenShareRef.current);
  }, [stageMode]);

  // Keep our Presence payload in sync whenever our own hand/mic state changes.
  useEffect(() => {
    presenceTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handRaisedSelf, canSpeak, micOn]);

  const joinChannel = async (uid: string, channel: string) => {
    try {
      const response = await fetch('/api/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: channel, uid, role: isHost ? 'publisher' : 'subscriber' })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      await client.join(data.appId, channel, data.token, uid);

      const AgoraRTC = AgoraRef.current;
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        if (!isHost) {
          await audioTrack.setMuted(true); // students start muted
        }

        setLocalAudioTrack(audioTrack);
        await client.publish([audioTrack]);
      } catch (deviceErr) {
        console.warn("Could not access microphone (missing device or permission denied):", deviceErr);
      }

      setJoined(true);
    } catch (err) {
      console.error("Failed to join Classroom Table:", err);
    }
  };

  const leaveChannel = async () => {
    localAudioTrack?.close();
    if (Array.isArray(localScreenTrack)) {
      localScreenTrack[0].close();
      if (localScreenTrack[1]) localScreenTrack[1].close();
    } else if (localScreenTrack) {
      localScreenTrack.close();
    }

    await client?.leave();
    setJoined(false);
    onLeave();
  };

  const handleUserPublished = async (remoteUser: any, mediaType: 'audio' | 'video') => {
    await client.subscribe(remoteUser, mediaType);
    if (mediaType === 'audio') {
      remoteUser.audioTrack?.play();
    }
    // Nobody in this room ever publishes a camera track (seats are shown as
    // PixiJS avatars, not webcam tiles) — so the only "video" anyone can
    // ever publish is the host's screen share.
    if (mediaType === 'video' && remoteUser.videoTrack) {
      pendingScreenTrackRef.current = remoteUser.videoTrack;
      if (screenShareRef.current) {
        remoteUser.videoTrack.play(screenShareRef.current);
      }
    }
  };

  const handleUserUnpublished = (_remoteUser: any, _mediaType: 'audio' | 'video') => {
    // Seats are driven by Presence, not by Agora publish state, so there's
    // nothing to remove from a roster here.
  };

  const handleUserLeft = (_remoteUser: any) => {};

  const toggleMic = async () => {
    if (!canSpeak) return; // Cannot unmute if not allowed
    if (localAudioTrack) {
      await localAudioTrack.setMuted(micOn);
      setMicOn(!micOn);
    }
  };

  const setStageModeAndBroadcast = (mode: 'idle' | 'screen' | 'youtube') => {
    setStageMode(mode);
    channelRef.current?.send({ type: 'broadcast', event: 'stage_mode', payload: { mode } });
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
      setStageModeAndBroadcast('idle');
    } else {
      try {
        const AgoraRTC = AgoraRef.current;
        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");
        await client.publish(screenTrack);
        setLocalScreenTrack(screenTrack);
        pendingScreenTrackRef.current = screenTrack;
        setScreenSharing(true);
        setStageModeAndBroadcast('screen');
      } catch (err) {
        console.error("Failed to start screen share", err);
      }
    }
  };

  const toggleYoutubeMode = () => {
    if (!isHost) return;
    setStageModeAndBroadcast(stageMode === 'youtube' ? 'idle' : 'youtube');
  };

  // --- Realtime chat & signaling (Supabase Broadcast + Presence, same channel) ---
  const subscribeToSignaling = () => {
    const channel = supabase.channel(`classroom_${roomId}`, {
      config: { presence: { key: user?.id || Math.random().toString(36).slice(2) } },
    })
      .on('broadcast', { event: 'chat' }, ({ payload }: { payload: any }) => {
        setMessages(prev => [...prev, payload]);
      })
      .on('broadcast', { event: 'request_speak' }, ({ payload }: { payload: any }) => {
        if (isHost) {
          setSpeakRequests(prev => [...prev.filter(id => id !== payload.userId), payload.userId]);
        }
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
      .on('broadcast', { event: 'youtube' }, ({ payload }: { payload: any }) => {
        if (payload.action === 'set') setYoutubeVideoId(payload.videoId);
        youtubeNonceRef.current += 1;
        setYoutubeRemoteCommand({ ...payload, nonce: youtubeNonceRef.current });
      })
      .on('broadcast', { event: 'stage_mode' }, ({ payload }: { payload: any }) => {
        setStageMode(payload.mode);
      })
      .on('presence', { event: 'sync' }, () => {
        setPresenceState(channel.presenceState());
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          channel.track({
            userId: user?.id,
            name: isHost ? (profile?.full_name || 'Host') : (profile?.full_name || 'Student'),
            avatarUrl: profile?.avatar_url || null,
            isHost,
            handRaised: false,
            canSpeak: isHost,
            micOn,
          });
        }
      });

    channelRef.current = channel;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const msg = { text: newMessage, sender: profile?.full_name || 'Student', senderId: user.id, timestamp: new Date().toISOString() };
    await channelRef.current?.send({ type: 'broadcast', event: 'chat', payload: msg });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const requestToSpeak = async () => {
    setHandRaisedSelf(true);
    await channelRef.current?.send({
      type: 'broadcast',
      event: 'request_speak',
      payload: { userId: user?.id, name: profile?.full_name },
    });
  };

  const allowUserToSpeak = async (userId: string) => {
    await channelRef.current?.send({ type: 'broadcast', event: 'allow_speak', payload: { userId } });
    setSpeakRequests(prev => prev.filter(id => id !== userId));
  };

  const revokeUserToSpeak = async (userId: string) => {
    await channelRef.current?.send({ type: 'broadcast', event: 'revoke_speak', payload: { userId } });
  };

  const broadcastYoutube = (payload: any) => {
    channelRef.current?.send({ type: 'broadcast', event: 'youtube', payload });
  };

  // --- Build the seat roster for the PixiJS room from Presence state ---
  const seats: StageSeat[] = Object.values(presenceState)
    .map((entries: any) => entries[0])
    .filter(Boolean)
    .map((p: any): StageSeat => ({
      id: p.userId,
      name: p.name || 'Student',
      avatarUrl: p.avatarUrl,
      isHost: !!p.isHost,
      handRaised: !!p.handRaised,
      canSpeak: !!p.canSpeak,
      micOn: !!p.micOn,
      speakingLevel: volumeByUid[p.userId] || 0,
    }));

  const studentSeatCount = seats.filter(s => !s.isHost).length;

  if (roomFullError) {
    return (
      <div className="flex h-[60vh] w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-emerald-950/40 shadow-2xl items-center justify-center p-8">
        <div className="text-center space-y-3 max-w-sm">
          <Users className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="text-white font-bold">Table's full</h3>
          <p className="text-xs text-gray-400">{roomFullError}</p>
          <Button variant="outline" onClick={onLeave} className="rounded-xl mt-2">Back to Café</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-emerald-950/40 shadow-2xl">

      {/* Room & Stage Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 border-b border-emerald-950/40 bg-[#121212] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              {roomName}
            </h2>
            <p className="text-xs text-gray-400">
              Classroom Table • {isHost ? 'You are Host' : 'Student Mode'} • {studentSeatCount}/{MAX_STUDENTS} students seated
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={leaveChannel} className="rounded-xl">
            <PhoneOff className="w-4 h-4 mr-2" /> Leave Table
          </Button>
        </div>

        <div className="flex-1 bg-black relative flex flex-col p-4 gap-4 overflow-hidden">
          {!joined && <p className="text-gray-500 animate-pulse text-center">Joining classroom...</p>}

          {stageMode !== 'idle' && (
            <div className="relative rounded-xl overflow-hidden border border-emerald-500/30" style={{ flex: '0 0 62%' }}>
              {stageMode === 'screen' && (
                <div ref={screenShareRef} className="w-full h-full bg-black" />
              )}
              {stageMode === 'youtube' && (
                <YouTubeStage
                  isHost={isHost}
                  videoId={youtubeVideoId}
                  remoteCommand={youtubeRemoteCommand}
                  onHostSetVideo={(videoId) => { setYoutubeVideoId(videoId); broadcastYoutube({ action: 'set', videoId }); }}
                  onHostPlay={(time) => broadcastYoutube({ action: 'play', time })}
                  onHostPause={(time) => broadcastYoutube({ action: 'pause', time })}
                  onHostSeek={(time) => broadcastYoutube({ action: 'seek', time })}
                />
              )}
            </div>
          )}

          {/* PixiJS seat/avatar layer — full-size when nothing is on the main stage, a compact strip underneath when there is */}
          <div className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-b from-[#0d1e18]/40 to-transparent border border-emerald-950/20">
            <RoomStage seats={seats} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-[#121212] border-t border-emerald-950/40 flex justify-center gap-4">
          <Button
            variant={micOn ? "default" : "secondary"}
            className={`rounded-full w-12 h-12 p-0 ${!canSpeak ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleMic}
            disabled={!canSpeak}
            title={!canSpeak ? "Host muted you" : ""}
          >
            {micOn ? <Mic /> : <MicOff className="text-red-500" />}
          </Button>

          {isHost && (
            <Button
              variant={screenSharing ? "default" : "secondary"}
              className={`rounded-full w-12 h-12 p-0 ${screenSharing ? 'bg-emerald-600' : ''}`}
              onClick={toggleScreenShare}
              title="Share your screen"
            >
              <MonitorUp />
            </Button>
          )}

          {isHost && (
            <Button
              variant={stageMode === 'youtube' ? "default" : "secondary"}
              className={`rounded-full w-12 h-12 p-0 ${stageMode === 'youtube' ? 'bg-emerald-600' : ''}`}
              onClick={toggleYoutubeMode}
              title="Play a YouTube video for everyone"
            >
              <Youtube />
            </Button>
          )}

          {isHost && stageMode !== 'idle' && (
            <Button
              variant="secondary"
              className="rounded-full w-12 h-12 p-0"
              onClick={() => setStageModeAndBroadcast('idle')}
              title="Back to room view (for everyone)"
            >
              <LayoutGrid />
            </Button>
          )}

          {!isHost && !canSpeak && (
            <Button variant="outline" className="rounded-full px-6" onClick={requestToSpeak} disabled={handRaisedSelf}>
              <Hand className="w-4 h-4 mr-2 text-yellow-500" /> {handRaisedSelf ? 'Hand Raised...' : 'Request to Speak'}
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar: Chat & Participants */}
      <div className="w-80 border-l border-emerald-950/40 bg-[#0f0f0f] flex flex-col">
        <div className="p-4 border-b border-emerald-950/40 bg-[#121212]">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Classroom Chat</h3>
        </div>

        {/* Speak Requests (Host only) */}
        {isHost && speakRequests.length > 0 && (
          <div className="p-3 bg-emerald-900/20 border-b border-emerald-900/40">
            <p className="text-xs font-bold text-emerald-400 mb-2">Speak Requests</p>
            {speakRequests.map(uid => {
              const seat = seats.find(s => s.id === uid);
              return (
                <div key={uid} className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-300">{seat?.name || `Student ${uid.substring(0, 4)}`}</span>
                  <div className="flex gap-2">
                    <button onClick={() => allowUserToSpeak(uid)} className="text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Currently-speaking students (Host can revoke) */}
        {isHost && seats.some(s => !s.isHost && s.canSpeak) && (
          <div className="p-3 bg-[#121212] border-b border-emerald-950/30">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Mic unlocked</p>
            {seats.filter(s => !s.isHost && s.canSpeak).map(s => (
              <div key={s.id} className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-300">{s.name}</span>
                <button onClick={() => revokeUserToSpeak(s.id)} className="text-red-400 hover:text-red-300">Mute</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 mb-1">{m.sender}</span>
              <div className={`px-3 py-2 rounded-xl text-sm ${m.senderId === user?.id ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none'
                }`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 border-t border-emerald-950/40 bg-[#121212]">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Ask a question..."
              className="bg-[#1a1a1a] border-emerald-950/50 text-sm h-10"
            />
            <Button type="submit" size="sm" className="h-10 px-3 bg-emerald-600 hover:bg-emerald-500">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

    </div>
  );
}
