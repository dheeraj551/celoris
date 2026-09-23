"use client"

import React, { useEffect, useState } from 'react';
import { Download, X, AlertTriangle, Loader2, RotateCcw, ImageIcon, Clock } from 'lucide-react';
import { AiJob, isPendingJob } from '@/lib/ai-jobs-client';

function ratioStyle(r: string | null): React.CSSProperties {
  const m = r && /^(\d+):(\d+)$/.exec(r);
  return { aspectRatio: m ? `${m[1]} / ${m[2]}` : '3 / 4' };
}

function Elapsed({ since }: { since: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000));
  return <span className="font-mono">{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}</span>;
}

interface CreationsGalleryProps {
  jobs: AiJob[];
  loading: boolean;
  notice: string | null;
  onOpen: (job: AiJob) => void;
  onReusePrompt: (job: AiJob) => void;
}

export function CreationsGallery({ jobs, loading, notice, onOpen, onReusePrompt }: CreationsGalleryProps) {
  return (
    <section id="vio-creations" className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-6 mt-10 pb-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Your creations</h3>
          <p className="text-xs text-neutral-500">Saved to your Celoris storage. Renders keep going even if you leave this page.</p>
        </div>
      </div>

      {notice && <p className="text-sm text-neutral-400 mb-4">{notice}</p>}

      {loading && jobs.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/[0.04] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        !notice && (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-neutral-500">
            <ImageIcon className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
            Nothing yet. Add your product, pick a template or write a prompt, then press Generate.
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-start">
          {jobs.map((job) => {
            const pending = isPendingJob(job);
            const done = job.status === 'completed' && job.imageUrl;
            return (
              <div
                key={job.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#111217]"
                style={ratioStyle(job.aspectRatio)}
              >
                {done ? (
                  <button onClick={() => onOpen(job)} className="absolute inset-0 w-full h-full cursor-zoom-in" aria-label="Open image">
                    <img src={job.imageUrl!} alt={job.prompt} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ) : pending ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a1f08] via-[#111217] to-[#0b0c10]">
                    <div className="absolute inset-0 opacity-30 animate-pulse bg-[radial-gradient(circle_at_50%_40%,rgba(212,255,0,0.25),transparent_60%)]" />
                    <Loader2 className="relative w-7 h-7 text-[#D4FF00] animate-spin" />
                    <span className="relative text-[11px] font-bold text-white">
                      {job.status === 'queued' ? 'In queue…' : 'Rendering…'}
                    </span>
                    <span className="relative text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> <Elapsed since={job.createdAt} />
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center bg-[#1a0b0b]">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <span className="text-[11px] text-red-100/90 line-clamp-4">{job.error || 'Generation failed.'}</span>
                    <button
                      onClick={() => onReusePrompt(job)}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-white/80 hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Use prompt again
                    </button>
                  </div>
                )}

                {done && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-white/80 truncate">{job.presetName || job.prompt}</span>
                      <a
                        href={`${job.imageUrl}?download=1`}
                        className="pointer-events-auto shrink-0 p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white"
                        aria-label="Download"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function ResultViewerModal({
  job,
  onClose,
  onReusePrompt,
}: {
  job: AiJob | null;
  onClose: () => void;
  onReusePrompt: (job: AiJob) => void;
}) {
  useEffect(() => {
    if (!job) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [job, onClose]);

  if (!job || !job.imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col lg:flex-row gap-4 bg-[#0f1014] border border-white/10 rounded-3xl p-3 sm:p-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 text-white/80 hover:text-white cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 min-h-0 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden">
          <img src={job.imageUrl} alt={job.prompt} className="max-w-full max-h-[60vh] lg:max-h-[84vh] object-contain" />
        </div>
        <div className="lg:w-72 shrink-0 flex flex-col gap-3 text-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4FF00]">
              {job.presetName ? `Template · ${job.presetName}` : 'Marketing Studio Image'}
            </div>
            <p className="mt-1 text-neutral-300 max-h-40 overflow-y-auto whitespace-pre-wrap">{job.prompt}</p>
          </div>
          <div className="text-[11px] text-neutral-500">
            {job.aspectRatio && <span className="mr-3">Ratio {job.aspectRatio}</span>}
            {new Date(job.completedAt || job.createdAt).toLocaleString()}
          </div>
          <a
            href={`${job.imageUrl}?download=1`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E2FE52] hover:bg-[#D4FF00] text-black font-black py-2.5"
          >
            <Download className="w-4 h-4" /> Download
          </a>
          <button
            onClick={() => {
              onReusePrompt(job);
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Use this prompt again
          </button>
        </div>
      </div>
    </div>
  );
}
