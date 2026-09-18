import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AssetCategory, FilterState, ModelFormat } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  RotateCcw,
  Bot,
  User,
  Car,
  Building2,
  Sword,
  Trees,
  Box,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: { name: AssetCategory; count: number }[];
  totalResults: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Sparkles className="w-3.5 h-3.5" />,
  'Sci-Fi': <Bot className="w-3.5 h-3.5" />,
  Characters: <User className="w-3.5 h-3.5" />,
  Vehicles: <Car className="w-3.5 h-3.5" />,
  Architecture: <Building2 className="w-3.5 h-3.5" />,
  Weapons: <Sword className="w-3.5 h-3.5" />,
  Nature: <Trees className="w-3.5 h-3.5" />,
  Props: <Box className="w-3.5 h-3.5" />,
  Electronics: <Laptop className="w-3.5 h-3.5" />,
};

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, searchQuery: val });
  };

  const handleCategorySelect = (cat: AssetCategory) => {
    onFilterChange({ ...filters, category: cat });
  };

  const toggleFormat = (fmt: ModelFormat) => {
    const nextFormats = filters.formats.includes(fmt)
      ? filters.formats.filter((f) => f !== fmt)
      : [...filters.formats, fmt];
    onFilterChange({ ...filters, formats: nextFormats });
  };

  const resetAllFilters = () => {
    onFilterChange({
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
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    filters.formats.length +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.polyRange !== 'all' ? 1 : 0) +
    (filters.isPbrOnly ? 1 : 0) +
    (filters.isRiggedOnly ? 1 : 0) +
    (filters.isAnimatedOnly ? 1 : 0) +
    (filters.license !== 'all' ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="w-full space-y-4">
      {/* Primary Search Bar & Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl blur-xs -z-10 group-focus-within:from-emerald-500/20 transition-all" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            id="input-search-query"
            type="text"
            placeholder="Search 3D models, assets, formats, tags (e.g. drone, helmet, pbr, fbx)..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white/90 backdrop-blur-md border border-zinc-200/90 rounded-2xl pl-11 pr-20 py-3 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
          />
          {filters.searchQuery ? (
            <button
              id="btn-clear-search"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
              <span>⌘K</span>
            </div>
          )}
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              id="select-sort-by"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-white/90 backdrop-blur-md border border-zinc-200/90 text-zinc-800 rounded-2xl pl-3.5 pr-8 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none shadow-xs transition-all hover:border-zinc-300"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="polycount">Polygon Count</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              showAdvanced || hasActiveFilters
                ? 'bg-emerald-50/90 text-emerald-900 border-emerald-300 shadow-emerald-500/10'
                : 'bg-white/90 backdrop-blur-md border-zinc-200/90 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Modern Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 text-xs no-scrollbar">
        {categories.map((cat) => {
          const isSelected = filters.category === cat.name;
          const icon = CATEGORY_ICONS[cat.name] || <Box className="w-3.5 h-3.5" />;
          return (
            <button
              key={cat.name}
              id={`tab-category-${cat.name.toLowerCase()}`}
              onClick={() => handleCategorySelect(cat.name)}
              className={`relative px-3.5 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'text-white'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/70 bg-white/50 border border-zinc-200/70'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="category-pill-active"
                  className="absolute inset-0 bg-emerald-600 rounded-2xl shadow-md shadow-emerald-600/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{icon}</span>
              <span className="relative z-10">{cat.name}</span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Panel (Collapsible with smooth animation) */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            id="advanced-filters-panel"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-xl space-y-5 text-zinc-700 text-xs"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-zinc-950 text-sm">Fine-Grain 3D Asset Filters</span>
              </div>

              {hasActiveFilters && (
                <button
                  id="btn-reset-filters"
                  onClick={resetAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Format Selection */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-900 block">File Formats</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['GLTF', 'GLB', 'FBX', 'OBJ', 'BLEND', 'USDZ'] as ModelFormat[]).map((fmt) => {
                    const isChecked = filters.formats.includes(fmt);
                    return (
                      <button
                        key={fmt}
                        id={`filter-fmt-${fmt}`}
                        onClick={() => toggleFormat(fmt)}
                        className={`px-2.5 py-1 rounded-xl border font-mono text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                        <span>.{fmt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Polygon Range */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-900 block">Polygon Budget</label>
                <select
                  id="filter-poly-range"
                  value={filters.polyRange}
                  onChange={(e) => onFilterChange({ ...filters, polyRange: e.target.value as any })}
                  className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">Any Polycount</option>
                  <option value="low">Low Poly (&lt; 10K Polys)</option>
                  <option value="mid">Mid Poly (10K - 50K Polys)</option>
                  <option value="high">High Detail (&gt; 50K Polys)</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-900 block">Price Tier</label>
                <select
                  id="filter-price-range"
                  value={filters.priceRange}
                  onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value as any })}
                  className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free Only (100% Free / CC0)</option>
                  <option value="under25">Under ₹25</option>
                  <option value="25to50">₹25 - ₹50</option>
                  <option value="50plus">₹50 and Above</option>
                </select>
              </div>

              {/* License Filter */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-900 block">License Type</label>
                <select
                  id="filter-license"
                  value={filters.license}
                  onChange={(e) => onFilterChange({ ...filters, license: e.target.value as any })}
                  className="w-full bg-zinc-50/80 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">Any License</option>
                  <option value="standard">Standard Commercial</option>
                  <option value="cc0">CC0 Free / Public Domain</option>
                  <option value="editorial">Editorial Only</option>
                </select>
              </div>
            </div>

            {/* Feature Toggles Row */}
            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-zinc-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="filter-pbr-toggle"
                  type="checkbox"
                  checked={filters.isPbrOnly}
                  onChange={(e) => onFilterChange({ ...filters, isPbrOnly: e.target.checked })}
                  className="rounded-md bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-zinc-800">4K PBR Materials Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="filter-rigged-toggle"
                  type="checkbox"
                  checked={filters.isRiggedOnly}
                  onChange={(e) => onFilterChange({ ...filters, isRiggedOnly: e.target.checked })}
                  className="rounded-md bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-zinc-800">Rigged Skeleton</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="filter-animated-toggle"
                  type="checkbox"
                  checked={filters.isAnimatedOnly}
                  onChange={(e) => onFilterChange({ ...filters, isAnimatedOnly: e.target.checked })}
                  className="rounded-md bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-zinc-800">Animated Sequences</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count & Active Filter Tags */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-zinc-900 font-extrabold">{totalResults}</strong> 3D models
          </span>
          {filters.category !== 'All' && (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {filters.category}
            </span>
          )}
          {filters.formats.map((fmt) => (
            <span
              key={fmt}
              className="text-zinc-700 font-mono text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 flex items-center gap-1"
            >
              .{fmt}
              <X
                className="w-2.5 h-2.5 cursor-pointer hover:text-rose-500"
                onClick={() => toggleFormat(fmt)}
              />
            </span>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline"
          >
            Clear active filters
          </button>
        )}
      </div>
    </div>
  );
};
