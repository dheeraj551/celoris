import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  PhoneOff, 
  Maximize2, 
  Settings, 
  MessageSquare, 
  Users, 
  Send, 
  Smile, 
  Hand, 
  MoreVertical, 
  LayoutGrid, 
  X, 
  Sparkles, 
  Save, 
  Check, 
  Radio,
  FileCheck
} from 'lucide-react';
import { InterviewSession, RubricCategory, ScorecardEvaluation, TranscriptSnippet, InterviewQuestion } from '../../types';

interface VideoInterviewRoomProps {
  session: InterviewSession;
  rubrics: RubricCategory[];
  onUpdateRubrics: (rubrics: RubricCategory[]) => void;
  onSaveEvaluation: (evaluation: ScorecardEvaluation) => void;
  onEndCall: () => void;
  questions: InterviewQuestion[];
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export const VideoInterviewRoom: React.FC<VideoInterviewRoomProps> = ({
  session,
  rubrics,
  onUpdateRubrics,
  onSaveEvaluation,
  onEndCall,
}) => {
  // Call Controls State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'scorecard' | 'participants'>('chat');
  
  // Floating reactions animation
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Main speaker selection
  const [mainSpeakerId, setMainSpeakerId] = useState<string>('candidate');

  // Real Camera & Stream
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Timer & Session Duration (HH:MM:SS)
  const [callDurationSeconds, setCallDurationSeconds] = useState(4988); // 01:23:08

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
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Setup Local Webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          if (!isCancelled) {
            setMediaStream(stream);
            setHasCameraPermission(true);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setHasCameraPermission(false);
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleToggleMic = () => {
    setIsMicOn(prev => !prev);
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
  };

  const handleToggleCam = () => {
    setIsCamOn(prev => !prev);
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !isCamOn;
      });
    }
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsScreenSharing(true);
        } else {
          setIsScreenSharing(true);
        }
      } catch (err) {
        setIsScreenSharing(true);
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  // Floating Emoji Reaction trigger
  const triggerReaction = (emoji: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      left: 30 + Math.random() * 40
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2400);
  };

  // Chat State & Messages (Matching reference design in black and green)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Martin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: 'Hey guys! 👋 Everyone ready for the interview?',
      timestamp: '12:05 AM',
      isMe: false,
    },
    {
      id: 'm2',
      sender: 'Jackson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      text: 'Yes I’m ready, Elena is prepped on distributed systems.',
      timestamp: '12:06 AM',
      isMe: false,
    },
    {
      id: 'm3',
      sender: 'Albert',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      text: 'Here is the rate limiting spec doc: https://acme.internal/rfc/9024',
      timestamp: '12:08 AM',
      isMe: false,
    },
    {
      id: 'm4',
      sender: 'Alice',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      text: 'That sliding window approach is perfect! 🔥',
      timestamp: '12:12 AM',
      isMe: false,
    },
    {
      id: 'm5',
      sender: 'Sarah Chen (You)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      text: 'Great team! Let’s proceed with failure domains.',
      timestamp: '12:13 AM',
      isMe: true,
    },
    {
      id: 'm6',
      sender: 'Michael',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      text: 'Hey Elena, how is the token bucket syncing across regions?',
      timestamp: '12:14 AM',
      isMe: false,
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Sarah Chen (You)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Trigger candidate reply
    setTimeout(() => {
      const candidateReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        text: 'We apply local memory batching at Envoy ingress with asynchronous delta synchronization every 10ms to Redis cluster.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setChatMessages(prev => [...prev, candidateReply]);
    }, 1500);
  };

  // Scorecard State
  const totalWeight = rubrics.reduce((sum, r) => sum + r.weight, 0);
  const weightedScore = (
    rubrics.reduce((sum, r) => sum + r.score * r.weight, 0) / (totalWeight || 100)
  ).toFixed(1);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [recommendation, setRecommendation] = useState<string>('Strong Hire');
  const [panelistNotes, setPanelistNotes] = useState(
    'Candidate demonstrated senior-level mastery of distributed systems, token bucket algorithms, and horizontal sharding.'
  );

  const handleScoreChange = (id: string, score: number) => {
    onUpdateRubrics(rubrics.map(r => r.id === id ? { ...r, score } : r));
  };

  const handleTriggerAiScore = async () => {
    setIsAiEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: session.candidateName,
          role: session.role,
          round: session.roundType,
          rubrics,
          notes: panelistNotes,
        })
      });
      const data = await res.json();
      if (data.evaluation?.recommendation) {
        setRecommendation(data.evaluation.recommendation);
      }
    } catch (err) {
      console.warn('AI evaluation fallback:', err);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const handleSaveScorecard = () => {
    const sc: ScorecardEvaluation = {
      id: `sc-${Date.now()}`,
      interviewId: session.id,
      candidateId: session.candidateId,
      interviewerName: 'Sarah Chen',
      interviewerRole: 'Lead Interviewer & Bar Raiser',
      submittedAt: new Date().toISOString(),
      overallScore: parseFloat(weightedScore),
      recommendation: recommendation as any,
      executiveSummary: `${session.candidateName} evaluated with score ${weightedScore}/5.0 during the ${session.roundType} interview.`,
      strengths: ['Decisive architectural trade-offs', 'Clean failure isolation semantics'],
      concerns: [],
      rubricBreakdown: rubrics,
      calibrationNotes: 'Ready for hiring committee review.',
      notes: panelistNotes
    };
    onSaveEvaluation(sc);
  };

  // Panel Attendees List
  const attendees = [
    {
      id: 'sarah',
      name: 'Sarah Chen (You)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      isMuted: !isMicOn,
      isCamOff: !isCamOn,
      role: 'Lead Panelist'
    },
    {
      id: 'attendee-1',
      name: 'Claire Dubois',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      isMuted: true,
      isCamOff: false,
      role: 'Head of Talent'
    },
    {
      id: 'attendee-2',
      name: 'Devon Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isMuted: true,
      isCamOff: false,
      role: 'Engineering Director'
    },
    {
      id: 'attendee-3',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isMuted: false,
      isCamOff: false,
      role: 'Staff SRE'
    },
    {
      id: 'attendee-4',
      name: 'Jessica Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isMuted: false,
      isCamOff: false,
      role: 'CISO'
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center bg-[#030705] p-2 sm:p-4 md:p-6 overflow-hidden select-none relative">
      {/* Background Ambient Emerald Aurora Glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[160px] pointer-events-none animate-aurora" style={{ animationDelay: '-5s' }} />

      {/* Main Glassy Metallic Window Chassis */}
      <div className="w-full max-w-7xl h-[calc(100vh-5rem)] max-h-[880px] rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.18)] flex overflow-hidden border border-emerald-950/70 border-t-white/20 bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] relative z-10">
        
        {/* Left Side: Video Canvas & Bottom Call Controls */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#060a08]/90">
          
          {/* Top Window Bar: Black & Green Metallic Glassy Header (matching main Header) */}
          <div className="h-14 px-6 flex items-center justify-between border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md select-none shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3">
              {/* Metallic Squircle Video Camera Icon with Emerald Glow */}
              <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <Video className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-tight leading-none flex items-center gap-2">
                    <span>{session.candidateName}</span>
                    <span className="text-emerald-700">·</span>
                    <span className="text-emerald-300 font-normal">{session.roundType} Interview</span>
                  </h2>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    Live Session
                  </span>
                </div>
                <p className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
                  Thursday, 15 Oct 2026 · Confidential Bar Raiser Panel
                </p>
              </div>
            </div>

            {/* Elapsed Timer Pill (MacBook Anodized Aluminum Style) */}
            <div className="bg-[#0c120f] px-3 py-1 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span>{formatTimer(callDurationSeconds)}</span>
            </div>
          </div>

          {/* Video Main Stage Area */}
          <div className="flex-1 p-4 relative min-h-0 flex gap-3">
            
            {/* Primary Dominant Speaker Video Feed */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#040806] border border-emerald-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center justify-center">
              
              {/* Speaker Video Image */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80"
                alt={session.candidateName}
                className="w-full h-full object-cover filter brightness-100"
              />

              {/* Recording Badge (Top-Left overlay: 🔴 14:08 / 60 min) */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#040806]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-xs font-medium text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_#f43f5e]" />
                <span className="font-mono text-[11px] text-emerald-200">14:08 / 60 min</span>
              </div>

              {/* Video Actions (Top-Right overlay: Settings & Maximize) */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    setIsSidebarOpen(true);
                    setActiveSidebarTab('scorecard');
                  }}
                  className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center transition-all shadow-sm"
                  title="Evaluation Scorecard"
                >
                  <Settings className="w-4 h-4 text-emerald-400" />
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center transition-all shadow-sm"
                  title="Toggle Fullscreen Canvas"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              {/* Speaker Name Tag (Bottom-Left overlay) */}
              <div className="absolute bottom-4 left-4 z-20 bg-[#040806]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span>{session.candidateName}</span>
                <span className="text-[10px] text-emerald-400 font-mono">(Candidate)</span>
              </div>

              {/* Floating Reaction Bar (Glassy Obsidian with Emerald Trim) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#07120c]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.25)] flex items-center gap-2.5">
                {['😂', '🎉', '👍', '👎', '👏', '😮', '❤️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="hover:scale-125 transition-transform text-base sm:text-lg cursor-pointer px-0.5 active:scale-95"
                    title={`Send ${emoji}`}
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
                    className="absolute bottom-16 text-3xl animate-bounce drop-shadow-[0_0_12px_#10b981]"
                    style={{ left: `${item.left}%`, transition: 'all 2s ease-out' }}
                  >
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Attendee Thumbnail Column (Right Side of Main Video) */}
            <div className="w-28 sm:w-32 flex flex-col gap-2.5 shrink-0 overflow-y-auto pr-0.5">
              {attendees.map((att) => (
                <div
                  key={att.id}
                  onClick={() => setMainSpeakerId(att.id)}
                  className="h-20 sm:h-24 rounded-xl overflow-hidden relative bg-[#060a08] border border-white/10 shadow-md group cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  {/* Local video feed if user's camera is active */}
                  {att.id === 'sarah' && hasCameraPermission && isCamOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={att.avatar}
                      alt={att.name}
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status Badges with Metallic Edge */}
                  <div className="absolute top-1.5 right-1.5 z-10">
                    {att.isMuted ? (
                      <span className="w-5 h-5 rounded-full bg-rose-600/90 border border-rose-400/40 flex items-center justify-center text-white shadow-sm">
                        <MicOff className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-emerald-600/90 border border-emerald-400/50 flex items-center justify-center text-white shadow-[0_0_6px_#10b981]">
                        <Mic className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Name badge */}
                  <span className="absolute bottom-1 left-1.5 text-[9px] text-white font-medium truncate max-w-[85px] drop-shadow font-mono">
                    {att.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call Control Bar: MacBook Brushed Aluminum Island */}
          <div className="h-20 px-6 bg-gradient-to-b from-[#121915] via-[#0b100d] to-[#060907] border-t border-emerald-950/70 flex items-center justify-between">
            
            {/* Left: Layout Toggle Icon */}
            <div>
              <button 
                onClick={() => setIsSidebarOpen(prev => !prev)}
                className="w-11 h-11 rounded-xl btn-metallic flex items-center justify-center transition-colors shadow-sm"
                title="Toggle Sidebar Layout"
              >
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Center Controls: MacBook Metallic Hardware Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mic Toggle */}
              <button
                onClick={handleToggleMic}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${
                  isMicOn
                    ? 'btn-metallic text-emerald-400'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isMicOn && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                )}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={handleToggleCam}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${
                  isCamOn
                    ? 'btn-metallic text-emerald-400'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                }`}
                title={isCamOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                {isCamOn && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                )}
              </button>

              {/* Screen Share */}
              <button
                onClick={handleToggleScreenShare}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isScreenSharing
                    ? 'btn-metallic-emerald text-white shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>

              {/* Emoji Smile Reaction */}
              <button
                onClick={() => triggerReaction('🎉')}
                className="w-11 h-11 rounded-xl btn-metallic flex items-center justify-center text-emerald-400 transition-colors"
                title="Reactions"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Hand Raise */}
              <button
                onClick={() => setIsHandRaised(prev => !prev)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isHandRaised
                    ? 'btn-metallic-emerald text-white animate-bounce shadow-[0_0_16px_#10b981]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-4 h-4" />
              </button>

              {/* More Options / Scorecard Quick Link */}
              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveSidebarTab('scorecard');
                }}
                className="w-11 h-11 rounded-xl btn-metallic flex items-center justify-center text-emerald-400 transition-colors"
                title="Scorecard & Calibration"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Red Metallic End Call Button */}
              <button
                onClick={onEndCall}
                className="h-11 px-5 rounded-xl bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 hover:from-rose-500 hover:to-rose-800 text-white font-bold text-xs flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border border-rose-400/30 ml-1"
                title="End Meeting"
              >
                <PhoneOff className="w-4 h-4 fill-current mr-1.5" />
                <span>End Call</span>
              </button>
            </div>

            {/* Right: Participants & Chat Toggle Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveSidebarTab('participants');
                }}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isSidebarOpen && activeSidebarTab === 'participants'
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Participants"
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveSidebarTab('chat');
                }}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isSidebarOpen && activeSidebarTab === 'chat'
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'btn-metallic text-emerald-400'
                }`}
                title="Meeting Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: "Meeting Details" with Glassy Metallic Finish */}
        {isSidebarOpen && (
          <div className="w-80 sm:w-96 border-l border-emerald-950/70 bg-[#060b08]/95 backdrop-blur-xl flex flex-col text-slate-100 transition-all duration-200">
            
            {/* Sidebar Header matching main Header bar */}
            <div className="h-14 px-4 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
              <h3 className="font-bold text-xs tracking-wide uppercase text-emerald-400 font-mono flex items-center gap-2">
                <span>Meeting Details</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Switcher Pill (MacBook Aluminum Style matching Header) */}
            <div className="p-3 border-b border-emerald-950/70 bg-[#08100c]/80">
              <div className="flex rounded-lg bg-[#0c120f] p-1 text-xs font-semibold border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <button
                  onClick={() => setActiveSidebarTab('chat')}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                    activeSidebarTab === 'chat'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveSidebarTab('scorecard')}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                    activeSidebarTab === 'scorecard'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
                  }`}
                >
                  Scorecard
                </button>
                <button
                  onClick={() => setActiveSidebarTab('participants')}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                    activeSidebarTab === 'participants'
                      ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
                  }`}
                >
                  People ({attendees.length + 1})
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* CHAT TAB (Black & Green Metallic Glassy Chat) */}
              {activeSidebarTab === 'chat' && (
                <div className="p-4 space-y-3.5 flex flex-col min-h-full justify-end">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-emerald-500/40 shadow-sm"
                      />
                      <div className={`max-w-[78%] ${msg.isMe ? 'items-end text-right' : ''}`}>
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-emerald-500 font-mono">
                          <span className="font-bold text-white">
                            {msg.sender.split(' ')[0]}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                            msg.isMe
                              ? 'btn-metallic-emerald text-white rounded-tr-none shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                              : 'bg-[#09150f] text-emerald-100 rounded-tl-none border border-white/10'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>
              )}

              {/* SCORECARD TAB (Calibrated Rubric Scoring in Black & Green) */}
              {activeSidebarTab === 'scorecard' && (
                <div className="p-4 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950/80">
                    <div>
                      <h4 className="font-bold text-white">Live Rubric Scoring</h4>
                      <p className="text-[11px] text-emerald-500 font-mono">Calibrated bar raiser math</p>
                    </div>
                    <span className="font-mono font-bold text-sm bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      ★ {weightedScore} / 5.0
                    </span>
                  </div>

                  {/* Rubric Category Rating */}
                  <div className="space-y-2.5">
                    {rubrics.map((cat) => (
                      <div key={cat.id} className="p-3 rounded-xl bg-[#08120d] border border-white/10 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white truncate max-w-[190px]">
                            {cat.name}
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">{cat.weight}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => handleScoreChange(cat.id, lvl)}
                              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                                cat.score === lvl
                                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_#10b981]'
                                  : 'btn-metallic text-emerald-300/80 hover:text-white'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Score Synth */}
                  <div className="pt-1">
                    <button
                      onClick={handleTriggerAiScore}
                      disabled={isAiEvaluating}
                      className="btn-metallic w-full py-2.5 px-3 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isAiEvaluating ? 'animate-spin' : ''}`} />
                      <span>{isAiEvaluating ? 'Calibrating...' : 'AI Score Synthesis'}</span>
                    </button>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="font-bold text-emerald-200 block mb-1.5 font-mono">
                      Recommendation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Strong Hire', 'Hire', 'Leaning Hire', 'Leaning No Hire'].map((rec) => (
                        <button
                          key={rec}
                          onClick={() => setRecommendation(rec)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                            recommendation === rec
                              ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                              : 'btn-metallic text-emerald-400/80'
                          }`}
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSaveScorecard}
                      className="btn-metallic-emerald w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.4)] flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Scorecard Evaluation</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PARTICIPANTS TAB */}
              {activeSidebarTab === 'participants' && (
                <div className="p-4 space-y-3 text-xs">
                  <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider font-mono">
                    In Call ({attendees.length + 1})
                  </div>
                  
                  {/* Candidate */}
                  <div className="p-3 rounded-xl bg-[#08120d] border border-emerald-500/30 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                        alt={session.candidateName}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                      />
                      <div>
                        <div className="font-bold text-white">{session.candidateName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Candidate</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                      Speaking
                    </span>
                  </div>

                  {/* Panelists */}
                  {attendees.map((att) => (
                    <div key={att.id} className="p-3 rounded-xl bg-[#08120d] border border-white/5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={att.avatar}
                          alt={att.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white">{att.name}</div>
                          <div className="text-[10px] text-emerald-500 font-mono">{att.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {att.isMuted ? (
                          <span className="w-6 h-6 rounded-full bg-rose-600/90 border border-rose-400/40 flex items-center justify-center text-white">
                            <MicOff className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-emerald-600/90 border border-emerald-400/50 flex items-center justify-center text-white shadow-[0_0_6px_#10b981]">
                            <Mic className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input Bar (Glassy Obsidian with Metallic Send Button) */}
            {activeSidebarTab === 'chat' && (
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-emerald-950/80 bg-[#060b08] flex items-center gap-2">
                <div className="flex-1 flex items-center bg-[#09140f] rounded-xl px-3 py-2 border border-white/10 shadow-inner">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message here..."
                    className="w-full bg-transparent text-xs text-white placeholder-emerald-700 focus:outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => triggerReaction('👍')}
                    className="text-emerald-500 hover:text-emerald-300 transition-colors ml-1"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Metallic Emerald Send Button */}
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl btn-metallic-emerald flex items-center justify-center text-white transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)] shrink-0"
                >
                  <Send className="w-4 h-4 fill-current -ml-0.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
