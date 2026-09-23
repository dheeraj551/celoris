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
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

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

    try {
      // Background animation stages
      let stageIdx = 0;
      const stageInterval = setInterval(() => {
        stageIdx = (stageIdx + 1) % stages.length;
        setGenerationStage(stages[stageIdx]);
      }, 1400);

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

      clearInterval(stageInterval);

      let data: any = null;
      if (res.ok) {
        data = await res.json();
      }

      const created: GeneratedCreative = {
        id: `creative-${Date.now()}`,
        headline: data?.headline || (
          selectedStyle === 'Vibrant Pop Ad'
            ? 'ZERO SUGAR. 100% VIBE.'
            : selectedStyle === 'Commercial Packshot'
            ? 'PURE CELLULAR HYDRATION.'
            : selectedStyle === 'Editorial Poster'
            ? 'CHASE THE UNEXPECTED.'
            : 'ELEVATE YOUR EVERYDAY RITUAL.'
        ),
        tagline: data?.tagline || 'Crafted for high performance & unstoppable flavor.',
        badgeText: data?.badgeText || 'TRY NOW',
        ctaText: data?.ctaText || 'ORDER TODAY',
        adCopy: data?.adCopy || `Turn everyday moments into pure refreshment with ${prod.name}. Crisp, vibrant, and engineered with premium natural ingredients for taste-makers who demand the best. Tap below to claim your exclusive launch pack!`,
        hashtags: data?.hashtags || [
          `#${prod.name.replace(/\s+/g, '')}`,
          '#ViOStudio',
          '#MarketingDesign',
          '#ProductDrop',
          '#AIGeneratedAds',
          '#ReadyToPost',
        ],
        productName: prod.name,
        productImage: data?.imageUrl || prod.image,
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
        stylePreset: data?.usedModel ? 'Marketing Studio Image' : selectedStyle,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setGeneratedCreative(created);
    } catch (err) {
      console.warn('Generation failed, using fallback creative:', err);
      const created: GeneratedCreative = {
        id: `creative-${Date.now()}`,
        headline: 'STAND OUT. GET NOTICED.',
        tagline: 'High-converting commercial creative crafted for modern taste-makers.',
        badgeText: 'TRY NOW',
        ctaText: 'SHOP EXCLUSIVE',
        adCopy: `Discover why creators and customers can't stop talking about ${prod.name}. Premium quality, engineered performance, and unforgettable impact. Tap below to claim yours today!`,
        hashtags: [`#${prod.name.replace(/\s+/g, '')}`, '#ViOStudio', '#ReadyToPost'],
        productName: prod.name,
        productImage: prod.image,
        avatarUrl: selectedAvatar?.avatarUrl,
        avatarName: selectedAvatar?.name,
        themeGradient: 'linear-gradient(180deg, #2E9C3A 0%, #42B84F 50%, #207A2B 100%)',
        accentColor: prod.colors[0] || '#D4FF00',
        aspectRatio: selectedRatio,
        stylePreset: selectedStyle,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setGeneratedCreative(created);
    } finally {
      setIsGenerating(false);
      setIsOutputModalOpen(true);
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

      {/* Result Output Modal */}
      <CreativeOutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        creative={generatedCreative}
      />
    </div>
  );
}
