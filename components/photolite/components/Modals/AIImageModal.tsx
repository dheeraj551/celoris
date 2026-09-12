import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Crown,
  Layers,
  RefreshCw,
  Download,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Palette,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Layer } from '../../types';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayer: Layer | null;
  canvasWidth: number;
  canvasHeight: number;
  isProUser: boolean;
  onOpenProModal: () => void;
  onAddLayerFromImage: (imageUrl: string, promptName: string) => void;
  onReplaceActiveLayerImage: (imageUrl: string, promptName: string) => void;
}

const STYLE_PRESETS = [
  { label: 'Photorealistic', promptSuffix: ', 8k resolution photorealistic cinematic lighting shot on 35mm lens' },
  { label: 'Digital Art', promptSuffix: ', digital concept art, vibrant dynamic lighting, detailed illustration' },
  { label: 'Cinematic', promptSuffix: ', cinematic movie still, dramatic lighting, volumetric atmosphere, 4k' },
  { label: 'Cyberpunk', promptSuffix: ', neon cyberpunk aesthetic, glowing hologram accents, nocturnal rain reflections' },
  { label: 'Watercolor', promptSuffix: ', soft fluid watercolor painting, expressive brushstrokes on textured paper' },
  { label: 'Minimalist 3D', promptSuffix: ', clean minimalist 3D isometric render, soft studio lighting, pastel palette' },
  { label: 'Vintage Film', promptSuffix: ', vintage 1970s analog film photography, warm grain, nostalgic colors' },
];

const PROMPT_SUGGESTIONS = [
  'A neon-lit futuristic city street in rain with reflections',
  'A serene Japanese zen garden with cherry blossoms and koi pond',
  'Mystical glowing crystal cave with underground turquoise lake',
  'Retro-futuristic astronaut floating among colorful nebula clouds',
  'Dramatic mountain landscape at golden hour with dramatic mist',
];

