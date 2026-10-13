import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import '@/components/cloud/index.css';

export const metadata: Metadata = {
  title: 'Celoris Cloud | 100% Free Managed WordPress Cloud Hosting',
  description:
    'High-speed, ad-free managed WordPress cloud hosting built for Indian design learners, students, freshers, and solo creators. Instant 60-second deploy, free Let’s Encrypt SSL, and custom subdomains.',
  alternates: {
    canonical: 'https://celorisdesigns.com/cloud',
  },
  openGraph: {
    title: 'Celoris Cloud | 100% Free Managed WordPress Hosting',
    description:
      'Deploy your live portfolio or agency site in 60 seconds with LiteSpeed NVMe storage, free SSL, and clean custom subdomains. 100% free forever for students.',
    url: 'https://celorisdesigns.com/cloud',
    siteName: 'Celoris',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celoris Cloud | 100% Free Managed WordPress Hosting',
    description:
      'High-speed, ad-free managed WordPress cloud hosting for students and creators with instant subdomains and NVMe LiteSpeed servers.',
  },
};

const CloudApp = dynamic(() => import('@/components/cloud/App'), {
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">Loading Celoris Cloud...</span>
      </div>
    </div>
  ),
});

export default function CloudPage() {
  return <CloudApp />;
}
