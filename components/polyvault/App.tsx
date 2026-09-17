import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ModelAsset, FilterState, Coupon, UserProfile, DownloadItem, ModelFormat } from './types';
import { MOCK_ASSETS, INITIAL_COUPONS, INITIAL_USER } from './data/mockAssets';
import { Navbar } from './components/Navbar';
import { Hero3DStage } from './components/Hero3DStage';
import { ModelCard } from './components/ModelCard';
import { ModelDetailModal } from './components/ModelDetailModal';
import { DownloadModal } from './components/DownloadModal';
import { CouponSystem } from './components/CouponSystem';
import { UserProfileModal } from './components/UserProfileModal';
import { UploadModal } from './components/UploadModal';
import { CompareModal } from './components/CompareModal';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Zap,
  Sparkles,
  Box,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  Cpu,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  // The real signed-in Supabase user (separate from the mock `currentUser`
  // profile below, which is a PolyVault-only local stand-in for
  // gamification fields — wallet/badges/turbo-tier — that don't exist in
  // the real profile yet). Real listings' author.id is always this user's
  // real id, so "My Uploads" below has to key off it, not currentUser.id.
  const { user } = useAuth();

  // Primary datasets. Real, published listings now live in Supabase (see
  // app/api/polyvault/assets) instead of this browser's own localStorage —
  // that local-only storage was the actual bug where an uploaded model and
  // its real creator name were invisible to every other visitor. `assets`
  // starts as just the seeded demo catalog and the effect below fetches and
  // prepends the real, shared listings once they load.
  const [assets, setAssets] = useState<ModelAsset[]>(MOCK_ASSETS);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('polyvault_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('polyvault_coupon');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS[0]; // Default TURBO100 active
  });

  const [downloadHistory, setDownloadHistory] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('polyvault_downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('polyvault_likes');
    return saved ? JSON.parse(saved) : ['mod_1', 'mod_3'];
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    formats: [],
    priceRange: 'all',
    polyRange: 'all',
    isPbrOnly: false,
    isRiggedOnly: false,
    isAnimatedOnly: false,
    license: 'all',
    sortBy: 'popular',
  });

  // Modal controls
  const [inspectingAsset, setInspectingAsset] = useState<ModelAsset | null>(null);
  const [downloadingAsset, setDownloadingAsset] = useState<ModelAsset | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [featuredAssetId, setFeaturedAssetId] = useState<string>(() => assets[0]?.id || 'mod_1');
  const [comparingAssetIds, setComparingAssetIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('polyvault_compare');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const featuredAsset = useMemo(() => {
    return assets.find((a) => a.id === featuredAssetId) || assets[0];
  }, [assets, featuredAssetId]);

  const comparingAssets = useMemo(() => {
    return assets.filter((a) => comparingAssetIds.includes(a.id));
  }, [assets, comparingAssetIds]);

  // Load the real, shared catalog from Supabase and prepend it to the
  // seeded demo assets, so every visitor — any browser, any device, signed
  // in or not — sees the same real uploads and real creator names.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/polyvault/assets');
        if (!res.ok) return;
        const body = await res.json();
        const realAssets: ModelAsset[] = Array.isArray(body?.assets) ? body.assets : [];
        if (!cancelled && realAssets.length > 0) {
          setAssets((prev) => [...realAssets, ...prev]);
        }
      } catch (err) {
        console.error('PolyVault: failed to load the shared catalog, showing the demo catalog only', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('polyvault_compare', JSON.stringify(comparingAssetIds));
  }, [comparingAssetIds]);

  useEffect(() => {
    localStorage.setItem('polyvault_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (activeCoupon) {
      localStorage.setItem('polyvault_coupon', JSON.stringify(activeCoupon));
    } else {
      localStorage.removeItem('polyvault_coupon');
    }
  }, [activeCoupon]);

  useEffect(() => {
    localStorage.setItem('polyvault_downloads', JSON.stringify(downloadHistory));
  }, [downloadHistory]);

  useEffect(() => {
    localStorage.setItem('polyvault_likes', JSON.stringify(likedIds));
  }, [likedIds]);

  // Like toggling
  const handleToggleLike = (assetId: string) => {
    setLikedIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  // Compare toggling (up to 4 items max)
  const handleToggleCompare = (asset: ModelAsset) => {
    setComparingAssetIds((prev) => {
      if (prev.includes(asset.id)) {
        return prev.filter((id) => id !== asset.id);
      }
      if (prev.length >= 4) {
        // Replace oldest or cap at 4
        return [...prev.slice(1), asset.id];
      }
      return [...prev, asset.id];
    });
  };

  const handleRemoveFromCompare = (assetId: string) => {
    setComparingAssetIds((prev) => prev.filter((id) => id !== assetId));
  };

  const handleClearCompare = () => {
    setComparingAssetIds([]);
  };

  // Record completed download
  const handleDownloadCompleted = (asset: ModelAsset, format: ModelFormat, textureRes: '1K' | '2K' | '4K') => {
    const newItem: DownloadItem = {
      id: `dl_${Date.now()}`,
      assetId: asset.id,
      assetTitle: asset.title,
      format,
      textureRes,
      fileSizeMb: asset.fileSizeMb,
      progress: 100,
      status: 'completed',
      speedMbps: activeCoupon ? 120 : 1.4,
      etaSec: 0,
      turboApplied: !!activeCoupon,
      couponCode: activeCoupon?.code,
      timestamp: Date.now(),
    };

    setDownloadHistory((prev) => [newItem, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1,
    }));

    // Update asset download count
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, downloadsCount: a.downloadsCount + 1 } : a))
    );
  };

  // High-performance search & filtering calculation
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Search text matching across title, description, tags, author, and formats
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchesTitle = asset.title.toLowerCase().includes(q);
          const matchesDesc = asset.description.toLowerCase().includes(q);
          const matchesTags = asset.tags.some((t) => t.toLowerCase().includes(q));
          const matchesAuthor = asset.author.name.toLowerCase().includes(q);
          const matchesFormat = asset.formats.some((f) => f.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTags && !matchesAuthor && !matchesFormat) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'All' && asset.category !== filters.category) {
          return false;
        }

        // Formats filter (asset must contain all chosen formats, or at least one)
        if (filters.formats.length > 0) {
          const hasFormat = filters.formats.some((fmt) => asset.formats.includes(fmt));
          if (!hasFormat) return false;
        }

        // Price range filter
        if (filters.priceRange === 'free' && asset.price !== 0) return false;
        if (filters.priceRange === 'under25' && (asset.price === 0 || asset.price >= 25)) return false;
        if (filters.priceRange === '25to50' && (asset.price < 25 || asset.price > 50)) return false;
        if (filters.priceRange === '50plus' && asset.price <= 50) return false;

        // Polygon range filter
        if (filters.polyRange === 'low' && asset.polyCount >= 10000) return false;
        if (filters.polyRange === 'mid' && (asset.polyCount < 10000 || asset.polyCount > 50000)) return false;
        if (filters.polyRange === 'high' && asset.polyCount <= 50000) return false;

        // Feature flags
        if (filters.isPbrOnly && !asset.isPbr) return false;
        if (filters.isRiggedOnly && !asset.isRigged) return false;
        if (filters.isAnimatedOnly && !asset.isAnimated) return false;

        // License filter
        if (filters.license === 'standard' && !asset.license.includes('Standard')) return false;
        if (filters.license === 'cc0' && !asset.license.includes('CC0')) return false;
        if (filters.license === 'editorial' && !asset.license.includes('Editorial')) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (filters.sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price_desc') {
          return b.price - a.price;
        }
        if (filters.sortBy === 'polycount') {
          return b.polyCount - a.polyCount;
        }
        // Default: popular (by downloads and reviews)
        return b.downloadsCount - a.downloadsCount;
      });
  }, [assets, filters]);

  // Assets uploaded by the current user. Real listings' author.id is the
  // real Supabase user id (see app/api/polyvault/assets), not the mock
  // currentUser.id, so this has to key off the real signed-in user —
  // signed-out visitors, and the seeded demo catalog, simply have none.
  const userUploads = useMemo(() => {
    if (!user) return [];
    return assets.filter((a) => a.author.id === user.id);
  }, [assets, user]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeCoupon={activeCoupon}
        currentUser={currentUser}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Store Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Interactive 3D WebGL Hero Graphic Stage */}
        <section>
          <Hero3DStage
            featuredAsset={featuredAsset}
            onInspect={(a) => setInspectingAsset(a)}
            onDownload={(a) => setDownloadingAsset(a)}
            onSelectFeatured={(a) => setFeaturedAssetId(a.id)}
            allAssets={assets}
          />
        </section>

        {/* Modern Graphic Feature Pillars */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex items-center gap-3 transition-colors hover:border-emerald-300"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Box className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">WebGL 2.0 Canvas</div>
              <div className="text-[10px] text-zinc-500">60 FPS Hardware Viewport</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex items-center gap-3 transition-colors hover:border-emerald-300"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">4K PBR Materials</div>
              <div className="text-[10px] text-zinc-500">Albedo, Normal & Roughness</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex items-center gap-3 transition-colors hover:border-emerald-300"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">Game & VFX Ready</div>
              <div className="text-[10px] text-zinc-500">GLTF, GLB, FBX, OBJ, USDZ</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex items-center gap-3 transition-colors hover:border-emerald-300"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">Gigabit Edge CDN</div>
              <div className="text-[10px] text-zinc-500">Direct High-Speed Pipeline</div>
            </div>
          </motion.div>
        </section>

        {/* Store Catalog Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <span>Featured 3D Assets Catalog</span>
                <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {filteredAssets.length} models
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Hover to rotate in real-time 3D, inspect polygon topology, or initiate rapid download.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeCoupon ? (
                <div
                  onClick={() => setIsCouponModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 cursor-pointer hover:border-emerald-400 transition-colors shadow-xs"
                  title="Manage active speed coupons"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Turbo CDN: <strong className="font-mono font-bold text-emerald-700">{activeCoupon.code}</strong> (120 MB/s)</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Apply Speed Coupon</span>
                </button>
              )}
            </div>
          </div>
          {/* Model Assets Grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredAssets.map((asset) => (
                <ModelCard
                  key={asset.id}
                  asset={asset}
                  activeCoupon={activeCoupon}
                  onInspect={(a) => setInspectingAsset(a)}
                  onDownload={(a) => setDownloadingAsset(a)}
                  isLiked={likedIds.includes(asset.id)}
                  onToggleLike={handleToggleLike}
                  onAuthorClick={() => setIsProfileModalOpen(true)}
                  isComparing={comparingAssetIds.includes(asset.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">No 3D Models Matched Your Criteria</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Try loosening your filters, selecting a different category, or clearing your search term.
              </p>
              <button
                id="btn-reset-filters-empty"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    category: 'All',
                    formats: [],
                    priceRange: 'all',
                    polyRange: 'all',
                    isPbrOnly: false,
                    isRiggedOnly: false,
                    isAnimatedOnly: false,
                    license: 'all',
                    sortBy: 'popular',
                  })
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 bg-white/90 py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-zinc-950">POLYVAULT 3D</span>
            <span>— Next-Gen 3D Assets, WebGL Viewport Studio & Fast CDN</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsCouponModalOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">
              Speed Coupons
            </button>
            <span>•</span>
            <button onClick={() => setIsUploadModalOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">
              Publish 3D Asset
            </button>
            <span>•</span>
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">
              Creator Profile
            </button>
          </div>
        </div>
      </footer>

      {/* 3D Model Inspection Studio Modal */}
      <ModelDetailModal
        asset={inspectingAsset}
        activeCoupon={activeCoupon}
        isOpen={!!inspectingAsset}
        onClose={() => setInspectingAsset(null)}
        onOpenDownload={(a) => {
          setInspectingAsset(null);
          setDownloadingAsset(a);
        }}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        onOpenAuthorProfile={() => {
          setInspectingAsset(null);
          setIsProfileModalOpen(true);
        }}
        isLiked={inspectingAsset ? likedIds.includes(inspectingAsset.id) : false}
        onToggleLike={handleToggleLike}
        isComparing={inspectingAsset ? comparingAssetIds.includes(inspectingAsset.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {/* Download Manager Modal */}
      <DownloadModal
        asset={downloadingAsset}
        activeCoupon={activeCoupon}
        onApplyCoupon={(c) => setActiveCoupon(c)}
        isOpen={!!downloadingAsset}
        onClose={() => setDownloadingAsset(null)}
        onDownloadCompleted={handleDownloadCompleted}
      />

      {/* Coupon & Turbo Speed Modal */}
      <CouponSystem
        activeCoupon={activeCoupon}
        onApplyCoupon={(c) => setActiveCoupon(c)}
        onRemoveCoupon={() => setActiveCoupon(null)}
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        user={currentUser}
        activeCoupon={activeCoupon}
        userUploads={userUploads}
        downloadHistory={downloadHistory}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectAsset={(a) => setInspectingAsset(a)}
        onOpenCouponModal={() => {
          setIsProfileModalOpen(false);
          setIsCouponModalOpen(true);
        }}
        onUpdateProfile={(updated) => setCurrentUser((u) => ({ ...u, ...updated }))}
        onReDownload={(item) => {
          const matched = assets.find((a) => a.id === item.assetId);
          if (matched) {
            setDownloadingAsset(matched);
          }
        }}
      />

      {/* Publish / Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onAssetCreated={(newAsset) => {
          setAssets((prev) => [newAsset, ...prev]);
          setCurrentUser((u) => ({
            ...u,
            uploadedAssetIds: [newAsset.id, ...u.uploadedAssetIds],
          }));
        }}
      />

      {/* Side-by-Side Model Comparison Overlay & Floating Tray */}
      <CompareModal
        selectedAssets={comparingAssets}
        onRemoveAsset={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
        onInspectAsset={(a) => setInspectingAsset(a)}
        onDownloadAsset={(a) => setDownloadingAsset(a)}
        activeCoupon={activeCoupon}
      />
    </div>
  );
}
