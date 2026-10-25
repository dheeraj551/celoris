import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronRight, 
  CheckCircle, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { InterviewQuestion } from '../../types';

interface QuestionBankProps {
  questions: InterviewQuestion[];
  onAskQuestion: (question: InterviewQuestion) => void;
  onInjectCode?: (code: string, language: string) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onAskQuestion,
  onInjectCode
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id || '');
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || questions[0];

  const handleAsk = (q: InterviewQuestion) => {
    if (!askedQuestionIds.includes(q.id)) {
      setAskedQuestionIds(prev => [...prev, q.id]);
    }
    onAskQuestion(q);
    if (q.starterCode && onInjectCode) {
      onInjectCode(q.starterCode.code, q.starterCode.language);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050a07] border-l border-emerald-950/70 text-slate-200">
      <div className="p-3.5 border-b border-emerald-950/80 bg-[#07100c]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Calibrated Question Guide</h3>
        </div>
        <p className="text-xs text-emerald-400/70 mt-0.5">
          Standardized interview prompts & expected evaluation criteria
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left mini list */}
        <div className="w-48 border-r border-emerald-950/80 overflow-y-auto p-2 space-y-1 bg-[#040806]">
          {questions.map((q) => {
            const isSelected = q.id === selectedQuestionId;
            const isAsked = askedQuestionIds.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all relative ${
                  isSelected
                    ? 'btn-metallic-emerald text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-emerald-300/70 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-300">
                    {q.category.replace('_', ' ')}
                  </span>
                  {isAsked && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" title="Asked in session" />
                  )}
                </div>
                <div className="font-bold truncate text-white mt-1">
                  {q.title}
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                  Level: {q.difficulty}
                </div>
              </button>
            );
          })}
        </div>

        {/* Question Details */}
        {selectedQuestion && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050a07]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  {selectedQuestion.category.replace('_', ' ')} · {selectedQuestion.difficulty} Level
                </span>
                {askedQuestionIds.includes(selectedQuestion.id) && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Asked</span>
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                {selectedQuestion.title}
              </h4>
            </div>

            {/* Prompt Card */}
            <div className="p-3.5 bg-[#09120e] rounded-xl border border-emerald-500/20 text-xs text-emerald-100 leading-relaxed font-sans shadow-md">
              {selectedQuestion.prompt}
            </div>

            {/* Expected Criteria */}
            <div>
              <h5 className="text-xs font-bold text-emerald-300 mb-1.5 font-mono">
                Target Competency Criteria
              </h5>
              <ul className="space-y-1.5 text-xs text-emerald-200/80">
                {selectedQuestion.evaluationCriteria.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-[10px] mt-0.5">•</span>
                    <span className="leading-snug">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Probing Questions */}
            {selectedQuestion.probeQuestions && selectedQuestion.probeQuestions.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-emerald-300 mb-1.5 font-mono">
                  Follow-up Probes
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-400/70 italic">
                  {selectedQuestion.probeQuestions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-mono text-[10px] mt-0.5">↳</span>
                      <span className="leading-snug">"{p}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metallic CTA to pose question to call */}
            <div className="pt-2">
              <button
                onClick={() => handleAsk(selectedQuestion)}
                className="btn-metallic-emerald w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Pose Question to Candidate & Load Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
