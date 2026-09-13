import React, { useState } from 'react';
import { X, Gift, Check, Coffee, Heart } from 'lucide-react';
import { CafeDrink, UserProfile } from './types';
import { CAFE_DRINKS } from './data/cafeData';
import { cafeAudio } from './utils/cafeAudio';

interface DrinkGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePatrons: UserProfile[];
  preselectedRecipient?: UserProfile | null;
  onSendGift: (drink: CafeDrink, recipientName?: string, note?: string) => void;
}

export const DrinkGiftModal: React.FC<DrinkGiftModalProps> = ({
  isOpen,
  onClose,
  activePatrons,
  preselectedRecipient,
  onSendGift,
}) => {
  const [selectedDrink, setSelectedDrink] = useState<CafeDrink>(CAFE_DRINKS[0]);
  const [recipient, setRecipient] = useState<string>(
    preselectedRecipient ? preselectedRecipient.name : 'The Entire Table'
  );
  const [note, setNote] = useState('Freshly brewed for you! Enjoy the warmth ☕');

  if (!isOpen) return null;

  const handleSend = () => {
    cafeAudio.playCupClink();
    onSendGift(selectedDrink, recipient, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        id="drink-gift-modal"
        className="bg-stone-900 border border-stone-700/80 rounded-3xl w-full max-w-lg shadow-2xl text-stone-100 p-5 sm:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30">
              🎁
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">
                Treat Someone to a Café Drink
              </h2>
              <p className="text-xs text-stone-400">
                Spread warmth by gifting a drink or pastry to a patron or the whole room
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

        {/* Recipient Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Who are you treating?</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="The Entire Table">✨ The Entire Table (Everyone here!)</option>
            {activePatrons.map((p, idx) => (
              <option key={`${p.id}-${idx}`} value={p.name}>
                {p.name} ({p.currentDrink || 'Patron'})
              </option>
            ))}
          </select>
        </div>

        {/* Drink Menu Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Choose Drink or Pastry</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {CAFE_DRINKS.map((drink) => {
              const isSelected = drink.id === selectedDrink.id;
              return (
                <button
                  key={drink.id}
                  onClick={() => setSelectedDrink(drink)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-600/30 border-amber-500 text-white shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{drink.icon}</div>
                  <div className="font-bold text-xs text-amber-100 truncate">{drink.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{drink.type}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Warm Note on the Cup</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
            placeholder="e.g. Hope your day is filled with good ideas!"
            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
          />
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
            onClick={handleSend}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/40 flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4" />
            <span>Send {selectedDrink.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
