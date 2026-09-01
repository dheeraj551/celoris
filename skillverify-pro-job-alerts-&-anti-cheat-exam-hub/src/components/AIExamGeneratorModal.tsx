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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800 space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Custom Skill Exam Builder</h3>
              <p className="text-[11px] text-slate-500">Configure an anti-cheat proctored assessment for any domain skill</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          
          {/* Skill name input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Target Skill / Technology:
            </label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. Distributed Cassandra Databases, PyTorch, React 19 Compiler..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Skill Inspiration Pills */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Popular domains:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkillName(s)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] text-slate-700 transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Industry & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Target Industry:</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Machine Learning / Systems">Machine Learning / Systems</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="FinTech">FinTech</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="HealthTech">HealthTech</option>
                <option value="SaaS / Web Platforms">SaaS / Web Platforms</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Difficulty Level:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Beginner">Beginner (150 XP)</option>
                <option value="Intermediate">Intermediate (200 XP)</option>
                <option value="Advanced">Advanced (250 XP)</option>
                <option value="Expert">Expert (300 XP)</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Anti-cheat notice */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Includes proctored anti-cheat kernel, code questions, and real architectural scenario challenges.</span>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !skillName.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-all"
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
