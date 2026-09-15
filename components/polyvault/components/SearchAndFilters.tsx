import React, { useState } from 'react';
import { AssetCategory, FilterState, ModelFormat } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  RotateCcw,
} from 'lucide-react';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: { name: AssetCategory; count: number }[];
  totalResults: number;
}

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

  const hasActiveFilters =
    filters.searchQuery ||
    filters.category !== 'All' ||
    filters.formats.length > 0 ||
    filters.priceRange !== 'all' ||
    filters.polyRange !== 'all' ||
    filters.isPbrOnly ||
    filters.isRiggedOnly ||
    filters.isAnimatedOnly ||
    filters.license !== 'all';

  return (
    <div className="w-full space-y-4">
      {/* Primary Search Bar & Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="input-search-query"
            type="text"
            placeholder="Search 3D models, assets, formats, tags (e.g. drone, helmet, pbr)..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
          />
          {filters.searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="select-sort-by"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-white border border-zinc-200 text-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-8 shadow-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="polycount">Polygon Count</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filter Toggle Button */}
          <button
            id="btn-toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              showAdvanced || hasActiveFilters
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => {
          const isSelected = filters.category === cat.name;
          return (
            <button
              key={cat.name}
              id={`tab-category-${cat.name.toLowerCase()}`}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Panel (Collapsible) */}
      {showAdvanced && (
        <div
          id="advanced-filters-panel"
          className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-lg space-y-4 animate-fade-in text-zinc-700 text-xs"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-zinc-900 text-sm">Fine-Grain Asset Filters</span>
            </div>

            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">File Formats</label>
              <div className="flex flex-wrap gap-1.5">
                {(['GLTF', 'FBX', 'OBJ', 'BLEND', 'USDZ'] as ModelFormat[]).map((fmt) => {
                  const isChecked = filters.formats.includes(fmt);
                  return (
                    <button
                      key={fmt}
                      id={`filter-fmt-${fmt}`}
                      onClick={() => toggleFormat(fmt)}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-colors flex items-center gap-1 cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
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
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">Polygon Budget</label>
              <select
                id="filter-poly-range"
                value={filters.polyRange}
                onChange={(e) => onFilterChange({ ...filters, polyRange: e.target.value as any })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Any Polycount</option>
                <option value="low">Low Poly (&lt; 10K Polys)</option>
                <option value="mid">Mid Poly (10K - 50K Polys)</option>
                <option value="high">High Detail (&gt; 50K Polys)</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">Price Tier</label>
              <select
                id="filter-price-range"
                value={filters.priceRange}
                onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value as any })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only (100% Free / CC0)</option>
                <option value="under25">Under $25</option>
                <option value="25to50">$25 - $50</option>
                <option value="50plus">$50 and Above</option>
              </select>
            </div>

            {/* License Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">License Type</label>
              <select
                id="filter-license"
                value={filters.license}
                onChange={(e) => onFilterChange({ ...filters, license: e.target.value as any })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Any License</option>
                <option value="standard">Standard Commercial</option>
                <option value="cc0">CC0 Free / Public Domain</option>
                <option value="editorial">Editorial Only</option>
              </select>
            </div>
          </div>

          {/* Feature Toggles Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-zinc-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="filter-pbr-toggle"
                type="checkbox"
                checked={filters.isPbrOnly}
                onChange={(e) => onFilterChange({ ...filters, isPbrOnly: e.target.checked })}
                className="rounded bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium text-zinc-800">PBR Materials Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="filter-rigged-toggle"
                type="checkbox"
                checked={filters.isRiggedOnly}
                onChange={(e) => onFilterChange({ ...filters, isRiggedOnly: e.target.checked })}
                className="rounded bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium text-zinc-800">Rigged Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="filter-animated-toggle"
                type="checkbox"
                checked={filters.isAnimatedOnly}
                onChange={(e) => onFilterChange({ ...filters, isAnimatedOnly: e.target.checked })}
                className="rounded bg-zinc-50 border-zinc-300 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium text-zinc-800">Animated Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Results Count & Active Filter Badges */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-zinc-900 font-bold">{totalResults}</strong> 3D models</span>
          {filters.category !== 'All' && (
            <span className="text-emerald-600 font-semibold">• {filters.category}</span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-emerald-600 hover:text-emerald-700 underline font-medium cursor-pointer"
          >
            Clear active filters
          </button>
        )}
      </div>
    </div>
  );
};
