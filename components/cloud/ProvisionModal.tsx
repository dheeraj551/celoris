"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ExternalLink, ShieldCheck, X, Terminal, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProvisionModalProps {
  isOpen: boolean;
  subdomain: string;
  onClose: () => void;
}

export const ProvisionModal: React.FC<ProvisionModalProps> = ({
  isOpen,
  subdomain,
  onClose,
}) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [siteTitle, setSiteTitle] = useState('');
  const [adminUser, setAdminUser] = useState('admin');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const cleanSubdomain = (subdomain || 'mysite').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const fullDomain = `${cleanSubdomain}.celoris.in`;

  const provisioningSteps = [
    { title: 'Allocating LiteSpeed NVMe Pod', desc: 'Deploying isolated container on Asia-South1 (Mumbai)' },
    { title: 'Generating Let’s Encrypt SSL', desc: 'Issuing free TLS/HTTPS wildcard certificate' },
    { title: 'Installing WordPress 6.7 Core', desc: 'Pre-configuring database & Gutenberg performance blocks' },
    { title: 'Activating LiteSpeed Cache Engine', desc: 'Configuring server-level page caching & CDN routing' }
  ];

  const handleStartDeployment = () => {
    setIsProvisioning(true);
    setStep(0);
    setProgress(15);

    const timer1 = setTimeout(() => { setStep(1); setProgress(45); }, 900);
    const timer2 = setTimeout(() => { setStep(2); setProgress(75); }, 1900);
    const timer3 = setTimeout(() => { setStep(3); setProgress(92); }, 2800);
    const timer4 = setTimeout(() => { 
      setProgress(100); 
      setIsProvisioning(false); 
      setIsCompleted(true); 

      // Wire to User Management & Local Storage Persistence
      const newDeployment = {
        subdomain: fullDomain,
        siteTitle: siteTitle || `${cleanSubdomain} Portfolio`,
        adminUser: adminUser || 'admin',
        deployedAt: new Date().toISOString(),
        userId: user?.id || null,
        userEmail: user?.email || null,
        status: 'active',
      };

      try {
        const stored = JSON.parse(localStorage.getItem('celoris_cloud_deployments') || '[]');
        const updated = [newDeployment, ...stored.filter((item: any) => item.subdomain !== fullDomain)].slice(0, 10);
        localStorage.setItem('celoris_cloud_deployments', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not cache deployment:', err);
      }
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setProgress(0);
      setIsProvisioning(false);
      setIsCompleted(false);
      
      const suggestedName = profile?.full_name 
        ? `${profile.full_name}'s Site`
        : `${cleanSubdomain.charAt(0).toUpperCase() + cleanSubdomain.slice(1)} Portfolio`;
      setSiteTitle(suggestedName);

      const defaultAdmin = profile?.username || user?.email?.split('@')[0] || 'admin';
      setAdminUser(defaultAdmin);
    }
  }, [isOpen, subdomain, profile, user]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#080808]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-sm font-semibold tracking-wide text-white">
              Celoris Cloud Provisioning Engine
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isProvisioning && !isCompleted && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                  Step 1 of 2 · Ready to Deploy
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Launch Your Free WordPress Site
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  We will provision your free NVMe database and install WordPress instantly.
                </p>
              </div>

              {/* User Identity / Account Wire Banner */}
              {user ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/25 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">Celoris Account Connected</div>
                      <div className="text-xs font-medium text-white truncate">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Owner
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[11px] text-neutral-400">Deploying as Guest Visitor</div>
                    <div className="text-xs text-neutral-300">No account required to test</div>
                  </div>
                  <Link
                    href="/login?redirect=/cloud"
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Sign In to Sync</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Selected Domain Banner */}
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-300 font-medium">Assigned Subdomain</div>
                  <div className="text-sm font-mono font-semibold text-white">https://{fullDomain}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded">
                    Free Forever
                  </span>
                </div>
              </div>

              {/* Basic Site Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Website Name / Title
                  </label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="e.g. Rahul Sharma | Design Portfolio"
                    className="w-full px-3.5 py-2 text-sm bg-[#141414] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-[#141414] border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Guarantees checklist */}
              <div className="pt-2 border-t border-white/[0.06] text-xs text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No credit card required. Never auto-charged.</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% ad-free LiteSpeed NVMe server instance.</span>
                </div>
              </div>

              {/* Launch CTA */}
              <button
                onClick={handleStartDeployment}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deploy WordPress Instance Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Provisioning In Progress */}
          {isProvisioning && (
            <div className="py-4 space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 animate-pulse">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Deploying Your Cloud Pod...</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Live provisioning on Celoris Edge Server (Asia-South)
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-400 font-mono">
                  <span>Progress</span>
                  <span className="text-emerald-400 font-semibold">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Live steps log */}
              <div className="space-y-2.5 bg-[#080808] p-3.5 rounded-xl border border-white/5 font-mono text-xs">
                {provisioningSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    {idx < step ? (
                      <span className="text-emerald-400 shrink-0">✓</span>
                    ) : idx === step ? (
                      <span className="text-emerald-400 animate-spin shrink-0">⟳</span>
                    ) : (
                      <span className="text-neutral-600 shrink-0">○</span>
                    )}
                    <div>
                      <div className={idx <= step ? 'text-neutral-200 font-medium' : 'text-neutral-500'}>
                        {s.title}
                      </div>
                      <div className="text-[11px] text-neutral-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed State */}
          {isCompleted && (
            <div className="py-2 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-white">Your WordPress Site is Live!</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Instance active and connected to Let's Encrypt SSL.
                </p>
                {user && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Saved to Celoris Account ({user.email})</span>
                  </div>
                )}
              </div>

              {/* Credentials Box */}
              <div className="space-y-3 bg-[#080808] p-4 rounded-xl border border-white/[0.08]">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-mono">Public Website URL</div>
                  <div className="flex items-center justify-between mt-1">
                    <a
                      href={`https://${fullDomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-emerald-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>https://{fullDomain}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(`https://${fullDomain}`, 'url')}
                      className="text-xs text-neutral-400 hover:text-white px-2 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                    >
                      {copied === 'url' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[11px] text-neutral-400 uppercase font-mono">WordPress Admin URL</div>
                  <div className="text-xs font-mono text-neutral-200 mt-0.5">
                    https://{fullDomain}/wp-admin
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-mono">Username</span>
                    <span className="font-mono text-neutral-200 font-semibold">{adminUser}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-mono">Generated Password</span>
                    <span className="font-mono text-emerald-400 font-semibold">celoris_wp_2026</span>
                  </div>
                </div>
              </div>

              {/* Guest prompt to save */}
              {!user && (
                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="text-xs text-neutral-300">
                    Want to manage this site from your Celoris account?
                  </div>
                  <Link
                    href="/register?redirect=/cloud"
                    className="text-xs font-semibold px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-colors shrink-0"
                  >
                    Save to Account
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close & Explore Features
                </button>
                <button
                  onClick={() => {
                    alert(`Opening WordPress Admin dashboard for ${fullDomain}...`);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Open WP Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
