import React, { useState } from 'react';
import { 
  Send, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  Check, 
  User, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Conversation, Product, BookingSlot, CustomInvoice, Message } from '../types';

interface DirectConsultationDrawerProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onPayInvoice: (invoice: CustomInvoice) => void;
  onConfirmBooking: (booking: BookingSlot) => void;
  onSendMessage: (conversationId: string, text: string, extras?: { product?: Product; booking?: BookingSlot; invoice?: CustomInvoice }) => void;
}

export const DirectConsultationDrawer: React.FC<DirectConsultationDrawerProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  products,
  onOpenProduct,
  onQuickAdd,
  onPayInvoice,
  onConfirmBooking,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedProductToAttach, setSelectedProductToAttach] = useState<string>('');

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleAttachProduct = (prod: Product) => {
    onSendMessage(
      activeConv.id,
      `I have pulled up the ${prod.title} ($${prod.price}) for you. Let me know if you would like me to reserve your size.`,
      { product: prod }
    );
    setShowAttachMenu(false);
  };

  const handleAttachBooking = () => {
    const newBooking: BookingSlot = {
      id: `booking-${Date.now()}`,
      serviceTitle: '1-on-1 Virtual Lookbook Fitting & Sizing',
      duration: '30 min',
      price: 0,
      date: 'Thursday, Oct 8',
      time: '3:00 PM MDT',
      stylistName: 'Camille (Lead Stylist)',
      status: 'available',
    };

    onSendMessage(
      activeConv.id,
      'I have reserved a 30-minute private virtual styling slot for you. Click below to lock in the appointment.',
      { booking: newBooking }
    );
    setShowAttachMenu(false);
  };

  const handleAttachInvoice = () => {
    const targetProduct = products[0]; // Santa Fe Suede Jacket
    const newInvoice: CustomInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-RC-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: activeConv.clientName,
      items: [
        {
          productId: targetProduct.id,
          title: targetProduct.title,
          size: 'S',
          color: 'Desert Caramel',
          price: targetProduct.price,
          quantity: 1,
        },
      ],
      subtotal: targetProduct.price,
      discount: 35,
      shipping: 0,
      total: targetProduct.price - 35,
      status: 'pending',
      notes: 'VIP Client Direct Consultation Rate with complimentary express delivery.',
    };

    onSendMessage(
      activeConv.id,
      `Here is your bespoke invoice with $35 VIP fitting courtesy applied. You can complete secure payment directly right here.`,
      { invoice: newInvoice }
    );
    setShowAttachMenu(false);
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Container with Instagram Direct + Luxury Salon Aesthetic */}
      <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-sm overflow-hidden flex flex-col md:flex-row h-[740px]">
        {/* Left Column: Client Chats List */}
        <div className="w-full md:w-80 border-r border-[#EAE6DF] flex flex-col bg-[#FAF9F6]">
          {/* Header */}
          <div className="p-4 border-b border-[#EAE6DF] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#181716]">
                VIP Consultations
              </h3>
              <p className="text-[11px] text-[#8E877E] tracking-wider uppercase">
                Private Stylist DMs
              </p>
            </div>
            <span className="text-[10px] font-mono bg-[#EFECE6] text-[#181716] px-2 py-0.5 rounded font-semibold">
              {conversations.length} Active
            </span>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#EAE6DF]/60">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isActive ? 'bg-white shadow-sm' : 'hover:bg-[#F2EFE9]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.clientAvatar}
                      alt={conv.clientName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-[#D6D0C5]"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8C6239] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-xs font-semibold text-[#181716] truncate">
                        {conv.clientName}
                      </p>
                      <span className="text-[10px] text-[#8E877E] font-mono shrink-0">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6B655B] truncate mb-1.5">
                      {conv.lastMessage}
                    </p>

                    <span className="text-[10px] uppercase tracking-wider font-medium text-[#8C6239] bg-[#EFECE6] px-1.5 py-0.5 rounded">
                      {conv.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Security Note */}
          <div className="p-3 bg-[#EFECE6]/50 border-t border-[#EAE6DF] text-[10px] text-[#8E877E] flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>End-to-End Encrypted Private Salon</span>
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Top Bar of Active Conversation */}
          <div className="p-4 border-b border-[#EAE6DF] flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.clientAvatar}
                alt={activeConv.clientName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-[#EAE6DF]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-[#181716]">
                    {activeConv.clientName}
                  </h4>
                  <span className="text-xs text-[#8E877E] font-mono">
                    {activeConv.clientHandle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#8E877E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Camille (Lead Stylist) Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stylist Action Shortcuts */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAttachBooking}
                className="px-2.5 py-1.5 text-xs font-medium text-[#181716] bg-[#EFECE6] hover:bg-[#E0DBD0] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Send virtual fitting slot"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send Fitting Slot</span>
              </button>

              <button
                onClick={handleAttachInvoice}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#181716] hover:bg-[#33302C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Create VIP custom invoice"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send Invoice</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6]/40">
            {activeConv.messages.map((msg) => {
              const isStylist = msg.sender === 'stylist';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStylist ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Text bubble */}
                  {msg.text && (
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isStylist
                          ? 'bg-[#181716] text-[#FAF9F6] rounded-tr-none'
                          : 'bg-white text-[#181716] border border-[#EAE6DF] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Interactive In-Chat Product Card */}
                  {msg.productCard && (
                    <div className="w-full max-w-sm p-3.5 bg-white rounded-xl border border-[#D6D0C5] shadow-sm space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={msg.productCard.image}
                          alt={msg.productCard.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-semibold text-[#8C6239] tracking-wider">
                            Curated Selection
                          </span>
                          <h5 className="text-xs font-semibold text-[#181716] truncate">
                            {msg.productCard.title}
                          </h5>
                          <p className="text-xs font-mono font-medium text-[#181716] mt-0.5 tabular-nums">
                            ${msg.productCard.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F0ECE4]">
                        <button
                          onClick={() => onOpenProduct(msg.productCard!)}
                          className="flex-1 py-1.5 text-xs font-medium text-[#181716] border border-[#D6D0C5] rounded hover:bg-[#FAF9F6] transition-colors cursor-pointer text-center"
                        >
                          View Sizing
                        </button>
                        <button
                          onClick={() => onQuickAdd(msg.productCard!)}
                          className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#181716] rounded hover:bg-[#33302C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive In-Chat Direct Booking Slot */}
                  {msg.bookingCard && (
                    <div className="w-full max-w-sm p-4 bg-white rounded-xl border border-[#D6D0C5] shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6239]">
                          <Calendar className="w-4 h-4" />
                          <span>Virtual Fitting Invitation</span>
                        </div>
                        <span className="text-[10px] text-[#8E877E] font-mono">
                          {msg.bookingCard.duration}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-sm font-semibold text-[#181716]">
                          {msg.bookingCard.serviceTitle}
                        </h5>
                        <p className="text-xs text-[#6B655B]">
                          Stylist: {msg.bookingCard.stylistName}
                        </p>
                        <div className="p-2.5 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-[#181716]">
                            {msg.bookingCard.date}
                          </span>
                          <span className="text-[#8C6239] font-bold">
                            {msg.bookingCard.time}
                          </span>
                        </div>
                      </div>

                      {msg.bookingCard.status === 'booked' ? (
                        <div className="py-2 px-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center gap-2 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Fitting Confirmed on Calendar</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onConfirmBooking(msg.bookingCard!)}
                          className="w-full py-2 bg-[#8C6239] hover:bg-[#73502E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm This Appointment</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Interactive In-Chat Custom Invoice Card & Direct Secure Payment */}
                  {msg.invoiceCard && (
                    <div className="w-full max-w-sm p-4 bg-white rounded-xl border-2 border-[#8C6239]/40 shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[#8C6239]">
                            {msg.invoiceCard.invoiceNumber}
                          </span>
                          <h5 className="text-xs font-semibold text-[#181716]">
                            VIP Tailored Order
                          </h5>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            msg.invoiceCard.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {msg.invoiceCard.status === 'paid' ? 'Paid & Verified' : 'Awaiting Payment'}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs">
                        {msg.invoiceCard.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-[#181716]">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-[10px] text-[#8E877E]">
                                Size {item.size} · {item.color}
                              </p>
                            </div>
                            <span className="font-mono font-semibold tabular-nums">
                              ${item.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Calculation */}
                      <div className="pt-2 border-t border-[#F0ECE4] space-y-1 text-[11px] text-[#6B655B]">
                        <div className="flex justify-between">
                          <span>VIP Consultation Courtesy</span>
                          <span className="font-mono text-emerald-600">
                            -${msg.invoiceCard.discount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Atelier Delivery</span>
                          <span className="font-mono text-[#8C6239] font-medium">
                            Complimentary
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-[#181716] pt-1 border-t border-[#F0ECE4]">
                          <span>Total Amount</span>
                          <span className="font-mono tabular-nums text-base">
                            ${msg.invoiceCard.total}.00
                          </span>
                        </div>
                      </div>

                      {/* Direct Secure Payment Button */}
                      {msg.invoiceCard.status === 'paid' ? (
                        <div className="py-2.5 px-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center gap-2 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Payment Processed · Garment Being Tailored</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onPayInvoice(msg.invoiceCard!)}
                          className="w-full py-2.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Securely (${msg.invoiceCard.total}.00)</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Timestamp & read status */}
                  <span className="text-[10px] text-[#8E877E] px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Styling Prompts Bar */}
          <div className="px-4 py-2 bg-[#FAF9F6] border-t border-[#EAE6DF] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-semibold text-[#8E877E] shrink-0">
              Quick Inquiries:
            </span>
            {[
              'What size fits bust 34B?',
              'Confirm sizing for Suede Rancher',
              'Can I book a virtual fitting tomorrow?',
              'Does the Austin silk dress wrinkle in travel?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(prompt)}
                className="text-[11px] text-[#524C44] bg-white border border-[#EAE6DF] px-2.5 py-1 rounded-full whitespace-nowrap hover:border-[#181716] hover:text-[#181716] transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Controls */}
          <div className="p-3 sm:p-4 border-t border-[#EAE6DF] bg-white relative">
            {/* Attach popup menu */}
            {showAttachMenu && (
              <div className="absolute bottom-16 left-4 bg-white border border-[#EAE6DF] shadow-xl rounded-xl p-2 w-64 space-y-1 z-20">
                <p className="text-[10px] uppercase font-bold text-[#8E877E] px-2 py-1">
                  Stylist Actions
                </p>
                <button
                  onClick={() => handleAttachProduct(products[0])}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#181716] hover:bg-[#FAF9F6] rounded flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Attach Santa Fe Suede Jacket</span>
                </button>
                <button
                  onClick={handleAttachBooking}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#181716] hover:bg-[#FAF9F6] rounded flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Attach 1-on-1 Fitting Slot</span>
                </button>
                <button
                  onClick={handleAttachInvoice}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#181716] hover:bg-[#FAF9F6] rounded flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Generate Bespoke VIP Invoice</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 rounded-full text-[#6B655B] hover:text-[#181716] hover:bg-[#FAF9F6] border border-[#EAE6DF] transition-colors cursor-pointer"
                title="Stylist attachments"
              >
                <Plus className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Camille regarding sizing, silk care, or bespoke requests..."
                className="flex-1 py-2 px-3 text-xs sm:text-sm bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl focus:outline-none focus:border-[#181716] transition-colors"
              />

              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  inputText.trim()
                    ? 'bg-[#181716] text-[#FAF9F6] hover:bg-[#33302C]'
                    : 'bg-[#EFECE6] text-[#A69F94] cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
