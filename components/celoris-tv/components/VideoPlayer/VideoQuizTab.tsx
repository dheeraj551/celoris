import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, Sparkles, HelpCircle, RotateCcw } from 'lucide-react';

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
      <div className="p-8 text-center bg-[#161B16]/60 border border-[#242A24] rounded-2xl text-[#95A395] text-xs">
        <Sparkles className="w-8 h-8 text-[#7F9172] mx-auto mb-2 opacity-60" />
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
    <div className="space-y-6 text-[#E0E5E0]">
      <div className="p-4 bg-[#161B16] border border-[#242A24] rounded-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7F9172]" />
          Interactive Lecture Checkpoints ({quizzes.length})
        </h3>
        <p className="text-xs text-[#95A395] mt-0.5">
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
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? isCorrect
                    ? 'bg-[#18261A] border-[#5C8A67]/50'
                    : 'bg-[#291717] border-[#C87D55]/50'
                  : 'bg-[#161B16] border-[#242A24]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#A8B89C] uppercase tracking-wider">
                  Question {qIdx + 1}
                </span>
                <button
                  onClick={() => seekToTime(quiz.timestamp)}
                  className="text-xs font-mono text-[#95A395] hover:text-[#A8B89C] transition-colors"
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

                  let style = 'bg-[#121512] border-[#242A24] text-[#E0E5E0] hover:border-[#2E382E]';
                  if (isOptSelected && !isDone) {
                    style = 'bg-[#1E261E] border-[#7F9172] text-white';
                  } else if (isOptCorrect) {
                    style = 'bg-[#18261A] border-[#5C8A67] text-[#C4E3C9]';
                  } else if (isOptWrong) {
                    style = 'bg-[#291717] border-[#C87D55] text-[#F3C5B5]';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isDone}
                      onClick={() => handleSelect(quiz.id, idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-[#2E382E] flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isOptCorrect && <CheckCircle2 className="w-4 h-4 text-[#5C8A67] flex-shrink-0" />}
                      {isOptWrong && <AlertCircle className="w-4 h-4 text-[#C87D55] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isDone && (
                <div className="p-3.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl mb-4 text-xs text-[#E0E5E0]">
                  <strong className="text-white block mb-1">
                    {isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect'}
                  </strong>
                  {quiz.explanation}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                {isDone ? (
                  <button
                    onClick={() => handleReset(quiz.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#95A395] hover:text-white rounded-lg hover:bg-[#1E241E] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retry
                  </button>
                ) : (
                  <button
                    disabled={selected === undefined}
                    onClick={() => handleSubmitQuiz(quiz.id, quiz.correctIndex)}
                    className="px-4 py-2 bg-[#7F9172] hover:bg-[#91A582] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0F0D] text-xs font-bold rounded-xl shadow-md transition-all"
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
