import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

interface WishlistProps {
  wishlistItems: string[];
  compareItems: string[];
  products: Product[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Wishlist({
  wishlistItems,
  compareItems,
  products,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onAddToCart,
  setActiveTab
}: WishlistProps) {
  const wishlistedProducts = products.filter(p => wishlistItems.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" id="wishlist-view-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-500">
            <Heart size={32} className="fill-rose-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Your Wishlist</h1>
          <p className="text-neutral-500 mt-2 max-w-lg">
            {wishlistedProducts.length > 0 
              ? "Keep track of the items you love. Add them to your cart when you're ready to buy."
              : "You haven't added any items to your wishlist yet. Discover our collection and save your favorites!"}
          </p>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {wishlistedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
                isCompared={compareItems.includes(product.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-12 bg-white p-12 rounded-2xl border border-neutral-100 shadow-sm max-w-xl mx-auto">
            <Heart size={48} className="text-neutral-200 mb-4" />
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Your wishlist is empty</h3>
            <p className="text-neutral-500 text-center mb-8">
              Explore our latest arrivals and tap the heart icon to save items you like for later.
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              Start Shopping <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
