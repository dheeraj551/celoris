import React from 'react';
import {
  Crown,
  Sparkles,
  Check,
  Zap,
  Image as ImageIcon,
  Layers,
  Wand2,
  ShieldCheck,
} from 'lucide-react';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  setIsProUser: (isPro: boolean) => void;
  onOpenAIModal?: () => void;
}

export const ProPlanModal: React.FC<ProPlanModalProps> = ({
  isOpen,
  onClose,
  isProUser,
  setIsProUser,
  onOpenAIModal,
}) => {
  if (!isOpen) return null;

  const proFeatures = [
    {
      icon: Sparkles,
      title: 'AI Create & Edit Images',
      desc: 'Generate photorealistic images and edit active layers with gemini-3.1-flash-image-preview.',
    },
    {
      icon: Wand2,
      title: 'Natural Language Prompting',
      desc: 'Describe modifications in plain text to transform layer styles, objects, and lighting.',
    },
    {
      icon: Layers,
      title: 'Unlimited Layer Blending & HSL',
      desc: 'Full-resolution color-shifting with Hue HSL matrices and 12 blend modes.',
    },
    {
      icon: Zap,
      title: 'Ultra Fast Processing',
      desc: 'Priority server-side GPU acceleration for instant canvas pipeline transforms.',
    },
    {
      icon: ImageIcon,
      title: '4K Ultra HD Canvas & Export',
      desc: 'Create, upscale, and export lossless PNG, JPEG, and WebP projects without watermarks.',
    },
  ];

  const handleTogglePro = () => {
    const nextState = !isProUser;
    setIsProUser(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('photolite_pro_user', nextState ? 'true' : 'false');
    }
  };

  return (
    <div
      id="modal-pro-plan-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4"
      onClick={onClose}
    >
      <div
        id="modal-pro-plan-content"
        className="pl-window-anim relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#242424]/97 to-[#1a1a1a]/97 backdrop-blur-2xl p-6 text-gray-200"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 70px -20px rgba(0,0,0,0.7), 0 10px 28px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window controls */}
        <div className="pl-traffic-lights absolute left-5 top-5" role="group" aria-label="Window controls">
          <button type="button" id="btn-close-pro-modal" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
          <span className="pl-traffic-dot pl-dot-yellow" />
          <span className="pl-traffic-dot pl-dot-green" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 mt-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-lg shadow-amber-500/20">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">PhotoLite Pro Membership</h2>
              <span
                id="badge-current-plan"
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isProUser
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-neutral-800 text-gray-400 border border-neutral-700'
                }`}
              >
                {isProUser ? 'Pro Active' : 'Free Tier'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Unlock Gemini AI image generation, layer editing, and creative tools.
            </p>
          </div>
        </div>

        {/* Pro Banner */}
        <div className="mb-5 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-950/40 to-neutral-900/80 p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>{isProUser ? 'You are on the Pro Plan' : 'Free Trial Available'}</span>
            </div>
            <p className="text-[11px] text-gray-300">
              {isProUser
                ? 'All AI image creation & editing capabilities are active.'
                : 'Activate Pro today with instant trial access — no credit card required.'}
            </p>
          </div>
          <button
            id="btn-toggle-pro-membership"
            onClick={handleTogglePro}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-md transition-all cursor-pointer ${
              isProUser
                ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-amber-500/30'
            }`}
          >
            {isProUser ? 'Downgrade to Free' : 'Activate Pro Access'}
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pro Features Included</h3>
          <div className="grid grid-cols-1 gap-2">
            {proFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="flex items-start gap-3 rounded-lg border border-black/40 bg-[#161616] p-2.5 text-xs"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 flex items-center gap-1.5">
                      <span>{feat.title}</span>
                      <Check className="h-3 w-3 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-snug">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/60">
          <button
            id="btn-close-pro-dialog"
            onClick={onClose}
            className="rounded-lg bg-[#2b2b2b] hover:bg-[#383838] border border-black px-4 py-2 text-xs font-medium text-gray-300 transition-colors cursor-pointer"
          >
            Done
          </button>
          {isProUser && onOpenAIModal && (
            <button
              id="btn-launch-ai-from-pro"
              onClick={() => {
                onClose();
                onOpenAIModal();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch AI Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
