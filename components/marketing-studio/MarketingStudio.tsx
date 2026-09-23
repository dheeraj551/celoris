"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Curved3DCarousel } from './Curved3DCarousel';
import { StudioDock } from './StudioDock';
import { CreativeOutputModal, GeneratedCreative } from './CreativeOutputModal';
import {
  CarouselCard,
  SHOWCASE_CARDS,
  DemoProduct,
  DEMO_PRODUCTS,
  DemoAvatar,
  DEMO_AVATARS,
} from './marketingStudioData';
import { Sparkles, AlertTriangle, X } from 'lucide-react';

export function MarketingStudio() {
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState<string>(
    SHOWCASE_CARDS[2].promptSuggestion // Default to Citrus Fizzo prompt
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('Marketing Studio Image');
  const [selectedAngle, setSelectedAngle] = useState<string>('Closeup');
  const [selectedRatio, setSelectedRatio] = useState<string>('3:4');
  const [variationCount, setVariationCount] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(DEMO_PRODUCTS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState<DemoAvatar | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generatedCreative, setGeneratedCreative] = useState<GeneratedCreative | null>(null);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // When card in carousel is selected
  const handleSelectCard = (card: CarouselCard) => {
    setPrompt(card.promptSuggestion);
    setSelectedRatio(card.ratio);

    // Map card to demo product if matching
    const matchingProd = DEMO_PRODUCTS.find((p) =>
      p.name.toLowerCase().includes(card.id)
    );
    if (matchingProd) {
      setSelectedProduct(matchingProd);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenerationError(null);
    setIsGenerating(true);
    const prod = selectedProduct || DEMO_PRODUCTS[0];

    const stages = [
      'Sending request to Higgsfield Marketing Studio model...',
      'Setting virtual camera angle & lighting rig...',
      'Synthesizing commercial product render...',
      'Composing high-CTR marketing typography & decals...',
      'Finalizing commercial ad creative...',
    ];
    setGenerationStage(stages[0]);
    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, stages.length - 1);
      setGenerationStage(stages[stageIdx]);
    }, 6000);

    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          productName: prod.name,
          productImageUrl: prod.image,
          avatarUrl: selectedAvatar?.avatarUrl,
          stylePreset: selectedStyle,
          aspectRatio: selectedRatio,
          angle: selectedAngle,
        }),
      });

      const data: any = await res.json().catch(() => null);

      // No more silent fallbacks: previously any failure showed the demo
      // product photo as if it were the generated ad.
      if (!res.ok || !data?.imageUrl) {
        const message =
          data?.error ||
          (res.status === 504
            ? 'The generation took too long and the server stopped waiting. Please try again.'
            : `Generation failed (error ${res.status}). Please try again.`);
        setGenerationError(message);
        return;
      }

      const created: GeneratedCreative = {
        id: `creative-${Date.now()}`,
        headline: data.headline || 'STAND OUT. GET NOTICED.',
        tagline: data.tagline || '',
        badgeText: data.badgeText || 'NEW',
        ctaText: data.ctaText || 'SHOP NOW',
        adCopy: data.adCopy || '',
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        productName: prod.name,
        productImage: data.imageUrl,
        avatarUrl: selectedAvatar?.avatarUrl,
        avatarName: selectedAvatar?.name,
        themeGradient:
          selectedStyle === 'Vibrant Pop Ad'
            ? 'linear-gradient(180deg, #2E9C3A 0%, #42B84F 50%, #207A2B 100%)'
            : selectedStyle === 'Commercial Packshot'
            ? 'linear-gradient(180deg, #1C2404 0%, #52670E 50%, #0F1402 100%)'
            : selectedStyle === 'Editorial Poster'
            ? 'linear-gradient(180deg, #3A0614 0%, #6E0E28 50%, #150207 100%)'
            : 'linear-gradient(180deg, #1F1B38 0%, #3B3363 50%, #110E21 100%)',
        accentColor: prod.colors[0] || '#D4FF00',
        aspectRatio: selectedRatio,
        stylePreset: 'Marketing Studio Image',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setGeneratedCreative(created);
      setIsOutputModalOpen(true);
    } catch (err) {
      console.warn('ViO Studio generation request failed:', err);
      setGenerationError('Could not reach Celoris. Check your connection and try again.');
    } finally {
      clearInterval(stageInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#08090C] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#D4FF00]/30 py-6 sm:py-8">
      {/* Subtle Dot Matrix Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#D4FF00]/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* 1. Top Centered Pill Badge: MARKETING STUDIO */}
      <header className="relative z-20 flex flex-col items-center justify-center pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-[0_0_25px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse shadow-[0_0_8px_rgba(212,255,0,0.8)]" />
          <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] text-white/90 uppercase font-sans">
            MARKETING STUDIO
          </span>
        </div>

        {/* Small subtitle indicator */}
        <span className="text-[10px] font-mono font-medium text-neutral-400 mt-1 uppercase tracking-widest">
          ViO Studio AI • Commercial Production Suite
        </span>
      </header>

      {/* 2. Visual 3D Curved Carousel Showcase */}
      <section className="relative z-20 w-full my-auto flex flex-col items-center">
        <Curved3DCarousel
          onSelectCard={handleSelectCard}
          selectedCardId="fizzo"
        />

        {/* 3. Hero Slogan Typography */}
        <div className="text-center px-4 mt-6 sm:mt-8 select-none">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans leading-tight">
            TURN ANY PRODUCT
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-400/90 font-sans mt-0.5 sm:mt-1">
            INTO READY TO POST CONTENT
          </h2>
        </div>
      </section>

      {/* 4. Floating Studio Dock (Bottom Control Deck) */}
      <footer className="relative z-20 w-full mt-6 pb-2">
        <StudioDock
          mode={mode}
          setMode={setMode}
          prompt={prompt}
          setPrompt={setPrompt}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedAngle={selectedAngle}
          setSelectedAngle={setSelectedAngle}
          selectedRatio={selectedRatio}
          setSelectedRatio={setSelectedRatio}
          variationCount={variationCount}
          setVariationCount={setVariationCount}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </footer>

      {/* Generation Progress HUD Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-2 border-t-[#D4FF00] border-r-transparent border-b-transparent border-l-transparent animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <Sparkles className="w-8 h-8 text-[#D4FF00] animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Generating Commercial Marketing Creative
            </h3>
            <p className="text-sm text-[#D4FF00] font-mono tracking-wide mb-6">
              {generationStage}
            </p>

            <div className="w-64 bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#D4FF00] h-full w-full animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation error */}
      <AnimatePresence>
        {generationError && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            role="alert"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,34rem)] rounded-2xl border border-red-500/30 bg-[#1a0b0b]/95 backdrop-blur-xl px-4 py-3 flex items-start gap-3 shadow-2xl"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-red-100">
              <p className="font-semibold text-red-300 mb-0.5">Couldn&apos;t generate your creative</p>
              <p className="text-red-100/80">{generationError}</p>
            </div>
            <button onClick={() => setGenerationError(null)} className="text-red-300/70 hover:text-red-200" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Output Modal */}
      <CreativeOutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        creative={generatedCreative}
      />
    </div>
  );
}
