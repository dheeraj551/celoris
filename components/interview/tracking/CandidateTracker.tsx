import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Video, 
  Star, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  BarChart2,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { Candidate, CandidateStage, InterviewSession } from '../types';
import { CandidateDossierModal } from './CandidateDossierModal';
import { CandidateCompareModal } from './CandidateCompareModal';

interface CandidateTrackerProps {
  candidates: Candidate[];
  onUpdateCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
  onStartInterview: (session: InterviewSession) => void;
  onScheduleInterview: (candidateId: string) => void;
}

const STAGES: { key: CandidateStage; label: string }[] = [
  { key: 'screening', label: 'Screening' },
  { key: 'tech_screen', label: 'Tech Screen' },
  { key: 'system_design', label: 'System Design' },
  { key: 'culture_fit', label: 'Leadership' },
  { key: 'executive_review', label: 'Committee Debrief' },
  { key: 'offer_extended', label: 'Offer Extended' },
];

export const CandidateTracker: React.FC<CandidateTrackerProps> = ({
  candidates,
  onUpdateCandidateStage,
  onStartInterview,
  onScheduleInterview,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedCandidateForDossier, setSelectedCandidateForDossier] = useState<Candidate | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = departmentFilter === 'all' || c.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const toggleSelectForCompare = (candidateId: string) => {
    setSelectedForComparison(prev => 
      prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
    );
  };

  const comparedCandidates = candidates.filter(c => selectedForComparison.includes(c.id));

  return (
    <div className="flex-1 flex flex-col bg-[#030705] overflow-y-auto p-4 sm:p-6 text-slate-200 relative select-none">
      {/* Background emerald aura */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />

      {/* Top ATS Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Enterprise Candidate Pipeline & Evaluation Tracking
            </h2>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              ATS Core
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mt-1">
            <span>{candidates.length} Active Candidates</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Automated Calibrated Scoring</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Hiring Committee Consensus</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {selectedForComparison.length >= 2 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="btn-metallic flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compare Selected ({selectedForComparison.length})</span>
            </button>
          )}

          {/* Segmented Switch (MacBook Style matching Header) */}
          <div className="flex items-center gap-1 bg-[#0c120f] p-1 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                viewMode === 'kanban' 
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Stage Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                viewMode === 'table' 
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Pipeline Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar with Metallic Edge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 glass-card-metallic p-3 rounded-xl text-xs z-10">
        <div className="flex items-center gap-2.5 flex-1 max-w-md metallic-input rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by candidate name, target role, or verified skills..."
            className="w-full bg-transparent text-white placeholder-emerald-700 focus:outline-none font-sans text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-emerald-400/80">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#0c120f] border border-white/10 rounded-lg px-2.5 py-1.5 text-emerald-200 focus:outline-none focus:border-emerald-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            <option value="all" className="bg-[#0c120f] text-emerald-200">All Engineering (5)</option>
            <option value="Infrastructure" className="bg-[#0c120f] text-emerald-200">Infrastructure</option>
            <option value="Platform" className="bg-[#0c120f] text-emerald-200">Platform</option>
            <option value="Data & AI" className="bg-[#0c120f] text-emerald-200">Data & AI</option>
            <option value="Security" className="bg-[#0c120f] text-emerald-200">Security</option>
            <option value="Product Engineering" className="bg-[#0c120f] text-emerald-200">Product Engineering</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 z-10">
          {STAGES.map((col) => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === col.key);
            return (
              <div
                key={col.key}
                className="w-72 shrink-0 bg-[#070e0a]/90 rounded-2xl border border-emerald-950/70 border-t-white/10 flex flex-col max-h-[calc(100vh-250px)] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {/* Stage Header matching Header styling */}
                <div className="h-11 px-3.5 border-b border-emerald-950/70 flex items-center justify-between bg-[#08120d] backdrop-blur-md">
                  <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    <span>{col.label}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in Stage */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageCandidates.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-emerald-800 italic">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidateForDossier(c)}
                        className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 hover:border-emerald-500/50 transition-all cursor-pointer shadow-md group space-y-2.5 relative"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatarUrl}
                              alt={c.name}
                              className="w-9 h-9 rounded-lg object-cover border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {c.name}
                              </h4>
                              <p className="text-[10px] text-emerald-400/80 truncate max-w-[130px] font-mono">
                                {c.role}
                              </p>
                            </div>
                          </div>

                          <input
                            type="checkbox"
                            checked={selectedForComparison.includes(c.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelectForCompare(c.id);
                            }}
                            title="Select for comparison matrix"
                            className="rounded border-emerald-800 bg-[#030705] text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                        </div>

                        {/* Candidate Score & Rec */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="font-mono text-emerald-400/80">
                            {c.targetLevel} · {c.yearsExperience}y exp
                          </span>
                          {c.overallScore ? (
                            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.2)]">
                              ★ {c.overallScore} / 5.0
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-mono text-[10px]">Evaluation Pending</span>
                          )}
                        </div>

                        {/* Active interview CTA if any */}
                        {c.interviewSessions && c.interviewSessions.length > 0 && (
                          <div className="pt-2 border-t border-emerald-950/60 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400 truncate max-w-[120px] font-mono text-[10px]">
                              {c.interviewSessions[0].roundType}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartInterview(c.interviewSessions[0]);
                              }}
                              className="btn-metallic-emerald px-2.5 py-1 rounded-lg text-white font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)] text-xs"
                            >
                              <Video className="w-3 h-3" />
                              <span>Room</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="metallic-card rounded-2xl border border-emerald-950/80 overflow-hidden shadow-xl z-10">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08120d] border-b border-emerald-950/80 text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              <tr>
                <th className="p-3.5 w-8"></th>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Target Role & Level</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Pipeline Stage</th>
                <th className="p-3.5">Calibrated Score</th>
                <th className="p-3.5">Recommendation</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-sans">
              {filteredCandidates.map((c) => (
                <tr 
                  key={c.id}
                  onClick={() => setSelectedCandidateForDossier(c)}
                  className="hover:bg-[#0c1812] cursor-pointer transition-colors"
                >
                  <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedForComparison.includes(c.id)}
                      onChange={() => toggleSelectForCompare(c.id)}
                      className="rounded border-emerald-800 bg-[#030705] text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="w-8 h-8 rounded-lg object-cover border border-emerald-500/30 shadow-[0_0_6px_rgba(16,185,129,0.2)]"
                      />
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-emerald-500 font-mono">{c.currentCompany}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-emerald-100">{c.role}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{c.targetLevel}</div>
                  </td>
                  <td className="p-3.5 font-medium text-emerald-300">
                    {c.department}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 capitalize">
                    {c.stage.replace('_', ' ')}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-300">
                    {c.overallScore ? `★ ${c.overallScore} / 5.0` : '—'}
                  </td>
                  <td className="p-3.5">
                    {c.recommendation ? (
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        c.recommendation.includes('Hire') && !c.recommendation.includes('No')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {c.recommendation}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-mono text-[10px]">Pending</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedCandidateForDossier(c)}
                      className="btn-metallic px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dossier Modal */}
      {selectedCandidateForDossier && (
        <CandidateDossierModal
          candidate={selectedCandidateForDossier}
          onClose={() => setSelectedCandidateForDossier(null)}
          onUpdateStage={(cid, stage) => {
            onUpdateCandidateStage(cid, stage);
            setSelectedCandidateForDossier(prev => prev ? { ...prev, stage } : null);
          }}
          onStartInterview={(session) => {
            setSelectedCandidateForDossier(null);
            onStartInterview(session);
          }}
          onScheduleInterview={(cid) => {
            setSelectedCandidateForDossier(null);
            onScheduleInterview(cid);
          }}
        />
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CandidateCompareModal
          candidates={comparedCandidates}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </div>
  );
};
