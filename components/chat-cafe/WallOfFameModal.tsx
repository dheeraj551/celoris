import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  Trophy,
  Star,
  Heart,
  Coffee,
  Feather,
  Scroll,
  Sparkles,
  Plus,
  Search,
  X,
  Check,
  MapPin,
  Quote,
  Shield,
  Music,
  Gem,
} from 'lucide-react';
import { GuestbookEntry, GuestbookStamp, UserProfile } from './types';
import { AVATAR_CHARACTERS } from './data/cafeData';
import { cafeAudio } from './utils/cafeAudio';

interface WallOfFameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeTableId: string;
  activeTableName: string;
  guestbookEntries: GuestbookEntry[];
  onSignGuestbook: (entryData: {
    message: string;
    motto?: string;
    origin?: string;
    stamp: GuestbookStamp;
    plaqueStyle: 'gold_brass' | 'classic_wood' | 'marble' | 'retro_pixel';
    tableId: string;
  }) => void;
  onTribute: (entryId: string, tributeType: string) => void;
  isRetroMode?: boolean;
}

const STAMP_CONFIG: Record<GuestbookStamp, { label: string; icon: string; symbol: string }> = {
  star: { label: 'Gold Star', icon: '⭐', symbol: 'Star' },
  coffee: { label: 'Espresso Crest', icon: '☕', symbol: 'Coffee' },
  quill: { label: 'Author’s Quill', icon: '🖋️', symbol: 'Quill' },
  seal: { label: 'Wax Seal', icon: '📜', symbol: 'Seal' },
  heart: { label: 'Cozy Heart', icon: '💖', symbol: 'Heart' },
  trophy: { label: 'Hall of Fame', icon: '🏆', symbol: 'Trophy' },
  music: { label: 'Lofi Chime', icon: '🎵', symbol: 'Music' },
  gem: { label: 'Cafe Gem', icon: '💎', symbol: 'Gem' },
};

const PLAQUE_STYLES: { id: 'gold_brass' | 'classic_wood' | 'marble' | 'retro_pixel'; name: string; desc: string }[] = [
  { id: 'gold_brass', name: 'Polished Brass', desc: 'Etched metallic gold with brass rivets' },
  { id: 'classic_wood', name: 'Walnut & Gold', desc: 'Deep warm oak with gold leaf lettering' },
  { id: 'marble', name: 'Italian Marble', desc: 'Carrara stone plaque with slate engraving' },
  { id: 'retro_pixel', name: 'Arcade Phosphor', desc: '1999 Cyber lounge pixel plaque' },
];

