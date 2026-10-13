"use client";

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  CelorisNvmeGraphic,
  CelorisTlsGraphic,
  CelorisAdFreeGraphic,
  CelorisContainerGraphic,
} from './CelorisGraphics';

export const InfrastructureBar: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    {
      id: 0,
      GraphicComponent: CelorisNvmeGraphic,
      title: 'Ultra-Fast NVMe SSD',
      headline: 'LiteSpeed-powered servers for instant loading',
      spec: 'PCIe Gen4 storage with up to 7,000 MB/s read speeds and server-level LSCache.',
      detail: 'Unlike traditional spinning disks or budget SATA SSDs used by cheap shared hosts, Celoris provisions ultra-fast NVMe storage clusters located strategically in Asia-South for lightning-quick Indian page loads.',
      badge: 'Asia-South Node',
    },
    {
      id: 1,
      GraphicComponent: CelorisTlsGraphic,
      title: 'Free Let’s Encrypt SSL',
      headline: 'Built-in green padlock security on every subdomain',
      spec: 'Automated TLS 1.3 encryption with 90-day auto-renewal and HTTP/2 protocol.',
      detail: 'Never pay ₹899/year for basic SSL. Every site on yourname.celoris.in receives a hardware-accelerated Let’s Encrypt SSL certificate deployed instantly during the 60-second provisioning process.',
      badge: 'TLS 1.3 Certified',
    },
    {
      id: 2,
      GraphicComponent: CelorisAdFreeGraphic,
      title: '100% Ad-Free Guarantee',
      headline: 'Your website belongs to you; no injected banner ads',
      spec: 'Zero third-party script injection, zero spam popups, 100% clean code.',
      detail: 'Many free web hosts litter student portfolios with intrusive third-party banner ads and popups. Celoris Cloud guarantees 100% ad-free hosting forever.',
      badge: 'Zero Injections',
    },
    {
      id: 3,
      GraphicComponent: CelorisContainerGraphic,
      title: 'Isolated & Secure',
      headline: 'Dedicated memory limits to protect your site 24/7',
      spec: 'CGroup container isolation with dedicated PHP memory and daily health scans.',
      detail: 'Every WordPress instance runs in its own sandboxed virtual runtime. If another site experiences a traffic spike, your portfolio remains unaffected, lightning fast, and fully responsive.',
      badge: 'Containerized',
    },
  ];

  return (
    <section id="infrastructure" className="py-16 bg-[#080808] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase mb-2">
            Enterprise Infrastructure · Free For Students
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Built on Real Cloud Architecture. Never Compromised.
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Click any infrastructure pillar below to inspect our real server-grade specifications.
          </p>
        </div>

        {/* 4-Column Feature Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => {
            const Graphic = feat.GraphicComponent;
            const isExpanded = selectedFeature === feat.id;

            return (
              <div
                key={feat.id}
                onClick={() => setSelectedFeature(isExpanded ? null : feat.id)}
                className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isExpanded
                    ? 'bg-[#121212] border-emerald-500/50 shadow-lg shadow-black'
                    : 'bg-[#0D0D0D] border-white/[0.08] hover:border-emerald-500/30 hover:bg-[#111111]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#0A0A0A] border border-emerald-500/30 p-1 flex items-center justify-center">
                      <Graphic className="w-9 h-9" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-neutral-400">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>{feat.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {feat.headline}
                  </p>
                </div>

                {/* Expanded Technical Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{feat.spec}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {feat.detail}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
