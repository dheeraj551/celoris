import React, { useState } from 'react';
import { Sparkles, Loader2, X, Brain, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { ExamDefinition } from '../types';
import { soundFx } from '../utils/audio';

interface AIExamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamGenerated: (exam: ExamDefinition) => void;
}

export const AIExamGeneratorModal: React.FC<AIExamGeneratorModalProps> = ({
  isOpen,
  onClose,
  onExamGenerated,
}) => {
  const [skillName, setSkillName] = useState('');
  const [industry, setIndustry] = useState('AI / Machine Learning');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleSkills = [
    'Kubernetes Cluster Orchestration',
    'Solidity Smart Contract Audit',
    'Rust High-Performance Systems',
    'LLM RAG & Vector Embeddings',
    'FinTech Payment Idempotency',
    'Healthcare HIPAA Cloud Compliance',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    soundFx.playNotification();

    try {
      const response = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: skillName.trim(),
          industry,
          difficulty,
        }),
      });

      const data = await response.json();
      if (data.success && data.exam) {
        const raw = data.exam;
        const newExam: ExamDefinition = {
          id: `ai-exam-${Date.now()}`,
          skillName: skillName.trim(),
          industry,
          title: raw.title || `${skillName} Certification Exam`,
          description: raw.description || `Validate verified domain competency in ${skillName}.`,
          timeLimitMinutes: raw.timeLimitMinutes || 10,
          passingScorePercent: raw.passingScorePercent || 75,
          xpReward: raw.xpReward || 250,
          badgeTitle: raw.badgeTitle || `${skillName} Specialist`,
          badgeColor: raw.badgeColor || '#6366f1',
          difficulty,
          targetRoleExamples: [`Senior ${skillName} Lead`, `Staff ${skillName} Architect`],
          questions: raw.questions || [],
        };
        soundFx.playCelebration();
        onExamGenerated(newExam);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to generate exam questions. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with AI Exam Generator.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#0c0e17] border border-white/[0.12] rounded-2xl shadow-2xl p-6 text-slate-200 space-y-5">
        
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Custom Skill Exam Builder</h3>
              <p className="text-[11px] text-slate-400">Configure an anti-cheat proctored assessment for any domain skill</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          
          {/* Skill name input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Target Skill / Technology:
            </label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. Distributed Cassandra Databases, PyTorch, React 19 Compiler..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#131622] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-500"
            />
          </div>

          {/* Quick Skill Inspiration Pills */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Popular domains:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkillName(s)}
                  className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] text-slate-300 transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Industry & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Target Industry:</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131622] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Machine Learning / Systems" className="bg-[#131622] text-white">Machine Learning / Systems</option>
                <option value="Cloud & Infrastructure" className="bg-[#131622] text-white">Cloud & Infrastructure</option>
                <option value="FinTech" className="bg-[#131622] text-white">FinTech</option>
                <option value="Cybersecurity" className="bg-[#131622] text-white">Cybersecurity</option>
                <option value="HealthTech" className="bg-[#131622] text-white">HealthTech</option>
                <option value="SaaS / Web Platforms" className="bg-[#131622] text-white">SaaS / Web Platforms</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Difficulty Level:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#131622] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Beginner" className="bg-[#131622] text-white">Beginner (150 XP)</option>
                <option value="Intermediate" className="bg-[#131622] text-white">Intermediate (200 XP)</option>
                <option value="Advanced" className="bg-[#131622] text-white">Advanced (250 XP)</option>
                <option value="Expert" className="bg-[#131622] text-white">Expert (300 XP)</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Anti-cheat notice */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Includes proctored anti-cheat kernel, code questions, and real architectural scenario challenges.</span>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !skillName.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading Assessment Questions...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Build & Launch Exam</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
