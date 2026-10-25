import React, { useState } from 'react';
import { X, Film, Plus, Check, Sparkles, Link as LinkIcon } from 'lucide-react';
import { Product, Reel } from '../types';

interface EmbedReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddReel: (reel: Reel) => void;
}

export const EmbedReelModal: React.FC<EmbedReelModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddReel,
}) => {
  if (!isOpen) return null;

  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/reel/C8x9Kl12_nm/');
  const [title, setTitle] = useState('Santa Fe Suede Jacket: Sunset styling in Taos');
  const [caption, setCaption] = useState('Layering our Santa Fe lambskin suede over silk slip with handcrafted calfskin boots. Comment your size or DM us directly for private fitting!');
  const [audioTrack, setAudioTrack] = useState('Leon Bridges · Texas Sun (Acoustic Mix)');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([products[0]?.id || 'prod-1']);
  const [selectedGradient, setSelectedGradient] = useState<string>('from-[#3D2C1E] via-[#5C4033] to-[#2B1B17]');

  const gradients = [
    { label: 'Desert Ochre', value: 'from-[#3D2C1E] via-[#5C4033] to-[#2B1B17]' },
    { label: 'Tuscan Charcoal', value: 'from-[#2F2620] via-[#43352A] to-[#171310]' },
    { label: 'Sedona Terracotta', value: 'from-[#6E473B] via-[#8C5E48] to-[#45271F]' },
    { label: 'High Plains Noir', value: 'from-[#1A1816] via-[#2A2622] to-[#0E0D0C]' },
  ];

  const toggleProductTag = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instagramUrl.trim()) return;

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim(),
      instagramUrl: instagramUrl.trim(),
      gradientBg: selectedGradient,
      taggedProductIds: selectedProductIds.length > 0 ? selectedProductIds : [products[0]?.id || 'prod-1'],
      likesCount: Math.floor(1200 + Math.random() * 3000),
      commentsCount: Math.floor(45 + Math.random() * 150),
      viewsCount: Math.floor(25000 + Math.random() * 50000),
      duration: '0:30',
      audioTrack: audioTrack.trim() || 'ReelCart Original Sound',
      createdAt: 'Just now',
    };

    onAddReel(newReel);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[#FAF9F6] text-[#6B655B] hover:text-[#181716] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="border-b border-[#EAE6DF] pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
              Instagram Integration
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#181716]">
              Embed Instagram Reel & Tag Products
            </h3>
            <p className="text-xs text-[#6B655B] mt-0.5">
              Turn your organic Instagram video views into direct sales with shoppable product tags.
            </p>
          </div>

          {/* Instagram URL */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
              Instagram Reel Link
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full p-2.5 pl-9 text-xs sm:text-sm bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
              />
              <LinkIcon className="w-4 h-4 text-[#8E877E] absolute left-3 top-3" />
            </div>
          </div>

          {/* Title & Caption */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
                Reel Title / Styling Theme
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
                Post Caption & Fitting Guidance
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
              />
            </div>
          </div>

          {/* Tag Products from Catalog */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
              Tag Shoppable Garments ({selectedProductIds.length} Selected)
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
              {products.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProductTag(p.id)}
                    className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-sm font-semibold text-[#181716] border border-[#181716]'
                        : 'hover:bg-white text-[#524C44]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="font-mono tabular-nums shrink-0 ml-2">${p.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Atmosphere */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
              Video Ambient Tone
            </label>
            <div className="grid grid-cols-4 gap-2">
              {gradients.map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedGradient(g.value)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedGradient === g.value
                      ? 'border-[#181716] ring-1 ring-[#181716]'
                      : 'border-[#EAE6DF]'
                  }`}
                >
                  <div className={`w-full h-4 rounded bg-gradient-to-r ${g.value} mb-1`} />
                  <span className="text-[10px] text-[#524C44] block truncate">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Film className="w-4 h-4" />
            <span>Publish Shoppable Reel to Boutique</span>
          </button>
        </form>
      </div>
    </div>
  );
};
