import React, { useState } from 'react';
import { 
  BarChart3, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  Award, 
  Users,
  Save,
  RotateCcw
} from 'lucide-react';
import { RubricCategory } from '../types';

interface ScoringAnalyticsProps {
  rubrics: RubricCategory[];
  onSaveRubricWeights: (rubrics: RubricCategory[]) => void;
}

export const ScoringAnalytics: React.FC<ScoringAnalyticsProps> = ({
  rubrics,
  onSaveRubricWeights,
}) => {
  const [editableRubrics, setEditableRubrics] = useState<RubricCategory[]>(rubrics);
  const [isSaved, setIsSaved] = useState(false);

  const handleWeightChange = (id: string, weight: number) => {
    setEditableRubrics(prev => prev.map(r => r.id === id ? { ...r, weight } : r));
  };

  const handleSave = () => {
    onSaveRubricWeights(editableRubrics);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const totalWeight = editableRubrics.reduce((acc, r) => acc + r.weight, 0);

  return (
    <div className="flex-1 flex flex-col bg-[#030705] overflow-y-auto p-4 sm:p-6 text-slate-200 relative select-none">
      {/* Background emerald aurora */}
      <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none animate-aurora" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Rubrics, Scoring Calibration & Hiring Analytics
            </h2>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              Bar Raiser Math
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mt-1">
            <span>Standardized Hiring Bar</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Objective Competency Weights</span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Interviewer Variance Normalization</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={totalWeight !== 100}
          className="btn-metallic-emerald flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold disabled:opacity-50 shadow-[0_0_16px_rgba(16,185,129,0.4)]"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Rubrics Saved!' : 'Save Rubric Calibration'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        {/* Left 2 Cols: Enterprise Rubric Dimension Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 metallic-card rounded-2xl border border-emerald-950/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-4">
              <div>
                <h3 className="font-bold text-sm text-white">Core Evaluation Rubrics</h3>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  Configure weighted scoring dimensions for technical and executive interview rounds.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-mono">Total Allocation:</span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  totalWeight === 100 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {totalWeight}% / 100%
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {editableRubrics.map((category) => (
                <div key={category.id} className="p-4 bg-[#060b08] rounded-xl border border-emerald-950/70 space-y-2.5 shadow-inner">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-xs text-white">{category.name}</h4>
                      <p className="text-[11px] text-emerald-400/70 leading-relaxed mt-0.5">{category.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="text-xs text-emerald-400">Weight:</span>
                      <input
                        type="number"
                        min={5}
                        max={60}
                        step={5}
                        value={category.weight}
                        onChange={(e) => handleWeightChange(category.id, parseInt(e.target.value) || 0)}
                        className="w-16 metallic-input rounded-lg p-1 text-xs text-center font-mono font-bold text-emerald-300 focus:outline-none"
                      />
                      <span className="text-xs text-emerald-500 font-bold">%</span>
                    </div>
                  </div>

                  {/* Weight progress bar with emerald glow */}
                  <div className="w-full h-1.5 bg-[#08120d] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_6px_#10b981] transition-all duration-300"
                      style={{ width: `${category.weight * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibrated AI Scoring Methodology Card */}
          <div className="p-5 bg-gradient-to-b from-[#0c1812] to-[#060c09] rounded-2xl border border-emerald-500/30 text-xs space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
              <span>Automated Scoring Engine Calibration Methodology</span>
            </div>
            <p className="text-emerald-300/80 leading-relaxed font-sans">
              Celoris VantageHire computes scores using continuous Bayesian aggregation across live interviewer ratings, prompt complexity vectors, and conversational trade-off depth. Outliers &plusmn; 1.5 standard deviations from team consensus trigger automatic debrief flags.
            </p>
          </div>
        </div>

        {/* Right Col: Team Metrics & Calibration Insights */}
        <div className="space-y-4">
          {/* Key Hiring Metrics */}
          <div className="p-5 metallic-card rounded-2xl border border-emerald-950/80 space-y-3.5 text-xs shadow-xl">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Q4 Pipeline Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/60 shadow-inner">
                <span className="text-emerald-500 block text-[10px] font-mono">Avg Tech Score</span>
                <span className="font-mono font-bold text-lg text-emerald-300 drop-shadow-[0_0_6px_#10b981]">★ 4.3</span>
              </div>
              <div className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/60 shadow-inner">
                <span className="text-emerald-500 block text-[10px] font-mono">Hire Recommendation</span>
                <span className="font-mono font-bold text-lg text-emerald-400 drop-shadow-[0_0_6px_#10b981]">71%</span>
              </div>
              <div className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/60 shadow-inner">
                <span className="text-emerald-500 block text-[10px] font-mono">Interviewer Variance</span>
                <span className="font-mono font-bold text-base text-white">0.24 σ</span>
              </div>
              <div className="p-3 bg-[#060b08] rounded-xl border border-emerald-950/60 shadow-inner">
                <span className="text-emerald-500 block text-[10px] font-mono">Debrief Turnaround</span>
                <span className="font-mono font-bold text-base text-white">&lt; 18h</span>
              </div>
            </div>
          </div>

          {/* Dimension Performance Breakdown */}
          <div className="p-5 metallic-card rounded-2xl border border-emerald-950/80 space-y-3.5 text-xs shadow-xl">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Competency Performance
            </h3>
            <div className="space-y-3">
              {[
                { label: 'System Architecture', score: 4.4 },
                { label: 'Algorithmic Problem Solving', score: 4.1 },
                { label: 'Technical Communication', score: 4.6 },
                { label: 'Operational Resilience', score: 3.9 },
                { label: 'Enterprise Alignment', score: 4.5 },
              ].map(dim => (
                <div key={dim.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-200">{dim.label}</span>
                    <span className="font-mono font-bold text-emerald-300">{dim.score} / 5.0</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#060b08] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_4px_#10b981]" 
                      style={{ width: `${(dim.score / 5) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
