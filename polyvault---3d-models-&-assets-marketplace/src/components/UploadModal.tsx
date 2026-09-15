import React, { useState } from 'react';
import { ModelAsset, AssetCategory, ModelFormat, ModelGeneratorType, UserProfile } from '../types';
import {
  X,
  UploadCloud,
  FileBox,
  Layers,
  DollarSign,
  Tag,
  CheckCircle2,
  Box,
  Palette,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAssetCreated: (asset: ModelAsset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAssetCreated,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Exclude<AssetCategory, 'All'>>('Sci-Fi');
  const [price, setPrice] = useState<number>(29);
  const [polyCount, setPolyCount] = useState<number>(32000);
  const [formats, setFormats] = useState<ModelFormat[]>(['GLTF', 'FBX', 'OBJ']);
  const [generatorType, setGeneratorType] = useState<ModelGeneratorType>('drone');
  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [accentColor, setAccentColor] = useState('#38bdf8');
  const [isPbr, setIsPbr] = useState(true);
  const [isRigged, setIsRigged] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [tagsInput, setTagsInput] = useState('sci-fi, 3d, game-ready, asset');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAsset: ModelAsset = {
      id: `mod_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'High-fidelity 3D model optimized for real-time rendering and virtual production pipelines.',
      category,
      price: Number(price) || 0,
      originalPrice: price > 0 ? Math.round(price * 1.3) : undefined,
      rating: 5.0,
      reviewCount: 1,
      polyCount: Number(polyCount) || 25000,
      vertexCount: Math.round(Number(polyCount) * 1.05),
      formats: formats.length > 0 ? formats : ['GLTF'],
      textures: ['Albedo 4K', 'Normal 4K', 'Roughness 4K', 'Metallic 4K', 'AO 4K'],
      isRigged,
      isAnimated,
      isPbr,
      fileSizeMb: Math.round(polyCount / 500) + 15,
      license: price === 0 ? 'CC0 Free' : 'Standard Commercial',
      author: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        badge: 'CREATOR',
        verified: true,
        salesCount: currentUser.salesCount,
      },
      tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      likesCount: 1,
      generatorType,
      primaryColor,
      accentColor,
    };

    onAssetCreated(newAsset);
    onClose();
  };

  const toggleFormat = (fmt: ModelFormat) => {
    setFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  return (
    <div
      id="upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="upload-modal-content"
        className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-950">Publish 3D Asset to Store</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-800">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700">Model Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Cybernetic Recon Drone Mk.IV"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700">Description</label>
            <textarea
              rows={2}
              placeholder="Detail polygon budget, topology, intended engine..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs cursor-pointer"
              >
                {(['Sci-Fi', 'Characters', 'Vehicles', 'Architecture', 'Weapons', 'Nature', 'Props', 'Electronics'] as const).map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">Price (USD) - 0 for Free</label>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">Polygon Count</label>
              <input
                type="number"
                min="100"
                step="500"
                value={polyCount}
                onChange={(e) => setPolyCount(Number(e.target.value))}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">3D Generator Archetype</label>
              <select
                value={generatorType}
                onChange={(e) => setGeneratorType(e.target.value as any)}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs cursor-pointer"
              >
                <option value="drone">Combat Drone / VTOL</option>
                <option value="helmet">Samurai Helmet</option>
                <option value="sword">Relic Greatsword</option>
                <option value="car">Aero Hypercar</option>
                <option value="building">Brutalist Architecture</option>
                <option value="robot">Titan Bipedal Mech</option>
                <option value="crystal">Aether Crystal</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-8 rounded-lg bg-transparent border border-zinc-300 cursor-pointer"
                />
                <span className="font-mono text-xs text-zinc-700">{primaryColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-700">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-8 rounded-lg bg-transparent border border-zinc-300 cursor-pointer"
                />
                <span className="font-mono text-xs text-zinc-700">{accentColor}</span>
              </div>
            </div>
          </div>

          {/* Formats check */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700">Included Formats</label>
            <div className="flex flex-wrap gap-2">
              {(['GLTF', 'FBX', 'OBJ', 'BLEND', 'USDZ'] as ModelFormat[]).map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => toggleFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${
                    formats.includes(fmt)
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Feature toggles */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-zinc-200">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
              <input
                type="checkbox"
                checked={isPbr}
                onChange={(e) => setIsPbr(e.target.checked)}
                className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
              />
              <span>PBR 4K Textures</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
              <input
                type="checkbox"
                checked={isRigged}
                onChange={(e) => setIsRigged(e.target.checked)}
                className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
              />
              <span>Rigged Mesh</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
              <input
                type="checkbox"
                checked={isAnimated}
                onChange={(e) => setIsAnimated(e.target.checked)}
                className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
              />
              <span>Includes Animations</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm cursor-pointer"
            >
              Publish Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
