import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Users, 
  Video, 
  Plus, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { Candidate, InterviewSession } from '../../types';
import { generateIcsCalendarFile } from '../../utils/calendarExport';

interface SchedulingHubProps {
  sessions: InterviewSession[];
  candidates: Candidate[];
  onScheduleSession: (newSession: InterviewSession) => void;
  onJoinSession: (session: InterviewSession) => void;
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
}

export const SchedulingHub: React.FC<SchedulingHubProps> = ({
  sessions,
  candidates,
  onScheduleSession,
  onJoinSession,
  isScheduleModalOpen,
  setIsScheduleModalOpen,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [copiedLinkSessionId, setCopiedLinkSessionId] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Form State for Scheduling New Interview
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || '');
  const [roundType, setRoundType] = useState<InterviewSession['roundType']>('System Architecture');
  const [scheduledDate, setScheduledDate] = useState('2026-10-16');
  const [startTime, setStartTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [timezone, setTimezone] = useState('America/Los_Angeles (PDT)');
  const [leadPanelist, setLeadPanelist] = useState('Sarah Chen (Principal Architect)');
  const [shadowPanelist, setShadowPanelist] = useState('Devon Patel (Eng Director)');

  const filteredSessions = sessions.filter(s => {
    if (viewFilter === 'upcoming') return s.status === 'upcoming' || s.status === 'live';
    if (viewFilter === 'completed') return s.status === 'completed';
    return true;
  });

  const handleCopyInviteLink = (session: InterviewSession) => {
    const link = `https://vantagehire.enterprise/room/${session.meetingRoomId}?pass=${session.passcode}`;
    navigator.clipboard.writeText(link);
    setCopiedLinkSessionId(session.id);
    setTimeout(() => setCopiedLinkSessionId(null), 2000);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find(c => c.id === candidateId) || candidates[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newSession: InterviewSession = {
      id: `int-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      role: candidate.role,
      targetLevel: candidate.targetLevel,
      roundType,
      scheduledDate,
      startTime,
      durationMinutes,
      timezone,
      status: 'upcoming',
      meetingRoomId: `VH-${randomSuffix}-CAL`,
      passcode: String(randomSuffix),
      panelists: [
        { name: leadPanelist.split('(')[0].trim(), role: leadPanelist.includes('(') ? leadPanelist.split('(')[1].replace(')', '') : 'Lead', isLead: true },
        ...(shadowPanelist ? [{ name: shadowPanelist.split('(')[0].trim(), role: shadowPanelist.includes('(') ? shadowPanelist.split('(')[1].replace(')', '') : 'Panelist' }] : [])
      ]
    };

    onScheduleSession(newSession);
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#030705] overflow-y-auto p-4 sm:p-6 text-slate-200 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Integrated Interview Scheduling & Calendar
            </h2>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              Panel Ops
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mt-1">
            <span>Multi-Round Coordination</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Conflict Resolution</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>RFC 5545 ICS Export</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Filter Control matching Header */}
          <div className="flex items-center gap-1 p-1 bg-[#0c120f] rounded-lg border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] text-xs">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                viewFilter === 'all' 
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              All Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setViewFilter('upcoming')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                viewFilter === 'upcoming' 
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Upcoming ({sessions.filter(s => s.status !== 'completed').length})
            </button>
            <button
              onClick={() => setViewFilter('completed')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                viewFilter === 'completed' 
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Evaluated ({sessions.filter(s => s.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn-metallic-emerald flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Round</span>
          </button>
        </div>
      </div>

      {/* Main Sessions Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        {/* Left 2 Cols: Session Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Scheduled Evaluation Rounds
            </span>
            <span>Showing {filteredSessions.length} sessions</span>
          </div>

          {filteredSessions.map((session) => {
            const isLive = session.status === 'live';
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all metallic-card ${
                  isLive
                    ? 'border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/40'
                    : 'border-emerald-950/80 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left session meta */}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">
                        {session.candidateName}
                      </span>
                      <span className="text-emerald-700">·</span>
                      <span className="text-xs font-medium text-emerald-200">
                        {session.role}
                      </span>
                      <span className="text-[11px] text-emerald-400/80 font-mono">
                        ({session.targetLevel})
                      </span>
                      {isLive && (
                        <span className="relative flex h-2 w-2 ml-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-300/80 mt-2">
                      <div className="flex items-center gap-1.5 font-mono">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{session.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{session.startTime} ({session.durationMinutes}m)</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{session.panelists.map(p => p.name).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status & Action Buttons with MacBook Metallic styling */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* ICS export */}
                    <button
                      onClick={() => generateIcsCalendarFile(session)}
                      className="btn-metallic p-2.5 rounded-lg text-xs"
                      title="Download .ics Calendar Invite for Google / Outlook"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyInviteLink(session)}
                      className="btn-metallic p-2.5 rounded-lg text-xs"
                      title="Copy Candidate Video Room URL"
                    >
                      {copiedLinkSessionId === session.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>

                    {/* Join / Review Scorecard CTA */}
                    {isLive ? (
                      <button
                        onClick={() => onJoinSession(session)}
                        className="btn-metallic-emerald flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.5)] animate-pulse"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Enter Live Room</span>
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => onJoinSession(session)}
                        className="btn-metallic flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold"
                      >
                        <span className="text-emerald-400 font-mono font-bold">★ {session.scorecard?.overallScore || '4.5'}</span>
                        <span>View Evaluation</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onJoinSession(session)}
                        className="btn-metallic-emerald flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Start Session</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Round Badge and Room Code info */}
                <div className="mt-3 pt-2.5 border-t border-emerald-950/60 flex items-center justify-between text-[11px] text-emerald-400/80 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Round: {session.roundType}
                    </span>
                    <span>Room #{session.meetingRoomId}</span>
                    <span className="text-emerald-700">·</span>
                    <span>Pass: {session.passcode}</span>
                  </div>
                  <span className="text-emerald-500">{session.timezone}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Panelist Capacity & Quick Calendar Widget */}
        <div className="space-y-4">
          {/* Panel Availability Card */}
          <div className="p-4 metallic-card rounded-2xl border border-emerald-950/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Panelist Capacity & Load
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Sarah Chen', role: 'Principal Architect', roundsThisWeek: 3, maxCapacity: 5, status: 'Available' },
                { name: 'Devon Patel', role: 'Engineering Director', roundsThisWeek: 4, maxCapacity: 4, status: 'At Capacity' },
                { name: 'Alex Rivera', role: 'Staff SRE', roundsThisWeek: 2, maxCapacity: 5, status: 'Available' },
                { name: 'Jessica Vance', role: 'CISO', roundsThisWeek: 1, maxCapacity: 3, status: 'Available' },
              ].map(p => (
                <div key={p.name} className="p-2.5 bg-[#060b08] rounded-xl border border-emerald-950/60 flex items-center justify-between shadow-inner">
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[11px] text-emerald-500 font-mono">{p.role}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-mono font-bold ${
                      p.status === 'At Capacity' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {p.roundsThisWeek} / {p.maxCapacity} rounds
                    </span>
                    <p className="text-[10px] text-emerald-600 font-mono">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Scheduling Candidate Link Box with Emerald Metallic Accent */}
          <div className="p-4 bg-gradient-to-br from-[#0e1c14] to-[#070e0a] border border-emerald-500/40 rounded-2xl space-y-2.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Candidate Self-Booking Portal</h3>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
              Generate an encrypted, branded link for candidates to review open panelist slots and confirm bookings.
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://vantagehire.enterprise/book/acme-engineering-portal');
                  setCopiedLinkSessionId('portal-link');
                  setTimeout(() => setCopiedLinkSessionId(null), 2000);
                }}
                className="btn-metallic w-full py-2.5 px-3 rounded-lg text-xs font-bold text-emerald-300 flex items-center justify-center gap-2"
              >
                {copiedLinkSessionId === 'portal-link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Booking URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy Branded Booking Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule New Interview Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
          <div className="bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] border border-emerald-950/70 border-t-white/20 rounded-2xl w-full max-w-lg shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.25)] overflow-hidden">
            
            {/* Modal Header matching Header */}
            <div className="h-14 px-5 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
              <div>
                <h3 className="font-bold text-sm text-white">Schedule Evaluation Round</h3>
                <p className="text-[10px] text-emerald-400 font-mono">Configure round type, panel allocations, and room link</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-emerald-200 block mb-1 font-mono">Target Candidate</label>
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full metallic-input rounded-lg p-2.5 text-white focus:outline-none font-sans cursor-pointer"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#08120d] text-white">
                      {c.name} · {c.role} ({c.targetLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-emerald-200 block mb-1 font-mono">Evaluation Round</label>
                <select
                  value={roundType}
                  onChange={(e) => setRoundType(e.target.value as any)}
                  className="w-full metallic-input rounded-lg p-2.5 text-white focus:outline-none font-sans cursor-pointer"
                >
                  <option value="Screening" className="bg-[#08120d]">Recruiter & Domain Screening (30m)</option>
                  <option value="Technical Coding" className="bg-[#08120d]">Technical Coding & Algorithms (45m)</option>
                  <option value="System Architecture" className="bg-[#08120d]">System Architecture & Scalability (60m)</option>
                  <option value="Values & Leadership" className="bg-[#08120d]">Enterprise Alignment & Culture (45m)</option>
                  <option value="Executive Debrief" className="bg-[#08120d]">Executive Debrief & Bar Raiser (30m)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full metallic-input rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full metallic-input rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Duration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full metallic-input rounded-lg p-2.5 text-white focus:outline-none font-mono cursor-pointer"
                  >
                    <option value={30} className="bg-[#08120d]">30 Minutes</option>
                    <option value={45} className="bg-[#08120d]">45 Minutes</option>
                    <option value={60} className="bg-[#08120d]">60 Minutes</option>
                    <option value={90} className="bg-[#08120d]">90 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full metallic-input rounded-lg p-2.5 text-white focus:outline-none font-sans cursor-pointer"
                  >
                    <option value="America/Los_Angeles (PDT)" className="bg-[#08120d]">Pacific Time (PDT)</option>
                    <option value="America/New_York (EDT)" className="bg-[#08120d]">Eastern Time (EDT)</option>
                    <option value="Europe/London (BST)" className="bg-[#08120d]">London (BST)</option>
                    <option value="Asia/Singapore (SGT)" className="bg-[#08120d]">Singapore (SGT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Lead Interviewer</label>
                  <input
                    type="text"
                    value={leadPanelist}
                    onChange={(e) => setLeadPanelist(e.target.value)}
                    className="w-full metallic-input rounded-lg p-2 text-white focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-200 block mb-1 font-mono">Shadow / Panelist</label>
                  <input
                    type="text"
                    value={shadowPanelist}
                    onChange={(e) => setShadowPanelist(e.target.value)}
                    className="w-full metallic-input rounded-lg p-2 text-white focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-950/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="btn-metallic px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-metallic-emerald px-5 py-2 text-white rounded-lg text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                >
                  Confirm & Generate Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
