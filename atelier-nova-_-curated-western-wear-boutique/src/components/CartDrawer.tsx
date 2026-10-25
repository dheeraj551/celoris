import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 250;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Top Bar */}
          <div className="p-4 sm:p-6 border-b border-[#EAE6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#181716]" />
              <h3 className="font-serif text-xl font-medium text-[#181716]">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FAF9F6] text-[#6B655B] hover:text-[#181716] cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="p-4 bg-[#FAF9F6] border-b border-[#EAE6DF] space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#524C44]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8C6239]" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="font-semibold text-emerald-700">
                    Complimentary Express Shipping Unlocked!
                  </span>
                ) : (
                  <span>
                    Add ${(freeShippingThreshold - subtotal).toLocaleString()} for free worldwide delivery
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8C6239] transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-[#F0ECE4]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8E877E] border border-[#EAE6DF]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-serif text-lg text-[#181716]">Your bag is empty</h4>
                <p className="text-xs text-[#6B655B] max-w-xs">
                  Explore our curated shop feed or watch styling reels to discover handcrafted Western tailoring.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-[#181716] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#33302C] transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100 shrink-0 border border-[#EAE6DF]"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#181716] line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8E877E] hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#6B655B] mt-0.5">
                        Size: <span className="font-medium text-[#181716]">{item.selectedSize}</span> · Color: <span className="font-medium text-[#181716]">{item.selectedColor}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#D6D0C5] rounded-md overflow-hidden bg-[#FAF9F6]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#181716] hover:bg-[#EFECE6] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#181716] hover:bg-[#EFECE6] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#181716] tabular-nums">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Section */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#EAE6DF] bg-[#FAF9F6] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B655B]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#181716] font-medium tabular-nums">
                    ${subtotal.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between text-[#6B655B]">
                  <span>Atelier Delivery</span>
                  <span className="font-mono text-[#8C6239] font-medium">
                    {subtotal >= freeShippingThreshold ? 'Complimentary' : '$15.00'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#181716] pt-2 border-t border-[#EAE6DF]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    ${(subtotal + (subtotal >= freeShippingThreshold ? 0 : 15)).toLocaleString()}.00
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E877E] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6239]" />
                <span>256-bit Encrypted Checkout · Apple Pay & Card Protected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
