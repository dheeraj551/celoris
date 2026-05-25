"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Smartphone, Check, Star, ChevronDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function MarketingHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    setIsGenerating(true);
    setTimeout(() => {
      router.push('/marketing/social/onboarding');
    }, 1500);
  };

  const renderAnimatedLetters = (text: string, delayOffset: number) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={`${text}-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayOffset + index * 0.03, duration: 0.5, ease: "easeOut" }}
        className="inline-block whitespace-pre"
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white selection:bg-[#10B981]/30">
      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 flex flex-col items-center justify-center text-center relative">
        <div className="absolute top-[40%] right-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#10B981] rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10B981]">Launch your business online in under 10 minutes</span>
          </span>
          <h1 className="text-5xl md:text-[84px] font-black tracking-tighter mb-6 max-w-4xl mx-auto leading-[0.85]">
            {renderAnimatedLetters("YOUR AI ", 0.1)}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">
              {renderAnimatedLetters("MARKETING TEAM", 0.34)}
            </span>
            {renderAnimatedLetters(", READY TO WORK.", 0.76)}
          </h1>
          <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a professional website, expert ad campaigns, and real leads delivered to your phone. We do the work, you grow your business.
          </p>

          <div className="w-full max-w-2xl mx-auto mb-8 bg-[#0A0F1D] border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <input 
              type="text" 
              placeholder="What do you sell or offer?" 
              className="bg-transparent w-full px-6 py-4 outline-none text-white placeholder-white/40 text-lg"
            />
            <button 
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="bg-[#10B981] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all whitespace-nowrap disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing AI...
                </>
              ) : (
                <>
                  Generate Free Page <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/50">
             <span className="bg-[#0A0F1D] px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:border-[#10B981]/50 transition-colors">Yoga classes</span>
             <span className="bg-[#0A0F1D] px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:border-[#10B981]/50 transition-colors">Handmade jewelry</span>
             <span className="bg-[#0A0F1D] px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:border-[#10B981]/50 transition-colors">Software consulting</span>
             <span className="bg-[#0A0F1D] px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:border-[#10B981]/50 transition-colors">Home catering</span>
          </div>

          <div className="mt-16 inline-flex flex-col sm:flex-row gap-8 px-8 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-bold">10min</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">To Launch</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10 self-center"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-bold">₹999</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Managed Growth</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10 self-center"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-bold">AI + Human</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Verified Leads</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Social Proof */}
      <section className="border-y border-white/5 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#10B981]">12k+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest text-left">Pages<br/>Launched</span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#10B981]">2.4M+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest text-left">Leads<br/>Generated</span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[#10B981]">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-widest text-left">4.9/5<br/>Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-6 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Real Results from Real Businesses</h2>
          <p className="text-white/50 text-lg">See how we are helping businesses grow.</p>
        </div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-20 pb-8 scrollbar-hide w-full max-w-7xl mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            {
              quote: "Since using Vibe Marketing, our gym memberships have doubled. The AI built a beautiful page and the leads just started rolling in.",
              name: "Rahul Sharma",
              business: "FitLife Gym"
            },
            {
              quote: "As a freelance designer, I struggled with marketing. Now, my portfolio looks amazing and I get qualified clients reaching out every week.",
              name: "Priya Patel",
              business: "UX/UI Freelancer"
            },
            {
              quote: "The easiest setup I've ever seen. We launched our catering business online in 10 minutes, and the first order came in the next day.",
              name: "Amit Desai",
              business: "Desai Catering"
            },
            {
              quote: "I thought I needed an expensive agency. Vibe Marketing does it all automatically. Incredible value for small business owners like myself.",
              name: "Sneha Kapoor",
              business: "Boutique Owner"
            }
          ].map((t, idx) => (
            <div key={idx} className="min-w-[300px] md:min-w-[400px] bg-[#0A0F1D] p-8 rounded-[32px] border border-white/10 snap-center shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex text-[#10B981] mb-6">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-lg md:text-xl text-white/80 mb-8 italic">"{t.quote}"</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-white/50">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How Our AI Business Launchpad Works</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Three simple steps to go from idea to receiving qualified leads on your phone.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="absolute top-12 left-1/6 right-1/6 h-px bg-white/10 hidden md:block -z-10"></div>
          
          <div className="bg-[#0A0F1D] p-8 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-6 border border-[#10B981]/50 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">1. Questionnaire</h3>
            <p className="text-white/50 text-center text-sm leading-relaxed">Tell our AI what you sell and who your customers are. It takes less than 60 seconds.</p>
          </div>

          <div className="bg-[#0A0F1D] p-8 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-6 border border-[#10B981]/50 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">2. AI Page Generation</h3>
            <p className="text-white/50 text-center text-sm leading-relaxed">We automatically write the copy, design the layout, and launch your free professional website.</p>
          </div>

          <div className="bg-[#0A0F1D] p-8 rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-6 border border-[#10B981]/50 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Smartphone size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">3. Lead Delivery</h3>
            <p className="text-white/50 text-center text-sm leading-relaxed">Choose a plan, let our experts run your ads, and receive qualified leads straight to your WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#0A0F1D] py-32 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Scalable Marketing Plans for Your Business</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Start with a free page, pay when you want leads.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-[#050810] rounded-3xl p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-white/50 text-sm mb-6">Perfect for small local businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹999</span>
                <span className="text-white/50">/mo</span>
              </div>
              <button 
                onClick={() => router.push('/marketing/social/onboarding')}
                className="w-full py-3 rounded-xl border border-white/20 font-medium mb-8 hover:bg-white/5 transition-colors"
              >
                Get Started
              </button>
              <div className="space-y-4 text-sm text-white/80">
                <div className="flex items-center gap-3"><Check size={18} className="text-green-400" /> Free Landing Page</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-green-400" /> AI page generation</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-green-400" /> Up to 20 Leads / month</div>
                <div className="flex items-center gap-3 opacity-50"><Check size={18} /> Human expert review</div>
                <div className="flex items-center gap-3 opacity-50"><Check size={18} /> Ad campaign setup</div>
              </div>
            </div>

            {/* Growth */}
            <div className="bg-gradient-to-b from-[#10B981]/20 to-[#0A0F1D] rounded-3xl p-8 border border-[#10B981]/50 relative scale-105 shadow-2xl shadow-[#10B981]/10">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-[#10B981] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Recommended</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-white/50 text-sm mb-6">For serious freelancers & trainers</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹2,499</span>
                <span className="text-white/50">/mo</span>
              </div>
              <button 
                onClick={() => router.push('/marketing/social/onboarding')}
                className="w-full py-3 rounded-xl bg-[#10B981] font-medium mb-8 hover:bg-[#059669] transition-colors"
              >
                Start Growing
              </button>
              <div className="space-y-4 text-sm text-white/80">
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> Free Landing Page</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> AI page generation</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> Up to 75 Leads / month</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> Human expert review (monthly)</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> FB + Google Ads setup</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-[#10B981]" /> WhatsApp Support</div>
              </div>
            </div>

            {/* Scale */}
            <div className="bg-[#050810] rounded-3xl p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-2">Scale</h3>
              <p className="text-white/50 text-sm mb-6">Full agency replacement</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹5,999</span>
                <span className="text-white/50">/mo</span>
              </div>
              <button 
                onClick={() => router.push('/marketing/social/onboarding')}
                className="w-full py-3 rounded-xl border border-white/20 font-medium mb-8 hover:bg-white/5 transition-colors"
              >
                Go Unlimited
              </button>
              <div className="space-y-4 text-sm text-white/80">
                <div className="flex items-center gap-3"><Check size={18} className="text-white" /> Free Landing Page</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-white" /> Unlimited Leads</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-white" /> Bi-weekly expert review</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-white" /> Dedicated Account Manager</div>
                <div className="flex items-center gap-3"><Check size={18} className="text-white" /> FB + Google + Retargeting Ads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 text-sm text-white/50">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded bg-[#10B981]/20 flex items-center justify-center font-bold text-xs text-[#10B981]">
            V
          </div>
          <span>&copy; 2026 Vibe Marketing by Celoris. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Made in India with ❤️</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
