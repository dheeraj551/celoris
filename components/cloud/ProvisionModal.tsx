"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ExternalLink, ShieldCheck, X, Terminal, ArrowRight, UserCheck, Sparkles, AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProvisionModalProps {
  isOpen: boolean;
  subdomain: string;
  onClose: () => void;
}

const generateClientPassword = (length = 16): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';
  const allChars = uppercase + lowercase + digits + symbols;

  const res: string[] = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(length - 4);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < length - 4; i++) {
      res.push(allChars[arr[i] % allChars.length]);
    }
  } else {
    for (let i = 4; i < length; i++) {
      res.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  }

  // Shuffle array
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }

  return res.join('');
};

export const ProvisionModal: React.FC<ProvisionModalProps> = ({
  isOpen,
  subdomain,
  onClose,
}) => {
  const { user, profile, session } = useAuth();
  const [customSubdomain, setCustomSubdomain] = useState('');
  const [hasUserEditedSubdomain, setHasUserEditedSubdomain] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [siteTitle, setSiteTitle] = useState('');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCompletedPassword, setShowCompletedPassword] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployedResult, setDeployedResult] = useState<{
    siteUrl: string;
    adminUrl: string;
    adminUser: string;
    adminPass: string;
    fullDomain: string;
  } | null>(null);

  const cleanSubdomain = (customSubdomain || 'yourname').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const fullDomain = `${cleanSubdomain}.celoris.in`;

  const PHISHING_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'kyc', 'paytm', 'sbi', 'upi',
    'bank', 'hdfc', 'icici', 'axis', 'pnb', 'kotak', 'phonepe', 'gpay',
    'googlepay', 'bhim', 'aadhaar', 'uidai', 'incometax', 'pan', 'otp',
    'secure', 'account', 'auth', 'update', 'wallet', 'amazon',
    'flipkart', 'netflix', 'paypal', 'apple', 'microsoft', 'freecharge', 'cred',
    'password', 'security', 'invoice', 'telegram', 'whatsapp'
  ];
  const matchedPhishingKeyword = PHISHING_KEYWORDS.find((kw) => cleanSubdomain.includes(kw));

  const provisioningSteps = [
    { title: 'Allocating NVMe Cloud Pod', desc: 'Deploying isolated 3 GB container on Asia-South1 (Mumbai)' },
    { title: 'Generating Let’s Encrypt SSL', desc: 'Issuing free TLS/HTTPS wildcard certificate' },
    { title: 'Installing WordPress Core', desc: 'Pre-configuring database & Gutenberg performance blocks' },
    { title: 'Activating Edge Caching & CDN', desc: 'Configuring server-level OPcache & Cloudflare edge routing' }
  ];

  const handleSiteTitleChange = (val: string) => {
    setSiteTitle(val);
    if (!hasUserEditedSubdomain) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24);
      if (slug.length >= 2) {
        setCustomSubdomain(slug);
      }
    }
  };

  const prevIsOpenRef = React.useRef(false);

  const handleStartDeployment = async () => {
    if (!user) {
      setDeployError('Account registration is required before deploying. Please register or sign in.');
      return;
    }

    if (matchedPhishingKeyword) {
      setDeployError(`Subdomain contains restricted security keyword "${matchedPhishingKeyword}". Banking, authentication, and KYC keywords are blocked.`);
      return;
    }

    if (cleanSubdomain.length < 3) {
      setDeployError('Subdomain must be at least 3 characters.');
      return;
    }

    const finalAdminUser = (adminUser.trim() || cleanSubdomain || 'admin').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const finalAdminPass = adminPass.trim() || generateClientPassword();

    setIsProvisioning(true);
    setDeployError(null);
    setStep(0);
    setProgress(15);

    const timer1 = setTimeout(() => { setStep(1); setProgress(45); }, 800);
    const timer2 = setTimeout(() => { setStep(2); setProgress(75); }, 1800);

    try {
      const res = await fetch('/api/cloud/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          subdomain: cleanSubdomain,
          title: siteTitle || `${cleanSubdomain} Site`,
          email: user?.email || `${cleanSubdomain}@celoris.in`,
          adminUser: finalAdminUser,
          adminPass: finalAdminPass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision WordPress instance');
      }

      setStep(3);
      setProgress(95);

      setTimeout(() => {
        const returnedUser = data.adminUser || finalAdminUser;
        const returnedPass = data.adminPass || finalAdminPass;

        setProgress(100);
        setIsProvisioning(false);
        setIsCompleted(true);
        setDeployedResult({
          siteUrl: data.siteUrl || `https://${fullDomain}`,
          adminUrl: data.adminUrl || `https://${fullDomain}/wp-admin`,
          adminUser: returnedUser,
          adminPass: returnedPass,
          fullDomain: data.fullDomain || fullDomain,
        });

        // Wire to User Management & Local Storage Persistence
        const newDeployment = {
          subdomain: data.fullDomain || fullDomain,
          siteTitle: siteTitle || `${cleanSubdomain} Portfolio`,
          adminUser: returnedUser,
          adminPass: returnedPass,
          deployedAt: new Date().toISOString(),
          userId: user?.id || null,
          userEmail: user?.email || null,
          status: 'active',
        };

        try {
          const stored = JSON.parse(localStorage.getItem('celoris_cloud_deployments') || '[]');
          const updated = [newDeployment, ...stored.filter((item: any) => item.subdomain !== (data.fullDomain || fullDomain))].slice(0, 10);
          localStorage.setItem('celoris_cloud_deployments', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not cache deployment:', err);
        }
      }, 500);

    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProvisioning(false);
      setDeployError(err.message || 'Provisioning service is currently busy. Please try again.');
    }
  };

  useEffect(() => {
    // Only reset state when modal opens from closed state (false -> true)
    if (isOpen && !prevIsOpenRef.current) {
      setStep(0);
      setProgress(0);
      setIsProvisioning(false);
      setIsCompleted(false);
      setDeployError(null);
      setDeployedResult(null);
      setHasUserEditedSubdomain(false);
      
      const userDefault = (profile?.username || user?.email?.split('@')[0] || '')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');

      const initialSub = (subdomain && subdomain.trim().length >= 3 && subdomain !== 'rahul-designs') 
        ? subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
        : (userDefault || 'yourname');

      setCustomSubdomain(initialSub);

      const suggestedName = profile?.full_name 
        ? `${profile.full_name}'s Site`
        : user?.email 
        ? `${user.email.split('@')[0]}'s Portfolio`
        : `${initialSub.charAt(0).toUpperCase() + initialSub.slice(1)} Portfolio`;
      setSiteTitle(suggestedName);

      const defaultAdmin = profile?.username || user?.email?.split('@')[0] || initialSub || 'admin';
      setAdminUser(defaultAdmin);
      setAdminPass(generateClientPassword());
      setShowPassword(false);
      setShowCompletedPassword(true);
    }
    prevIsOpenRef.current = isOpen;
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
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
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
                <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                  Step 1 of 2 · Ready to Deploy
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Launch Your Free WordPress Site
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  We will provision your free 3 GB NVMe container and install WordPress instantly.
                </p>
              </div>

              {/* User Identity / Account Wire Banner */}
              {user ? (
                <div className="p-3 bg-amber-950/40 border border-amber-500/25 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">Celoris Account Verified</div>
                      <div className="text-xs font-medium text-white truncate">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Owner
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-300">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Account Registration Required</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    To prevent automated bot abuse and dedicate <strong className="text-amber-400">3 GB high-speed NVMe storage</strong> to your site, please create a free Celoris account or sign in.
                  </p>
                </div>
              )}

              {/* Interactive Assigned Subdomain Claim Box */}
              <div className="p-3.5 bg-amber-950/30 border border-amber-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                    Assigned Subdomain
                  </label>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-950/60 border border-amber-500/30 rounded font-mono">
                    3 GB Free Forever
                  </span>
                </div>

                <div className="flex items-center bg-[#121212] border border-white/10 focus-within:border-amber-500 rounded-lg px-3 py-2 font-mono text-sm transition-colors">
                  <span className="text-neutral-500 text-xs select-none pr-1">https://</span>
                  <input
                    type="text"
                    value={customSubdomain}
                    onChange={(e) => {
                      setCustomSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                      setHasUserEditedSubdomain(true);
                    }}
                    placeholder="yourname"
                    className="flex-1 bg-transparent text-white font-semibold focus:outline-none min-w-0 placeholder:text-neutral-600"
                  />
                  <span className="text-amber-400 text-xs font-semibold select-none pl-1">.celoris.in</span>
                </div>

                {matchedPhishingKeyword ? (
                  <div className="p-2 bg-rose-950/60 border border-rose-500/30 rounded-lg text-[11px] text-rose-300 flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Restricted keyword: "<strong>{matchedPhishingKeyword}</strong>" is blocked to prevent phishing and financial abuse.</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                    <span className="truncate">
                      Live URL: <span className="text-amber-300 font-mono font-medium">https://{fullDomain}</span>
                    </span>
                    {cleanSubdomain.length < 3 && (
                      <span className="text-amber-400 shrink-0 text-[10px]">Min 3 chars</span>
                    )}
                  </div>
                )}
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
                    onChange={(e) => handleSiteTitleChange(e.target.value)}
                    placeholder="e.g. Creative Design Studio | Portfolio"
                    className="w-full px-3.5 py-2 text-sm bg-[#141414] border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                    className="w-full px-3.5 py-2 text-sm bg-[#141414] border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-neutral-300">
                      Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAdminPass(generateClientPassword())}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reroll Random</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Strong password"
                      className="w-full px-3.5 py-2 pr-10 text-sm bg-[#141414] border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    High-entropy cryptographic password generated automatically.
                  </p>
                </div>
              </div>

              {/* Deploy Error Banner */}
              {deployError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-300">Deployment Notice</div>
                    <div className="text-[11px] text-red-300/80 mt-0.5">{deployError}</div>
                  </div>
                </div>
              )}

              {/* Guarantees and Inactivity Rule */}
              <div className="pt-2 border-t border-white/[0.06] text-xs text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3 GB High-Speed NVMe PCIe Storage Allocated.</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% ad-free server with free Let's Encrypt SSL.</span>
                </div>
                <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-[11px] text-neutral-300 leading-relaxed">
                  <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Free Forever While Active</span>
                  Free sites enter power-saving sleep after <strong className="text-white">7 days of inactivity</strong> (1-click wake up) and are archived after <strong className="text-white">30 days</strong> (preceded by 2 email reminders). Pro sites are <strong className="text-amber-400 font-semibold">100% Always-On 24/7</strong>.
                </div>
              </div>

              {/* Launch CTA or Auth Gate Action */}
              {user ? (
                <button
                  onClick={handleStartDeployment}
                  disabled={cleanSubdomain.length < 3 || !!matchedPhishingKeyword || isProvisioning}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Deploy 3 GB WordPress Instance Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    href={`/register?redirect=${encodeURIComponent(`/cloud?subdomain=${cleanSubdomain}`)}`}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <span>Create Free Account to Deploy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/cloud?subdomain=${cleanSubdomain}`)}`}
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>Already have an account? Sign In to Launch</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Provisioning In Progress */}
          {isProvisioning && (
            <div className="py-4 space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 animate-pulse">
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
                  <span className="text-amber-400 font-semibold">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Live steps log */}
              <div className="space-y-2.5 bg-[#080808] p-3.5 rounded-xl border border-white/5 font-mono text-xs">
                {provisioningSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    {idx < step ? (
                      <span className="text-amber-400 shrink-0">✓</span>
                    ) : idx === step ? (
                      <span className="text-amber-400 animate-spin shrink-0">⟳</span>
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
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-white">Your WordPress Site is Live!</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Instance active and connected to Let's Encrypt SSL.
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 font-semibold font-mono">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>3.0 GB NVMe Storage Allocated</span>
                  </div>
                  {user && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300">
                      <span>Owner: {user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Credentials Box */}
              <div className="space-y-3 bg-[#080808] p-4 rounded-xl border border-white/[0.08]">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-mono">Public Website URL</div>
                  <div className="flex items-center justify-between mt-1">
                    <a
                      href={deployedResult?.siteUrl || `https://${fullDomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-amber-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>{deployedResult?.siteUrl || `https://${fullDomain}`}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(deployedResult?.siteUrl || `https://${fullDomain}`, 'url')}
                      className="text-xs text-neutral-400 hover:text-white px-2 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                    >
                      {copied === 'url' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[11px] text-neutral-400 uppercase font-mono">WordPress Admin URL</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <a
                      href={deployedResult?.adminUrl || `https://${fullDomain}/wp-admin`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-200 hover:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>{deployedResult?.adminUrl || `https://${fullDomain}/wp-admin`}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(deployedResult?.adminUrl || `https://${fullDomain}/wp-admin`, 'admin_url')}
                      className="text-xs text-neutral-400 hover:text-white px-2 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                    >
                      {copied === 'admin_url' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-mono">Username</span>
                    <span className="font-mono text-neutral-200 font-semibold">
                      {deployedResult?.adminUser || adminUser}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-neutral-400 font-mono">Password</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowCompletedPassword(!showCompletedPassword)}
                          className="text-neutral-400 hover:text-white p-0.5 transition-colors cursor-pointer"
                          aria-label={showCompletedPassword ? "Hide password" : "Show password"}
                        >
                          {showCompletedPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(deployedResult?.adminPass || adminPass, 'pass')}
                          className="text-[10px] text-neutral-400 hover:text-white px-1.5 py-0.5 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                        >
                          {copied === 'pass' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <span className="font-mono text-amber-400 font-semibold break-all select-all text-xs">
                      {showCompletedPassword ? (deployedResult?.adminPass || adminPass) : "••••••••••••••••"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Tier Inactivity Notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-left space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Free Forever While Active</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Your site is free forever while active! Log in to your WordPress Admin at least once every <strong>7 days</strong> to keep your site awake. Inactive sites sleep after 7 days (wakeable in 1 click) and are safely archived after 30 days (preceded by 2 email alerts). Pro sites (₹149/mo) never sleep.
                </p>
              </div>

              {/* Premium Plan Upsell Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#0d1611] to-amber-950/30 border border-amber-500/30 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Loving the speed? Connect your custom domain!</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    Pro ₹149/mo
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Upgrade to <strong className="text-white">Celoris Pro</strong> to connect <span className="text-amber-300 font-mono">yourbrand.com</span>, expand to <strong className="text-white">15 GB NVMe storage</strong>, and get custom professional business email.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="#pricing"
                    onClick={onClose}
                    className="text-xs font-bold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Pro & Agency Plans</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://wa.me/919084718101?text=Hi%20Celoris!%20My%20site%20is%20live%20on%20Celoris%20Cloud.%20I'd%20like%20to%20upgrade%20to%20Pro%20(₹149/mo)%20to%20connect%20my%20own%20custom%20domain."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-white px-2 py-1 transition-colors"
                  >
                    Upgrade on WhatsApp →
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close & Explore Features
                </button>
                <a
                  href={deployedResult?.adminUrl || `https://${fullDomain}/wp-admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Open WP Admin</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
