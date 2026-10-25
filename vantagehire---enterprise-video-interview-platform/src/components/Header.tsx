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
  Sparkles
} from 'lucide-react';

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
          title="Return to Landing Page Overview"
        >
          {/* Metallic Brand Icon */}
          <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:border-emerald-400 transition-colors">
            <Video className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">VantageHire</span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                Enterprise
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-mono">
              <span className="text-emerald-500/80">Acme Cloud</span>
              <span aria-hidden="true" className="text-emerald-800">·</span>
              <span className="text-emerald-500/60">← Overview</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs - MacBook Anodized Aluminum Style Segmented Control */}
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
            <span>Scheduling & Calendar</span>
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
            <span>Rubrics & Calibration</span>
          </button>
        </nav>
      </div>

      {/* Right Controls: Role Switcher, Metallic CTA, Profile */}
      <div className="flex items-center gap-3">
        {/* Role Perspective Switcher with Metallic Chamfer */}
        <div className="flex items-center gap-1.5 bg-[#0c120f] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-500/70 hidden sm:inline">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-transparent text-emerald-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="interviewer" className="bg-[#0c120f] text-emerald-200">Lead Interviewer</option>
            <option value="hiring_manager" className="bg-[#0c120f] text-emerald-200">Hiring Committee</option>
            <option value="candidate" className="bg-[#0c120f] text-emerald-200">Candidate View</option>
          </select>
        </div>

        {/* Schedule Interview Metallic Button */}
        <button
          onClick={onScheduleNew}
          className="btn-metallic flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Schedule Interview</span>
        </button>

        {/* Lead Interviewer Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-emerald-950/80">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1b2520] to-[#2c3932] border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            SC
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-semibold text-emerald-100 leading-tight">Sarah Chen</p>
            <p className="text-[10px] text-emerald-400 font-mono">Bar Raiser</p>
          </div>
        </div>
      </div>
    </header>
  );
};