export const WallOfFameModal: React.FC<WallOfFameModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeTableId,
  activeTableName,
  guestbookEntries,
  onSignGuestbook,
  onTribute,
  isRetroMode = false,
}) => {
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured' | 'popular'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Signing Form State
  const [message, setMessage] = useState('');
  const [motto, setMotto] = useState('');
  const [origin, setOrigin] = useState('');
  const [stamp, setStamp] = useState<GuestbookStamp>('coffee');
  const [plaqueStyle, setPlaqueStyle] = useState<'gold_brass' | 'classic_wood' | 'marble' | 'retro_pixel'>(
    isRetroMode ? 'retro_pixel' : 'gold_brass'
  );
  const [submitting, setSubmitting] = useState(false);
  const [submittedJustNow, setSubmittedJustNow] = useState(false);

  if (!isOpen) return null;

  // Filter and sort entries
  const filteredEntries = guestbookEntries
    .filter((entry) => {
      if (filter === 'featured') return entry.isFeatured;
      if (filter === 'popular') {
        const tributes = entry.tributes || {};
        const totalTributes: number = (Object.values(tributes) as string[][]).reduce(
          (acc, users) => acc + (users?.length || 0),
          0
        );
        return totalTributes >= 2;
      }
      return true;
    })
    .filter((entry) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        entry.userName.toLowerCase().includes(q) ||
        entry.message.toLowerCase().includes(q) ||
        (entry.motto && entry.motto.toLowerCase().includes(q)) ||
        (entry.origin && entry.origin.toLowerCase().includes(q))
      );
    });

  const handleTributeClick = (entryId: string, tributeType: string) => {
    cafeAudio.playPlaqueTribute();
    onTribute(entryId, tributeType);
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    cafeAudio.playGuestbookSign();

    onSignGuestbook({
      message: message.trim(),
      motto: motto.trim() || undefined,
      origin: origin.trim() || undefined,
      stamp,
      plaqueStyle,
      tableId: activeTableId,
    });

    setSubmittedJustNow(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSigningOpen(false);
      setSubmittedJustNow(false);
      setMessage('');
      setMotto('');
      setOrigin('');
    }, 900);
  };

  const renderPlaqueClasses = (style: string) => {
    switch (style) {
      case 'classic_wood':
        return 'bg-gradient-to-br from-[#2a170d] via-[#1c0f08] to-[#140a05] text-[#f5ebd7] border-2 border-[#8b5a2b] shadow-[0_8px_20px_rgba(0,0,0,0.6)]';
      case 'marble':
        return 'bg-gradient-to-br from-[#e8e9ea] via-[#f1f3f5] to-[#d6dadf] text-[#1e293b] border-2 border-[#94a3b8] shadow-[0_8px_20px_rgba(0,0,0,0.4)]';
      case 'retro_pixel':
        return 'bg-[#0f172a] text-[#38bdf8] border-2 border-[#0284c7] font-mono shadow-[0_0_15px_rgba(14,165,233,0.35)]';
      case 'gold_brass':
      default:
        return 'bg-gradient-to-br from-[#3b2b10] via-[#261a07] to-[#1f1505] text-[#fef3c7] border-2 border-[#d97706] shadow-[0_8px_25px_rgba(217,119,6,0.25)]';
    }
  };

  // Rendered through a portal straight onto document.body so this overlay's
  // `fixed inset-0` is always positioned relative to the real viewport. The
  // Chat Café UI nests this modal several layers deep inside the retro
  // arcade cabinet frame; without the portal, position:fixed here can end up
  // trapped by that ancestry (it was scrolling with the page and getting
  // clipped near the taskbar instead of staying pinned full-screen).
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="wall-of-fame-modal"
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
          isRetroMode
            ? 'bg-[#181124] border-amber-500/70 font-mono text-stone-100'
            : 'bg-stone-900 border-stone-700/80 text-stone-100'
        }`}
      >
        {/* Wall of Fame Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-600/40 p-4 sm:p-6 flex-shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-lg flex items-center justify-center text-amber-950">
                <div className="w-full h-full bg-amber-900/60 rounded-[10px] flex items-center justify-center text-2xl">
                  🏆
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-amber-200 flex items-center gap-2">
                    Wall of Fame & Perpetual Guestbook
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Non-Expiring
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300">
                  Permanent plaques etched into <strong className="text-amber-300">{activeTableName}</strong>. Messages left here never expire.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="sign-guestbook-trigger-btn"
                onClick={() => {
                  cafeAudio.playKeyClick();
                  setIsSigningOpen(!isSigningOpen);
                }}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border border-amber-300/40"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isSigningOpen ? 'View Plaques' : 'Sign Guestbook'}</span>
              </button>
              <button
                id="close-wall-of-fame-modal"
                onClick={() => {
                  cafeAudio.playKeyClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Close Wall of Fame"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-bar: Filter Tabs & Search */}
          {!isSigningOpen && (
            <div className="mt-4 pt-3 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 bg-stone-950/60 p-1 rounded-xl border border-stone-800">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Plaques ({guestbookEntries.length})
                </button>
                <button
                  onClick={() => setFilter('featured')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filter === 'featured'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Award className="w-3 h-3" /> Staff & Founders
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filter === 'popular'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" /> Most Tributed
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px] flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search user or quote..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-stone-950/70 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Body: Either Signing Form OR Plaques Wall */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950/70">
          {isSigningOpen ? (
            /* ================= SIGNING FORM ================= */
            <form onSubmit={handleSignSubmit} className="max-w-2xl mx-auto space-y-5">
              <div className="bg-amber-950/30 border border-amber-700/50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">📜</div>
                  <div>
                    <h3 className="text-base font-bold text-amber-200">Etch Your Permanent Message</h3>
                    <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                      Your entry will be mounted on the <strong>Wall of Fame</strong> forever. Share a warm reflection, favorite quote, or blessing for fellow users.
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200 flex items-center justify-between">
                  <span>Your Permanent Message / Inscription *</span>
                  <span className="text-[11px] text-stone-400">{message.length}/320</span>
                </label>
                <textarea
                  required
                  maxLength={320}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write words that you would like remembered at Celoris Cafe..."
                  className="w-full p-3 bg-stone-900/90 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Patron Motto & Hometown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <Quote className="w-3.5 h-3.5 text-amber-400" /> Short Personal Motto (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="e.g. Always leave room for one more cup."
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Origin / Hometown / Table Spot (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Tokyo, Japan or Corner Armchair #2"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Stamp Crest Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Choose Your Plaque Crest Stamp</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {(Object.keys(STAMP_CONFIG) as GuestbookStamp[]).map((st) => {
                    const cfg = STAMP_CONFIG[st];
                    const isSel = stamp === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          cafeAudio.playKeyClick();
                          setStamp(st);
                        }}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-amber-500/25 border-2 border-amber-400 text-amber-200 scale-105 shadow-sm'
                            : 'bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <span className="text-xl">{cfg.icon}</span>
                        <span className="text-[10px] truncate max-w-full font-medium">{cfg.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plaque Style Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Plaque Material & Texture</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PLAQUE_STYLES.map((ps) => {
                    const isSel = plaqueStyle === ps.id;
                    return (
                      <button
                        key={ps.id}
                        type="button"
                        onClick={() => {
                          cafeAudio.playKeyClick();
                          setPlaqueStyle(ps.id);
                        }}
                        className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{ps.name}</span>
                          {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-1 leading-snug">{ps.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Plaque Live Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Plaque Live Preview
                </span>
                <div className={`p-5 rounded-2xl relative ${renderPlaqueClasses(plaqueStyle)}`}>
                  {/* Decorative corner bolts */}
                  <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />

                  <div className="flex items-center justify-between pb-3 border-b border-current/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg text-stone-950 font-bold shadow-sm">
                        {STAMP_CONFIG[stamp].icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-none flex items-center gap-1.5">
                          <span>{currentUser.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 uppercase font-semibold">
                            {currentUser.role}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-75 mt-0.5">
                          {origin ? `📍 ${origin}` : `Etched into ${activeTableName}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs opacity-75 font-mono">Just Now</div>
                  </div>

                  <p className="mt-3 text-sm italic leading-relaxed font-serif">
                    "{message || 'Your permanent words will be engraved right here...'}"
                  </p>

                  {motto && (
                    <div className="mt-2.5 pt-2 border-t border-current/15 text-xs opacity-85 font-medium">
                      “{motto}”
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSigningOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  {submittedJustNow ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                      <span>Permanently Etched!</span>
                    </>
                  ) : submitting ? (
                    <span>Etching Brass Plaque...</span>
                  ) : (
                    <>
                      <Award className="w-4 h-4 stroke-[2.5]" />
                      <span>Etch onto Wall of Fame</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= PLAQUES GRID ================= */
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="text-4xl">📜</div>
                  <h4 className="text-base font-bold text-amber-200">No Plaques Found</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    {searchQuery
                      ? `No permanent entries matching "${searchQuery}". Try another keyword.`
                      : 'Be the very first user to leave a permanent mark on the Wall of Fame!'}
                  </p>
                  <button
                    onClick={() => setIsSigningOpen(true)}
                    className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Sign the Guestbook Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEntries.map((entry) => {
                    const charData = AVATAR_CHARACTERS.find((c) => c.id === entry.userAvatarId);
                    const isOwner = entry.userId === currentUser.id;
                    const dateStr = new Date(entry.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    // Tributes summary
                    const tributesMap = entry.tributes || {};
                    const totalTributeCount: number = (Object.values(tributesMap) as string[][]).reduce(
                      (acc, arr) => acc + (arr?.length || 0),
                      0
                    );

                    return (
                      <div
                        key={entry.id}
                        className={`relative p-5 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.01] ${renderPlaqueClasses(
                          entry.plaqueStyle
                        )}`}
                      >
                        {/* Decorative Brass Corner Studs */}
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-400/60 border border-amber-600 shadow-inner" />

                        {/* Top: Patron info & Stamp */}
                        <div>
                          <div className="flex items-start justify-between gap-3 pb-3 border-b border-current/20">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                                  entry.userAvatarColor || 'from-amber-400 to-orange-500'
                                } flex items-center justify-center text-xl shadow-md border border-white/20`}
                              >
                                {charData?.icon || '☕'}
                              </div>
                              <div>
                                <div className="font-bold text-sm flex items-center gap-1.5 flex-wrap">
                                  <span>{entry.userName}</span>
                                  {entry.isFeatured && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                                      <Award className="w-2.5 h-2.5" /> Founder
                                    </span>
                                  )}
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25 uppercase font-medium">
                                    {entry.userRole}
                                  </span>
                                </div>
                                <div className="text-[11px] opacity-75 mt-0.5 flex items-center gap-1">
                                  {entry.origin ? (
                                    <>
                                      <MapPin className="w-3 h-3 text-rose-400" />
                                      <span>{entry.origin}</span>
                                    </>
                                  ) : (
                                    <span>User of Celoris Cafe</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stamp icon badge */}
                            <div
                              className="w-8 h-8 rounded-full bg-black/20 border border-current/30 flex items-center justify-center text-base shadow-sm flex-shrink-0"
                              title={STAMP_CONFIG[entry.stamp]?.label || 'Stamp'}
                            >
                              {STAMP_CONFIG[entry.stamp]?.icon || '☕'}
                            </div>
                          </div>

                          {/* Message Inscription */}
                          <div className="my-3 text-sm leading-relaxed font-serif italic text-balance">
                            "{entry.message}"
                          </div>

                          {/* Personal Motto */}
                          {entry.motto && (
                            <div className="text-xs opacity-90 font-medium pb-2 border-b border-current/15 flex items-center gap-1.5">
                              <Quote className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span className="italic">{entry.motto}</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom: Date & Interactive Tributes */}
                        <div className="pt-3 flex items-center justify-between gap-2 mt-auto">
                          <div className="text-[10px] opacity-70 font-mono">
                            Permanent • {dateStr}
                          </div>

                          {/* Tribute action buttons */}
                          <div className="flex items-center gap-1.5">
                            {(['⭐', '☕', '❤️'] as const).map((emoji) => {
                              const users = tributesMap[emoji] || [];
                              const hasTributed = users.includes(currentUser.id);
                              const count = users.length;
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleTributeClick(entry.id, emoji)}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-90 cursor-pointer ${
                                    hasTributed
                                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                                      : 'bg-black/30 hover:bg-black/50 text-current opacity-85 hover:opacity-100'
                                  }`}
                                  title={`Pay tribute with ${emoji}`}
                                >
                                  <span>{emoji}</span>
                                  {count > 0 && <span className="text-[10px]">{count}</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Permanent Inscriptions: <strong className="text-amber-300">{guestbookEntries.length}</strong></span>
          </div>
          <div className="text-[11px] text-stone-500 hidden sm:block">
            Permanent Wall of Fame • Celoris Cafe Perpetual Registry
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
