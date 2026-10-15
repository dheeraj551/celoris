import React from 'react';
import { 
  Video, 
  Users, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  Plus, 
  Radio, 
  ChevronDown,
  UserCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export type ActiveTab = 'video' | 'pipeline' | 'schedule' | 'analytics';
export type UserRole = 'interviewer' | 'hiring_manager' | 'candidate';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isCallActive: boolean;
  onScheduleNew: () => void;
  activeCandidateName?: string;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  isCallActive,
  onScheduleNew,
  activeCandidateName,
  onGoToLanding,
}) => {
  return (
    <header className="h-14 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between select-none shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-6">
        <div 
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to VantageHire Overview"
        >
          {/* Metallic Brand Icon */}
          <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:border-emerald-400 transition-colors">
            <Video className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Celoris <span className="text-emerald-400">VantageHire</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                LiveKit
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-mono">
              <span className="text-emerald-500/80">Job Center &amp; Academy</span>
              <span aria-hidden="true" className="text-emerald-800">·</span>
              <span className="text-emerald-500/60">← Overview</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#0c120f] rounded-lg border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'video'
                ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Interview</span>
            {isCallActive && (
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'pipeline'
                ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Candidate Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'schedule'
                ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scheduling Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'analytics'
                ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scoring Analytics</span>
          </button>
        </nav>
      </div>

      {/* Right Controls: Role Switcher & Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Link back to Celoris Job Center */}
        <Link
          href="/job-center"
          className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-emerald-300 px-2 py-1 rounded transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Job Center</span>
        </Link>

        {/* Role Simulator Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0c120f] rounded-lg border border-white/10 text-xs">
          <span className="text-[11px] font-mono text-emerald-500/80 pl-2 hidden sm:inline">Role:</span>
          
          <button
            onClick={() => setUserRole('interviewer')}
            className={`px-2.5 py-1 rounded text-xs transition-all font-mono ${
              userRole === 'interviewer'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Interviewer
          </button>

          <button
            onClick={() => setUserRole('hiring_manager')}
            className={`px-2.5 py-1 rounded text-xs transition-all font-mono ${
              userRole === 'hiring_manager'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Committee
          </button>

          <button
            onClick={() => setUserRole('candidate')}
            className={`px-2.5 py-1 rounded text-xs transition-all font-mono ${
              userRole === 'candidate'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Candidate View
          </button>
        </div>

        {/* Schedule CTA */}
        <button
          onClick={onScheduleNew}
          className="btn-metallic-emerald flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Schedule Round</span>
        </button>
      </div>
    </header>
  );
};
