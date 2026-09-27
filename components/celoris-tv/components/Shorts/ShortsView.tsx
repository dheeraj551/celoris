import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { ThumbsUp, ThumbsDown, Bookmark, ChevronUp, ChevronDown, Play, Smartphone, GraduationCap } from 'lucide-react';

// Celoris TV Shorts: a vertical, swipe-style feed of short videos (YouTube
// Shorts published from Teacher Studio with "Short" selected). One short per
// screen; only the one in view is loaded as a player, the rest show their
// thumbnail, so scrolling stays light.

function embedUrl(id: string) {
  const p = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    playsinline: '1',
    loop: '1',
    playlist: id,
    rel: '0',
    modestbranding: '1',
    controls: '1',
  });
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const ShortsView: React.FC = () => {
  const { videos, activeShortId, currentUser, toggleLike, toggleDislike, toggleSave, setCurrentView, currentRole } = useApp();

  const shorts = useMemo(() => videos.filter((v) => v.isShort && v.youtubeId), [videos]);
  const startIndex = Math.max(0, shorts.findIndex((v) => v.id === activeShortId));
  const [active, setActive] = useState(startIndex);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Start on the short that was clicked.
  useEffect(() => {
    const el = itemRefs.current[startIndex];
    if (el) el.scrollIntoView({ block: 'start' });
    setActive(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShortId, shorts.length]);

  // Whichever short fills most of the screen is the one that plays.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { root, threshold: [0.6] }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [shorts.length]);

  const go = (delta: number) => {
    const next = Math.min(shorts.length - 1, Math.max(0, active + delta));
    itemRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Arrow keys move between shorts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (shorts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-slate-300 select-none">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5">
          <Smartphone className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-white mb-2">No Shorts yet</h1>
        <p className="text-sm text-slate-400 mb-6">
          Quick vertical lessons will appear here. Trainers can publish one from Teacher Studio by choosing “Short”.
        </p>
        {currentRole === 'teacher' && (
          <button
            onClick={() => setCurrentView('teacher-studio')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold"
          >
            <GraduationCap className="w-4 h-4" /> Open Teacher Studio
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto select-none">
      <div
        ref={scrollerRef}
        className="h-[calc(100vh-7.5rem)] overflow-y-auto snap-y snap-mandatory rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shorts.map((v, i) => (
          <ShortItem
            key={v.id}
            video={v}
            index={i}
            isActive={i === active}
            shouldLoad={Math.abs(i - active) <= 0}
            liked={currentUser.likedVideoIds.includes(v.id)}
            disliked={currentUser.dislikedVideoIds.includes(v.id)}
            saved={currentUser.savedVideoIds.includes(v.id)}
            onLike={() => toggleLike(v.id)}
            onDislike={() => toggleDislike(v.id)}
            onSave={() => toggleSave(v.id)}
            refCb={(el) => {
              itemRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Up / down (desktop) */}
      <div className="hidden md:flex flex-col gap-2 absolute right-0 top-1/2 -translate-y-1/2">
        <button
          onClick={() => go(-1)}
          disabled={active === 0}
          className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white disabled:opacity-30"
          aria-label="Previous short"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          disabled={active >= shorts.length - 1}
          className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white disabled:opacity-30"
          aria-label="Next short"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ShortItem: React.FC<{
  video: Video;
  index: number;
  isActive: boolean;
  shouldLoad: boolean;
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  onLike: () => void;
  onDislike: () => void;
  onSave: () => void;
  refCb: (el: HTMLDivElement | null) => void;
}> = ({ video, index, isActive, shouldLoad, liked, disliked, saved, onLike, onDislike, onSave, refCb }) => {
  return (
    <div ref={refCb} data-index={index} className="h-full snap-start snap-always flex items-center justify-center gap-4 py-3">
      <div className="relative h-full max-h-full aspect-[9/16] max-w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
        {shouldLoad && video.youtubeId ? (
          <iframe
            key={video.youtubeId}
            src={embedUrl(video.youtubeId)}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-current" />
              </span>
            </div>
          </>
        )}

        {/* Title + trainer (under the player controls area) */}
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 p-4 pb-14 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <img src={video.author.avatar} alt={video.author.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
            <span className="text-sm font-bold text-white truncate">{video.author.name}</span>
          </div>
          <p className="text-sm text-white font-semibold line-clamp-2">{video.title}</p>
          <span className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-emerald-300">{video.subject}</span>
        </div>

        {/* Actions on mobile (over the video) */}
        <div className="md:hidden absolute right-2 bottom-24 flex flex-col gap-3">
          <ActionButton active={liked} onClick={onLike} label={compact(video.likes)} icon={<ThumbsUp className="w-5 h-5" />} />
          <ActionButton active={disliked} onClick={onDislike} label="" icon={<ThumbsDown className="w-5 h-5" />} />
          <ActionButton active={saved} onClick={onSave} label="Save" icon={<Bookmark className="w-5 h-5" />} />
        </div>
      </div>

      {/* Actions on desktop (beside the video) */}
      <div className={`hidden md:flex flex-col gap-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        <ActionButton active={liked} onClick={onLike} label={compact(video.likes)} icon={<ThumbsUp className="w-5 h-5" />} />
        <ActionButton active={disliked} onClick={onDislike} label="Dislike" icon={<ThumbsDown className="w-5 h-5" />} />
        <ActionButton active={saved} onClick={onSave} label={saved ? 'Saved' : 'Save'} icon={<Bookmark className="w-5 h-5" />} />
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({
  active,
  onClick,
  label,
  icon,
}) => (
  <button type="button" onClick={onClick} className="flex flex-col items-center gap-1 text-white">
    <span
      className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
        active ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/[0.08] hover:bg-white/[0.16] border-white/15'
      }`}
    >
      {icon}
    </span>
    {label && <span className="text-[11px] font-semibold text-slate-200">{label}</span>}
  </button>
);
