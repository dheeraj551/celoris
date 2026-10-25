import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Truck
} from 'lucide-react';
import { CartItem, Order, CustomInvoice } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  invoiceToPay?: CustomInvoice | null;
  onOrderSuccess: (order: Order) => void;
  onConsultStylistWithOrder: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  invoiceToPay,
  onOrderSuccess,
  onConsultStylistWithOrder,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'klarna'>('apple_pay');
  const [customerName, setCustomerName] = useState(invoiceToPay ? invoiceToPay.clientName : 'Elena Vance');
  const [customerEmail, setCustomerEmail] = useState('elena.vance@example.com');
  const [address, setAddress] = useState('42 Canyon Road, Santa Fe, NM 87501');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = invoiceToPay
    ? invoiceToPay.total
    : cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const shipping = subtotal >= 250 || invoiceToPay ? 0 : 15;
  const total = subtotal + shipping;

  const handleAutofill = () => {
    setCustomerName('Elena Vance');
    setCustomerEmail('elena.vance@example.com');
    setAddress('42 Canyon Road, Suite 4, Santa Fe, NM 87501');
    setCardNumber('4000 1234 5678 9010');
    setCardExp('09/29');
    setCardCvc('321');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
        items: cartItems,
        subtotal,
        shipping,
        total,
        customerName,
        customerEmail,
        shippingAddress: address,
        paymentMethod,
        status: 'confirmed',
        createdAt: 'Just now',
      };
      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[#FAF9F6] text-[#6B655B] hover:text-[#181716] cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Confirmation State */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#8C6239] font-bold">
                Order Confirmed
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#181716] font-medium">
                Thank You, {confirmedOrder.customerName}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B655B]">
                Your tailored Western pieces are being prepared at the Santa Fe atelier.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#EAE6DF] pb-2">
                <span className="text-[#8E877E]">Order Reference</span>
                <span className="font-mono font-semibold text-[#181716]">
                  #{confirmedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#EAE6DF] pb-2">
                <span className="text-[#8E877E]">Delivery Destination</span>
                <span className="font-medium text-[#181716] text-right truncate max-w-[240px]">
                  {confirmedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#EAE6DF] pb-2">
                <span className="text-[#8E877E]">Total Charged</span>
                <span className="font-mono font-bold text-base text-[#181716] tabular-nums">
                  ${confirmedOrder.total}.00
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#8E877E]">
                <span>Estimated Arrival</span>
                <span className="font-medium text-emerald-700">3-4 Business Days via Express</span>
              </div>
            </div>

            {/* Direct Stylist Follow-up Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onConsultStylistWithOrder(confirmedOrder.orderNumber);
                }}
                className="w-full py-3 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#DFBA73]" />
                <span>Message Stylist Camille with Order #{confirmedOrder.orderNumber}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-[#6B655B] hover:text-[#181716] cursor-pointer"
              >
                Continue Browsing Boutique
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6239]">
                  {invoiceToPay ? 'VIP Consultation Checkout' : 'Atelier Direct Checkout'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#181716]">
                  Secure Payment Processing
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[11px] font-mono text-[#8C6239] hover:underline bg-[#FAF9F6] border border-[#EAE6DF] px-2.5 py-1 rounded cursor-pointer"
              >
                Autofill Test Card
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#181716] bg-[#181716] text-[#FAF9F6]'
                    : 'border-[#D6D0C5] text-[#181716] hover:bg-[#FAF9F6]'
                }`}
              >
                <span className="text-xs font-semibold block">Apple Pay</span>
                <span className="text-[10px] opacity-75">1-Touch Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#181716] bg-[#181716] text-[#FAF9F6]'
                    : 'border-[#D6D0C5] text-[#181716] hover:bg-[#FAF9F6]'
                }`}
              >
                <span className="text-xs font-semibold block">Credit Card</span>
                <span className="text-[10px] opacity-75">Visa / MC / Amex</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('klarna')}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'klarna'
                    ? 'border-[#181716] bg-[#181716] text-[#FAF9F6]'
                    : 'border-[#D6D0C5] text-[#181716] hover:bg-[#FAF9F6]'
                }`}
              >
                <span className="text-xs font-semibold block">Klarna</span>
                <span className="text-[10px] opacity-75">4x ${(total / 4).toFixed(0)}</span>
              </button>
            </div>

            {/* Input Details */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                />
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 pl-9 font-mono bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                      />
                      <CreditCard className="w-4 h-4 text-[#8E877E] absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                        Expiration
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full p-2.5 font-mono bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2.5 font-mono bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B655B]">
                <span>Items Subtotal</span>
                <span className="font-mono text-[#181716] font-medium">${subtotal}.00</span>
              </div>
              <div className="flex justify-between text-[#6B655B]">
                <span>Express Delivery</span>
                <span className="font-mono text-[#8C6239] font-medium">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}.00`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#181716] pt-1.5 border-t border-[#EAE6DF]">
                <span>Total Due Now</span>
                <span className="font-mono tabular-nums text-base">${total}.00</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <span>Authorizing & Encrypting...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ${total}.00</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E877E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>PCI-DSS Level 1 Compliant · Instant Order Confirmation</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
