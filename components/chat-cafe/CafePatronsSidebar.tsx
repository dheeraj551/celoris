import React from 'react';
import { Users, Coffee, Gift, Shield, VolumeX, Ban, BookOpen, Clock, Heart } from 'lucide-react';
import { UserProfile, CafeTable } from './types';
import { HOUSE_RULES } from './data/cafeData';

interface CafePatronsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  patrons: UserProfile[];
  currentUser: UserProfile;
  currentTable: CafeTable;
  onTreatPatron: (patron: UserProfile) => void;
  onMuteUser: (userId: string, userName: string) => void;
  onBanUser: (userId: string, userName: string) => void;
}

export const CafePatronsSidebar: React.FC<CafePatronsSidebarProps> = ({
  isOpen,
  onClose,
  patrons,
  currentUser,
  currentTable,
  onTreatPatron,
  onMuteUser,
  onBanUser,
}) => {
  const isStaff = currentUser.role === 'moderator' || currentUser.role === 'admin';

  if (!isOpen) return null;

  return (
    <aside
      id="cafe-patrons-sidebar"
      className="fixed inset-y-0 right-0 z-40 w-80 sm:w-88 bg-stone-950/95 border-l border-stone-800 backdrop-blur-xl shadow-2xl flex flex-col p-4 text-stone-100 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <h2 className="font-serif font-bold text-sm text-amber-100">
            Café Patrons ({patrons.length})
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
        >
          ✕
        </button>
      </div>

      {/* Table Atmosphere Card */}
      <div className="my-3 p-3 rounded-2xl bg-black/40 border border-stone-800 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <span>{currentTable.icon}</span>
            <span>{currentTable.name}</span>
          </span>
          {currentTable.slowModeSeconds > 0 && (
            <span className="text-[10px] bg-amber-900/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/40 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {currentTable.slowModeSeconds}s slow mode
            </span>
          )}
        </div>
        <p className="text-[11px] text-stone-400 leading-snug">{currentTable.tagline}</p>
      </div>

      {/* Patrons List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider px-1">
          Currently at Table
        </div>

        {patrons.map((p, idx) => {
          const isMe = p.id === currentUser.id;
          return (
            <div
              key={`${p.id}-${idx}`}
              className={`p-2.5 rounded-2xl border transition-all ${
                isMe
                  ? 'bg-amber-950/30 border-amber-600/40'
                  : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.avatarColor || 'from-amber-400 to-orange-500'} flex items-center justify-center text-lg shadow-sm flex-shrink-0 border border-white/20`}
                  >
                    {p.avatarId === 'cat_barista' ? '🐱' :
                     p.avatarId === 'fox_books' ? '🦊' :
                     p.avatarId === 'owl_philosophy' ? '🦉' :
                     p.avatarId === 'bear_cozy' ? '🐻' :
                     p.avatarId === 'rabbit_matcha' ? '🐰' :
                     p.avatarId === 'capybara_chill' ? '🦫' :
                     p.avatarId === 'otter_latte' ? '🦦' :
                     p.avatarId === 'raccoon_pastry' ? '🦝' : '🐕'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-100 truncate">
                        {p.name} {isMe && '(You)'}
                      </span>
                      {p.role === 'barista' && (
                        <span className="text-[9px] bg-amber-600/40 text-amber-200 px-1 rounded">
                          Barista
                        </span>
                      )}
                      {p.role === 'moderator' && (
                        <span className="text-[9px] bg-rose-950/60 text-rose-300 px-1 rounded">
                          Mod
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {p.statusText || p.currentDrink || 'Relaxing at table'}
                    </div>
                  </div>
                </div>

                {/* Quick actions for this patron */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isMe && (
                    <button
                      onClick={() => onTreatPatron(p)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                      title={`Treat ${p.name} to a drink`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isStaff && !isMe && p.role !== 'moderator' && (
                    <>
                      <button
                        onClick={() => onMuteUser(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-300 transition-colors"
                        title={`Mute ${p.name}`}
                      >
                        <VolumeX className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onBanUser(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 transition-colors"
                        title={`Ban ${p.name}`}
                      >
                        <Ban className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* House Etiquette Snippet */}
      <div className="mt-3 pt-3 border-t border-stone-800 space-y-1.5 text-stone-400">
        <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>Café House Rules</span>
        </div>
        <p className="text-[11px] leading-snug">
          Be kind, listen openly, and keep the table cozy. Zero tolerance for harassment or hate speech.
        </p>
      </div>
    </aside>
  );
};
