"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Curved3DCarousel } from './Curved3DCarousel';
import { StudioDock, MAX_VARIATIONS } from './StudioDock';
import { PresetPickerModal } from './PresetPickerModal';
import { CreationsGallery, ResultViewerModal } from './CreationsGallery';
import { CarouselCard, SHOWCASE_CARDS, DemoProduct, DEMO_PRODUCTS, DemoAvatar, SHOT_ANGLES } from './marketingStudioData';
import {
  AiJob,
  AiJobsError,
  MarketingPreset,
  getAiJob,
  isPendingJob,
  listAiJobs,
  listMarketingPresets,
  startAiJob,
  uploadReferenceImage,
} from '@/lib/ai-jobs-client';
import { AlertTriangle, X } from 'lucide-react';

// ViO Studio — Higgsfield Marketing Studio Image, rebuilt as background jobs.
//
// Generate no longer holds a request open while the image renders (that is
// what produced the 504s). It uploads the reference photos, starts a job and
// returns in a second or two; the gallery below polls each job and shows the
// finished image from Cloudflare R2. Several renders can run at once and they
// survive a page refresh.

const POLL_MS = 3000;

export function MarketingStudio() {
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState<string>(SHOWCASE_CARDS[2].promptSuggestion);
  const [selectedAngle, setSelectedAngle] = useState<string>(SHOT_ANGLES[0].name);
  const [selectedRatio, setSelectedRatio] = useState<string>('3:4');
  const [resolution, setResolution] = useState<'1k' | '2k' | '4k'>('2k');
  const [variationCount, setVariationCount] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<DemoAvatar | null>(null);

  // Templates (Higgsfield presets)
  const [selectedPreset, setSelectedPreset] = useState<MarketingPreset | null>(null);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [presets, setPresets] = useState<MarketingPreset[] | null>(null);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [presetsError, setPresetsError] = useState<string | null>(null);

  // Jobs
  const [jobs, setJobs] = useState<AiJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsNotice, setJobsNotice] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [viewerJob, setViewerJob] = useState<AiJob | null>(null);

  const jobsRef = useRef<AiJob[]>([]);
  jobsRef.current = jobs;
  const openWhenDone = useRef<Set<string>>(new Set());

  // ---------------------------------------------------------------- history
  useEffect(() => {
    let cancelled = false;
    listAiJobs('vio')
      .then((list) => !cancelled && setJobs(list))
      .catch((err: AiJobsError) => {
        if (cancelled) return;
        setJobsNotice(err.status === 401 ? 'Sign in to create ads and see your creations.' : `Couldn't load your creations: ${err.message}`);
      })
      .finally(() => !cancelled && setJobsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------- polling
  const hasPending = jobs.some(isPendingJob);
  useEffect(() => {
    if (!hasPending) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      const pending = jobsRef.current.filter(isPendingJob).slice(0, 4);
      await Promise.all(
        pending.map(async (j) => {
          try {
            const { job } = await getAiJob(j.id);
            if (stopped) return;
            setJobs((prev) => prev.map((p) => (p.id === job.id ? job : p)));
            if (!isPendingJob(job) && openWhenDone.current.has(job.id)) {
              openWhenDone.current.delete(job.id);
              if (job.status === 'completed') setViewerJob((cur) => cur ?? job);
            }
          } catch {
            /* network blip — next tick retries */
          }
        })
      );
      if (!stopped) timer = setTimeout(tick, POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [hasPending]);

  // ---------------------------------------------------------------- templates
  const loadPresets = useCallback(() => {
    setPresetsLoading(true);
    setPresetsError(null);
    listMarketingPresets()
      .then(setPresets)
      .catch((err: AiJobsError) => setPresetsError(err.message))
      .finally(() => setPresetsLoading(false));
  }, []);

  const openPresets = () => {
    setIsPresetOpen(true);
    if (!presets && !presetsLoading) loadPresets();
  };

  // ---------------------------------------------------------------- carousel
  const handleSelectCard = (card: CarouselCard) => {
    setPrompt(card.promptSuggestion);
    setSelectedRatio(card.ratio);
  };

  // ---------------------------------------------------------------- generate
  const handleGenerate = async () => {
    if (submitStage) return;
    setGenerationError(null);

    if (mode === 'video') {
      setGenerationError('Video ads are coming soon. Switch to Image to create now.');
      return;
    }
    if (selectedPreset && !selectedProduct) {
      setGenerationError('Templates need your product photo. Tap PRODUCT to upload one.');
      return;
    }
    if (!selectedPreset && !prompt.trim()) {
      setGenerationError('Describe the ad you want, or pick a template.');
      return;
    }
    const running = jobsRef.current.filter(isPendingJob).length;
    const count = Math.min(variationCount, MAX_VARIATIONS - running);
    if (count <= 0) {
      setGenerationError(`You already have ${running} images rendering. Please wait for one to finish.`);
      return;
    }

    try {
      // 1) Reference photos -> R2 + Higgsfield (in parallel, cached per image)
      setSubmitStage('Uploading…');
      const [productUrl, avatarUrl] = await Promise.all([
        selectedProduct ? uploadReferenceImage(selectedProduct.image, `product:${selectedProduct.id}`) : Promise.resolve(null),
        selectedAvatar ? uploadReferenceImage(selectedAvatar.avatarUrl, `avatar:${selectedAvatar.id}`) : Promise.resolve(null),
      ]);
      const imageUrls = [productUrl, avatarUrl].filter((u): u is string => !!u);

      // 2) Build the prompt
      let finalPrompt: string;
      let displayPrompt: string;
      if (selectedPreset) {
        const extra = prompt.trim();
        finalPrompt = extra || `Marketing image for ${selectedProduct?.name || 'this product'}.`;
        displayPrompt = extra || `${selectedPreset.name} · ${selectedProduct?.name || 'product'}`;
      } else {
        const angle = SHOT_ANGLES.find((a) => a.name === selectedAngle);
        const parts = [prompt.trim()];
        if (angle && angle.id !== 'auto') parts.push(`Camera: ${angle.name}, ${angle.desc.toLowerCase()}.`);
        if (productUrl) parts.push(`Feature the product "${selectedProduct?.name}" from the reference photo exactly as it looks — keep its shape, label and colours.`);
        if (avatarUrl) parts.push('Include the person from the model reference photo, keeping their face and look.');
        finalPrompt = parts.join(' ');
        displayPrompt = prompt.trim();
      }

      // 3) Start the job(s) — each returns immediately
      setSubmitStage('Starting…');
      const started: AiJob[] = [];
      let firstError: string | null = null;
      for (let i = 0; i < count; i++) {
        try {
          const { job } = await startAiJob({
            app: 'vio',
            prompt: finalPrompt,
            displayPrompt,
            presetId: selectedPreset?.id ?? null,
            presetName: selectedPreset?.name ?? null,
            imageUrls,
            aspectRatio: selectedRatio,
            resolution,
            quality: 'high',
          });
          started.push(job);
          openWhenDone.current.add(job.id);
          setJobs((prev) => [job, ...prev.filter((p) => p.id !== job.id)]);
        } catch (err: any) {
          firstError = err?.message || 'Could not start the generation.';
          break;
        }
      }
      if (started.length) {
        setJobsNotice(null);
        document.getElementById('vio-creations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (firstError) {
        setGenerationError(started.length ? `Started ${started.length} of ${count}. ${firstError}` : firstError);
      }
    } catch (err: any) {
      setGenerationError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitStage(null);
    }
  };

  const reusePrompt = (job: AiJob) => {
    setMode('image');
    if (!job.presetName) setPrompt(job.prompt);
    if (job.aspectRatio && job.aspectRatio !== 'auto') setSelectedRatio(job.aspectRatio);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#08090C] text-white flex flex-col overflow-x-hidden selection:bg-[#D4FF00]/30 py-6 sm:py-8">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#D4FF00]/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <header className="relative z-20 flex flex-col items-center justify-center pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_0_25px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse shadow-[0_0_8px_rgba(212,255,0,0.8)]" />
          <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] text-white/90 uppercase font-sans">MARKETING STUDIO</span>
        </div>
        <span className="text-[10px] font-mono font-medium text-neutral-400 mt-1 uppercase tracking-widest">
          ViO Studio AI • Commercial Production Suite
        </span>
      </header>

      <section className="relative z-20 w-full flex flex-col items-center">
        <Curved3DCarousel onSelectCard={handleSelectCard} selectedCardId="fizzo" />
        <div className="text-center px-4 mt-6 sm:mt-8 select-none">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans leading-tight">
            TURN ANY PRODUCT
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-400/90 font-sans mt-0.5 sm:mt-1">
            INTO READY TO POST CONTENT
          </h2>
        </div>
      </section>

      <div className="relative z-20 w-full mt-6 pb-2">
        <StudioDock
          mode={mode}
          setMode={setMode}
          prompt={prompt}
          setPrompt={setPrompt}
          selectedPreset={selectedPreset}
          onOpenPresets={openPresets}
          onClearPreset={() => setSelectedPreset(null)}
          selectedAngle={selectedAngle}
          setSelectedAngle={setSelectedAngle}
          selectedRatio={selectedRatio}
          setSelectedRatio={setSelectedRatio}
          resolution={resolution}
          setResolution={setResolution}
          variationCount={variationCount}
          setVariationCount={setVariationCount}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          onGenerate={handleGenerate}
          isSubmitting={!!submitStage}
          submitLabel={submitStage || undefined}
        />
        {!selectedProduct && (
          <p className="text-center text-[11px] text-neutral-500 mt-2 px-4">
            Tip: add your PRODUCT photo so the ad shows your real product.{' '}
            <button
              type="button"
              onClick={() => setSelectedProduct(DEMO_PRODUCTS[0])}
              className="underline decoration-dotted hover:text-neutral-300 cursor-pointer"
            >
              Try a sample product
            </button>
          </p>
        )}
      </div>

      <CreationsGallery jobs={jobs} loading={jobsLoading} notice={jobsNotice} onOpen={setViewerJob} onReusePrompt={reusePrompt} />

      <PresetPickerModal
        isOpen={isPresetOpen}
        onClose={() => setIsPresetOpen(false)}
        presets={presets}
        loading={presetsLoading}
        error={presetsError}
        onRetry={loadPresets}
        selectedId={selectedPreset?.id ?? null}
        onSelect={(p) => {
          setSelectedPreset(p);
          // The template writes the prompt; drop the carousel's sample text so it doesn't fight the template.
          if (p && SHOWCASE_CARDS.some((c) => c.promptSuggestion === prompt)) setPrompt('');
          setGenerationError(null);
        }}
      />

      <ResultViewerModal job={viewerJob} onClose={() => setViewerJob(null)} onReusePrompt={reusePrompt} />

      <AnimatePresence>
        {generationError && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            role="alert"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[min(92vw,34rem)] rounded-2xl border border-red-500/30 bg-[#1a0b0b]/95 backdrop-blur-xl px-4 py-3 flex items-start gap-3 shadow-2xl"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-red-100">
              <p className="font-semibold text-red-300 mb-0.5">Couldn&apos;t generate your creative</p>
              <p className="text-red-100/80">{generationError}</p>
            </div>
            <button onClick={() => setGenerationError(null)} className="text-red-300/70 hover:text-red-200 cursor-pointer" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
