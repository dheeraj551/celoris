import React, { Suspense } from 'react';
import { Metadata } from 'next';
import PromptBoxClient from '@/components/prompt-box/PromptBoxClient';

export const metadata: Metadata = {
  title: 'Prompt Box — Free Copy-Paste AI Prompts & Video Workflows | Celoris',
  description:
    'Browse tested, copy-paste AI prompts for cinematic Reels, 3D WebGL worlds, UI/UX design, brand identity, and enterprise AI automation — with real output previews.',
  keywords: [
    'Celoris Prompt Box',
    'free AI video prompts',
    'Veo 3.1 prompt examples',
    'Kling 3.0 prompts',
    'Three.js 3D prompts',
    'UI UX Figma AI prompts',
    'AI email support prompt',
  ],
  alternates: {
    canonical: 'https://celorisdesigns.com/prompt-box',
  },
  openGraph: {
    title: 'Celoris Prompt Box — Copy-Paste AI Prompts That Actually Ship',
    description:
      'Get the exact prompts featured in our LinkedIn and Instagram videos with 1-click copy and production tips.',
    url: 'https://celorisdesigns.com/prompt-box',
    siteName: 'Celoris',
    type: 'website',
  },
};

export default function PromptBoxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a0d] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PromptBoxClient />
    </Suspense>
  );
}
