"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Package, Briefcase, MapPin, Store, Sparkles, LayoutTemplate, UserCircle, Rocket, MonitorPlay } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

const STEPS = 8;

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'product' | 'service' | null>(null);
  const [category, setCategory] = useState<string>('');
  const [businessDetails, setBusinessDetails] = useState({ name: '', city: '', description: '' });
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [loadingText, setLoadingText] = useState('Writing your headline...');

  const router = useRouter();
  const { user } = useAuth();

  // Onboarding state restoration
  useEffect(() => {
    const pendingDataStr = localStorage.getItem('celoris_pending_onboarding');
    if (pendingDataStr) {
      try {
        const pendingData = JSON.parse(pendingDataStr);
        if (pendingData.businessDetails) setBusinessDetails(pendingData.businessDetails);
        if (pendingData.businessType) setBusinessType(pendingData.businessType);
        if (pendingData.category) setCategory(pendingData.category);
        if (pendingData.selectedTemplate) setSelectedTemplate(pendingData.selectedTemplate);
        
        // If user is now logged in, restore and advance to Step 7
        if (user) {
          setStep(7);
          localStorage.removeItem('celoris_pending_onboarding');
        }
      } catch (e) {
        console.error("Error restoring pending onboarding:", e);
      }
    }
  }, [user]);

  const nextStep = () => Math.min(step + 1, STEPS);
  const prevStep = () => Math.max(step - 1, 1);

  // Loading animation simulation
  useEffect(() => {
    if (step === 5) {
      const texts = ['Writing your headline...', 'Adding your offers...', 'Designing the layout...', 'Publishing...'];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i < texts.length) setLoadingText(texts[i]);
        else {
          clearInterval(interval);
          setStep(6);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans flex flex-col">
      {/* Progress Steps Bar */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <button 
          onClick={() => step > 1 ? setStep(prevStep()) : router.push('/marketing/social')} 
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        {step < 5 && (
          <div className="flex gap-2 items-center">
            {[1,2,3,4].map(i => (
              <div 
                key={i} 
                className={`w-12 h-1 rounded-full ${i <= step ? 'bg-[#10B981]' : 'bg-white/10'}`}
              />
            ))}
          </div>
        )}
        
        <div className="w-8"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20 relative">
        <div className="absolute top-[40%] right-[10%] w-[100px] h-[100px] md:w-[300px] md:h-[300px] bg-[#10B981] rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="w-full max-w-xl bg-[#0A0F1D] rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-8 md:p-12 relative z-10 flex flex-col min-h-[500px]">
          <span className="text-[#10B981] text-xs font-bold uppercase tracking-widest mb-2 block w-full text-center">Step {step} of {STEPS}</span>
          
          <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 1: What do you sell? */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center"
              >
                <h1 className="text-3xl font-bold mb-4 leading-tight">Tell us what you <br/> sell today.</h1>
                <p className="text-white/50 mb-10 text-sm">We'll customize your page based on your offering.</p>
              
              <div className="space-y-4 text-left">
                <button 
                  onClick={() => { setBusinessType('product'); setStep(nextStep()); }}
                  className="w-full p-4 rounded-2xl bg-[#10B981] border border-[#10B981]/50 flex items-center gap-4 cursor-pointer hover:bg-[#10B981]/90 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Products</p>
                    <p className="text-xs text-white/80">Handmade, food, or physical goods</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => { setBusinessType('service'); setStep(nextStep()); }}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Services</p>
                    <p className="text-xs text-white/50">Tutoring, freelancing, or events</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

            {/* Step 2: Category */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center"
              >
                <h1 className="text-3xl font-bold mb-8 leading-tight">Select your category</h1>
                <div className="grid grid-cols-2 gap-4">
                {businessType === 'service' ? (
                  ['Yoga/Fitness', 'Tuition', 'Photography', 'Consulting', 'Event Planning', 'Beauty/Salon'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => { setCategory(c); setStep(nextStep()); }}
                      className="bg-[#0A0F1D] p-4 rounded-xl border border-white/10 hover:border-[#10B981] transition-colors"
                    >
                      {c}
                    </button>
                  ))
                ) : (
                  ['Clothing', 'Handicrafts', 'Food/Bakery', 'Jewelry', 'Electronics', 'Other'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => { setCategory(c); setStep(nextStep()); }}
                      className="bg-[#0A0F1D] p-4 rounded-xl border border-white/10 hover:border-[#10B981] transition-colors"
                    >
                      {c}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md w-full"
            >
              <h1 className="text-3xl font-bold mb-2 text-center">Tell us more</h1>
              <p className="text-white/50 mb-8 text-center">These details will be used on your page.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Business Name (Optional)</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 text-white/30" size={20} />
                    <input 
                      type="text" 
                      value={businessDetails.name}
                      onChange={(e) => setBusinessDetails({...businessDetails, name: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#10B981] transition-colors"
                      placeholder="e.g. Sonia's Yoga"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">City / Area *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-white/30" size={20} />
                    <input 
                      type="text" 
                      value={businessDetails.city}
                      onChange={(e) => setBusinessDetails({...businessDetails, city: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#10B981] transition-colors"
                      placeholder="e.g. Lajpat Nagar, Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">One-line description (Optional)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={businessDetails.description}
                      onChange={(e) => setBusinessDetails({...businessDetails, description: e.target.value})}
                      className="w-full bg-[#0A0F1D] border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#10B981] transition-colors"
                      placeholder="e.g. Daily morning yoga classes for beginners"
                    />
                  </div>
                </div>

                <button 
                  disabled={!businessDetails.city}
                  onClick={() => setStep(nextStep())}
                  className="w-full mt-4 bg-[#10B981] text-white font-medium py-4 rounded-xl disabled:opacity-50 hover:bg-[#059669] transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Pick Template */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl w-full text-center"
            >
              <h1 className="text-3xl font-bold mb-8">Pick a starting design</h1>
              <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                {[1, 2, 3, 4].map((t) => (
                  <div 
                    key={t}
                    onClick={() => setSelectedTemplate(t)}
                    className={`min-w-[280px] snap-center cursor-pointer transition-all ${selectedTemplate === t ? 'ring-2 ring-[#10B981] scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className="h-64 bg-[#0A0F1D] border border-white/10 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <LayoutTemplate size={48} className="text-white/20" />
                      {selectedTemplate === t && (
                        <div className="absolute top-3 right-3 bg-[#10B981] rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">Design Variant {t}</span>
                  </div>
                ))}
              </div>
              <button 
                disabled={!selectedTemplate}
                onClick={() => setStep(nextStep())}
                className="bg-[#10B981] px-10 py-4 rounded-xl font-medium disabled:opacity-50 mt-4 flex items-center gap-2 mx-auto"
              >
                <Sparkles size={20} /> Generate my Magic Page
              </button>
            </motion.div>
          )}

          {/* Step 5: AI Generation Loading */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mb-8"
              >
                <Sparkles size={48} className="text-[#10B981]" />
              </motion.div>
              <h2 className="text-2xl font-bold animate-pulse">{loadingText}</h2>
              <p className="text-white/50 mt-2">Putting together {businessDetails.name || 'your new business'} in {businessDetails.city}</p>
            </motion.div>
          )}

          {/* Step 6: Preview */}
          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl w-full flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Page is Ready!</h1>
                <button 
                  onClick={() => setStep(nextStep())}
                  className="bg-[#10B981] px-6 py-2 rounded-lg font-medium hover:bg-[#059669] transition-colors"
                >
                  Publish & Claim
                </button>
              </div>

              {/* Mock Preview iframe/container */}
              <div className="w-full bg-[#0A0F1D] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="bg-black/30 px-4 py-3 flex gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                {/* Content mockup */}
                <div className="p-8 md:p-16 text-center animate-in fade-in duration-700">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                    {businessDetails.name || 'Best Classes'} in {businessDetails.city}
                  </h1>
                  <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto">
                    {businessDetails.description || 'Join our highly rated programs today and transform your skills with expert guidance.'}
                  </p>
                  <div className="inline-block bg-[#10B981] px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#10B981]/20">
                    Contact Us Now
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Account Creation */}
          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-[#0A0F1D] p-8 rounded-3xl border border-white/10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold">{user ? "Claim your page" : "Save your page"}</h1>
                <p className="text-white/50 text-sm mt-2">
                  {user 
                    ? `You are signed in as ${user.email}. Save this page to your account.` 
                    : "Create a Celoris account or sign in to save your page and manage leads."}
                </p>
              </div>

              <div className="space-y-4">
                {user ? (
                  <button 
                    onClick={() => setStep(nextStep())}
                    className="w-full bg-[#10B981] text-white font-medium py-4 rounded-xl hover:bg-[#059669] transition-colors"
                  >
                    Claim & Continue
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        localStorage.setItem('celoris_pending_onboarding', JSON.stringify({
                          businessDetails,
                          businessType,
                          category,
                          selectedTemplate
                        }));
                        router.push('/login?redirect=/marketing/social/onboarding');
                      }}
                      className="w-full bg-[#10B981] text-white font-medium py-4 rounded-xl hover:bg-[#059669] transition-colors"
                    >
                      Sign In to Celoris
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.setItem('celoris_pending_onboarding', JSON.stringify({
                          businessDetails,
                          businessType,
                          category,
                          selectedTemplate
                        }));
                        router.push('/register?redirect=/marketing/social/onboarding');
                      }}
                      className="w-full bg-white/10 border border-white/10 text-white font-medium py-4 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      Create Celoris Account
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 8: Plan Selection */}
          {step === 8 && (
            <motion.div 
              key="step8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full text-center"
            >
              <h1 className="text-3xl font-bold mb-2">Want us to bring you leads?</h1>
              <p className="text-white/50 mb-8">Your page is online. Upgrade to get our experts to run ads for you.</p>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left">
                {/* Starter */}
                <div className="bg-[#0A0F1D] p-6 rounded-2xl border border-white/10">
                  <div className="text-white/50 text-sm font-medium mb-1">STARTER</div>
                  <div className="text-2xl font-bold mb-4">₹999<span className="text-sm font-normal text-white/50">/mo</span></div>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Up to 20 Leads/mo</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Vibe branding on page</div>
                  </div>
                  <button 
                    onClick={() => router.push('/marketing/social/dashboard')}
                    className="w-full py-2 rounded-lg border border-white/20 hover:bg-white/5 font-medium"
                  >
                    Select Starter
                  </button>
                </div>

                {/* Growth */}
                <div className="bg-gradient-to-b from-[#10B981]/20 to-[#0A0F1D] p-6 rounded-2xl border border-[#10B981]/50 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10B981] text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Recommended
                  </div>
                  <div className="text-[#10B981] text-sm font-medium mb-1">GROWTH</div>
                  <div className="text-2xl font-bold mb-4">₹2,499<span className="text-sm font-normal text-white/50">/mo</span></div>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]"/> Up to 75 Leads/mo</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]"/> Human expert review</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]"/> Ad campaign setup</div>
                  </div>
                  <button 
                    onClick={() => router.push('/marketing/social/dashboard')}
                    className="w-full py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] font-medium"
                  >
                    Select Growth
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => router.push('/marketing/social/dashboard')}
                  className="text-white/60 hover:text-[#10B981] font-medium underline underline-offset-4 text-sm transition-colors py-2 px-4 rounded-lg hover:bg-[#10B981]/10"
                >
                  Skip for now, continue to dashboard with free page
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        </div>
        </div>
      </main>
    </div>
  );
}
