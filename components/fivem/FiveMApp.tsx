"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Cpu,
  Shield,
  Zap,
  HardDrive,
  Network,
  Check,
  ArrowRight,
  Clock,
  RotateCcw,
  Gamepad2,
  Terminal,
  Database,
  Sparkles,
  Radio,
  Layers,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { FiveMLogo } from './FiveMLogo';

interface ServerPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  cores: string;
  coreDetails: string;
  ram: string;
  storage: string;
  portSpeed: string;
  snapshots: number;
  playerCapacity: string;
  idealFor: string;
  eurMonth: number;
  inrMonth: number;
}

export const FiveMApp: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'vps' | 'vds'>('vps');
  const [currency, setCurrency] = useState<'INR' | 'EUR'>('INR');
  const [selectedPlan, setSelectedPlan] = useState<ServerPlan | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Performance VPS Plans (Contabo Cloud VPS Plus)
  const vpsPlans: ServerPlan[] = [
    {
      id: 'vps-4',
      name: 'Cloud 5M Plus 4',
      tagline: 'Ideal for solo developers, script testing & private sandbox',
      cores: '4 vCPU Cores',
      coreDetails: 'AMD EPYC™ Gen4',
      ram: '8 GB RAM',
      storage: '150 GB NVMe PCIe',
      portSpeed: '500 Mbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 32 Players',
      idealFor: 'Solo Dev / Script Testing / Private Build',
      eurMonth: 12.74,
      inrMonth: 1199,
    },
    {
      id: 'vps-6',
      name: 'Cloud 5M Plus 6',
      tagline: 'Great for small racing, drifting or whitelisted squads',
      cores: '6 vCPU Cores',
      coreDetails: 'AMD EPYC™ Gen4',
      ram: '12 GB RAM',
      storage: '300 GB NVMe PCIe',
      portSpeed: '500 Mbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 48–64 Players',
      idealFor: 'Whitelisted Squads / Drift & Freeroam',
      eurMonth: 17.94,
      inrMonth: 1699,
    },
    {
      id: 'vps-8',
      name: 'Cloud 5M Plus 8',
      tagline: 'The sweet spot for growing public QBCore & ESX RP cities',
      badge: 'Most Popular for RP',
      isPopular: true,
      cores: '8 vCPU Cores',
      coreDetails: 'AMD EPYC™ Gen4',
      ram: '24 GB RAM',
      storage: '450 GB NVMe PCIe',
      portSpeed: '1 Gbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 64–96 Players',
      idealFor: 'Public Economy RP / Custom Vehicles & MLOs',
      eurMonth: 33.04,
      inrMonth: 2999,
    },
    {
      id: 'vps-12',
      name: 'Cloud 5M Plus 12',
      tagline: 'Heavy public servers running large scripts & police CADs',
      cores: '12 vCPU Cores',
      coreDetails: 'AMD EPYC™ Gen4',
      ram: '48 GB RAM',
      storage: '600 GB NVMe PCIe',
      portSpeed: '1 Gbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 128+ Players',
      idealFor: 'High-Concurrency Public RP / MariaDB Heavy',
      eurMonth: 55.70,
      inrMonth: 4999,
    },
    {
      id: 'vps-16',
      name: 'Cloud 5M Plus 16',
      tagline: 'Maximum VPS power for huge communities and dual cities',
      cores: '16 vCPU Cores',
      coreDetails: 'AMD EPYC™ Gen4',
      ram: '64 GB RAM',
      storage: '750 GB NVMe PCIe',
      portSpeed: '1 Gbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 160–200 Players',
      idealFor: 'Multi-City Networks / Massive Asset Streaming',
      eurMonth: 74.90,
      inrMonth: 6799,
    },
  ];

  // Max Performance Dedicated VDS Plans (Contabo Cloud VDS - 100% Dedicated Cores)
  const vdsPlans: ServerPlan[] = [
    {
      id: 'vds-s',
      name: 'Cloud VDS S',
      tagline: 'Guaranteed dedicated physical cores for rock-solid 60 FPS tickrate',
      cores: '6 Virtual Cores',
      coreDetails: 'AMD EPYC 7282 2.8 GHz (100% Dedicated)',
      ram: '24 GB Dedicated RAM',
      storage: '180 GB NVMe PCIe',
      portSpeed: '250 Mbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 96–128 Players',
      idealFor: 'Competitive Serious RP / Zero Noisy Neighbors',
      eurMonth: 46.26,
      inrMonth: 4199,
    },
    {
      id: 'vds-m',
      name: 'Cloud VDS M',
      tagline: 'The gold standard for flagship Indian & International RP servers',
      badge: 'Flagship Dedicated',
      isPopular: true,
      cores: '8 Virtual Cores',
      coreDetails: 'AMD EPYC 7282 2.8 GHz (100% Dedicated)',
      ram: '32 GB Dedicated RAM',
      storage: '240 GB NVMe PCIe',
      portSpeed: '500 Mbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 128–160 Players',
      idealFor: 'Flagship RP Cities / High AI Peds & Custom Cars',
      eurMonth: 58.53,
      inrMonth: 5299,
    },
    {
      id: 'vds-l',
      name: 'Cloud VDS L',
      tagline: 'Extreme compute for 200+ player concurrency without tickrate drop',
      cores: '12 Virtual Cores',
      coreDetails: 'AMD EPYC 7282 2.8 GHz (100% Dedicated)',
      ram: '48 GB Dedicated RAM',
      storage: '360 GB NVMe PCIe',
      portSpeed: '750 Mbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 200–250+ Players',
      idealFor: 'Mega RP Hubs / 24/7 Peak Queues',
      eurMonth: 82.13,
      inrMonth: 7399,
    },
    {
      id: 'vds-xl',
      name: 'Cloud VDS XL',
      tagline: 'Ultra high-tier dedicated workstation for giant roleplay networks',
      cores: '16 Virtual Cores',
      coreDetails: 'AMD EPYC 7282 2.8 GHz (100% Dedicated)',
      ram: '64 GB Dedicated RAM',
      storage: '480 GB NVMe PCIe',
      portSpeed: '1 Gbit/s Port',
      snapshots: 5,
      playerCapacity: 'Up to 300+ Players',
      idealFor: 'National RP Server Ecosystems',
      eurMonth: 111.39,
      inrMonth: 9999,
    },
    {
      id: 'vds-xxl',
      name: 'Cloud VDS XXL',
      tagline: 'The ultimate powerhouse — GTA 6 Modding & Next-Gen RP Ready',
      cores: '24 Virtual Cores',
      coreDetails: 'AMD EPYC 7282 2.8 GHz (100% Dedicated)',
      ram: '96 GB Dedicated RAM',
      storage: '720 GB NVMe PCIe',
      portSpeed: '1 Gbit/s Port',
      snapshots: 5,
      playerCapacity: '350+ Players / Enterprise Network',
      idealFor: 'Enterprise RP Networks / Next-Gen Modding Hubs',
      eurMonth: 164.90,
      inrMonth: 14999,
    },
  ];

  const currentPlans = activeTier === 'vps' ? vpsPlans : vdsPlans;

  const faqs = [
    {
      q: 'What is the difference between Performance VPS and Dedicated VDS for FiveM?',
      a: 'A Cloud VPS shares physical host CPU cycles with other virtual machines. While our VPS tier is high performance and powered by AMD EPYC™, large FiveM servers (100+ players) can experience tickrate micro-stutters when neighbors burst CPU. A Virtual Dedicated Server (VDS) gives you 100% dedicated physical CPU cores and RAM with zero noisy neighbors, guaranteeing stable 60.0 FPS server tickrates.',
    },
    {
      q: 'Do these servers come with txAdmin pre-installed?',
      a: 'Yes! Every server is deployed with txAdmin ready out of the box. You get instant access to the web-based management suite to run recipe deployers, view live player lists, inspect real-time server logs, restart the server with one click, and manage Discord bot webhooks.',
    },
    {
      q: 'Do I get raw root SSH access to the underlying VPS?',
      a: 'No. To ensure maximum server stability and security, we provide a fully managed Game Control Panel (txAdmin) + high-speed SFTP access rather than raw root SSH. This prevents accidental OS corruption, protects against unauthorized background scripts, and saves you from dealing with tedious Linux terminal commands. You have 100% control over all your game resources, MLOs, cars, server.cfg, and database.',
    },
    {
      q: 'Can I install my own custom MLOs, soundpacks, and vehicle packs?',
      a: 'Absolutely. You receive full high-speed SFTP access directly to your FiveM server-data folder, plus the txAdmin web manager and MariaDB database access. You can upload unlimited custom vehicles, MLOs, EUP clothing packs, and scripts without touching confusing Linux terminal commands or risking system corruption.',
    },
    {
      q: 'Do I get free web hosting for my server CAD / MDT or community site?',
      a: 'Yes! Through our Celoris Cloud partnership, every FiveM server customer receives a complimentary Celoris Cloud web hosting account. You can use it to host your server rules page, staff application forms, or custom CAD/MDT web portal.',
    },
    {
      q: 'How does DDoS protection work on FiveM servers?',
      a: 'FiveM servers are frequent targets of UDP flood and game packet exploits on port 30120. Our infrastructure includes automated Layer 3/4 and Layer 7 gaming DDoS filtering that scrubs malicious traffic at the edge before it can ever touch your server process.',
    },
    {
      q: 'Can I prepare my community on these servers for GTA 6 modding?',
      a: 'Yes! By building your player base, custom Discord, and server administration routines on Celoris Play infrastructure today, your community will be established and ready to deploy next-gen Cfx.re / Rockstar game modes the moment GTA 6 modding tools roll out.',
    },
  ];

  const handleSelectPlan = (plan: ServerPlan) => {
    setSelectedPlan(plan);
    setInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#05070c]/90 backdrop-blur-md border-b border-amber-500/15 shadow-lg shadow-black/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/cloud"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Celoris Cloud</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link href="/fivem-servers" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#0e1422] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-md shadow-amber-950/40 group-hover:border-amber-400 transition-colors">
                <FiveMLogo size={22} glow={true} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    FiveM Server Hosting
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Cfx.re Ready
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 block -mt-0.5">by Celoris Play™</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://www.youtube.com/@celorisplay"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Celoris Play YouTube</span>
            </Link>

            <a
              href="#plans"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow-md shadow-amber-500/20 transition-all duration-150 active:scale-95 flex items-center gap-2"
            >
              <FiveMLogo size={16} />
              <span>Deploy FiveM Server</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121929]/90 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xl shadow-amber-950/40">
            <FiveMLogo size={20} glow={true} />
            <span>Official FiveM™ & GTA V Server Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            High-Performance FiveM Hosting with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Guaranteed 60 FPS Tickrate
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Powered by enterprise <strong>AMD EPYC™ NVMe hardware</strong>. Instant <strong>txAdmin</strong> web control, zero texture hitching for custom MLOs and 4K cars, gaming DDoS mitigation, and 1-click QBCore / ESX setups.
          </p>

          {/* Quick HUD Metrics Bar */}
          <div className="max-w-3xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center backdrop-blur-md">
              <span className="text-xs text-neutral-400 block font-mono">Server Tickrate</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">60.0 FPS</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center backdrop-blur-md">
              <span className="text-xs text-neutral-400 block font-mono">Hardware CPU</span>
              <span className="text-lg font-bold text-amber-400 font-mono">AMD EPYC™</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center backdrop-blur-md">
              <span className="text-xs text-neutral-400 block font-mono">Control Panel</span>
              <span className="text-lg font-bold text-yellow-400 font-mono">txAdmin Ready</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center backdrop-blur-md">
              <span className="text-xs text-neutral-400 block font-mono">Anti-DDoS</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">Port 30120 🛡️</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#plans"
              className="px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-xl shadow-amber-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore Server Plans</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#specs-comparison"
              className="px-6 py-4 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 transition-colors"
            >
              VPS vs Dedicated VDS Guide
            </a>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-[#070a11] border-t border-amber-500/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Select Your FiveM Server Tier
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              Backed by Contabo’s battle-tested AMD EPYC™ infrastructure. Upgrade or downgrade anytime with 5 included automated snapshots.
            </p>

            {/* Currency & Tier Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {/* VPS vs Dedicated VDS Toggle */}
              <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTier('vps')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTier === 'vps'
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚡ Performance VPS (Value Choice)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTier('vds')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTier === 'vds'
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🚀 Max Performance VDS (100% Dedicated Cores)
                </button>
              </div>

              {/* Currency Toggle */}
              <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === 'INR' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('EUR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === 'EUR' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  € EUR
                </button>
              </div>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {currentPlans.map((plan) => {
              const displayPrice =
                currency === 'INR'
                  ? `₹${plan.inrMonth.toLocaleString()}`
                  : `€${plan.eurMonth.toFixed(2)}`;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                    plan.isPopular
                      ? 'bg-gradient-to-b from-[#131b2c] to-[#0a0f19] border-2 border-amber-400/80 shadow-2xl shadow-amber-950/40 hover:scale-[1.02]'
                      : 'bg-[#090d16] border border-white/10 hover:border-amber-400/40 hover:bg-[#0c1220]'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                    <p className="text-[11px] text-neutral-400 mt-1 min-h-[32px] leading-snug">
                      {plan.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white">{displayPrice}</span>
                        <span className="text-xs text-neutral-400 font-mono">/month</span>
                      </div>
                      <span className="text-[10px] text-amber-400/90 font-mono block mt-0.5">
                        {plan.playerCapacity}
                      </span>
                    </div>

                    {/* Specs List */}
                    <div className="space-y-2.5 mt-5 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block">{plan.cores}</span>
                          <span className="text-[10px] text-neutral-400">{plan.coreDetails}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-yellow-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block">{plan.ram}</span>
                          <span className="text-[10px] text-neutral-400">High-Frequency DDR4/ECC</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block">{plan.storage}</span>
                          <span className="text-[10px] text-neutral-400">Ultra-Fast Asset Streaming</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block">{plan.portSpeed}</span>
                          <span className="text-[10px] text-neutral-400">Unlimited Traffic</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block">{plan.snapshots} Snapshots</span>
                          <span className="text-[10px] text-neutral-400">1-Click Instant Rollback</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        plan.isPopular
                          ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/20 active:scale-95'
                          : 'bg-white/10 hover:bg-white/20 text-white active:scale-95'
                      }`}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-neutral-400 text-center block mt-2">
                      txAdmin Ready · Setup in minutes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: Why Celoris FiveM? */}
      <section className="py-20 bg-[#05070c] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Engineered for Modding</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Why Server Owners Trust Celoris Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pre-Installed txAdmin Web Suite</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Skip the complicated manual command lines. Manage your FiveM server from your browser with live player monitoring, 1-click recipe deployment, scheduled restarts, and interactive server console.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">NVMe Gen4 Storage (Zero Hitching)</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Loading custom 4K police vehicles, soundpacks, and high-poly MLO maps causes texture popping on regular SSDs. Our pure NVMe storage delivers extreme read IOPS so players never fall through roads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Port 30120 Gaming DDoS Protection</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                FiveM roleplay communities are prime targets for DDoS attacks during major server events. Contabo’s automated upstream network scrubs malicious UDP/TCP floods before they disrupt your active roleplay.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">High-Speed MariaDB / OxMySQL</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Roleplay economy scripts make thousands of SQL queries every minute for player inventories and vehicle garages. Our setups come with optimized MariaDB indexing for sub-millisecond query execution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">5 Automated Snapshot Backups</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Take an instant snapshot before installing experimental scripts or running database updates. If an unverified script corrupts your files, roll back the entire server state in 60 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Free Celoris Cloud CAD Web Hosting</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Every FiveM server customer receives a complimentary Celoris Cloud web hosting account. Host your police dispatch CAD/MDT, public server rules, staff applications, and Discord bots with zero extra bills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Frameworks Bar */}
      <section className="py-12 bg-[#090d16] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiveMLogo size={18} glow={true} />
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
              Certified for All Major FiveM & Cfx.re Frameworks
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-300 font-semibold text-sm">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> QBCore Framework
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> ESX Legacy
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ox_Core & Ox_Lib
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> vMenu / Freeroam
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Standalone Custom Scripts
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#05070c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-gradient-to-b from-[#090d16] to-[#05070c] border-t border-amber-500/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Build Your FiveM City?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Get your dedicated AMD EPYC™ server configured, txAdmin credentials delivered, and launch your roleplay community today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#plans"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Choose Server Plan
            </a>
            <Link
              href="/cloud"
              className="px-6 py-3.5 rounded-xl font-medium text-sm bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              Back to Celoris Cloud
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#030407] border-t border-white/5 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Celoris Play™ & Celoris Cloud. All rights reserved.</p>
          <div className="flex items-center gap-6 text-neutral-400">
            <Link href="/cloud/acceptable-use" className="hover:text-amber-400 transition-colors">
              Acceptable Use Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="https://www.youtube.com/@celorisplay" target="_blank" className="hover:text-amber-400 transition-colors">
              Celoris Play YouTube
            </Link>
          </div>
        </div>
      </footer>

      {/* Interactive Server Order / Inquiry Modal */}
      {inquiryModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b101c] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-amber-950/40 relative">
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Deploying Game Server Node
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{selectedPlan.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-neutral-400">Hardware Allocation:</span>
                <span className="text-white font-bold">{selectedPlan.cores} · {selectedPlan.ram}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-neutral-400">Storage IOPS:</span>
                <span className="text-amber-400 font-bold">{selectedPlan.storage}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-neutral-400">Recommended Concurrency:</span>
                <span className="text-emerald-400 font-bold">{selectedPlan.playerCapacity}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-neutral-400">Monthly Price:</span>
                <span className="text-white font-bold">
                  {currency === 'INR' ? `₹${selectedPlan.inrMonth.toLocaleString()}` : `€${selectedPlan.eurMonth.toFixed(2)}`} / mo
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              Our engineering team will provision your <strong>AMD EPYC™</strong> node on Contabo infrastructure with <strong>txAdmin pre-configured</strong>, open FiveM ports, and setup your free Celoris Cloud Web Hosting account.
            </p>

            <div className="space-y-3">
              <a
                href={`https://wa.me/919643579101?text=${encodeURIComponent(
                  `Hi Celoris Team! I want to deploy a FiveM Server on ${selectedPlan.name} (${selectedPlan.cores}, ${selectedPlan.ram}, ${selectedPlan.storage}). Please guide me through setup and IP provisioning.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Setup via WhatsApp Support</span>
              </a>

              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                Close & Review Other Tiers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
