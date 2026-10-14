"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  CelorisStudentPersonaGraphic,
  CelorisFreelancerPersonaGraphic,
  CelorisLearnerPersonaGraphic,
  CelorisCreatorPersonaGraphic,
} from './CelorisGraphics';

interface TargetAudienceProps {
  onClaimClick: (subdomain?: string) => void;
}

export const TargetAudience: React.FC<TargetAudienceProps> = ({ onClaimClick }) => {
  const [activePersona, setActivePersona] = useState<number>(0);

  const personas = [
    {
      id: 0,
      GraphicComponent: CelorisStudentPersonaGraphic,
      tag: 'College & University Students',
      title: 'Design & Tech Students',
      benefit: 'Put a fast, live portfolio link on your resume to stand out to recruiters.',
      description: 'Stop submitting Google Drive links or Figma prototypes that recruiters won’t open. Give hiring managers a live, interactive WordPress website on yourname.celoris.in that loads in under 400 milliseconds.',
      features: ['100% Free Forever While Active', 'No credit card needed', 'WordPress & Elementor ready', 'SSL green padlock on resume'],
      demoSubdomain: 'student-portfolio',
      useCaseTitle: 'Resume & Campus Placement Live Link',
      useCaseDetail: 'Provide recruiters and agencies with a live, interactive WordPress link (yourname.celoris.in) that loads instantly on mobile devices with zero server errors.',
    },
    {
      id: 1,
      GraphicComponent: CelorisFreelancerPersonaGraphic,
      tag: 'Freelancers & Solo Studios',
      title: 'Freelance Web Designers',
      benefit: 'Test and demo client landing pages without paying extra hosting fees.',
      description: 'Never spend ₹3,000 buying temporary hosting just to show a local Indian client a staging demo. Spin up client-name.celoris.in in 60 seconds, get approval, and export when ready.',
      features: ['Fast client demo URLs', 'High-speed NVMe performance', 'Zero ad injection', '1-Click custom domain upgrade'],
      demoSubdomain: 'dentist-clinic-demo',
      useCaseTitle: 'Staging Demos for Client Sign-offs',
      useCaseDetail: 'Spin up a quick staging demo (e.g. clientname.celoris.in) to show prospective Indian clients live page prototypes before purchasing a custom domain.',
    },
    {
      id: 2,
      GraphicComponent: CelorisLearnerPersonaGraphic,
      tag: 'Celoris Community',
      title: 'Celoris Course Learners',
      benefit: 'The official live sandbox for students attending Celoris Free Live Classes.',
      description: 'Follow along with Celoris instructors step-by-step. While mentors build in class, you deploy your own live WordPress site right alongside without spending a single rupee on hosting.',
      features: ['Official Celoris sandbox', 'Pre-optimized for class templates', 'Instant 60s activation', 'Direct mentorship integration'],
      demoSubdomain: 'batch-assignment-04',
      useCaseTitle: 'Live Classroom Hands-on Sandbox',
      useCaseDetail: 'Practice building live during Celoris webinars and masterclasses without spending money on hosting or struggling with manual database setup.',
    },
    {
      id: 3,
      GraphicComponent: CelorisCreatorPersonaGraphic,
      tag: 'Writers & Influencers',
      title: 'Creators & Bloggers',
      benefit: 'Launch your personal blog, newsletter landing page, or link-in-bio hub.',
      description: 'Own your digital home and audience instead of relying solely on social media algorithms. Publish articles, embed newsletters, and showcase all your social channels on one clean link.',
      features: ['Clean SEO-optimized URL', 'Gutenberg block editor', 'Fast NVMe mobile speed', '15,000 monthly visits included'],
      demoSubdomain: 'creator-journal',
      useCaseTitle: 'Independent Content Hub & Newsletter',
      useCaseDetail: 'Own your digital audience instead of relying solely on social media algorithms, with full WordPress blogging control and fast page loads.',
    },
  ];

  return (
    <section className="py-24 bg-[#080808] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase mb-2">
            Tailored For The Next Generation of Makers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Who is Celoris Cloud Built For?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            Engineered to empower Indian learners and creators to launch without upfront financial barriers.
          </p>
        </div>

        {/* 4 Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, idx) => {
            const Graphic = persona.GraphicComponent;
            const isSelected = activePersona === idx;

            return (
              <div
                key={persona.id}
                onClick={() => setActivePersona(idx)}
                className={`rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#121212] border-emerald-500/60 shadow-xl shadow-black ring-1 ring-emerald-500/20'
                    : 'bg-[#0D0D0D] border-white/[0.08] hover:border-emerald-500/30 hover:bg-[#111111]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0A0A0A] border border-emerald-500/30 p-1 flex items-center justify-center">
                      <Graphic className="w-9 h-9" />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {persona.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {persona.title}
                  </h3>

                  <p className="text-xs font-medium text-emerald-400 mb-3">
                    {persona.benefit}
                  </p>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {persona.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-white/5 text-[11px] text-neutral-400">
                    {persona.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subdomain sample & action */}
                <div className="pt-3 border-t border-white/[0.08]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-2">
                    Example: <span className="text-emerald-400">https://{persona.demoSubdomain}.celoris.in</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClaimClick(persona.demoSubdomain);
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-white/5 hover:bg-emerald-400 hover:text-black rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Claim Subdomain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Persona Practical Spotlight */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0D0D0D] border border-emerald-500/20 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
            🎯
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              Spotlight: {personas[activePersona].useCaseTitle}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {personas[activePersona].useCaseDetail}
            </p>
            <div className="text-[11px] text-neutral-400 pt-1">
              Founding Cohort: Real student portfolio showcases will be linked here as our initial creators launch their sites.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
