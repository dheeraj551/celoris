"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { PlayCircle, Star, X } from 'lucide-react';

// Homepage showcase videos (served from Cloudflare R2 via /api/media/showcase).
//
// Kept light on purpose — this is the first page most visitors see:
//  - nothing downloads until the card is close to the screen
//  - loops are muted, pause when scrolled away, and stay a still image for
//    people who prefer reduced motion
//  - the full trainer reel only loads when someone presses play

export const SHOWCASE_MEDIA = '/api/media/showcase/';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** A muted looping clip that loads when near the screen and pauses when off it. */
export function LazyLoopVideo({
  src,
  poster,
  className = '',
  style,
  videoRef,
}: {
  src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional handle on the <video> (e.g. to follow its playing time). */
  videoRef?: React.MutableRefObject<HTMLVideoElement | null>;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          setLoad(true);
          el.play?.().catch(() => undefined);
        } else {
          el.pause?.();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return <img src={poster} alt="" aria-hidden className={className} style={style} loading="lazy" />;
  }

  return (
    <video
      ref={(el) => {
        ref.current = el;
        if (videoRef) videoRef.current = el;
      }}
      src={load ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={load}
      preload="none"
      aria-hidden
      className={className}
      style={style}
    />
  );
}

/** "Why teach on Celoris" — opens the trainer reel (with sound) in a player. */
export function TrainerReelButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-97 cursor-pointer'
        }
      >
        <PlayCircle className="w-4 h-4 text-emerald-400" />
        Why teach here <span className="text-neutral-500 text-[11px]">1:25</span>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Why teach on Celoris"
          >
            <div className="relative w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -top-11 right-0 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                ref={videoRef}
                src={`${SHOWCASE_MEDIA}trainer-pitch-reel.mp4`}
                poster={`${SHOWCASE_MEDIA}trainer-pitch-reel.jpg`}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full max-h-[78vh] aspect-[9/16] rounded-2xl bg-black shadow-2xl object-contain"
              />
              <Link
                href="/teach"
                onClick={() => setOpen(false)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-100 border border-emerald-400/40 font-semibold text-sm transition-colors"
              >
                <Star className="w-4 h-4 text-emerald-300" />
                Become an Instructor
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
