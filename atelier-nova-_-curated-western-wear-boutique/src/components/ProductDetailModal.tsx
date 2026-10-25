import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Film
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onConsultStylist: (product: Product) => void;
  onWatchReel: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onConsultStylist,
  onWatchReel,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'S');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#181716] shadow-sm transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Editorial Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#F5F3EF] flex flex-col justify-between p-4 sm:p-6">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-200">
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] uppercase tracking-wider font-semibold bg-[#181716] text-[#FAF9F6] px-2 py-0.5 rounded shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Alternate Image Switcher */}
          {product.secondaryImage && (
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setActiveImage(product.image)}
                className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === product.image
                    ? 'border-[#181716] scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.image}
                  alt="Front view"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={() => setActiveImage(product.secondaryImage!)}
                className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === product.secondaryImage
                    ? 'border-[#181716] scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.secondaryImage}
                  alt="Editorial styling view"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-6">
          <div className="space-y-4">
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-[#8E877E] uppercase tracking-wider">
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">In Stock Atelier</span>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#181716] font-medium leading-snug">
                {product.title}
              </h2>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-mono text-2xl font-semibold text-[#181716] tabular-nums">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-base text-[#8E877E] line-through tabular-nums">
                    ${product.compareAtPrice}
                  </span>
                )}
                <span className="text-xs text-[#8E877E]">Taxes & Duties Included</span>
              </div>
            </div>

            {/* Watch in Reel Link */}
            <button
              onClick={() => {
                onClose();
                onWatchReel();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C6239] hover:text-[#5C4033] transition-colors cursor-pointer"
            >
              <Film className="w-4 h-4" />
              <span>Watch how this piece drapes in our Instagram Reel</span>
            </button>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#524C44] leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
                Colorway: <span className="text-[#181716] font-medium">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-[#181716] bg-[#181716] text-[#FAF9F6] font-semibold'
                        : 'border-[#D6D0C5] text-[#524C44] hover:border-[#181716]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider">
                  Select Size
                </label>
                <button
                  onClick={() => onConsultStylist(product)}
                  className="text-xs text-[#8C6239] underline font-medium hover:text-[#5C4033] cursor-pointer"
                >
                  Unsure? Consult Stylist
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#181716] bg-[#181716] text-[#FAF9F6]'
                        : 'border-[#D6D0C5] text-[#181716] hover:border-[#181716]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric & Fit Notes Accordion style */}
            <div className="pt-2 border-t border-[#F0ECE4] space-y-2 text-xs text-[#524C44]">
              <div>
                <span className="font-semibold text-[#181716]">Fabrication:</span>{' '}
                {product.fabric}
              </div>
              <div>
                <span className="font-semibold text-[#181716]">Tailoring Notes:</span>{' '}
                {product.fitNotes}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-[#F0ECE4]">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#D6D0C5] rounded-xl overflow-hidden bg-[#FAF9F6]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs text-[#181716] hover:bg-[#EFECE6] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-mono font-medium text-[#181716] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs text-[#181716] hover:bg-[#EFECE6] cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Primary Buy CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Stylist Chat Button */}
            <button
              onClick={() => onConsultStylist(product)}
              className="w-full py-2.5 px-4 bg-[#EFECE6] hover:bg-[#E0DBD0] text-[#181716] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#8C6239]" />
              <span>Discuss Sizing with Stylist in DM</span>
            </button>

            {/* Reassurance markers */}
            <div className="flex items-center justify-between text-[11px] text-[#8E877E] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Complimentary Express Shipping
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> 14-Day Tailoring Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
