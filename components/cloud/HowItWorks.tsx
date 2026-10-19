"use client";

import React, { useState } from 'react';
import { Terminal, Share2, Check, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface HowItWorksProps {
  onClaimClick: (subdomain?: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onClaimClick }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      title: 'Choose Your Unique Name',
      subtitle: 'Instant Subdomain Reservation',
      description: 'Pick your custom subdomain like yourname.celoris.in or studiocraft.celoris.in. No confusing DNS settings or domain purchase required.',
      highlight: 'Free permanent SSL included',
      previewType: 'domain',
    },
    {
      number: '02',
      title: 'Launch WordPress in 60s',
      subtitle: 'Zero-Config Cloud Provisioning',
      description: 'Our cloud engine automatically creates an isolated MySQL database, installs the latest WordPress core, configures OPcache & edge caching, and issues your SSL certificate.',
      highlight: 'Automated 1-Click setup',
      previewType: 'provision',
    },
    {
      number: '03',
      title: 'Share with the World',
      subtitle: 'Instant Professional Credibility',
      description: 'Add your live link to your resume, design portfolio, GitHub profile, or freelance proposal. Fast loading in under 500ms anywhere in India.',
      highlight: 'Clean link recruiters trust',
      previewType: 'share',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#080808] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase mb-2">
            Simple 3-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            From Zero to a Live Website in 3 Steps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            No complex cPanel jargon, no FTP client, and no manual database setup. Click through each step to see how it works.
          </p>
        </div>

        {/* 3 Step Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Step Cards */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#121212] border-amber-500/60 shadow-xl shadow-black'
                      : 'bg-[#0D0D0D] border-white/[0.08] hover:border-amber-500/30 hover:bg-[#111111]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                      Step {s.number}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-medium">
                      {s.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {s.title}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {s.subtitle}
                    </span>
                    <span className={`text-xs font-medium transition-colors ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>
                      {isActive ? 'Active Preview →' : 'Click to View'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Mockup Frame */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-1 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl">
              <div className="bg-[#0A0A0A] rounded-[15px] p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono text-neutral-300">
                      Celoris Workflow Simulator · Step {steps[activeStep].number}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-400">
                    60s Cloud Engine
                  </div>
                </div>

                {/* Simulated Content Body */}
                <div className="py-8">
                  {activeStep === 0 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                          Step 01 Simulation
                        </span>
                        <h4 className="text-xl font-bold text-white mt-1">
                          Claiming your clean brand link
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          Instant DNS delegation across our Asian edge network.
                        </p>
                      </div>

                      <div className="p-4 bg-[#111111] border border-amber-500/30 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-xs text-neutral-300">
                          <span>Target Subdomain</span>
                          <span className="text-amber-400 font-mono font-medium">✓ Available</span>
                        </div>
                        <div className="p-3 bg-[#080808] border border-white/10 rounded-lg font-mono text-sm text-amber-300 flex items-center justify-between">
                          <span>https://studiocraft.celoris.in</span>
                          <span className="text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                            Free While Active
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Wildcard Let’s Encrypt TLS automatically tied to this route</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onClaimClick('studiocraft')}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <span>Test Launch with studiocraft</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                          Step 02 Simulation
                        </span>
                        <h4 className="text-xl font-bold text-white mt-1">
                          Automated 60-second cloud deployment
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          Containerized latest WordPress stack initialized with Cloudflare CDN &amp; server caching.
                        </p>
                      </div>

                      <div className="bg-[#050505] p-4 rounded-xl border border-white/10 font-mono text-xs space-y-2 text-neutral-300">
                        <div className="text-neutral-500">// Celoris Auto-Installer v2.4</div>
                        <div className="text-amber-400">✓ [0.2s] Dedicated MariaDB database provisioned</div>
                        <div className="text-amber-400">✓ [0.6s] Latest WordPress core installed</div>
                        <div className="text-amber-400">✓ [1.1s] OPcache &amp; Cloudflare edge caching activated</div>
                        <div className="text-amber-400">✓ [1.4s] TLS 1.3 Let's Encrypt certificate deployed</div>
                        <div className="text-amber-400">✓ [1.8s] Site online at https://studiocraft.celoris.in</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActiveStep(2)}
                          className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span>Proceed to Step 03: Sharing</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                          Step 03 Simulation
                        </span>
                        <h4 className="text-xl font-bold text-white mt-1">
                          Put a real live URL on your resume
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          No broken previews, no localhost, no generic Google Drive folders.
                        </p>
                      </div>

                      <div className="p-4 bg-[#111111] border border-white/10 rounded-xl space-y-3">
                        <div className="text-xs font-semibold text-neutral-300">Resume / LinkedIn Ready Link:</div>
                        <div className="p-3 bg-[#080808] border border-amber-500/30 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-sm text-amber-400">
                            studiocraft.celoris.in
                          </span>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>100% Ad-Free</span>
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Recruiters and clients immediately see your live work on a custom high-speed address instead of an ugly ad-laden hosting page.
                        </p>
                      </div>

                      <button
                        onClick={() => onClaimClick()}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Claim Your Subdomain Now</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer progress bar */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-200 ${
                          activeStep === i
                            ? 'w-8 bg-amber-400'
                            : activeStep > i
                            ? 'w-4 bg-amber-600'
                            : 'w-4 bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span>Step {activeStep + 1} of 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
