import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  video: Video;
}

export const VideoQuizTab: React.FC<Props> = ({ video }) => {
  const { seekToTime } = useApp();
  const quizzes = video.quizzes || [];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  if (quizzes.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0e121e]/40 border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
        <p className="font-semibold text-white">No Formal Quizzes for this Lecture</p>
        <p className="mt-1">Check back later or explore the Q&A section to test your understanding.</p>
      </div>
    );
  }

  const handleSelect = (quizId: string, optionIdx: number) => {
    if (submitted[quizId]) return;
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = (quizId: string, correctIdx: number) => {
    if (selectedAnswers[quizId] === undefined) return;
    setSubmitted(prev => ({ ...prev, [quizId]: true }));

    if (selectedAnswers[quizId] === correctIdx) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleReset = (quizId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[quizId];
      return copy;
    });
    setSubmitted(prev => {
      const copy = { ...prev };
      delete copy[quizId];
      return copy;
    });
  };

  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-4 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Interactive Lecture Checkpoints ({quizzes.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify your retention of fundamental proofs, theorems, and algorithmic bounds.
        </p>
      </div>

      <div className="space-y-5">
        {quizzes.map((quiz, qIdx) => {
          const isDone = submitted[quiz.id];
          const selected = selectedAnswers[quiz.id];
          const isCorrect = isDone && selected === quiz.correctIndex;

          return (
            <div
              key={quiz.id}
              className={`p-5 rounded-2xl border transition-all backdrop-blur-md ${
                isDone
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5'
                  : 'bg-[#0e121e]/85 border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Question {qIdx + 1}
                </span>
                <button
                  onClick={() => seekToTime(quiz.timestamp)}
                  className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Anchor: {formatTime(quiz.timestamp)}
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-4 leading-snug">
                {quiz.question}
              </h4>

              <div className="space-y-2 mb-4">
                {quiz.options.map((opt, idx) => {
                  const isOptSelected = selected === idx;
                  const isOptCorrect = isDone && idx === quiz.correctIndex;
                  const isOptWrong = isDone && isOptSelected && idx !== quiz.correctIndex;

                  let style = 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.03]';
                  if (isOptSelected && !isDone) {
                    style = 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10';
                  } else if (isOptCorrect) {
                    style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                  } else if (isOptWrong) {
                    style = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isDone}
                      onClick={() => handleSelect(quiz.id, idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 text-slate-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isOptCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {isOptWrong && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isDone && (
                <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl mb-4 text-xs text-slate-300">
                  <strong className={`block mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect'}
                  </strong>
                  {quiz.explanation}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                {isDone ? (
                  <button
                    onClick={() => handleReset(quiz.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retry
                  </button>
                ) : (
                  <button
                    disabled={selected === undefined}
                    onClick={() => handleSubmitQuiz(quiz.id, quiz.correctIndex)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Check Answer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
