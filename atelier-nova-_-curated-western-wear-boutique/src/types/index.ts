export interface Product {
  id: string;
  title: string;
  category: 'outerwear' | 'dresses' | 'trousers' | 'tops' | 'footwear' | 'accessories';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  fabric: string;
  fitNotes: string;
  sizes: string[];
  colors: string[];
  image: string;
  secondaryImage?: string;
  inStock: boolean;
  tags: string[];
  rating: number;
  reviewsCount: number;
}

export interface Reel {
  id: string;
  title: string;
  caption: string;
  instagramUrl: string;
  videoUrl?: string;
  gradientBg: string;
  taggedProductIds: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  duration: string;
  audioTrack: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  thumbnail: string;
  gradient: string;
  items: {
    id: string;
    caption: string;
    imageGradient: string;
    taggedProductId?: string;
    subtitle?: string;
  }[];
}

export interface BookingSlot {
  id: string;
  serviceTitle: string;
  duration: string;
  price: number;
  date: string;
  time: string;
  stylistName: string;
  status: 'available' | 'booked';
}

export interface CustomInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  items: {
    productId: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid';
  notes: string;
}

export interface Message {
  id: string;
  sender: 'client' | 'stylist';
  text: string;
  timestamp: string;
  productCard?: Product;
  bookingCard?: BookingSlot;
  invoiceCard?: CustomInvoice;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  clientName: string;
  clientHandle: string;
  clientAvatar: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  status: 'VIP Inquiry' | 'Fitting Booked' | 'Invoice Sent' | 'Order Completed';
  messages: Message[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: 'apple_pay' | 'card' | 'klarna';
  status: 'confirmed' | 'tailoring' | 'shipped';
  createdAt: string;
}