const EDIT_SUGGESTIONS = [
  'Add glowing neon futuristic sunglasses',
  'Change the background to a starry night sky with milky way galaxy',
  'Transform into an oil painting with visible impressionist brush strokes',
  'Add dramatic warm golden hour lighting and lens flares',
  'Make the scene look snowy with frost and falling snowflakes',
];

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  activeLayer,
  canvasWidth,
  canvasHeight,
  isProUser,
  onOpenProModal,
  onAddLayerFromImage,
  onReplaceActiveLayerImage,
}) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [activeLayerDataUrl, setActiveLayerDataUrl] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  // Derive aspect ratio from canvas if appropriate
  useEffect(() => {
    if (canvasWidth && canvasHeight) {
      const ratio = canvasWidth / canvasHeight;
      if (Math.abs(ratio - 16 / 9) < 0.2) setAspectRatio('16:9');
      else if (Math.abs(ratio - 4 / 3) < 0.2) setAspectRatio('4:3');
      else if (Math.abs(ratio - 9 / 16) < 0.2) setAspectRatio('9:16');
      else if (Math.abs(ratio - 1) < 0.2) setAspectRatio('1:1');
    }
  }, [canvasWidth, canvasHeight]);

  // Generate thumbnail data URL for active layer
  useEffect(() => {
    if (activeLayer?.canvas) {
      try {
        setActiveLayerDataUrl(activeLayer.canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Could not export active layer data URL:', err);
      }
    } else {
      setActiveLayerDataUrl(null);
    }
  }, [activeLayer]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for what you want to create or modify.');
      return;
    }

    if (!isProUser) {
      onOpenProModal();
      return;
    }

    setLoading(true);
    setError(null);
    setAppliedSuccess(null);

    let fullPrompt = prompt.trim();
    if (mode === 'create' && selectedStyle) {
      const style = STYLE_PRESETS.find((s) => s.label === selectedStyle);
      if (style) fullPrompt += style.promptSuffix;
    }

    try {
      const bodyPayload: any = {
        prompt: fullPrompt,
        mode,
        aspectRatio,
      };

      if (mode === 'edit' && activeLayer?.canvas) {
        bodyPayload.imageBase64 = activeLayer.canvas.toDataURL('image/png');
        bodyPayload.mimeType = 'image/png';
      }

      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI image generation service failed.');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err?.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertAsNewLayer = () => {
    if (!generatedImageUrl) return;
    const label = prompt.slice(0, 24) || 'AI Generated';
    onAddLayerFromImage(generatedImageUrl, `AI: ${label}`);
    setAppliedSuccess('Added as new layer to composition!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleApplyToActiveLayer = () => {
    if (!generatedImageUrl) return;
    const label = prompt.slice(0, 24) || 'AI Edit';
    onReplaceActiveLayerImage(generatedImageUrl, `AI Edit: ${label}`);
    setAppliedSuccess('Updated active layer with AI transformation!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `photolite-ai-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="modal-ai-image-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4"
      onClick={onClose}
    >
      <div
        id="modal-ai-image-content"
        className="pl-window pl-window-anim relative flex flex-col w-full max-w-3xl max-h-[90vh] text-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="pl-traffic-lights" role="group" aria-label="Window controls">
              <button type="button" id="btn-close-ai-modal" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
              <span className="pl-traffic-dot pl-dot-yellow" />
              <span className="pl-traffic-dot pl-dot-green" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow">
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">AI Image Studio</h2>
                <span
                  id="badge-ai-model-tag"
                  className="rounded-full bg-neutral-900 border border-neutral-700 px-2 py-0.5 font-mono text-[9px] text-amber-300"
                >
                  gemini-3.1-flash-image-preview
                </span>
                <span
                  id="badge-ai-pro-indicator"
                  onClick={onOpenProModal}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                    isProUser
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-neutral-800 text-amber-400 border border-amber-500/40 hover:bg-neutral-700'
                  }`}
                  title={isProUser ? 'Pro plan is active' : 'Click to upgrade to Pro'}
                >
                  <Crown className="h-2.5 w-2.5" />
                  <span>{isProUser ? 'Pro Active' : 'Pro Feature'}</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Use text prompts to create original artwork or edit the active canvas layer.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Plan Upsell Notice (when user is on Free Tier) */}
        {!isProUser && (
          <div
            id="banner-pro-gated-alert"
            className="pl-toast-anim bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border-b border-amber-500/30 px-5 py-2.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Crown className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>Pro Plan Exclusive:</strong> AI image creation & editing requires a PhotoLite Pro membership.
              </span>
            </div>
            <button
              id="btn-activate-pro-from-banner"
              onClick={onOpenProModal}
              className="rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-md cursor-pointer transition-transform active:scale-95"
            >
              Unlock Pro Access
            </button>
          </div>
        )}

        {/* Mode Selector Tabs: Create vs Edit */}
        <div className="flex border-b border-black/80 bg-[#1b1b1b] px-5 pt-2">
          <button
            id="tab-ai-create-mode"
            onClick={() => {
              setMode('create');
              setError(null);
            }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              mode === 'create'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create New Image (Text-to-Image)</span>
          </button>

          <button
            id="tab-ai-edit-mode"
            onClick={() => {
              setMode('edit');
              setError(null);
            }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              mode === 'edit'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Edit Active Layer ({activeLayer ? activeLayer.name : 'No Layer'})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Layer Context for Edit Mode */}
          {mode === 'edit' && (
            <div className="rounded-lg border border-black/60 bg-[#161616] p-3 flex items-center gap-3">
              <div className="h-16 w-16 rounded border border-black/80 bg-[#121212] overflow-hidden flex items-center justify-center shrink-0">
                {activeLayerDataUrl ? (
                  <img
                    src={activeLayerDataUrl}
                    alt={activeLayer?.name || 'Active Layer'}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-600" />
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span>Target Layer: {activeLayer?.name || 'Background'}</span>
                </div>
                <p className="text-gray-400 text-[11px]">
                  Gemini will analyze your active layer pixels and transform them based on your text prompt.
                </p>
                <div className="text-[10px] font-mono text-gray-500">
                  Dimensions: {activeLayer?.width || canvasWidth} × {activeLayer?.height || canvasHeight} px
                </div>
              </div>
            </div>
          )}

          {/* Text Prompt Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-gray-300">
              <label htmlFor="ai-prompt-input" className="flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-amber-400" />
                <span>{mode === 'create' ? 'Prompt Description' : 'Edit Instructions'}</span>
              </label>
              <span className="text-[10px] text-gray-500">Powered by Gemini AI</span>
            </div>

            <textarea
              id="ai-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'create'
                  ? 'E.g., A majestic lion with a crown in a futuristic cybernetic jungle with neon bioluminescent foliage...'
                  : 'E.g., Add glowing neon sunglasses, transform background to sunset mountains, make it high fantasy style...'
              }
              className="w-full rounded-lg border border-black bg-[#151515] p-3 text-xs text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none shadow-inner"
            />

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-gray-400 self-center">Ideas:</span>
              {(mode === 'create' ? PROMPT_SUGGESTIONS : EDIT_SUGGESTIONS).slice(0, 3).map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="rounded-full border border-black/60 bg-[#222] px-2.5 py-0.5 text-[10px] text-gray-300 hover:bg-[#333] hover:text-amber-300 transition-colors cursor-pointer truncate max-w-[240px]"
                  title={idea}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Creation Settings: Aspect Ratio & Styles (Create Mode Only) */}
          {mode === 'create' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Aspect Ratio */}
              <div className="space-y-1.5 rounded-lg border border-black/60 bg-[#161616] p-3">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Aspect Ratio</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['1:1', '16:9', '4:3', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      id={`btn-ratio-${ratio.replace(':', '-')}`}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`rounded py-1.5 text-xs font-mono font-medium border transition-colors cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-amber-600 border-amber-400 text-white font-bold'
                          : 'bg-[#202020] border-black text-gray-400 hover:bg-[#2c2c2c] hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Presets */}
              <div className="space-y-1.5 rounded-lg border border-black/60 bg-[#161616] p-3">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-amber-400" />
                  <span>Art Style</span>
                </label>
                <div className="flex flex-wrap gap-1">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.label}
                      id={`btn-style-${style.label.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setSelectedStyle(selectedStyle === style.label ? null : style.label)}
                      className={`rounded px-2 py-0.5 text-[10px] font-medium border transition-colors cursor-pointer ${
                        selectedStyle === style.label
                          ? 'bg-amber-600 border-amber-400 text-white font-semibold'
                          : 'bg-[#202020] border-black text-gray-400 hover:bg-[#2c2c2c] hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              id="ai-error-banner"
              className="pl-toast-anim rounded-lg border border-red-800/80 bg-red-950/40 p-3 flex items-start gap-2.5 text-xs text-red-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Generation Notice</p>
                <p className="text-[11px] leading-relaxed opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {appliedSuccess && (
            <div
              id="ai-success-banner"
              className="rounded-lg border border-emerald-800/80 bg-emerald-950/40 p-3 flex items-center gap-2 text-xs text-emerald-300"
            >
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{appliedSuccess}</span>
            </div>
          )}

          {/* Generated Result Preview Area */}
          {generatedImageUrl && (
            <div className="pl-window-anim rounded-lg border border-amber-500/40 bg-[#141414] p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generated Image Result</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">gemini-3.1-flash-image-preview</span>
              </div>

              <div className="relative rounded-md border border-black/80 bg-black/60 overflow-hidden flex items-center justify-center max-h-72">
                <img
                  id="preview-generated-ai-image"
                  src={generatedImageUrl}
                  alt="Generated AI artwork"
                  className="max-h-72 w-auto object-contain rounded"
                />
              </div>

              {/* Action Buttons for Result */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  id="btn-add-ai-as-layer"
                  type="button"
                  onClick={handleInsertAsNewLayer}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 text-xs shadow-md cursor-pointer transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Add as New Layer</span>
                </button>

                {mode === 'edit' && activeLayer && (
                  <button
                    id="btn-apply-ai-to-active-layer"
                    type="button"
                    onClick={handleApplyToActiveLayer}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 text-xs shadow-md cursor-pointer transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Apply to Active Layer</span>
                  </button>
                )}

                <button
                  id="btn-download-ai-image"
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg bg-[#252525] hover:bg-[#333] border border-black px-3 py-2 text-xs font-medium text-gray-300 cursor-pointer transition-colors"
                  title="Download Image to computer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-black/80 bg-[#252525] px-5 py-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Server-side Gemini SDK Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-ai-modal"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-[#1f1f1f] hover:bg-[#333] border border-black px-3.5 py-1.5 text-xs font-medium text-gray-300 cursor-pointer transition-colors disabled:opacity-50"
            >
              Close
            </button>

            <button
              id="btn-generate-ai-image"
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-neutral-700 disabled:to-neutral-800 disabled:text-gray-500 text-black font-bold px-4 py-1.5 text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-black" />
                  <span>Generating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{mode === 'create' ? 'Generate Image' : 'Transform Layer'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
