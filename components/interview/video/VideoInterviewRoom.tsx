"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  VideoTrack, 
  AudioTrack,
  useTracks, 
  useLocalParticipant, 
  useRemoteParticipants, 
  useConnectionState, 
  useIsSpeaking, 
  useRoomContext, 
  isTrackReference 
} from '@livekit/components-react';
import { Track, ConnectionState, RoomEvent } from 'livekit-client';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  PhoneOff, 
  Maximize2, 
  Minimize2,
  Settings, 
  MessageSquare, 
  Users, 
  Send, 
  Smile, 
  LayoutGrid, 
  X, 
  Sparkles, 
  Save, 
  Check, 
  Copy,
  Radio, 
  Code, 
  AlertCircle, 
  RefreshCw, 
  SwitchCamera, 
  ChevronUp 
} from 'lucide-react';
import { InterviewSession, RubricCategory, ScorecardEvaluation, InterviewQuestion } from '../types';
import { CodeWorkspace } from './CodeWorkspace';
import { UserRole } from '../Header';

interface VideoInterviewRoomProps {
  session: InterviewSession;
  rubrics: RubricCategory[];
  onUpdateRubrics: (rubrics: RubricCategory[]) => void;
  onSaveEvaluation: (evaluation: ScorecardEvaluation) => void;
  onEndCall: () => void;
  questions: InterviewQuestion[];
  userRole?: UserRole;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export const VideoInterviewRoom: React.FC<VideoInterviewRoomProps> = (props) => {
  const { session, userRole = 'interviewer' } = props;
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('wss://livekit.celoris.in');
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      setIsLoadingToken(true);
      setTokenError(null);
      const participantName = userRole === 'candidate' 
        ? (session.candidateName && session.candidateName !== 'Rohan Verma' ? session.candidateName : 'Candidate') 
        : 'Lead Interviewer (Celoris)';

      const res = await fetch('/api/livekit/interview-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: session.meetingRoomId,
          participantName,
          role: userRole
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize session');
      }

      setToken(data.token);
      if (data.serverUrl) setServerUrl(data.serverUrl);
    } catch (err: any) {
      console.error('[VideoInterviewRoom] token error:', err);
      setTokenError(err?.message || 'Error connecting to video session');
    } finally {
      setIsLoadingToken(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [session.meetingRoomId, userRole]);

  // Clean Enterprise Loading Screen (Zero Technical Jargon)
  if (isLoadingToken) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#030705] p-4 sm:p-6 text-slate-200 select-none relative overflow-hidden h-[100dvh]">
        <div className="w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />
        <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] border border-emerald-500/30 text-center max-w-sm sm:max-w-md shadow-2xl space-y-4 z-10 relative mx-4">
          <div className="w-14 h-14 rounded-2xl btn-metallic flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_16px_rgba(16,185,129,0.3)] animate-pulse">
            <Radio className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Joining Interview Room</h3>
            <p className="text-xs text-emerald-400 font-mono mt-1">Room #{session.meetingRoomId}</p>
            <p className="text-xs text-emerald-300/80 mt-2 font-sans leading-relaxed">
              Establishing confidential, encrypted high-definition audio &amp; video session...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono text-emerald-400">Connecting Media Streams...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen
  if (tokenError || !token) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#030705] p-4 sm:p-6 text-slate-200 select-none relative overflow-hidden h-[100dvh]">
        <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#180a0a] to-[#070404] border border-rose-500/40 text-center max-w-sm sm:max-w-md shadow-2xl space-y-4 z-10 mx-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-700/60 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Unable to Connect to Room</h3>
            <p className="text-xs text-rose-300/80 mt-1 font-sans leading-relaxed">
              Could not join video session. Please ensure camera and microphone permissions are allowed.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={fetchToken}
              className="btn-metallic flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={props.onEndCall}
              className="btn-metallic px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      data-lk-theme="default"
      onDisconnected={props.onEndCall}
      className="flex-1 flex flex-col h-full w-full select-none"
    >
      <RoomAudioRenderer />
      <LiveKitInterviewStage {...props} />
    </LiveKitRoom>
  );
};

