"use client"

import React, { useState } from 'react';
import { ExternalLink, Copy, Edit2, Download, TrendingUp, Users, MousePointerClick, MessageCircle, Mail, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const plan = 'Free'; // Mock state
  const router = useRouter();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans">
      <main className="p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back.</h1>
              <p className="text-white/50">Here is how your business is doing today.</p>
            </div>
            {/* Mobile plan badge */}
            <div className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
              <span className="text-sm font-medium">{plan}</span>
              <button className="text-xs text-[#10B981] font-bold">UPGRADE</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Leads Counter */}
            <div className="bg-gradient-to-br from-[#10B981]/20 to-[#0A0F1D] p-6 rounded-[32px] border border-[#10B981]/50 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 text-[#10B981] mb-4">
                <Users size={20} />
                <span className="font-medium text-sm">Total Leads</span>
              </div>
              <div className="text-4xl font-bold mb-1">2</div>
              <div className="text-sm text-green-400 font-medium">+2 this week</div>
            </div>

            {/* Page Views */}
            <div className="bg-[#0A0F1D] p-6 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-white/50">
              <div className="flex items-center gap-2 mb-4">
                <MousePointerClick size={20} />
                <span className="font-medium text-sm text-white/50">Page Views</span>
              </div>
              <div className="text-4xl font-bold mb-1 text-white">45</div>
              <div className="text-sm text-white/30">+12% from last week</div>
            </div>

            {/* Ad Spend (Disabled for free) */}
            <div className="bg-[#0A0F1D] p-6 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-white/30 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} />
                <span className="font-medium text-sm">Ad Spend</span>
              </div>
              <div className="text-4xl font-bold mb-1">-</div>
              <div className="text-sm">Only on paid plans</div>
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                 <span className="bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-lg">Upgrade to Start Ads</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* My Page Card */}
            <div className="bg-[#0A0F1D] p-6 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">My Page</h2>
                <button 
                  onClick={() => router.push('/marketing/social/edit/sonias-yoga')}
                  className="text-sm text-[#10B981] hover:text-[#34D399] flex items-center gap-1 font-medium transition-colors"
                >
                  <Edit2 size={14} /> Edit Page
                </button>
              </div>
              
              <div className="aspect-[16/9] w-full bg-black/40 rounded-xl mb-4 border border-white/5 flex items-center justify-center overflow-hidden">
                 <div className="text-center opacity-50 scale-75">
                    <h1 className="text-3xl font-bold">Sonia's Yoga</h1>
                    <p>Lajpat Nagar</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-white/70 truncate">vibe.in/sonias-yoga</span>
                  <button onClick={handleCopy} className="text-white/50 hover:text-white p-1">
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <button 
                  onClick={() => window.open('/marketing/site/sonias-yoga', '_blank')}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink size={16} /> Open
                </button>
                <button 
                  onClick={() => router.push('/marketing/social/edit/sonias-yoga')}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            </div>

            {/* Leads List */}
            <div className="bg-[#0A0F1D] p-6 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">Recent Leads</h2>
                <button className="text-xs font-medium flex items-center gap-1 text-white/50 hover:text-white transition-colors">
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {/* Lead Item */}
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors cursor-pointer">
                  <div>
                    <div className="font-medium text-sm group-hover:text-[#10B981] transition-colors">Rahul K.</div>
                    <div className="text-xs text-white/50">+91 98765 43210</div>
                  </div>
                  <div className="text-xs text-white/30 text-right">
                    <div>Today</div>
                    <div>10:42 AM</div>
                  </div>
                </div>

                {/* Lead Item */}
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors cursor-pointer">
                  <div>
                    <div className="font-medium text-sm group-hover:text-[#10B981] transition-colors">Priya Sharma</div>
                    <div className="text-xs text-white/50">+91 99887 76655</div>
                  </div>
                  <div className="text-xs text-white/30 text-right">
                    <div>Yesterday</div>
                    <div>4:15 PM</div>
                  </div>
                </div>

                {/* Empty State filler */}
                <div className="mt-auto pt-6 text-center">
                  <p className="text-sm text-white/30">Upgrade for more leads</p>
                </div>
              </div>
            </div>
            
            {/* Support Card */}
            <div className="md:col-span-2 bg-[#0A0F1D] p-6 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                 <h2 className="text-lg font-bold mb-1">Need help?</h2>
                 <p className="text-sm text-white/50">Our team is here to assist you with your marketing goals.</p>
               </div>
               
               <div className="flex gap-3 w-full md:w-auto">
                 {plan === 'Free' || plan === 'Starter' ? (
                   <button className="w-full md:w-auto bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                     <Mail size={18} /> Email Support
                   </button>
                 ) : (
                   <button className="w-full md:w-auto bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                     <MessageCircle size={18} /> WhatsApp Concierge
                   </button>
                 )}
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Simple icon representation since we don't want to break the imports
function LayoutTemplate(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
}
