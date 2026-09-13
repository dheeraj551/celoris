import React, { useState } from 'react';
import { X, Sparkles, Compass, Lightbulb, Bot, Check, ArrowRight } from 'lucide-react';
import { DiscussionTopic } from '../types';
import { SEED_TOPICS } from '../data/cafeData';

interface GuidedTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: DiscussionTopic) => void;
  activeTableName: string;
}

export const GuidedTopicModal: React.FC<GuidedTopicModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  activeTableName,
}) => {
  const [activeTab, setActiveTab] = useState<'curated' | 'ai_generate'>('ai_generate');
  const [selectedTopic, setSelectedTopic] = useState<DiscussionTopic>(SEED_TOPICS[0]);
  const [aiCategory, setAiCategory] = useState('Daily Life & Curiosity');
  const [aiMood, setAiMood] = useState('Warm, thoughtful, and accessible to anyone');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cafe/discussion-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: aiCategory, mood: aiMood }),
      });
      const data = await res.json();
      if (data.topic) {
        setSelectedTopic(data.topic);
      }
    } catch (err) {
      console.error('Failed to generate AI topic:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    onSelectTopic(selectedTopic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        id="guided-topic-modal"
        className="bg-stone-900 border border-stone-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100 p-5 sm:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-sm border border-amber-300/30">
              🎙️
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">
                Host a Guided Discussion
              </h2>
              <p className="text-xs text-stone-400">
                Guide conversation at <strong className="text-amber-200">{activeTableName}</strong> with thoughtful questions
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

        {/* Tab switch: AI Generator vs Curated */}
        <div className="flex items-center gap-2 p-1 bg-black/30 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('ai_generate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ai_generate'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Generate with AI Barista (Gemini)</span>
          </button>

          <button
            onClick={() => setActiveTab('curated')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'curated'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Topics Library</span>
          </button>
        </div>

        {/* Tab 1: AI Generator */}
        {activeTab === 'ai_generate' && (
          <div className="space-y-4 p-4 rounded-2xl bg-black/30 border border-amber-500/20">
            <div className="text-xs text-amber-200/90 leading-relaxed">
              Ask our server-side Gemini intelligence to brew a personalized discussion card tailored to the mood of your table:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-300">Category / Interest</label>
                <input
                  type="text"
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  placeholder="e.g., Creative Arts, Philosophy, Book Club"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-300">Desired Vibe / Atmosphere</label>
                <input
                  type="text"
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                  placeholder="e.g., Nostalgic, deep, witty, inspiring"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              id="generate-ai-discussion-btn"
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>{isGenerating ? 'Barista AI is brewing a fresh topic...' : 'Generate New Discussion Topic with Gemini'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Curated Seed Topics */}
        {activeTab === 'curated' && (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {SEED_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-600/30 border-amber-500 text-white shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold mb-1">
                    <span>{topic.category}</span>
                    <span>Hosted by {topic.hostedBy}</span>
                  </div>
                  <div className="font-bold text-xs text-amber-100 mb-1">{topic.title}</div>
                  <div className="text-[11px] text-stone-400 line-clamp-2">{topic.prompt}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Topic Preview Card */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Selected Topic Preview</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedTopic.category}
            </span>
          </div>

          <h3 className="font-serif text-sm sm:text-base font-bold text-amber-100">
            {selectedTopic.title}
          </h3>

          <p className="text-xs text-stone-200 italic leading-relaxed">
            "{selectedTopic.prompt}"
          </p>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <div className="text-[10px] font-semibold text-stone-400">Included Starter Prompts:</div>
            <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
              {selectedTopic.starterQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300"
          >
            Cancel
          </button>
          <button
            id="start-discussion-at-table-btn"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/40 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Launch Discussion at Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