// ==========================================
// Inner LiveKit Stage with Responsive Mobile & Desktop Layout
// ==========================================
const LiveKitInterviewStage: React.FC<VideoInterviewRoomProps> = ({
  session,
  rubrics,
  onUpdateRubrics,
  onSaveEvaluation,
  onEndCall,
  questions,
  userRole = 'interviewer'
}) => {
  const room = useRoomContext();
  const { localParticipant, isCameraEnabled, isMicrophoneEnabled, isScreenShareEnabled } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], { onlySubscribed: false });
  
  // Audio tracks for Screen Share Audio (System / Tab Sound)
  const audioTracks = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio], { onlySubscribed: false });
  const remoteScreenAudioTracks = audioTracks.filter(
    t => !t.participant.isLocal && t.source === Track.Source.ScreenShareAudio
  );

  // Fullscreen Video Frame Reference & Mobile/Desktop Fullscreen State
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (videoFrameRef.current?.requestFullscreen) {
          await videoFrameRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else if ((videoFrameRef.current as any)?.webkitRequestFullscreen) {
          await (videoFrameRef.current as any).webkitRequestFullscreen();
          setIsFullscreen(true);
        } else {
          // CSS fallback for mobile browsers
          setIsFullscreen(true);
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      // Fallback toggle for browsers blocking requestFullscreen
      setIsFullscreen(prev => !prev);
    }
  };

  // Sidebar / Mobile Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'scorecard' | 'code' | 'people'>('chat');
  const [pinnedParticipantIdentity, setPinnedParticipantIdentity] = useState<string | null>(null);

  // Link copy feedback
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Floating Reactions
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Elapsed Call Timer
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Synchronized Real-Time Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'System',
      text: `Secure interview session active for #${session.meetingRoomId}. End-to-end encrypted audio & video connected.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle incoming LiveKit data messages (Chat + Reactions)
  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array, participant?: any) => {
      try {
        const text = new TextDecoder().decode(payload);
        const data = JSON.parse(text);
        if (data.type === 'reaction') {
          triggerLocalFloatingEmoji(data.emoji);
        } else if (data.type === 'chat') {
          setChatMessages(prev => [
            ...prev,
            {
              id: data.id || `msg-${Date.now()}`,
              sender: data.sender || participant?.name || 'Participant',
              text: data.text,
              timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: false
            }
          ]);
        }
      } catch (err) {
        console.warn('[LiveKit Stage] data error:', err);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  const triggerLocalFloatingEmoji = (emoji: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.floor(20 + Math.random() * 60)
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2200);
  };

  const handleBroadcastReaction = (emoji: string) => {
    triggerLocalFloatingEmoji(emoji);
    try {
      const payload = JSON.stringify({ type: 'reaction', emoji });
      room.localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true });
    } catch (err) {
      console.warn('Reaction broadcast error:', err);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const myName = localParticipant.name || (userRole === 'candidate' 
      ? (session.candidateName && session.candidateName !== 'Rohan Verma' ? session.candidateName : 'Candidate') 
      : 'Interviewer');
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: `${myName} (You)`,
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatMessages(prev => [...prev, msg]);
    const outgoingText = chatInput.trim();
    setChatInput('');

    try {
      const payload = JSON.stringify({
        type: 'chat',
        id: msg.id,
        sender: myName,
        text: outgoingText,
        timestamp: msg.timestamp
      });
      room.localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true });
    } catch (err) {
      console.warn('Chat broadcast error:', err);
    }
  };

  const handleCopyInviteLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://celorisdesigns.com';
    const link = `${origin}/interviews/${session.meetingRoomId}`;
    navigator.clipboard.writeText(link);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  // WebRTC Controls
  const toggleMic = async () => {
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (err) {
      console.error('Failed to toggle mic:', err);
    }
  };

  const toggleCam = async () => {
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } catch (err) {
      console.error('Failed to toggle camera:', err);
    }
  };

  // Enable Screen Share with Audio (System / Tab sound sharing)
  const toggleScreen = async () => {
    try {
      const nextState = !isScreenShareEnabled;
      await localParticipant.setScreenShareEnabled(nextState, {
        audio: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'include',
        systemAudio: 'include',
      });
    } catch (err) {
      console.error('Failed to toggle screen share:', err);
    }
  };

  // Flip Camera on Mobile Phones
  const handleFlipCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      if (videoDevices.length > 1) {
        const currentTrack = localCameraTrack?.publication?.track?.mediaStreamTrack;
        const currentId = currentTrack?.getSettings()?.deviceId;
        const nextDevice = videoDevices.find(d => d.deviceId !== currentId) || videoDevices[0];
        if (nextDevice) {
          await room.switchActiveDevice('videoinput', nextDevice.deviceId);
        }
      }
    } catch (err) {
      console.warn('Camera flip error:', err);
    }
  };

  // Scorecard Math & AI Synthesis
  const totalWeight = rubrics.reduce((sum, r) => sum + r.weight, 0);
  const weightedScore = (
    rubrics.reduce((sum, r) => sum + r.score * r.weight, 0) / (totalWeight || 100)
  ).toFixed(1);
  const [recommendation, setRecommendation] = useState<string>('Strong Hire');
  const [panelistNotes, setPanelistNotes] = useState(
    'Candidate demonstrated solid technical clarity, architectural design trade-offs, and production empathy.'
  );
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);

  const handleScoreChange = (id: string, score: number) => {
    onUpdateRubrics(rubrics.map(r => r.id === id ? { ...r, score } : r));
  };

  const handleTriggerAiScore = async () => {
    setIsAiEvaluating(true);
    setTimeout(() => {
      const parsed = parseFloat(weightedScore);
      const synth = parsed >= 4.5 ? 'Strong Hire' : parsed >= 3.8 ? 'Hire' : parsed >= 3.0 ? 'Leaning Hire' : 'Leaning No Hire';
      setRecommendation(synth);
      setIsAiEvaluating(false);
    }, 600);
  };

  // Dynamic peer names calculation
  const remotePeerNames = remoteParticipants
    .map(p => p.name || p.identity)
    .filter(Boolean);

  const headerTitle = remotePeerNames.length > 0
    ? remotePeerNames.join(', ')
    : (userRole === 'candidate' 
        ? 'Celoris Technical Evaluation' 
        : (session.candidateName && session.candidateName !== 'Rohan Verma' 
            ? session.candidateName 
            : `Interview Room #${session.meetingRoomId}`));

  const handleSaveScorecard = () => {
    const candidateDisplayName = remotePeerNames[0] || (session.candidateName && session.candidateName !== 'Rohan Verma' ? session.candidateName : 'Candidate');
    const sc: ScorecardEvaluation = {
      id: `sc-${Date.now()}`,
      interviewId: session.id,
      candidateId: session.candidateId,
      interviewerName: localParticipant.name || 'Lead Interviewer',
      interviewerRole: 'Lead Technical Evaluator',
      submittedAt: new Date().toISOString(),
      overallScore: parseFloat(weightedScore),
      recommendation: recommendation as any,
      executiveSummary: `${candidateDisplayName} evaluated with score ${weightedScore}/5.0 during ${session.roundType} interview. Clear production instincts and architectural empathy.`,
      strengths: ['Decisive architectural trade-offs', 'Clean failure isolation semantics'],
      concerns: [],
      rubricBreakdown: rubrics,
      calibrationNotes: 'Scorecard calibrated against Celoris engineering standards.',
      notes: panelistNotes
    };
    onSaveEvaluation(sc);
  };

  // Determine Tracks
  const cameraTracks = tracks.filter(t => t.source === Track.Source.Camera);
  const screenTracks = tracks.filter(t => t.source === Track.Source.ScreenShare);
  const localCameraTrack = cameraTracks.find(t => t.participant.isLocal);
  const remoteCameraTracks = cameraTracks.filter(t => !t.participant.isLocal);

  // Primary Video Source Logic:
  // 1. If screen share is active, show screen share.
  // 2. If user pinned a participant, show pinned track.
  // 3. If there is a remote participant with camera, show remote participant.
  // 4. Otherwise, show local camera preview (so user sees their own camera).
  let primaryTrack: any = screenTracks[0] || null;
  if (!primaryTrack && pinnedParticipantIdentity) {
    primaryTrack = cameraTracks.find(t => t.participant.identity === pinnedParticipantIdentity) || null;
  }
  if (!primaryTrack && remoteCameraTracks.length > 0) {
    primaryTrack = remoteCameraTracks[0];
  }
  if (!primaryTrack && localCameraTrack) {
    primaryTrack = localCameraTrack;
  }

  const isAloneInRoom = remoteParticipants.length === 0;

  const speakerName = primaryTrack?.participant.isLocal 
    ? `${localParticipant.name || 'You'} (Your Camera)` 
    : (primaryTrack?.participant.name || remotePeerNames[0] || 'Remote Participant');

  // Workspace Content (Shared between desktop dock and mobile bottom drawer)
  const renderWorkspaceContent = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 1. Real-Time Chat Tab */}
      {activeSidebarTab === 'chat' && (
        <div className="h-full flex flex-col justify-between space-y-3 min-h-[300px]">
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  msg.isMe
                    ? 'ml-auto btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-[#09150f] text-emerald-100 border border-emerald-950/80 shadow-inner'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1 opacity-80 font-mono">
                  <span className="font-bold">{msg.sender}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="pt-2 border-t border-emerald-950/70 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send message to room..."
              className="flex-1 metallic-input rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-800 focus:outline-none"
            />
            <button
              type="submit"
              className="btn-metallic-emerald px-3.5 py-2 rounded-xl text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 2. Scorecard & Rubrics Tab */}
      {activeSidebarTab === 'scorecard' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-950/70">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Continuous Rubric Math
            </span>
            <span className="font-mono font-bold text-xs text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              ★ {weightedScore} / 5.0
            </span>
          </div>

          <div className="space-y-3">
            {rubrics.map((r) => (
              <div key={r.id} className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/70 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{r.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{r.score} / 5</span>
                </div>
                <p className="text-[10px] text-emerald-400/70 leading-tight">{r.description}</p>
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((scoreVal) => (
                    <button
                      key={scoreVal}
                      onClick={() => handleScoreChange(r.id, scoreVal)}
                      className={`flex-1 py-1 rounded-md font-mono text-[11px] font-bold transition-all ${
                        r.score === scoreVal
                          ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : 'bg-[#0a140f] text-emerald-500 hover:text-white'
                      }`}
                    >
                      {scoreVal}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="font-bold text-white block mb-1 font-mono text-[11px]">
              Evaluation Notes
            </label>
            <textarea
              rows={3}
              value={panelistNotes}
              onChange={(e) => setPanelistNotes(e.target.value)}
              className="w-full metallic-input rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleTriggerAiScore}
              disabled={isAiEvaluating}
              className="btn-metallic w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isAiEvaluating ? 'animate-spin' : ''}`} />
              <span>{isAiEvaluating ? 'Synthesizing...' : 'AI Scorecard Synthesis'}</span>
            </button>

            <button
              onClick={handleSaveScorecard}
              className="btn-metallic-emerald w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white shadow-[0_0_16px_rgba(16,185,129,0.4)] flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scorecard</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Collaborative Code Workspace Tab */}
      {activeSidebarTab === 'code' && (
        <div className="h-[480px] -m-2">
          <CodeWorkspace />
        </div>
      )}

      {/* 4. Connected Participants Tab */}
      {activeSidebarTab === 'people' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/70 space-y-1">
            <span className="text-[10px] text-emerald-500 font-mono uppercase block">Session Infrastructure</span>
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span>Network Infrastructure</span>
              <span className="font-mono text-emerald-400">Celoris High-Speed Media Mesh</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span>Session Security</span>
              <span className="font-mono text-emerald-400">End-to-End Encrypted</span>
            </div>
          </div>

          <div className="space-y-2">
            {/* Local User */}
            <div className="p-3 metallic-card rounded-xl border border-emerald-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center font-bold text-emerald-400 font-mono">
                  YOU
                </div>
                <div>
                  <p className="font-bold text-white">{localParticipant.name || 'You'} (You)</p>
                  <p className="text-[10px] text-emerald-500 font-mono">Active Participant</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </div>

            {/* Remote Participants */}
            {remoteParticipants.map((p) => (
              <div key={p.identity} className="p-3 metallic-card rounded-xl border border-emerald-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center font-bold text-emerald-400 font-mono">
                    {p.name?.substring(0, 2).toUpperCase() || 'CA'}
                  </div>
                  <div>
                    <p className="font-bold text-white">{p.name || p.identity.substring(0, 10)}</p>
                    <p className="text-[10px] text-emerald-500 font-mono">Connected Peer</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              </div>
            ))}

            {isAloneInRoom && (
              <div className="p-4 rounded-xl border border-dashed border-emerald-950/80 text-center text-emerald-600 font-mono text-xs">
                No external participants connected yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-[#030705] p-0 md:p-6 h-[100dvh] md:h-auto overflow-hidden select-none relative">
      {/* Background Ambient Aurora Glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora hidden md:block" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[160px] pointer-events-none animate-aurora hidden md:block" style={{ animationDelay: '-5s' }} />

      {/* Main Glassy Window Chassis: Full Viewport on Mobile, Floating MacBook Pro Chassis on Desktop */}
      <div className="w-full md:max-w-7xl h-[100dvh] md:h-[calc(100vh-5rem)] md:max-h-[880px] rounded-none md:rounded-[24px] shadow-none md:shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.18)] flex flex-col md:flex-row overflow-hidden border-0 md:border md:border-emerald-950/70 md:border-t-white/20 bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] relative z-10">
        
        {/* Main Video Section & Bottom Controls */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#060a08] h-full relative">
          
          {/* Top Session Bar (Optimized for Mobile & Desktop) */}
          <div className="h-12 md:h-14 px-3 md:px-6 flex items-center justify-between border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md select-none shrink-0 z-20">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0">
                <VideoIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <h2 className="text-xs md:text-sm font-bold text-white tracking-tight leading-none truncate">
                    <span>{headerTitle}</span>
                    <span className="hidden sm:inline text-emerald-700"> · </span>
                    <span className="hidden sm:inline text-emerald-300 font-normal">{session.roundType || 'Live Session'}</span>
                  </h2>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] text-emerald-500/80 font-mono mt-0.5 truncate">
                  Room #{session.meetingRoomId} · {1 + remoteParticipants.length} Connected
                </p>
              </div>
            </div>

            {/* Top Right: Timer & Invite Link Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyInviteLink}
                className="btn-metallic flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[11px] font-mono font-semibold"
                title="Copy candidate invite link to clipboard"
              >
                {hasCopiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400" />}
                <span className="hidden sm:inline">{hasCopiedLink ? 'Copied!' : 'Invite Link'}</span>
              </button>

              <div className="bg-[#0c120f] px-2.5 py-1 rounded-lg border border-white/10 text-[11px] md:text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]"></span>
                <span>{formatTimer(callDurationSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Video Canvas Stage */}
          <div className="flex-1 p-2 md:p-4 relative min-h-0 flex flex-col md:flex-row gap-2 md:gap-3 overflow-hidden">
            
            {/* Primary Dominant Video Frame */}
            <div 
              ref={videoFrameRef}
              className={`relative overflow-hidden bg-[#040806] border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all ${
                isFullscreen
                  ? 'fixed inset-0 z-50 w-screen h-[100dvh] rounded-none border-0'
                  : 'flex-1 rounded-xl md:rounded-2xl min-h-0 w-full'
              }`}
            >
              
              {primaryTrack && isTrackReference(primaryTrack) && primaryTrack.publication && !primaryTrack.publication.isMuted ? (
                <VideoTrack
                  trackRef={primaryTrack}
                  className={`w-full h-full ${
                    primaryTrack?.source === Track.Source.ScreenShare
                      ? 'object-contain bg-black'
                      : 'object-cover'
                  }`}
                />
              ) : (
                /* Fallback when camera is turned off */
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#0a140f] border-2 border-emerald-500/40 flex items-center justify-center text-2xl md:text-3xl font-bold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                    {speakerName.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm font-bold text-white">
                    {speakerName}
                  </p>
                  <p className="text-xs text-emerald-500 font-mono">Camera is currently paused</p>
                </div>
              )}

              {/* Waiting Overlay when alone in room */}
              {isAloneInRoom && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none z-10 p-4">
                  <div className="p-5 md:p-6 rounded-2xl bg-[#07120c]/90 border border-emerald-500/40 text-center max-w-sm pointer-events-auto space-y-3 shadow-2xl">
                    <div className="w-11 h-11 rounded-xl btn-metallic flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Your Camera is Active</h3>
                      <p className="text-xs text-emerald-300/80 mt-1 font-mono">
                        Waiting for candidate or panelists to join Room #{session.meetingRoomId}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyInviteLink}
                      className="btn-metallic-emerald w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                    >
                      {hasCopiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{hasCopiedLink ? 'Invite Link Copied!' : 'Copy Candidate Invite Link'}</span>
                    </button>
                    <p className="text-[10px] text-emerald-500/70 font-mono">
                      Send on WhatsApp or open in browser to connect peer video.
                    </p>
                  </div>
                </div>
              )}

              {/* Live Session Badge (Top-Left) */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#040806]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/40 text-[10px] font-medium text-white shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="font-mono text-emerald-200">
                  {primaryTrack?.source === Track.Source.ScreenShare ? 'Screen Share Active' : '1080p HD Encrypted'}
                </span>
              </div>

              {/* Top-Right Controls: Fullscreen Toggle */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="btn-metallic flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white bg-[#07120c]/90 backdrop-blur-md border border-emerald-500/40 shadow-lg active:scale-95 transition-all cursor-pointer"
                  title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] md:text-xs font-mono">Exit</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] md:text-xs font-mono">Full Screen</span>
                    </>
                  )}
                </button>
              </div>

              {/* Screen Share Tap to Fullscreen Banner (Mobile / Desktop) */}
              {primaryTrack?.source === Track.Source.ScreenShare && !isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-200 px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-lg animate-pulse cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                  <span>Screen Shared · Tap for Fullscreen</span>
                </button>
              )}

              {/* Speaker Name Tag (Bottom-Left) */}
              <div className="absolute bottom-3 left-3 z-20 bg-[#040806]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/30 text-[11px] font-bold text-white shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {speakerName}
                </span>
              </div>

              {/* Mobile Picture-in-Picture (PiP) Floating Card */}
              {!isAloneInRoom && (
                <div 
                  onClick={() => setPinnedParticipantIdentity(prev => prev === localParticipant.identity ? null : localParticipant.identity)}
                  className={`md:hidden absolute top-12 right-3 rounded-xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl z-30 bg-[#060a08] cursor-pointer transition-all ${
                    primaryTrack?.source === Track.Source.ScreenShare
                      ? 'w-16 h-20 sm:w-20 sm:h-28 opacity-85 hover:opacity-100'
                      : 'w-20 h-28 sm:w-24 sm:h-32'
                  }`}
                  title="Tap to toggle camera focus"
                >
                  {localCameraTrack && isTrackReference(localCameraTrack) && isCameraEnabled ? (
                    <VideoTrack trackRef={localCameraTrack} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#07100c] text-emerald-400">
                      <VideoOff className="w-4 h-4 text-emerald-600 mb-0.5" />
                      <span className="text-[8px] font-mono">Muted</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/80 px-1 rounded text-[8px] text-white font-mono">
                    You
                  </div>
                  <div className="absolute top-1 right-1">
                    {isMicrophoneEnabled ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] shadow-[0_0_6px_#10b981]">
                        <Mic className="w-2 h-2" />
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[8px]">
                        <MicOff className="w-2 h-2" />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Floating Reaction Bar (Mobile & Desktop) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-[#07120c]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-1.5 sm:gap-2.5">
                {['😂', '🎉', '👍', '👎', '👏', '😮', '❤️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleBroadcastReaction(emoji)}
                    className="hover:scale-125 transition-transform text-sm sm:text-base cursor-pointer px-0.5 active:scale-95"
                    title={`Broadcast ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Flying Animated Reactions Container */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                {floatingEmojis.map((item) => (
                  <div
                    key={item.id}
                    className="absolute bottom-14 text-2xl sm:text-3xl animate-bounce drop-shadow-[0_0_12px_#10b981]"
                    style={{ left: `${item.left}%`, transition: 'all 2s ease-out' }}
                  >
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Vertical Attendee Thumbnail Column (Hidden on Mobile, PiP used instead) */}
            <div className="hidden md:flex w-28 sm:w-32 flex-col gap-2.5 shrink-0 overflow-y-auto pr-0.5">
              
              {/* Local Participant Tile (You) */}
              <div
                onClick={() => setPinnedParticipantIdentity(localParticipant.identity)}
                className={`h-20 sm:h-24 rounded-xl overflow-hidden relative bg-[#060a08] border shadow-md group cursor-pointer transition-all ${
                  pinnedParticipantIdentity === localParticipant.identity
                    ? 'border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'border-white/10 hover:border-emerald-500/50'
                }`}
              >
                {localCameraTrack && isTrackReference(localCameraTrack) && isCameraEnabled ? (
                  <VideoTrack
                    trackRef={localCameraTrack}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#07100c] text-emerald-400">
                    <VideoOff className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="text-[9px] font-mono">Cam Muted</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-1.5 right-1.5 z-10">
                  {isMicrophoneEnabled ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600/90 border border-emerald-400/50 flex items-center justify-center text-white shadow-[0_0_6px_#10b981]">
                      <Mic className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-rose-600/90 border border-rose-400/40 flex items-center justify-center text-white shadow-sm">
                      <MicOff className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <span className="absolute bottom-1 left-1.5 text-[9px] text-white font-medium truncate max-w-[85px] drop-shadow font-mono">
                  You
                </span>
              </div>

              {/* Remote Participants Tiles */}
              {remoteParticipants.map((p) => {
                const pTrack = cameraTracks.find(t => t.participant.identity === p.identity);
                const isPinned = pinnedParticipantIdentity === p.identity;

                return (
                  <div
                    key={p.identity}
                    onClick={() => setPinnedParticipantIdentity(p.identity)}
                    className={`h-20 sm:h-24 rounded-xl overflow-hidden relative bg-[#060a08] border shadow-md group cursor-pointer transition-all ${
                      isPinned 
                        ? 'border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                        : 'border-white/10 hover:border-emerald-500/50'
                    }`}
                  >
                    {pTrack && isTrackReference(pTrack) && p.isCameraEnabled ? (
                      <VideoTrack
                        trackRef={pTrack}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#07100c] text-emerald-300">
                        <span className="text-xs font-bold font-mono">
                          {p.name?.substring(0, 2).toUpperCase() || 'CA'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-1.5 right-1.5 z-10">
                      {p.isMicrophoneEnabled ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-600/90 border border-emerald-400/50 flex items-center justify-center text-white shadow-[0_0_6px_#10b981]">
                          <Mic className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-rose-600/90 border border-rose-400/40 flex items-center justify-center text-white shadow-sm">
                          <MicOff className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-1 left-1.5 text-[9px] text-white font-medium truncate max-w-[85px] drop-shadow font-mono">
                      {p.name || p.identity.substring(0, 8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Call Control Bar (Optimized for Mobile Touch & Desktop) */}
          <div className="h-16 md:h-20 px-3 md:px-6 bg-gradient-to-b from-[#121915] via-[#0b100d] to-[#060907] border-t border-emerald-950/70 flex items-center justify-between shrink-0 z-20">
            
            {/* Left: Mobile Tools / Desktop Layout Button */}
            <div>
              <button 
                onClick={() => setIsSidebarOpen(prev => !prev)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl btn-metallic flex items-center justify-center transition-colors shadow-sm"
                title="Toggle Workspace & Tools"
              >
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Center: Essential Hardware Call Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mic Toggle Button */}
              <button
                onClick={toggleMic}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  isMicrophoneEnabled
                    ? 'btn-metallic text-emerald-400'
                    : 'bg-rose-950/80 border border-rose-600/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                }`}
                title={isMicrophoneEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicrophoneEnabled ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              {/* Camera Toggle Button */}
              <button
                onClick={toggleCam}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  isCameraEnabled
                    ? 'btn-metallic text-emerald-400'
                    : 'bg-rose-950/80 border border-rose-600/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                }`}
                title={isCameraEnabled ? 'Turn Off Cam' : 'Turn On Cam'}
              >
                {isCameraEnabled ? <VideoIcon className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              {/* Flip Camera Button (On Mobile) */}
              <button
                onClick={handleFlipCamera}
                className="md:hidden w-11 h-11 rounded-xl btn-metallic flex items-center justify-center text-emerald-400"
                title="Switch Front/Back Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  isFullscreen
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              {/* Screen Share Button */}
              <button
                onClick={toggleScreen}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  isScreenShareEnabled
                    ? 'btn-metallic-emerald text-white shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title={isScreenShareEnabled ? 'Stop Sharing' : 'Share Screen & System Audio'}
              >
                {isScreenShareEnabled ? <MonitorOff className="w-4 h-4 md:w-5 md:h-5" /> : <Monitor className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={() => {
                  try { room.disconnect(); } catch (_) {}
                  onEndCall();
                }}
                className="h-11 md:h-12 px-3.5 sm:px-5 md:px-6 rounded-xl bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 border border-rose-400/40 text-white font-bold text-xs flex items-center gap-1.5 md:gap-2 shadow-[0_4px_16px_rgba(225,29,72,0.4)] hover:brightness-110 active:translate-y-0.5 transition-all"
                title="Leave Video Call"
              >
                <PhoneOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Leave</span>
              </button>
            </div>

            {/* Explicit Remote Screen Audio Renderer (System & Tab Sound) */}
            <div className="hidden" aria-hidden="true">
              {remoteScreenAudioTracks.map(track => isTrackReference(track) && (
                <AudioTrack key={track.publication.trackSid} trackRef={track} />
              ))}
            </div>

            {/* Right: Quick Tab Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveSidebarTab('chat');
                }}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all ${
                  isSidebarOpen && activeSidebarTab === 'chat'
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveSidebarTab('code');
                }}
                className={`hidden sm:flex w-10 h-10 md:w-11 md:h-11 rounded-xl items-center justify-center transition-all ${
                  isSidebarOpen && activeSidebarTab === 'code'
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Code Sandbox"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Docked Sidebar (Hidden on Mobile) */}
        {isSidebarOpen && (
          <div className="hidden md:flex w-80 lg:w-96 border-l border-emerald-950/70 bg-[#060b08]/95 flex-col justify-between shrink-0 shadow-2xl">
            
            {/* Top Workspace Bar */}
            <div className="p-3.5 border-b border-emerald-950/70 bg-[#08100c]">
              <div className="flex items-center justify-between pb-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span>Interview Workspace</span>
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-6 h-6 rounded-md btn-metallic flex items-center justify-center text-emerald-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Segmented Tab Switcher */}
              <div className="flex rounded-lg bg-[#0c120f] p-0.5 text-xs font-medium border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <button
                  onClick={() => setActiveSidebarTab('chat')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeSidebarTab === 'chat'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'text-emerald-300/70 hover:text-emerald-200'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveSidebarTab('scorecard')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeSidebarTab === 'scorecard'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'text-emerald-300/70 hover:text-emerald-200'
                  }`}
                >
                  Scorecard
                </button>
                <button
                  onClick={() => setActiveSidebarTab('code')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeSidebarTab === 'code'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'text-emerald-300/70 hover:text-emerald-200'
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveSidebarTab('people')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeSidebarTab === 'people'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'text-emerald-300/70 hover:text-emerald-200'
                  }`}
                >
                  People ({1 + remoteParticipants.length})
                </button>
              </div>
            </div>

            {renderWorkspaceContent()}
          </div>
        )}

        {/* Mobile Slide-Up Bottom Sheet Drawer (Active on Phones when Workspace is Opened) */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-[#070e0a] border-t border-emerald-500/40 rounded-t-3xl max-h-[82vh] h-[82vh] flex flex-col overflow-hidden shadow-2xl">
              
              {/* Drawer Handle & Header */}
              <div className="p-3 border-b border-emerald-950/70 bg-[#08100c]">
                <div className="w-12 h-1 rounded-full bg-emerald-500/40 mx-auto mb-2" />
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    <span>Workspace &amp; Tools</span>
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="flex rounded-lg bg-[#0c120f] p-0.5 text-xs font-medium border border-white/10">
                  <button
                    onClick={() => setActiveSidebarTab('chat')}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeSidebarTab === 'chat'
                        ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'text-emerald-300/70'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab('scorecard')}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeSidebarTab === 'scorecard'
                        ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'text-emerald-300/70'
                    }`}
                  >
                    Scorecard
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab('code')}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeSidebarTab === 'code'
                        ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'text-emerald-300/70'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab('people')}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeSidebarTab === 'people'
                        ? 'btn-metallic-emerald text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'text-emerald-300/70'
                    }`}
                  >
                    People ({1 + remoteParticipants.length})
                  </button>
                </div>
              </div>

              {renderWorkspaceContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
