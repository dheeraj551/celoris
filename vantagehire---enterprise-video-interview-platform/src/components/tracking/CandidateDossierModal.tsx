import React, { useState } from 'react';
import { 
  Candidate, 
  CandidateStage, 
  InterviewSession, 
  RecommendationType, 
  RubricCategory 
} from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar, 
  FileCheck, 
  Sparkles, 
  ChevronRight, 
  Video, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  X
} from 'lucide-react';

interface CandidateDossierModalProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdateStage: (candidateId: string, newStage: CandidateStage) => void;
  onStartInterview: (session: InterviewSession) => void;
  onScheduleInterview: (candidateId: string) => void;
}

export const CandidateDossierModal: React.FC<CandidateDossierModalProps> = ({
  candidate,
  onClose,
  onUpdateStage,
  onStartInterview,
  onScheduleInterview,
}) => {
  const [activeTab, setActiveTab] = useState<'scorecards' | 'resume' | 'timeline'>('scorecards');

  const STAGE_LABELS: Record<CandidateStage, string> = {
    applied: 'Initial Application',
    screening: 'Recruiter Screening',
    tech_screen: 'Technical Coding',
    system_design: 'System Architecture',
    culture_fit: 'Culture & Leadership',
    executive_review: 'Hiring Committee Debrief',
    offer_extended: 'Offer Extended',
    hired: 'Hired / Closed',
    rejected: 'Archived / Rejected',
  };

  const completedSessions = candidate.interviewSessions.filter(s => s.scorecard);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] border border-emerald-950/70 border-t-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden text-slate-200 relative">
        
        {/* Top Profile Header matching Header styling */}
        <div className="p-5 sm:p-6 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
          <div className="flex items-start gap-4">
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-wide">{candidate.name}</h2>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  {candidate.targetLevel}
                </span>
                {candidate.recommendation && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    candidate.recommendation.includes('Hire') && !candidate.recommendation.includes('No')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {candidate.recommendation}
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-emerald-300 mt-0.5">
                {candidate.role} · {candidate.department}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-400/80 mt-2 font-mono">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{candidate.currentCompany} ({candidate.yearsExperience}y exp)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{candidate.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stage Controls */}
          <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono">Pipeline Stage:</span>
              <select
                value={candidate.stage}
                onChange={(e) => onUpdateStage(candidate.id, e.target.value as CandidateStage)}
                className="bg-[#0c120f] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-200 focus:outline-none focus:border-emerald-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                {Object.entries(STAGE_LABELS).map(([key, label]) => (
                  <option key={key} value={key} className="bg-[#0c120f] text-emerald-200">{label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onScheduleInterview(candidate.id)}
                className="btn-metallic-emerald px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              >
                Schedule Next Round
              </button>
              <button
                onClick={onClose}
                className="btn-metallic px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Dossier Tabs (MacBook Style Segmented Control matching Header) */}
        <div className="px-6 py-2.5 border-b border-emerald-950/70 bg-[#08100c]/80 flex items-center">
          <div className="flex rounded-lg bg-[#0c120f] p-1 text-xs font-medium border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setActiveTab('scorecards')}
              className={`py-1.5 px-3.5 rounded-md font-medium transition-all ${
                activeTab === 'scorecards'
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Calibrated Scorecards ({completedSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`py-1.5 px-3.5 rounded-md font-medium transition-all ${
                activeTab === 'resume'
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Candidate Competencies
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-1.5 px-3.5 rounded-md font-medium transition-all ${
                activeTab === 'timeline'
                  ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              Interview History ({candidate.interviewSessions.length})
            </button>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#040806]">
          {activeTab === 'scorecards' && (
            <div className="space-y-5">
              {completedSessions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-emerald-950/80 rounded-2xl bg-[#060a08]/60">
                  <FileCheck className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-300">No evaluated scorecards yet</p>
                  <p className="text-xs text-emerald-600 mt-1 font-mono">
                    Conduct a live interview or submit an evaluation to populate calibrated scoring metrics.
                  </p>
                </div>
              ) : (
                completedSessions.map(session => {
                  const sc = session.scorecard!;
                  return (
                    <div key={session.id} className="p-5 metallic-card rounded-2xl border border-emerald-950/80 space-y-4 shadow-lg">
                      {/* Scorecard Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {session.roundType} Round Scorecard
                            </h4>
                            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.2)]">
                              ★ {sc.overallScore} / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-emerald-400/70 mt-0.5 font-mono">
                            Evaluated by {sc.interviewerName} ({sc.interviewerRole}) · {new Date(sc.submittedAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                          sc.recommendation.includes('Hire') && !sc.recommendation.includes('No')
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          Recommendation: {sc.recommendation}
                        </span>
                      </div>

                      {/* Executive Summary */}
                      <div className="text-xs text-emerald-100 bg-[#050907] p-3.5 rounded-xl border border-emerald-500/20 leading-relaxed shadow-inner">
                        <span className="font-bold text-emerald-400 block mb-1 font-mono">Hiring Committee Synthesis:</span>
                        {sc.executiveSummary}
                      </div>

                      {/* Strengths & Concerns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                          <span className="font-bold text-emerald-400 block mb-1.5 font-mono">Observed Strengths</span>
                          <ul className="space-y-1 text-emerald-200/90 list-disc list-inside">
                            {sc.strengths.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-xl">
                          <span className="font-bold text-amber-400 block mb-1.5 font-mono">Concerns & Probing Areas</span>
                          <ul className="space-y-1 text-amber-200/90 list-disc list-inside">
                            {sc.concerns.length > 0 ? (
                              sc.concerns.map((cn, i) => <li key={i}>{cn}</li>)
                            ) : (
                              <li className="text-emerald-700 italic">No significant concerns flagged.</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Rubric Category Breakdown */}
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block mb-2 font-mono">
                          Competency Rating Breakdown
                        </span>
                        <div className="space-y-2">
                          {sc.rubricBreakdown.map(r => (
                            <div key={r.id} className="p-3 bg-[#050907] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-bold text-white">{r.name}</p>
                                {r.rationale && (
                                   <p className="text-[11px] text-emerald-400/60 mt-0.5">{r.rationale}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-mono text-emerald-600 text-[11px]">wt: {r.weight}%</span>
                                <span className="font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {r.score} / 5
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-5 text-xs">
              <div>
                <span className="font-bold text-emerald-300 block mb-2 font-mono">Verified Skill Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 metallic-badge rounded-lg font-mono text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-emerald-300 block mb-2 font-mono">Work History & Technical Milestones</span>
                <div className="space-y-2">
                  {candidate.resumeHighlights.map((hl, idx) => (
                    <div key={idx} className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 text-emerald-100 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-emerald-400 font-mono text-xs mt-0.5 font-bold">#{idx + 1}</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3 text-xs">
              {candidate.interviewSessions.map((session, idx) => (
                <div key={session.id} className="p-3.5 metallic-card rounded-xl border border-emerald-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center font-bold text-emerald-400 font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{session.roundType} Round</h4>
                      <p className="text-[11px] text-emerald-400/70 font-mono">
                        {session.scheduledDate} at {session.startTime} · {session.panelists.map(p => p.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                      {session.status}
                    </span>
                    <button
                      onClick={() => onStartInterview(session)}
                      className="btn-metallic px-3 py-1.5 rounded-lg font-bold"
                    >
                      Open Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
