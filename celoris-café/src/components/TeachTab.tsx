import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Clock, Plus, Compass, ChevronRight } from 'lucide-react';

export default function TeachTab() {
  const [activeTab, setActiveTab] = useState<'roster' | 'propose'>('roster');

  const upcomingCohorts = [
    {
      id: 'co1',
      title: 'Python Scripts & Automations for Excel wizards',
      instructor: 'Vikram Singh (BITS Pilani)',
      time: 'Tomorrow, 5:00 PM IST',
      duration: '60 mins',
      capacity: '20 seats',
      enrolled: 14,
    },
    {
      id: 'co2',
      title: 'Monsoon Indie Guitar chord shapes masterclass',
      instructor: 'Sneha Patel (IIT Madras)',
      time: 'Sunday, 7:00 PM IST',
      duration: '90 mins',
      capacity: '15 seats',
      enrolled: 9,
    },
    {
      id: 'co3',
      title: 'Option trading backtesting in Google Sheets',
      instructor: 'Rohan Mehta (SRCC Delhi)',
      time: 'Monday, 4:00 PM IST',
      duration: '45 mins',
      capacity: '30 seats',
      enrolled: 26,
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-950/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Teach Platform
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black italic text-white tracking-wide mt-1 uppercase">
            STUDENT TRAINER WORKSPACE
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build your brand, share your industry-level skill hacks, and mentor peers. We provide the tools; you provide the magic.
          </p>
        </div>

        <div className="flex bg-[#121212] border border-emerald-950/40 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'roster' ? 'bg-emerald-500 text-[#0a0a0a]' : 'text-gray-400 hover:text-white'}`}
          >
            Scheduled cohorts
          </button>
          <button 
            onClick={() => setActiveTab('propose')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'propose' ? 'bg-emerald-500 text-[#0a0a0a]' : 'text-gray-400 hover:text-white'}`}
          >
            Propose custom session
          </button>
        </div>
      </div>

      {activeTab === 'roster' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Upcoming peer-led schedules</span>
            </h3>
            <span className="text-xs text-gray-500">Muted automatic recording enabled</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingCohorts.map((co) => (
              <div 
                key={co.id}
                className="group relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-emerald-950/30 p-5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                      {co.duration}
                    </span>
                    <span className="font-semibold">{co.capacity} max</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1.5 leading-snug line-clamp-2">
                      {co.title}
                    </h4>
                    <span className="block text-xs text-emerald-400/90 font-medium">{co.instructor}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-950/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-mono">Date & Time</span>
                    <span className="text-xs text-gray-300 font-semibold">{co.time}</span>
                  </div>

                  <button 
                    onClick={() => alert(`Seat Request: Proposing seat booking for "${co.title}". Welcome to the lounge!`)}
                    className="py-1.5 px-3 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold text-xs hover:bg-emerald-500 hover:text-[#0a0a0a] transition-all cursor-pointer"
                  >
                    Book seat ({co.capacity.split(' ')[0]} available)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-[#0d0d0d] rounded-2xl border border-emerald-950/30 p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Lounge Masterclass Proposal</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              Ready to teach peer cohorts? Describe your idea below. All courses are verified first by the mentor group before publishing.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Proposal Submitted: Your cohort proposal will be reviewed in 2 hours! Monitor your university mailbox."); }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Lounge Class Title</label>
              <input 
                type="text"
                placeholder="e.g. Backtesting Nifty F&O inside Google Sheets"
                className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Class Date</label>
                <input 
                  type="date"
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Start Time (IST)</label>
                <input 
                  type="time"
                  className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Class description & outline</label>
              <textarea 
                rows={3}
                placeholder="Describe what resources (Figma file, Sheets, GitHub) you will share with students..."
                className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none resize-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)] cursor-pointer"
            >
              Submit Session Proposal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
