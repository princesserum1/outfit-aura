export interface Product {
  id: string;
  name: string;
  price: number; // in PKR (Rs.)
  originalPrice?: number; // for sale items
  category: string; // T-Shirts, Polo Shirts, etc.
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  sizes: string[];
  inStock: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: 'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderNotes?: string;
  earnedPoints?: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}
