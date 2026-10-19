import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import '@/components/cloud/index.css';

export const metadata: Metadata = {
  title: 'FiveM Server Hosting | Dedicated AMD EPYC™ NVMe GTA RP Servers | Celoris Play',
  description:
    'Deploy high-performance GTA V & FiveM roleplay servers with guaranteed 60 FPS tickrate. Powered by enterprise AMD EPYC™ NVMe infrastructure, pre-installed txAdmin, gaming DDoS mitigation, and 1-click QBCore / ESX setups.',
  keywords: [
    'fivem server hosting',
    'fivem server hosting india',
    'gta rp server hosting',
    'cheap fivem hosting',
    'contabo fivem server',
    'dedicated fivem server',
    'fivem vds hosting',
    'txadmin server hosting',
    'celoris play fivem',
    'qbcore server hosting'
  ],
  alternates: {
    canonical: 'https://celorisdesigns.com/fivem-servers',
  },
  openGraph: {
    title: 'FiveM Server Hosting | High-Performance AMD EPYC™ NVMe Servers',
    description:
      'Guaranteed 60 FPS tickrate FiveM servers with pre-installed txAdmin, zero texture hitching NVMe storage, and gaming DDoS protection.',
    url: 'https://celorisdesigns.com/fivem-servers',
    siteName: 'Celoris Play™ Gaming Infrastructure',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FiveM Server Hosting | Celoris Play',
    description:
      'High-performance FiveM game servers on enterprise AMD EPYC™ hardware with txAdmin and gaming DDoS filtering.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between Performance VPS and Dedicated VDS for FiveM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Cloud VPS shares physical CPU cores with other virtual machines, making it ideal for solo development and growing servers under 96 players. A Virtual Dedicated Server (VDS) provides 100% dedicated AMD EPYC physical CPU cores and RAM with zero noisy neighbors, guaranteeing stable 60.0 FPS tickrate for 128 to 300+ player roleplay communities.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does the server include txAdmin pre-installed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Every server is deployed with txAdmin pre-installed out of the box with web console access, live player monitoring, scheduled restarts, and 1-click recipe deployment.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do I get raw root SSH access to the underlying VPS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. To ensure maximum server stability and security, we provide a fully managed Game Control Panel (txAdmin) + high-speed SFTP access rather than raw root SSH. This prevents accidental OS corruption, protects against unauthorized background scripts, and saves you from dealing with tedious Linux terminal commands. You have 100% control over all your game resources, MLOs, cars, server.cfg, and database.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I install custom MLOs, soundpacks, and high-poly vehicle mods?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, full high-speed SFTP access and txAdmin web suite are provided. Ultra-fast NVMe PCIe Gen4 storage prevents client texture streaming hitching and void falls.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is free web hosting included for community CAD/MDT systems?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, every FiveM server customer receives a complimentary Celoris Cloud web hosting account to host their police dispatch CAD/MDT, public server rules, staff applications, and Discord webhooks.'
      }
    }
  ]
};

const FiveMApp = dynamic(() => import('@/components/fivem/FiveMApp').then(mod => mod.FiveMApp), {
  loading: () => (
    <div className="min-h-screen bg-[#05070c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
        <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">Loading Celoris 5M Servers...</span>
      </div>
    </div>
  ),
});

export default function FiveMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FiveMApp />
    </>
  );
}
