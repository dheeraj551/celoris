"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, MonitorUp, Users, CheckCircle, Hand } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

let client: IAgoraRTCClient;

interface ClassroomTableProps {
  roomId: string;
  roomName: string;
  isHost: boolean;
  onLeave: () => void;
}

export default function ClassroomTable({ roomId, roomName, isHost, onLeave }: ClassroomTableProps) {
  const { profile, user } = useAuth();
  
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localScreenTrack, setLocalScreenTrack] = useState<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null>(null);
  
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [micOn, setMicOn] = useState(isHost); // Host starts with mic on, students muted
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  
  // Realtime signaling state (Supabase)
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [speakRequests, setSpeakRequests] = useState<string[]>([]);
  const [canSpeak, setCanSpeak] = useState(isHost);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const screenShareRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  // Holds the dynamically-loaded AgoraRTC module (browser only)
  const AgoraRef = useRef<any>(null);

  // 1. Initialize Agora and join channel
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      // Lazy-load Agora SDK so it never runs on the server
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRef.current = AgoraRTC;
      client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-left', handleUserLeft);

      await joinChannel(user.id, `classroom_${roomId}`);
      subscribeToSignaling();
    };
    
    init();

    return () => {
      leaveChannel();
      if (client) {
        client.off('user-published', handleUserPublished);
        client.off('user-unpublished', handleUserUnpublished);
        client.off('user-left', handleUserLeft);
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    if (localVideoTrack && localVideoRef.current && !screenSharing) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack, screenSharing]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      
      if (!isHost) {
        await audioTrack.setMuted(true); // students start muted
      }
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      await client.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Failed to join Classroom Table:", err);
    }
  };

  const leaveChannel = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    if (Array.isArray(localScreenTrack)) {
      localScreenTrack[0].close();
      if(localScreenTrack[1]) localScreenTrack[1].close();
    } else if (localScreenTrack) {
      localScreenTrack.close();
    }
    
    await client?.leave();
    setJoined(false);
    onLeave();
  };

  const handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
    }
    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  };

  const handleUserUnpublished = (user: any, mediaType: 'audio' | 'video') => {
    if (mediaType === 'video') {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    }
  };

  const handleUserLeft = (user: any) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const toggleMic = async () => {
    if (!canSpeak) return; // Cannot unmute if not allowed
    if (localAudioTrack) {
      await localAudioTrack.setMuted(micOn);
      setMicOn(!micOn);
    }
  };

  const toggleCamera = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setMuted(cameraOn);
      setCameraOn(!cameraOn);
    }
  };

  const toggleScreenShare = async () => {
    if (!isHost) return;
    
    if (screenSharing) {
      // Stop screen sharing
      if (Array.isArray(localScreenTrack)) {
        await client.unpublish(localScreenTrack);
        localScreenTrack[0].close();
        if(localScreenTrack[1]) localScreenTrack[1].close();
      } else if (localScreenTrack) {
        await client.unpublish(localScreenTrack);
        localScreenTrack.close();
      }
      setLocalScreenTrack(null);
      
      if (localVideoTrack) await client.publish(localVideoTrack);
      setScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const AgoraRTC = AgoraRef.current;
        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");
        if (localVideoTrack) await client.unpublish(localVideoTrack);
        
        await client.publish(screenTrack);
        setLocalScreenTrack(screenTrack);
        setScreenSharing(true);
        
        // play locally
        if (Array.isArray(screenTrack)) {
           screenTrack[0].play(screenShareRef.current!);
        } else {
           screenTrack.play(screenShareRef.current!);
        }

      } catch (err) {
        console.error("Failed to start screen share", err);
      }
    }
  };

  // --- Realtime chat & signaling ---
  const subscribeToSignaling = () => {
    const channel = supabase.channel(`classroom_${roomId}`)
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
          // auto-unmute when allowed
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
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const msg = { text: newMessage, sender: profile?.full_name || 'Student', senderId: user.id, timestamp: new Date().toISOString() };
    await supabase.channel(`classroom_${roomId}`).send({
      type: 'broadcast',
      event: 'chat',
      payload: msg
    });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const requestToSpeak = async () => {
    await supabase.channel(`classroom_${roomId}`).send({
      type: 'broadcast',
      event: 'request_speak',
      payload: { userId: user?.id, name: profile?.full_name }
    });
  };

  const allowUserToSpeak = async (userId: string) => {
    await supabase.channel(`classroom_${roomId}`).send({
      type: 'broadcast',
      event: 'allow_speak',
      payload: { userId }
    });
    setSpeakRequests(prev => prev.filter(id => id !== userId));
  };
  
  const revokeUserToSpeak = async (userId: string) => {
    await supabase.channel(`classroom_${roomId}`).send({
      type: 'broadcast',
      event: 'revoke_speak',
      payload: { userId }
    });
  };

  return (
    <div className="flex h-[80vh] w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-emerald-950/40 shadow-2xl">
      
      {/* Video & Screen Share Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 border-b border-emerald-950/40 bg-[#121212] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              {roomName}
            </h2>
            <p className="text-xs text-gray-400">Classroom Table • {isHost ? 'You are Host' : 'Student Mode'}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={leaveChannel} className="rounded-xl">
            <PhoneOff className="w-4 h-4 mr-2" /> Leave Table
          </Button>
        </div>

        <div className="flex-1 bg-black relative flex items-center justify-center p-4">
          {!joined && <p className="text-gray-500 animate-pulse">Joining classroom...</p>}
          
          {screenSharing ? (
             <div ref={screenShareRef} className="w-full h-full rounded-xl overflow-hidden border border-emerald-500/30"></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full auto-rows-fr">
              {/* Local Video */}
              <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-emerald-950/50">
                <div ref={localVideoRef} className="w-full h-full"></div>
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur flex items-center gap-2">
                   {profile?.full_name} (You)
                   {!micOn && <MicOff className="w-3 h-3 text-red-500" />}
                </div>
              </div>

              {/* Remote Videos */}
              {remoteUsers.map(u => (
                <div key={u.uid} className="relative rounded-xl overflow-hidden bg-gray-900 border border-emerald-950/50"
                  ref={(node) => { if (node && u.videoTrack) u.videoTrack.play(node) }}
                >
                  <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur flex items-center gap-2">
                    Student {u.uid.substring(0,4)}
                    {/* Host Controls for each student */}
                    {isHost && (
                      <button onClick={() => allowUserToSpeak(u.uid)} className="ml-2 text-emerald-400 hover:text-emerald-300">
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
          
          <Button
            variant={cameraOn ? "default" : "secondary"}
            className="rounded-full w-12 h-12 p-0"
            onClick={toggleCamera}
          >
            {cameraOn ? <Video /> : <VideoOff className="text-red-500" />}
          </Button>
          
          {isHost && (
            <Button
              variant={screenSharing ? "default" : "secondary"}
              className={`rounded-full w-12 h-12 p-0 ${screenSharing ? 'bg-emerald-600' : ''}`}
              onClick={toggleScreenShare}
            >
              <MonitorUp />
            </Button>
          )}

          {!isHost && !canSpeak && (
            <Button variant="outline" className="rounded-full px-6" onClick={requestToSpeak}>
              <Hand className="w-4 h-4 mr-2 text-yellow-500" /> Request to Speak
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
             {speakRequests.map(uid => (
               <div key={uid} className="flex justify-between items-center text-xs mb-1">
                 <span className="text-gray-300">User {uid.substring(0,4)}</span>
                 <div className="flex gap-2">
                   <button onClick={() => allowUserToSpeak(uid)} className="text-emerald-400">Allow</button>
                 </div>
               </div>
             ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 mb-1">{m.sender}</span>
              <div className={`px-3 py-2 rounded-xl text-sm ${
                m.senderId === user?.id ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none'
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
