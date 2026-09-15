import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/mockAssets';
import {
  Zap,
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Gauge,
  Clock,
  ShieldCheck,
  Percent,
  X,
  Copy,
  Check,
} from 'lucide-react';

interface CouponSystemProps {
  activeCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CouponSystem: React.FC<CouponSystemProps> = ({
  activeCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isOpen,
  onClose,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSimulatingSpeed, setIsSimulatingSpeed] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState({ standard: 12, turbo: 98 });

  if (!isOpen) return null;

  const handleApplyCode = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage('Please enter a valid coupon code.');
      return;
    }

    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code);
    if (found) {
      setErrorMessage('');
      onApplyCoupon(found);
      setInputCode('');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#6ee7b7'],
        });
      } catch (err) {
        // Fallback silently if confetti is unavailable
      }
    } else {
      // Dynamic fallback for custom promotional codes
      if (code.length >= 4) {
        const customCoupon: Coupon = {
          code,
          title: 'Special Promo Turbo Boost',
          description: 'Custom community code applied. High-speed multi-threaded CDN enabled.',
          discountPercent: 25,
          speedBoost: '80 MB/s Accelerated CDN',
          speedMultiplier: 55,
          badge: '⚡ TURBO SPEED',
          expires: '2026-12-31',
          active: true,
        };
        onApplyCoupon(customCoupon);
        setInputCode('');
        setErrorMessage('');
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#059669', '#10b981', '#34d399'],
          });
        } catch (err) {}
      } else {
        setErrorMessage('Invalid coupon code. Try one from the recommended list below!');
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const runSpeedComparison = () => {
    setIsSimulatingSpeed(true);
    setSimulationProgress({ standard: 0, turbo: 0 });

    let std = 0;
    let trb = 0;
    const interval = setInterval(() => {
      trb = Math.min(100, trb + 22);
      std = Math.min(100, std + 2.5);
      setSimulationProgress({ standard: Math.round(std), turbo: Math.round(trb) });

      if (trb >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsSimulatingSpeed(false), 800);
      }
    }, 150);
  };

  return (
    <div
      id="coupon-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="coupon-modal-content"
        className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with High-Speed Banner */}
        <div className="relative px-6 py-5 bg-white border-b border-zinc-200">
          <button
            id="btn-close-coupon-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Coupons & High-Speed CDN</h2>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Instant Speed Boost
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Apply a coupon to unlock gigabit bandwidth, remove download queues, and get asset discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800">
          {/* Active Applied Coupon Banner */}
          {activeCoupon ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-800 text-base">{activeCoupon.code}</span>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5 font-medium">{activeCoupon.speedBoost}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="text-right mr-2 hidden sm:block">
                  <div className="text-xs text-emerald-800 font-bold">
                    {activeCoupon.discountPercent}% OFF + TURBO
                  </div>
                  <div className="text-[11px] text-emerald-600">Queue Bypassed</div>
                </div>
                <button
                  id="btn-remove-active-coupon"
                  onClick={onRemoveCoupon}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Standard download speed is currently capped at 350 KB/s with a 15-second queue.</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 underline cursor-pointer shrink-0 hover:text-emerald-800" onClick={() => handleApplyCode('TURBO100')}>
                Apply TURBO100
              </span>
            </div>
          )}

          {/* Coupon Code Input Form */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" /> Have a Promo or Speed Code?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="input-coupon-code"
                  type="text"
                  placeholder="Enter code (e.g. TURBO100, POLY50)"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
                />
              </div>
              <button
                id="btn-apply-coupon-submit"
                onClick={() => handleApplyCode()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                Apply <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMessage && <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>}
          </div>

          {/* Speed Acceleration Benchmark Widget */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  CDN Download Pipeline Benchmark
                </h3>
              </div>
              <button
                id="btn-test-speed"
                onClick={runSpeedComparison}
                disabled={isSimulatingSpeed}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 underline font-medium cursor-pointer"
              >
                {isSimulatingSpeed ? 'Benchmarking...' : 'Test Speed Difference'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Standard Speed Bar */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-500">Standard CDN (Free Tier)</span>
                  <span className="text-zinc-500 font-mono">350 KB/s (~3m 40s)</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 transition-all duration-300"
                    style={{ width: `${simulationProgress.standard}%` }}
                  />
                </div>
              </div>

              {/* Turbo Speed Bar */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> Turbo Accelerated CDN (With Coupon)
                  </span>
                  <span className="text-emerald-700 font-mono font-bold">120 MB/s (Instant 1.2s)</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-600 rounded-full shadow-xs transition-all duration-300"
                    style={{ width: `${simulationProgress.turbo}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Available Featured Coupons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Available Verified Coupons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_COUPONS.map((coupon) => {
                const isCurrent = activeCoupon?.code === coupon.code;
                return (
                  <div
                    key={coupon.code}
                    id={`coupon-card-${coupon.code}`}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between shadow-xs ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-emerald-800 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {coupon.code}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {coupon.badge}
                        </span>
                      </div>
                      <h4 className="font-semibold text-zinc-900 text-xs mb-1">{coupon.title}</h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{coupon.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
                      <button
                        id={`btn-copy-${coupon.code}`}
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-[11px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>

                      <button
                        id={`btn-apply-${coupon.code}`}
                        onClick={() => handleApplyCode(coupon.code)}
                        disabled={isCurrent}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-zinc-100 text-zinc-400 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {isCurrent ? 'Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multi-Threaded Direct CDN enabled for all coupon holders.</span>
          </div>
          <button
            id="btn-done-coupons"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
