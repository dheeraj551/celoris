"use client";

import React, { useState } from 'react';
import { Check, X, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ComparisonTableProps {
  onClaimClick: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onClaimClick }) => {
  const [filterView, setFilterView] = useState<'all' | 'cost' | 'experience'>('all');

  const rows = [
    {
      category: 'cost',
      feature: 'Initial Cost',
      traditional: '₹3,000 – ₹5,000 upfront yearly',
      oldFree: '₹0 (Ad-injected & strict limits)',
      celoris: '₹0 (Free Forever While Active)',
      isHighlight: true,
      celorisWin: true,
    },
    {
      category: 'cost',
      feature: 'Payment / Card Required?',
      traditional: 'Credit Card / Auto-Debit required',
      oldFree: 'None (Ad-supported)',
      celoris: 'Zero Card or UPI Info Required',
      isHighlight: true,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Third-Party Banner Ads',
      traditional: 'None',
      oldFree: 'Forced third-party banners & popups',
      celoris: '100% Ad-Free Guarantee',
      isHighlight: false,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Free Live Subdomain',
      traditional: 'None (Must purchase custom domain)',
      oldFree: 'Clunky / unbranded (e.g. .epizy.com)',
      celoris: 'Clean yourname.celoris.in',
      isHighlight: true,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Setup & Deployment Time',
      traditional: '30–60 mins (Manual cPanel & MySQL)',
      oldFree: '15–30 mins (Slow / manual scripts)',
      celoris: '60 Seconds (1-Click Automated)',
      isHighlight: false,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Upgrade to Custom Domain',
      traditional: 'Standard hosting plan renewals',
      oldFree: 'Complex or restricted',
      celoris: 'Seamless 1-Click Upgrade (₹149/mo)',
      isHighlight: false,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Storage Allocation',
      traditional: 'Shared SSD hosting plans',
      oldFree: 'Heavily throttled / restricted shared',
      celoris: '3 GB High-Speed NVMe Storage',
      isHighlight: false,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Monthly Visits Included',
      traditional: 'Metered bandwidth tiers',
      oldFree: 'Low traffic caps / CPU limits',
      celoris: '15,000 Visits / Month',
      isHighlight: false,
      celorisWin: true,
    },
    {
      category: 'experience',
      feature: 'Inactivity Policy',
      traditional: 'Suspended if subscription lapses',
      oldFree: 'Deleted randomly without warning',
      celoris: '7d Sleep · 30d Archival (2 Email Alerts)',
      isHighlight: false,
      celorisWin: true,
    },
  ];

  const filteredRows = filterView === 'all' 
    ? rows 
    : rows.filter((r) => r.category === filterView);

  return (
    <section id="comparison" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase mb-2">
            The Truth About Hosting For Beginners
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Celoris Cloud vs. The Old Way
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            Why pay thousands upfront or struggle with ad-injected free hosts just to show your design portfolio or student assignments?
          </p>

          {/* Functional filter segmented control */}
          <div className="mt-6 inline-flex p-1 bg-[#101010] rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setFilterView('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterView === 'all' ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Comparisons
            </button>
            <button
              onClick={() => setFilterView('cost')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterView === 'cost' ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cost & Cards
            </button>
            <button
              onClick={() => setFilterView('experience')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterView === 'experience' ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Speed & Quality
            </button>
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#0D0D0D]">
                <th className="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-400 w-1/4">
                  Feature / Capability
                </th>
                <th className="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-400 w-1/4">
                  Paid Shared Hosts
                  <span className="block text-[11px] font-normal text-neutral-500 normal-case mt-0.5">
                    Multi-Year Lock-In & Upfront Fees
                  </span>
                </th>
                <th className="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-400 w-1/4">
                  Generic Free Hosts
                  <span className="block text-[11px] font-normal text-neutral-500 normal-case mt-0.5">
                    Ad-Injected & Strict Limits
                  </span>
                </th>
                <th className="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-emerald-400 w-1/4 bg-emerald-950/30 border-l border-r border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Celoris Cloud</span>
                  </div>
                  <span className="block text-[11px] font-medium text-emerald-300 normal-case mt-0.5">
                    100% Free Forever While Active
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-white/[0.02] ${
                    row.isHighlight ? 'bg-white/[0.01]' : ''
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-neutral-200">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 text-neutral-400 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-400 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{row.oldFree}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 bg-emerald-950/20 border-l border-r border-emerald-500/25 font-semibold text-white text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                      <span>{row.celoris}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-[#080808]">
                <td colSpan={3} className="py-4 px-6 text-xs text-neutral-400">
                  Ready to test our cloud without giving anyone your credit card?
                </td>
                <td className="py-4 px-6 bg-emerald-950/30 border-l border-r border-emerald-500/30">
                  <button
                    onClick={onClaimClick}
                    className="w-full py-2 px-3 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Launch Free Site</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};
