"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ChevronLeft, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface JobCenterViewProps {
  onBack: () => void;
  onClose: () => void;
}

interface LiveJob {
  id: string;
  title: string;
  company: string;
  rate: string;
  type: 'Remote' | 'Freelance' | 'Full-time' | 'Contract';
  location: string;
  verified: boolean;
  featured?: boolean;
}

export function JobCenterView({ onBack, onClose }: JobCenterViewProps) {
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Remote' | 'Freelance' | 'Full-time'>('All');

  const fetchLiveJobs = async () => {
    try {
      const supabase = createClient();

      // 1. Fetch live certified jobs (real Indian freelance and contract gigs)
      const { data: certData, error: certErr } = await supabase
        .from('certified_jobs')
        .select('id, title, company, location, salary_range, work_mode, featured, hiring_manager_verified, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (certErr) {
        console.error('Error fetching certified jobs:', certErr);
      }

      // 2. Also fetch jobs from main jobs table
      const { data: stdData, error: stdErr } = await supabase
        .from('jobs')
        .select('id, title, company_name, location, is_remote, employment_type, salary_min, salary_max, salary_currency, is_featured, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(15);

      if (stdErr) {
        console.error('Error fetching standard jobs:', stdErr);
      }

      const formattedCert: LiveJob[] = (certData || []).map((row: any) => {
        const isRemote = row.work_mode?.toLowerCase() === 'remote' || row.location?.toLowerCase().includes('remote');
        let jobType: LiveJob['type'] = isRemote ? 'Remote' : 'Contract';
        const titleLower = (row.title || '').toLowerCase();
        const salLower = (row.salary_range || '').toLowerCase();
        if (salLower.includes('reel') || salLower.includes('hour') || titleLower.includes('freelance') || titleLower.includes('creator')) {
          jobType = isRemote ? 'Remote' : 'Freelance';
        }

        return {
          id: row.id,
          title: row.title || 'Creative & Tech Role',
          company: row.company === 'Confidential Client' ? 'Verified Client' : (row.company || 'Celoris Client'),
          rate: row.salary_range || 'Competitive',
          type: jobType,
          location: row.location || 'Remote',
          verified: row.hiring_manager_verified ?? true,
          featured: row.featured,
        };
      });

      const formattedStd: LiveJob[] = (stdData || []).map((row: any) => {
        let rateStr = 'Competitive';
        if (row.salary_min && row.salary_max) {
          const sym = row.salary_currency === 'INR' ? '₹' : (row.salary_currency === 'USD' ? '$' : '₹');
          rateStr = `${sym}${row.salary_min.toLocaleString()} – ${sym}${row.salary_max.toLocaleString()}`;
        } else if (row.salary_min) {
          const sym = row.salary_currency === 'INR' ? '₹' : '$';
          rateStr = `From ${sym}${row.salary_min.toLocaleString()}`;
        }

        const isRemote = row.is_remote || row.location?.toLowerCase().includes('remote');
        const empType = (row.employment_type || '').toLowerCase();
        let jobType: LiveJob['type'] = 'Full-time';
        if (isRemote) jobType = 'Remote';
        else if (empType.includes('freelance') || empType.includes('contract')) jobType = 'Freelance';

        return {
          id: row.id,
          title: row.title || 'Role Spec',
          company: row.company_name || 'Celoris Partner',
          rate: rateStr,
          type: jobType,
          location: row.location || (isRemote ? 'Remote' : 'India'),
          verified: true,
          featured: row.is_featured,
        };
      });

      const combined = [...formattedCert, ...formattedStd];
      if (combined.length > 0) {
        setJobs(combined);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveJobs();

    // Realtime Supabase Subscription
    const supabase = createClient();
    const channel = supabase
      .channel('public:certified_jobs:phone_os')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certified_jobs' }, () => {
        fetchLiveJobs();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchLiveJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (filter === 'All') return true;
    if (filter === 'Remote') return job.type === 'Remote' || job.location.toLowerCase().includes('remote');
    if (filter === 'Freelance') return job.type === 'Freelance' || job.rate.includes('Reel') || job.rate.includes('hour');
    if (filter === 'Full-time') return job.type === 'Full-time';
    return true;
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
          <p className="text-[8.5px] text-amber-300/90">Direct client contracts &amp; verified badges</p>
        </div>
        <span className="text-[9px] font-mono font-bold text-amber-400">
          {loading ? 'Syncing...' : `${jobs.length} Live Gigs`}
        </span>
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
        {loading && jobs.length === 0 ? (
          <div className="py-6 space-y-2.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
                <div className="h-3 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-2.5 w-1/3 bg-white/5 rounded mb-3" />
                <div className="h-2 w-1/2 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Briefcase className="w-6 h-6 mx-auto mb-2 opacity-40 text-amber-400" />
            <p className="text-xs font-medium">No {filter} gigs right now</p>
            <p className="text-[9px] text-slate-500 mt-1">Check back soon or explore all listings</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <Link
              key={job.id}
              href="/job-center"
              onClick={onClose}
              className="block p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-400/40 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
            >
              {job.featured && (
                <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg bg-amber-500/20 border-l border-b border-amber-500/30 text-[7.5px] font-mono font-bold text-amber-300">
                  Featured
                </div>
              )}
              <div className="flex items-start justify-between gap-1 mb-1 pr-12">
                <div>
                  <h4 className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-1">
                    {job.title}
                  </h4>
                  <p className="text-[9px] text-slate-400">{job.company}</p>
                </div>
              </div>

              <div className="mb-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-400">
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
          ))
        )}
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
