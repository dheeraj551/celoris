import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import '@/components/cloud/index.css';

export const metadata: Metadata = {
  title: 'Free WordPress Hosting in India | Celoris Cloud (Free While Active)',
  description:
    'Free WordPress hosting in India with instant 60-second deploy, 3 GB NVMe PCIe storage, free Let’s Encrypt SSL, and custom subdomains. Built 100% free while active for students, designers, and solo creators.',
  keywords: [
    'free wordpress hosting in india',
    'free wordpress hosting',
    'free website hosting india',
    'fast wordpress hosting india',
    'free portfolio hosting',
    'free student website hosting',
    'wordpress cloud hosting'
  ],
  alternates: {
    canonical: 'https://celorisdesigns.com/cloud',
  },
  openGraph: {
    title: 'Free WordPress Hosting in India | Celoris Cloud (Free While Active)',
    description:
      'Deploy your live WordPress site in 60 seconds with 3 GB NVMe storage, free SSL, and clean subdomains. 100% free forever while active.',
    url: 'https://celorisdesigns.com/cloud',
    siteName: 'Celoris Cloud',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free WordPress Hosting in India | Celoris Cloud',
    description:
      'High-speed, ad-free managed WordPress cloud hosting with instant subdomains and high-performance NVMe cloud servers.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Celoris Cloud really 100% free WordPress hosting in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the Starter tier is 100% free forever while active for Indian students, design learners, and creators. No credit card is required, and there are zero auto-debits or sudden paywalls. Sites inactive for 30 consecutive days are archived after 2 email reminders.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much storage is included on the free WordPress plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every free Starter account receives 3 GB of dedicated high-speed NVMe PCIe Gen4 storage with server-side caching and free wildcard SSL certificates.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I install Elementor and other WordPress plugins?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You receive full WordPress Admin (wp-admin) access to install Elementor, Astra, Gutenberg blocks, and plugins from the WordPress repository.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I connect a custom .com or .in domain later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can upgrade to Celoris Pro for just ₹149/month anytime to connect your own custom domain (yourbrand.com or .in) with 15 GB NVMe storage.'
      }
    }
  ]
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CloudApp />
    </>
  );
}
