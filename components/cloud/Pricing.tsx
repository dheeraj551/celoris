"use client";

import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter (Hobby / Student)',
      badge: 'Default Tier · 100% Free Forever',
      priceMonthly: 0,
      priceYearly: 0,
      periodText: 'forever',
      description: 'Ideal for Indian college students, portfolio websites, beginners, and Celoris class projects.',
      highlight: true,
      features: [
        '1 Managed WordPress Site',
        'Free yourname.celoris.in Subdomain',
        '1 GB NVMe Cloud Storage',
        '10,000 Monthly Visits',
        'Free SSL Certificate (HTTPS)',
        'Automated Daily Security Scans',
        '100% Ad-Free Experience',
        'Community Forum & Docs Support',
      ],
      ctaText: 'Launch Free Site (No Card Needed)',
      ctaStyle: 'bg-emerald-400 hover:bg-emerald-300 text-black font-bold shadow-emerald-900/30',
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      badge: 'Recommended for Freelancers',
      priceMonthly: 149,
      priceYearly: 108,
      annualTotal: 1299,
      periodText: billingCycle === 'yearly' ? '/month (billed ₹1,299/yr)' : '/month',
      description: 'Ideal for freelancers, agency portfolios, personal brands, and clients needing custom .com domains.',
      highlight: false,
      isPopular: true,
      features: [
        'Connect Your Custom Domain (yourbrand.com / .in)',
        '5 GB High-Speed NVMe Storage',
        '50,000 Monthly Visits',
        'Custom Professional Email (hello@yourbrand.com)',
        'Priority RAM & CPU Allocation',
        '1-Click Cloud Staging & Cloning',
        'Priority WhatsApp & Ticket Support',
        'Free SSL for Custom Domains',
      ],
      ctaText: 'Upgrade to Pro Cloud',
      ctaStyle: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-emerald-900/30',
    },
    {
      id: 'agency',
      name: 'Agency / Studio',
      badge: 'For Client Work',
      priceMonthly: 499,
      priceYearly: 399,
      annualTotal: 4788,
      periodText: billingCycle === 'yearly' ? '/month (billed annually)' : '/month',
      description: 'Ideal for freelance web designers building and managing websites for local business clients.',
      highlight: false,
      isPopular: false,
      features: [
        'Host up to 5 Custom Domain Websites',
        '25 GB NVMe Cloud Storage',
        'Unlimited Monthly Bandwidth',
        'Client Management Dashboard',
        'Automated Weekly Off-site Backups',
        'White-label Staging Previews',
        'Dedicated Support Channel & Call Assist',
      ],
      ctaText: 'Get Agency Cloud',
      ctaStyle: 'bg-white/10 hover:bg-white/15 text-white',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[400px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[400px] bg-emerald-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase mb-2">
            Honest & Transparent Freemium Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Start 100% Free. Upgrade When You Earn.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            No sneaky auto-debits, no hidden domain renewal surprises. Indian pricing tailored for students and creators.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-[#101010] rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Save 27%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayPrice = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-[#0A0A0A] border-2 border-emerald-500/60 shadow-2xl shadow-black ring-1 ring-emerald-500/20'
                    : plan.isPopular
                    ? 'bg-[#0E0E0E] border-2 border-emerald-500/60 shadow-2xl shadow-black ring-1 ring-emerald-500/30'
                    : 'bg-[#080808] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-semibold tracking-wide text-neutral-400">
                      {plan.badge}
                    </span>
                    {plan.isPopular && (
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    )}
                    {plan.highlight && (
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                        Free Forever
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed min-h-[38px]">
                    {plan.description}
                  </p>

                  {/* Price Tag with Tabular Numerals */}
                  <div className="my-6 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                        ₹{displayPrice}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {plan.priceMonthly === 0 ? '/ free forever' : plan.periodText}
                      </span>
                    </div>

                    {plan.priceMonthly === 0 ? (
                      <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>No credit card required. Never expires.</span>
                      </div>
                    ) : billingCycle === 'yearly' ? (
                      <div className="mt-2 text-[11px] text-emerald-300 font-mono">
                        Total ₹{plan.annualTotal} paid annually (save over ₹480/yr)
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-neutral-400 font-mono">
                        Cancel anytime with 1 click in dashboard
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8 text-xs">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">
                      What’s Included:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-neutral-300">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 stroke-[2] text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${plan.ctaStyle}`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Student Guarantee Note */}
        <div className="mt-12 p-4 bg-[#0A0A0A] rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Are you attending Celoris Free Live Classes?</strong> Your student account is automatically eligible for immediate instant provisioning without any waitlists.
            </span>
          </div>
          <button
            onClick={() => onSelectPlan('Starter (Hobby / Student)')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline shrink-0 cursor-pointer"
          >
            Claim Live Class Instance →
          </button>
        </div>
      </div>
    </section>
  );
};
