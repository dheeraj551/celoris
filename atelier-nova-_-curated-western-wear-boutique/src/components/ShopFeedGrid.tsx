import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ShopFeedGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onConsultStylistForProduct: (product: Product) => void;
}

export const ShopFeedGrid: React.FC<ShopFeedGridProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  onConsultStylistForProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Curated Pieces' },
    { id: 'outerwear', label: 'Tailored Outerwear' },
    { id: 'dresses', label: 'Dresses & Silks' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'footwear', label: 'Handcrafted Boots' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleLike = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Category Filter Tabs (Segmented Controls) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2">
          <div className="inline-flex items-center gap-1.5 p-1 bg-[#EFECE6] rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#FAF9F6] text-[#181716] shadow-sm font-semibold'
                    : 'text-[#6B655B] hover:text-[#181716]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredProducts.map((product) => {
            const isLiked = likedMap[product.id];

            return (
              <article
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col justify-between bg-white rounded-xl border border-[#EAE6DF] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Image Container with Instagram Aspect */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EF]">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Floating Controls */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <button
                      onClick={(e) => toggleLike(e, product.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-black/30 text-white hover:bg-black/50'
                      }`}
                      aria-label="Save look"
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : 'stroke-[2]'}`}
                      />
                    </button>
                  </div>

                  {/* Stock or Limited Run indicator (quiet text tag, no pill clutter) */}
                  {product.compareAtPrice && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#181716] text-[#FAF9F6] px-2 py-0.5 rounded">
                        Special Atelier Run
                      </span>
                    </div>
                  )}

                  {/* Hover Actions Tray */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="flex-1 py-2 px-3 bg-[#FAF9F6] text-[#181716] text-xs font-semibold tracking-wider uppercase rounded hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Bag</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onConsultStylistForProduct(product);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors cursor-pointer"
                      title="Ask stylist about fit"
                      aria-label="Ask stylist about fit"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content & Metadata */}
                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8E877E] uppercase tracking-wider mb-1">
                      <span>{product.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>In Stock</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg text-[#181716] font-medium leading-snug line-clamp-1 group-hover:text-[#8C6239] transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-[#F0ECE4] mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-sm sm:text-base font-semibold text-[#181716] tabular-nums">
                        ${product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="font-mono text-xs text-[#8E877E] line-through tabular-nums">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#8E877E] hidden sm:inline">
                      {product.sizes.length} sizes available
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
