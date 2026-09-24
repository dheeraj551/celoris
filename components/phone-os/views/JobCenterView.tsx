"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ChevronLeft, 
  ShieldCheck, 
  Search, 
  ArrowUpRight, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { HOT_JOBS } from '../data';
import Link from 'next/link';

interface JobCenterViewProps {
  onBack: () => void;
  onClose: () => void;
}

export function JobCenterView({ onBack, onClose }: JobCenterViewProps) {
  const [filter, setFilter] = useState<'All' | 'Remote' | 'Freelance' | 'Full-time'>('All');

  const filteredJobs = HOT_JOBS.filter(job => {
    if (filter === 'All') return true;
    return job.type === filter;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top App Header */}
      <div className="px-3 py-2.5 bg-[#0e111a] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Job Center</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8.5px] font-mono">
          <ShieldCheck className="w-2.5 h-2.5" />
          <span>0% Fees</span>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="px-3 py-2 bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border-b border-amber-500/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-white leading-tight">Verified Hiring Network</p>
          <p className="text-[8.5px] text-amber-300/90">Direct client contracts & anti-cheat badges</p>
        </div>
        <span className="text-[9px] font-mono font-bold text-amber-400">30+ Gigs</span>
      </div>

      {/* Filters */}
      <div className="px-3 py-1.5 bg-[#090c13] border-b border-white/[0.04] flex items-center gap-1 overflow-x-auto no-scrollbar">
        {(['All', 'Remote', 'Freelance', 'Full-time'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${
              filter === tab
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        {filteredJobs.map(job => (
          <Link
            key={job.id}
            href="/job-center"
            onClick={onClose}
            className="block p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-400/40 transition-all group cursor-pointer shadow-sm"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <h4 className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {job.title}
                </h4>
                <p className="text-[9px] text-slate-400">{job.company}</p>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-amber-400 shrink-0">
                {job.rate}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[8.5px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="px-1.5 py-0.2 rounded bg-white/[0.04] font-medium text-slate-300">
                  {job.type}
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>

              <span className="text-amber-400/80 group-hover:text-amber-300 font-bold flex items-center gap-0.5">
                Apply <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Hand-off Footer */}
      <div className="p-2.5 bg-[#0e111a] border-t border-white/[0.08]">
        <Link
          href="/job-center"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-lg shadow-amber-500/20"
        >
          <span>Open Full Job Center</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
