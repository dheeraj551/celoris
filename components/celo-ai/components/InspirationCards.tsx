import React from 'react';

interface InspirationCardsProps {
  onSelectCard: (prompt: string, tag?: string) => void;
}

export const InspirationCards: React.FC<InspirationCardsProps> = ({ onSelectCard }) => {
  const cards = [
    {
      id: 'android-compose',
      text: 'Explain VLOOKUP with a simple example',
      tag: 'Excel',
      icon: <span className="text-base leading-none select-none">📊</span>,
      prompt: 'Explain how VLOOKUP works in Excel with a simple, beginner-friendly step-by-step example, syntax breakdown, and common use cases.',
    },
    {
      id: 'sheets-automation',
      text: 'Give me 5 practice questions on Instagram ads',
      tag: 'Digital Marketing',
      icon: <span className="text-base leading-none select-none">📣</span>,
      prompt: 'Give me 5 practical, scenario-based practice questions on Instagram ads (covering audience targeting, ad formats, budgeting, ROAS optimization, and metrics) with comprehensive explanations and correct answers.',
    },
    {
      id: 'calendar-triage',
      text: 'How do I remove background in Photoshop?',
      tag: 'Photoshop',
      icon: <span className="text-base leading-none select-none">🎨</span>,
      prompt: 'Provide a clear, step-by-step tutorial on how to remove a background in Adobe Photoshop, including Quick Action (Remove Background), Select Subject & Select and Mask, Pen Tool precision cutout, and best practices for saving transparent PNGs.',
    },
    {
      id: 'sleek-ui',
      text: 'Correct my English sentence for grammar',
      tag: 'Spoken English',
      icon: <span className="text-base leading-none select-none">🗣️</span>,
      prompt: 'Please check and correct the grammar of my English sentences. Provide the corrected version, explain the grammar rules involved, highlight common mistakes to avoid, and give 2 more natural alternatives.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full my-6">
      {cards.map((card) => (
        <button
          key={card.id}
          id={`inspiration-card-${card.id}`}
          type="button"
          onClick={() => onSelectCard(card.prompt, card.tag)}
          className="bg-[#1e1f20] p-4.5 sm:p-5 rounded-2xl border border-[#333537] hover:bg-[#333537] hover:border-[#444746] cursor-pointer min-h-[140px] sm:min-h-[155px] flex flex-col justify-between text-left transition-all duration-200 group active:scale-[0.98] shadow-md"
        >
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#e3e3e3] group-hover:text-white font-normal line-clamp-3">
            {card.text}
          </p>
          <div className="w-9 h-9 rounded-full bg-[#131314] flex items-center justify-center border border-[#333537] group-hover:border-[#444746] transition-colors self-end mt-2">
            {card.icon}
          </div>
        </button>
      ))}
    </div>
  );
};
