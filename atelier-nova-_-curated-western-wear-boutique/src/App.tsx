import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileHeader } from './components/ProfileHeader';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { ShopFeedGrid } from './components/ShopFeedGrid';
import { ReelsStudio } from './components/ReelsStudio';
import { DirectConsultationDrawer } from './components/DirectConsultationDrawer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { EmbedReelModal } from './components/EmbedReelModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_REELS, 
  INITIAL_STORIES, 
  INITIAL_CONVERSATIONS 
} from './data/mockData';
import { Product, Reel, Story, Conversation, CartItem, BookingSlot, CustomInvoice, Order } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'messages' | 'analytics'>('feed');
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');

  // Cart & Checkout state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      product: INITIAL_PRODUCTS[0],
      selectedSize: 'S',
      selectedColor: 'Desert Caramel',
      quantity: 1,
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<CustomInvoice | null>(null);

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Unread badge count
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          id: `item-${Date.now()}-${Math.random()}`,
          product,
          selectedSize,
          selectedColor,
          quantity,
        },
      ];
    });
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'S', product.colors[0] || 'Natural', 1);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => Boolean(i))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Direct Stylist Inquiries
  const handleConsultStylistForProduct = (product: Product) => {
    setSelectedProductForDetail(null);
    setActiveTab('messages');

    // Append to active conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: `Client inquiry regarding ${product.title}`,
            lastTimestamp: 'Just now',
            messages: [
              ...c.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'client',
                text: `Hi Camille, I am looking at ${product.title} ($${product.price}). Could you advise on sizing and fabric weight?`,
                timestamp: 'Just now',
                productCard: product,
                isRead: true,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  // Messaging operations
  const handleSendMessage = (
    conversationId: string,
    text: string,
    extras?: { product?: Product; booking?: BookingSlot; invoice?: CustomInvoice }
  ) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'stylist' as const,
            text,
            timestamp: 'Just now',
            productCard: extras?.product,
            bookingCard: extras?.booking,
            invoiceCard: extras?.invoice,
            isRead: true,
          };
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Booking confirmation
  const handleConfirmBooking = (booking: BookingSlot) => {
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) => {
          if (m.bookingCard && m.bookingCard.id === booking.id) {
            return {
              ...m,
              bookingCard: { ...m.bookingCard, status: 'booked' as const },
            };
          }
          return m;
        }),
      }))
    );
  };

  // In-Chat Secure Invoice Payment
  const handlePayInvoice = (invoice: CustomInvoice) => {
    setInvoiceToPay(invoice);
    setIsCheckoutOpen(true);
  };

  // Add Reel
  const handleAddReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setActiveTab('reels');
  };

  // Successful Order Handler
  const handleOrderSuccess = (order: Order) => {
    if (invoiceToPay) {
      // Mark invoice as paid in conversations
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          status: 'Order Completed',
          lastMessage: `Payment received for ${invoiceToPay.invoiceNumber}. Preparing dispatch.`,
          messages: [
            ...c.messages.map((m) => {
              if (m.invoiceCard && m.invoiceCard.id === invoiceToPay.id) {
                return {
                  ...m,
                  invoiceCard: { ...m.invoiceCard, status: 'paid' as const },
                };
              }
              return m;
            }),
            {
              id: `msg-${Date.now()}`,
              sender: 'stylist',
              text: `Payment confirmed for invoice ${invoiceToPay.invoiceNumber}! Order reference #${order.orderNumber}. Your tailored piece is being packed with our cedar garment bag.`,
              timestamp: 'Just now',
              isRead: true,
            },
          ],
        }))
      );
      setInvoiceToPay(null);
    } else {
      // Clear shopping bag
      setCartItems([]);
    }
  };

  const handleConsultStylistWithOrder = (orderNumber: string) => {
    setActiveTab('messages');
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: `Inquiry for Order #${orderNumber}`,
            messages: [
              ...c.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'client',
                text: `Hi Camille! I just confirmed Order #${orderNumber}. Could you keep me updated on the atelier dispatch?`,
                timestamp: 'Just now',
                isRead: true,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#181716] flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Bar (3-Zone Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openEmbedModal={() => setIsEmbedModalOpen(true)}
        unreadCount={unreadCount}
      />

      <main className="flex-1">
        {/* Profile Header and Stories are shown on Feed or when browsing */}
        {activeTab !== 'analytics' && (
          <>
            <ProfileHeader
              onOpenStylistDM={() => setActiveTab('messages')}
              onOpenBookingModal={() => {
                setActiveTab('messages');
                // send booking invite prompt
              }}
              onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
              onOpenAnalytics={() => setActiveTab('analytics')}
              onStoryClick={() => setSelectedStory(stories[0])}
            />

            <StoriesBar
              stories={stories}
              onSelectStory={(story) => setSelectedStory(story)}
            />
          </>
        )}

        {/* Dynamic Content Views */}
        {activeTab === 'feed' && (
          <ShopFeedGrid
            products={products}
            onSelectProduct={(p) => setSelectedProductForDetail(p)}
            onQuickAdd={handleQuickAdd}
            onConsultStylistForProduct={handleConsultStylistForProduct}
          />
        )}

        {activeTab === 'reels' && (
          <ReelsStudio
            reels={reels}
            products={products}
            onOpenProduct={(p) => setSelectedProductForDetail(p)}
            onQuickAdd={handleQuickAdd}
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          />
        )}

        {activeTab === 'messages' && (
          <DirectConsultationDrawer
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            products={products}
            onOpenProduct={(p) => setSelectedProductForDetail(p)}
            onQuickAdd={handleQuickAdd}
            onPayInvoice={handlePayInvoice}
            onConfirmBooking={handleConfirmBooking}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

      {/* Clean Editorial Footer (Anti-Slop Restraint) */}
      <footer className="border-t border-[#EAE6DF] bg-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8E877E]">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-serif text-sm font-semibold tracking-wider text-[#181716] uppercase">
              REELCART
            </span>
            <p className="text-[11px] text-[#6B655B]">
              Santa Fe Atelier & Online Western Boutique. Handcrafted Lambskin, Tuscan Wool, and 22-Momme Silk.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#524C44]">
            <button
              onClick={() => setActiveTab('feed')}
              className="hover:text-[#181716] transition-colors cursor-pointer"
            >
              Shop Lookbook
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className="hover:text-[#181716] transition-colors cursor-pointer"
            >
              Shoppable Reels
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className="hover:text-[#181716] transition-colors cursor-pointer"
            >
              VIP Stylist Salon
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-[#181716] transition-colors cursor-pointer"
            >
              Owner Analytics
            </button>
          </div>

          <div className="text-[11px] text-[#8E877E]">
            © {new Date().getFullYear()} ReelCart. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Nav */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Modals & Slide-overs */}
      <StoryViewerModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        products={products}
        onOpenProduct={(p) => setSelectedProductForDetail(p)}
        onQuickAdd={handleQuickAdd}
      />

      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
        onConsultStylist={handleConsultStylistForProduct}
        onWatchReel={() => setActiveTab('reels')}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setInvoiceToPay(null);
        }}
        cartItems={cartItems}
        invoiceToPay={invoiceToPay}
        onOrderSuccess={handleOrderSuccess}
        onConsultStylistWithOrder={handleConsultStylistWithOrder}
      />

      <EmbedReelModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        products={products}
        onAddReel={handleAddReel}
      />
    </div>
  );
}
