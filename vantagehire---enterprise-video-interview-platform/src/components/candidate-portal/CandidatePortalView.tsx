import React from 'react';
import { 
  Video, 
  Mic, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  ArrowRight,
  Monitor,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Candidate, InterviewSession } from '../../types';

interface CandidatePortalViewProps {
  candidate: Candidate;
  session: InterviewSession;
  onEnterRoom: () => void;
}

export const CandidatePortalView: React.FC<CandidatePortalViewProps> = ({
  candidate,
  session,
  onEnterRoom,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#030705] p-4 sm:p-6 text-slate-200 relative overflow-hidden select-none">
      {/* Background Animated Emerald Glow */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />

      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] border border-emerald-950/70 border-t-white/20 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.25)] overflow-hidden z-10 relative">
        {/* Top Header matching Header style */}
        <div className="h-16 px-6 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">Acme Cloud Enterprise Hiring Portal</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-mono shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-emerald-400/80 mt-0.5 font-mono">
              Welcome, {candidate.name}. Your session room is prepared.
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Video className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
          </div>
        </div>

        {/* Meeting Information */}
        <div className="p-6 space-y-6">
          <div className="p-5 metallic-card rounded-2xl border border-emerald-950/80 space-y-3 shadow-inner">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Upcoming Technical Session
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {session.roundType} Interview
                </h3>
                <p className="text-xs text-emerald-200">
                  Target Role: {session.role} ({session.targetLevel})
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Room: #{session.meetingRoomId}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-400/80 pt-3 border-t border-emerald-950/60 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{session.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{session.startTime} ({session.durationMinutes} minutes)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Panel: {session.panelists.map(p => p.name).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Pre-Call System Readiness Check with Glowing Emerald Badges */}
          <div>
            <span className="text-xs font-bold text-white block mb-2.5 font-mono">
              Audio & Video Readiness Verification
            </span>
            <div className="grid grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 flex items-center gap-2.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981] shrink-0" />
                <div>
                  <div className="font-bold text-white">Camera Active</div>
                  <div className="text-[10px] text-emerald-400 font-mono">1080p 60fps</div>
                </div>
              </div>

              <div className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 flex items-center gap-2.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981] shrink-0" />
                <div>
                  <div className="font-bold text-white">Mic Hardware</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Echo cancelled</div>
                </div>
              </div>

              <div className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 flex items-center gap-2.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981] shrink-0" />
                <div>
                  <div className="font-bold text-white">Low Latency</div>
                  <div className="text-[10px] text-emerald-300 font-mono font-bold">14ms ping</div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Code Environment Note */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 to-[#070e0a] border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5 shadow-md">
            <Monitor className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              During this interview, you will have access to an interactive browser code workspace with execution test cases and architecture diagramming. You can use TypeScript, Python, or SQL.
            </span>
          </div>

          {/* Join CTA - MacBook Anodized Emerald Button */}
          <div className="pt-2">
            <button
              onClick={onEnterRoom}
              className="btn-metallic-emerald w-full py-3.5 px-5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_24px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Enter Interview Video Room Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
