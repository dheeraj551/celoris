import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  HelpCircle,
  TrendingUp,
  FileText,
  Clock,
  Send
} from 'lucide-react';
import { RubricCategory, ScorecardEvaluation, RecommendationType } from '../../types';

interface ScorecardDockProps {
  rubrics: RubricCategory[];
  onUpdateRubrics: (rubrics: RubricCategory[]) => void;
  candidateName: string;
  role: string;
  roundType: string;
  onSaveEvaluation: (evaluation: ScorecardEvaluation) => void;
  existingEvaluation?: ScorecardEvaluation;
  transcriptSnippets?: { speaker: string; text: string; timestamp: string }[];
}

export const ScorecardDock: React.FC<ScorecardDockProps> = ({
  rubrics,
  onUpdateRubrics,
  candidateName,
  role,
  roundType,
  onSaveEvaluation,
  existingEvaluation,
  transcriptSnippets = []
}) => {
  const [notes, setNotes] = useState(existingEvaluation?.notes || '');
  const [recommendation, setRecommendation] = useState<RecommendationType>(
    existingEvaluation?.recommendation || 'Hire'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(existingEvaluation || null);
  const [quickTagAdded, setQuickTagAdded] = useState('');

  const totalWeight = rubrics.reduce((sum, r) => sum + r.weight, 0);
  const weightedScore = (
    rubrics.reduce((sum, r) => sum + r.score * r.weight, 0) / (totalWeight || 100)
  ).toFixed(1);

  const handleScoreChange = (id: string, newScore: number) => {
    const updated = rubrics.map(r => r.id === id ? { ...r, score: newScore } : r);
    onUpdateRubrics(updated);
  };

  const addQuickTag = (tag: string) => {
    const prefix = notes ? notes + '\n' : '';
    setNotes(`${prefix}[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${tag}`);
    setQuickTagAdded(tag);
    setTimeout(() => setQuickTagAdded(''), 2000);
  };

  const handleTriggerAiEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          role,
          round: roundType,
          rubrics,
          notes,
          transcript: transcriptSnippets.slice(-10),
          durationMinutes: 45
        })
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        setAiAnalysis(data.evaluation);
        if (data.evaluation.recommendation) {
          setRecommendation(data.evaluation.recommendation);
        }
        if (data.evaluation.rubricBreakdown && Array.isArray(data.evaluation.rubricBreakdown)) {
          const merged = rubrics.map(localR => {
            const found = data.evaluation.rubricBreakdown.find((aiR: any) => 
              aiR.category?.toLowerCase().includes(localR.name.substring(0, 10).toLowerCase()) ||
              localR.name.toLowerCase().includes(aiR.category?.substring(0, 10).toLowerCase())
            );
            return found ? { ...localR, score: Math.round(found.score) } : localR;
          });
          onUpdateRubrics(merged);
        }
      }
    } catch (err) {
      console.error('Failed to trigger AI rubric evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSave = () => {
    const evaluation: ScorecardEvaluation = {
      id: existingEvaluation?.id || `sc-${Date.now()}`,
      interviewId: 'int-active',
      candidateId: 'cand-active',
      interviewerName: 'Sarah Chen',
      interviewerRole: 'Lead Interviewer & Bar Raiser',
      submittedAt: new Date().toISOString(),
      overallScore: parseFloat(weightedScore),
      recommendation,
      executiveSummary: aiAnalysis?.executiveSummary || `${candidateName} evaluated across ${rubrics.length} core technical competencies for the ${role} position.`,
      strengths: aiAnalysis?.strengths || [
        'Strong clarity in system constraints and trade-off verbalization',
        'Demonstrated production empathy in failure domain mitigation'
      ],
      concerns: aiAnalysis?.concerns || [
        'Would probe deeper into cross-region replication latency guarantees in debrief'
      ],
      rubricBreakdown: rubrics,
      calibrationNotes: aiAnalysis?.calibrationNotes || 'Scorecard submitted for hiring committee review.',
      notes
    };

    onSaveEvaluation(evaluation);
  };

  return (
    <div className="h-full flex flex-col bg-[#060b08] border-l border-emerald-950/60 text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-emerald-950/80 bg-[#08100c]/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white">Live Rubric & Calibration</h3>
            <span className="text-[11px] text-emerald-700">·</span>
            <span className="text-xs text-emerald-400 font-mono font-bold drop-shadow-[0_0_6px_#10b981]">
              ★ {weightedScore} / 5.0
            </span>
          </div>
          <p className="text-xs text-emerald-400/70 truncate max-w-[260px] font-mono mt-0.5">
            {candidateName} · {roundType}
          </p>
        </div>

        {/* Metallic AI Score Synth Button */}
        <button
          onClick={handleTriggerAiEvaluation}
          disabled={isEvaluating}
          className="btn-metallic flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
          title="Automated interview scoring synthesis using calibrated AI"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isEvaluating ? 'animate-spin' : ''}`} />
          <span>{isEvaluating ? 'Calibrating...' : 'AI Score Synth'}</span>
        </button>
      </div>

      {/* Scrollable Rubric Dimensions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Observations */}
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 block mb-1.5">
            Quick Observations
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              '+ Strong Arch Scoping',
              '+ Optimal Complexity',
              '+ Clear Tradeoffs',
              '- Overlooked Timeout',
              '+ Receptive to Hints',
              '- Missed Edge Case'
            ].map(tag => (
              <button
                key={tag}
                onClick={() => addQuickTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-mono border transition-all ${
                  tag.startsWith('+')
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                    : 'bg-amber-950/50 text-amber-300 border-amber-600/40 hover:bg-amber-900/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Rubrics List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Evaluation Dimensions</span>
            <span>Total: 100%</span>
          </div>

          {rubrics.map((category) => (
            <div 
              key={category.id} 
              className="p-3.5 bg-[#09120e] rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="text-xs font-bold text-emerald-100">{category.name}</h4>
                  <p className="text-[11px] text-emerald-400/60 leading-relaxed mt-0.5">{category.description}</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                  {category.weight}%
                </span>
              </div>

              {/* Metallic 1-5 Rating Selector */}
              <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-white/5">
                <span className="text-[11px] text-emerald-400/80 font-mono">Rating:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const isSelected = category.score === level;
                    const labels = ['Unacceptable', 'Below Bar', 'Meets Bar', 'Exceeds Bar', 'Outstanding'];
                    return (
                      <button
                        key={level}
                        onClick={() => handleScoreChange(category.id, level)}
                        title={`${level}/5: ${labels[level - 1]}`}
                        className={`w-7 h-7 text-xs font-mono font-bold rounded-lg transition-all ${
                          isSelected
                            ? 'btn-metallic-emerald text-white shadow-[0_0_12px_#10b981]'
                            : 'btn-metallic text-emerald-300/70 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Synthesis Card */}
        {aiAnalysis && (
          <div className="p-4 bg-gradient-to-b from-[#0e1f16] to-[#09140f] border border-emerald-500/40 rounded-xl space-y-2.5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
                <span className="text-xs font-bold text-white">Automated Scoring Synthesis</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                Calibrated: {aiAnalysis.overallScore || weightedScore} / 5.0
              </span>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {aiAnalysis.executiveSummary}
            </p>

            {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
              <div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400 block mb-1">Key Strengths</span>
                <ul className="text-xs text-emerald-200/80 space-y-1 list-disc list-inside font-sans">
                  {aiAnalysis.strengths.map((s: string, idx: number) => (
                    <li key={idx} className="leading-snug">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.concerns && aiAnalysis.concerns.length > 0 && (
              <div>
                <span className="text-[11px] font-mono font-semibold text-amber-400 block mb-1">Debrief Probes & Flags</span>
                <ul className="text-xs text-amber-200/80 space-y-1 list-disc list-inside font-sans">
                  {aiAnalysis.concerns.map((c: string, idx: number) => (
                    <li key={idx} className="leading-snug">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Panelist Notes */}
        <div>
          <label className="text-xs font-semibold text-emerald-200 block mb-1">
            Panelist Notes & Evidence
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Document concrete architectural rationale, candidate responses, and trade-off discussions..."
            className="w-full text-xs bg-[#09120e] border border-white/10 rounded-xl p-3 text-emerald-100 placeholder-emerald-700/60 focus:outline-none focus:border-emerald-500 font-sans shadow-inner"
          />
        </div>

        {/* Final Recommendation Selector */}
        <div>
          <label className="text-xs font-semibold text-emerald-200 block mb-1.5 font-mono">
            Hiring Recommendation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Strong Hire', 'Hire', 'Leaning Hire', 'Leaning No Hire', 'Strong No Hire'] as RecommendationType[]).map((rec) => {
              const isSelected = recommendation === rec;
              return (
                <button
                  key={rec}
                  onClick={() => setRecommendation(rec)}
                  className={`text-xs py-2 px-2.5 rounded-lg font-bold text-center transition-all ${
                    isSelected
                      ? rec.includes('Hire') && !rec.includes('No')
                        ? 'btn-metallic-emerald text-white shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                        : 'bg-rose-900 text-white border border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.4)]'
                      : 'btn-metallic text-emerald-300/80'
                  }`}
                >
                  {rec}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Submit Button */}
      <div className="p-3.5 border-t border-emerald-950/80 bg-[#070e0b] flex items-center justify-between">
        <div className="text-[11px] text-emerald-400 font-mono">
          Status: <span className="text-emerald-300 font-bold">Drafting</span>
        </div>
        <button
          onClick={handleSave}
          className="btn-metallic-emerald flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.4)]"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save & Submit Scorecard</span>
        </button>
      </div>
    </div>
  );
};
