import React from 'react';
import { Candidate, RubricCategory } from '../types';
import { Check, X, Award, BarChart2 } from 'lucide-react';

interface CandidateCompareModalProps {
  candidates: Candidate[];
  onClose: () => void;
}

export const CandidateCompareModal: React.FC<CandidateCompareModalProps> = ({
  candidates,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-gradient-to-b from-[#0e1712] via-[#070e0a] to-[#040806] border border-emerald-950/70 border-t-white/20 rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden text-slate-200">
        
        {/* Header matching main Header style */}
        <div className="h-16 px-6 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Hiring Committee Candidate Calibration Matrix</h3>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Consensus Tool
                </span>
              </div>
              <p className="text-xs text-emerald-400/80 font-mono">
                Side-by-side comparative rubric evaluation across short-listed finalists
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-metallic text-xs px-3.5 py-1.5 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#040806]">
          <div className={`grid grid-cols-${candidates.length + 1} gap-4`}>
            {/* Criteria Column */}
            <div className="space-y-4 pt-16 text-xs text-emerald-400 font-mono font-bold">
              <div className="h-10 flex items-center">Target Role & Level</div>
              <div className="h-10 flex items-center">Years of Experience</div>
              <div className="h-10 flex items-center">Current Pipeline Stage</div>
              <div className="h-10 flex items-center">Overall Calibrated Score</div>
              <div className="h-10 flex items-center">Panel Recommendation</div>
              <div className="h-20 flex items-start pt-2">Core Technical Strengths</div>
            </div>

            {/* Candidate Columns */}
            {candidates.map((c) => (
              <div key={c.id} className="p-4 metallic-card rounded-2xl border border-emerald-950/80 space-y-4 text-xs shadow-lg">
                {/* Candidate Card Header */}
                <div className="flex items-center gap-3 h-12">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                  />
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-[11px] text-emerald-500 font-mono">{c.currentCompany}</p>
                  </div>
                </div>

                {/* Rows matching criteria */}
                <div className="h-10 flex items-center font-bold text-white">
                  {c.role} ({c.targetLevel})
                </div>

                <div className="h-10 flex items-center font-mono text-emerald-300">
                  {c.yearsExperience} Years Professional
                </div>

                <div className="h-10 flex items-center font-mono text-emerald-400 capitalize">
                  {c.stage.replace('_', ' ')}
                </div>

                <div className="h-10 flex items-center">
                  <span className="font-mono font-bold text-sm bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    ★ {c.overallScore || '4.0'} / 5.0
                  </span>
                </div>

                <div className="h-10 flex items-center">
                  <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                    c.recommendation && c.recommendation.includes('Hire') && !c.recommendation.includes('No')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {c.recommendation || 'Pending'}
                  </span>
                </div>

                <div className="h-20 flex items-start pt-1 text-[11px] text-emerald-200/90 leading-relaxed overflow-y-auto">
                  <ul className="space-y-1 list-disc list-inside">
                    {c.skills.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
