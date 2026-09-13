import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, Coffee } from 'lucide-react';
import { UserProfile } from './types';

interface AskBaristaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeTableName: string;
}

export const AskBaristaModal: React.FC<AskBaristaModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeTableName,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/social/chat-cafe/barista-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          userContext: {
            name: currentUser.name,
            currentDrink: currentUser.currentDrink,
            table: activeTableName,
          },
        }),
      });
      const data = await res.json();
      setReply(data.reply || 'Enjoy your calm moments at the café!');
    } catch (err) {
      setReply("Nora's coffee grinder is buzzing loudly! Take three slow sips of your drink and be kind to yourself today.");
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Recommend a drink for a rainy afternoon ☕',
    'Give us a wholesome icebreaker for our table 💡',
    'A calming quote to reset my busy mind 🌿',
    'What makes a digital cafe feel like home? ✨',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        id="ask-barista-modal"
        className="bg-stone-900 border border-stone-700/80 rounded-3xl w-full max-w-lg shadow-2xl text-stone-100 p-5 sm:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30">
              ☕
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">
                Ask Barista Nora
              </h2>
              <p className="text-xs text-stone-400">
                AI Café Host for coffee wisdom, icebreakers & warm encouragement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-stone-400">Popular Barista Prompts:</div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestion(q);
                  handleAsk(q);
                }}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 hover:text-amber-200 hover:border-amber-600/40 text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask Nora anything..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || isLoading}
            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* Barista Reply Bubble */}
        {reply && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-1 text-xs leading-relaxed text-amber-100">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🐱 Barista Nora:</span>
            </div>
            <p className="italic">{reply}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
