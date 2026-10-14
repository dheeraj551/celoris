"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { InfrastructureBar } from './InfrastructureBar';
import { ComparisonTable } from './ComparisonTable';
import { HowItWorks } from './HowItWorks';
import { Pricing } from './Pricing';
import { TargetAudience } from './TargetAudience';
import { Faq } from './Faq';
import { CtaBanner } from './CtaBanner';
import { Footer } from './Footer';
import { ProvisionModal } from './ProvisionModal';

export default function App() {
  const { user, profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubdomain, setSelectedSubdomain] = useState('');

  // Auto-open modal if user was redirected back after sign up or log in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('subdomain');
      if (sub && sub.trim().length >= 3) {
        const clean = sub.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSelectedSubdomain(clean);
        setModalOpen(true);
      }
    }
  }, []);

  const getUserHandle = () => {
    return (profile?.username || user?.email?.split('@')[0] || 'yourname')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleOpenClaimModal = (subdomain?: string) => {
    if (subdomain && subdomain.trim().length > 0) {
      setSelectedSubdomain(subdomain.trim());
    } else {
      setSelectedSubdomain(getUserHandle());
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar onClaimClick={() => handleOpenClaimModal()} />

      {/* Main Landing Page Flow */}
      <main className="flex-1">
        {/* Section 1: Hero & Interactive Subdomain Claimer */}
        <Hero onClaim={handleOpenClaimModal} />

        {/* Section 2: Trust & Infrastructure Highlights */}
        <InfrastructureBar />

        {/* Section 3: Celoris Cloud vs The Old Way */}
        <ComparisonTable onClaimClick={() => handleOpenClaimModal()} />

        {/* Section 4: How It Works 3-Step Interactive Progression */}
        <HowItWorks onClaimClick={handleOpenClaimModal} />

        {/* Section 5: Transparent Pricing Grid */}
        <Pricing onSelectPlan={(plan) => handleOpenClaimModal(plan.toLowerCase().includes('starter') ? selectedSubdomain : undefined)} />

        {/* Section 6: Who is Celoris Cloud Built For? */}
        <TargetAudience onClaimClick={handleOpenClaimModal} />

        {/* Section 7: Frequently Asked Questions */}
        <Faq />

        {/* Section 8: Final Call To Action Banner */}
        <CtaBanner onClaimClick={handleOpenClaimModal} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive 60-Second Provisioning Modal */}
      <ProvisionModal
        isOpen={modalOpen}
        subdomain={selectedSubdomain}
        onClose={handleCloseModal}
      />
    </div>
  );
}
