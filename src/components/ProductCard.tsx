import React, { useState } from 'react';
import { Product } from '../types';
import { Star, Eye, ShoppingCart, Heart, ArrowLeftRight, Pencil, Check, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (productId: string) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  searchQuery?: string;
  key?: React.Key;
}

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isWishlisted = false, 
  onToggleWishlist,
  isCompared = false,
  onToggleCompare,
  onUpdateProduct,
  searchQuery = ''
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editDescription, setEditDescription] = useState(product.description);
  const [editSizesStr, setEditSizesStr] = useState(product.sizes.join(', '));
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSizes = editSizesStr.split(',').map(s => s.trim()).filter(Boolean);
    const updated: Product = {
      ...product,
      name: editName,
      price: Number(editPrice) || 3000,
      description: editDescription,
      sizes: updatedSizes
    };
    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditSizesStr(product.sizes.join(', '));
    setIsEditing(false);
  };

  const renderHighlightedName = (name: string, query: string) => {
    if (!query || !query.trim()) return name;
    
    const parts = name.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="font-extrabold text-amber-500 bg-amber-500/10 px-0.5 rounded-sm">{part}</strong>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      className="group relative flex flex-col bg-white border border-neutral-100 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        {/* Sale / New Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wider">
              SAVE {discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Action Buttons */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-2">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full text-neutral-800 transition-colors shadow-sm cursor-pointer"
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              id={`btn-wishlist-${product.id}`}
            >
              <Heart 
                size={16} 
                className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-neutral-600"} 
              />
            </button>
          )}
          
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product.id);
              }}
              className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full text-neutral-800 transition-colors shadow-sm cursor-pointer"
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              id={`btn-compare-${product.id}`}
            >
              <ArrowLeftRight 
                size={16} 
                className={isCompared ? "text-blue-500" : "text-neutral-600"} 
              />
            </button>
          )}

          {/* Admin Edit Trigger */}
          {onUpdateProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
              className="p-2 bg-neutral-900/90 text-amber-400 hover:bg-neutral-900 rounded-full transition-colors shadow-sm cursor-pointer"
              title="Edit Product details (Price/Sizes)"
              id={`btn-admin-edit-${product.id}`}
            >
              <Pencil size={15} />
            </button>
          )}
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-125 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm hover:bg-neutral-900 hover:text-white rounded-full text-neutral-900 font-semibold text-xs tracking-wider transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
            title="Quick View"
            id={`btn-quickview-${product.id}`}
          >
            <Eye size={16} />
            QUICK VIEW
          </button>
          
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, selectedSize);
              }}
              className="pointer-events-auto p-3 bg-white hover:bg-neutral-900 hover:text-white rounded-full text-neutral-800 transition-colors shadow-sm duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center cursor-pointer"
              title={`Add ${selectedSize} to Cart`}
              id={`btn-quickadd-${product.id}`}
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Product Information Footer */}
      <div className="p-4 flex flex-col flex-1">
        {isEditing ? (
          /* Inline Edit Form */
          <div className="space-y-2.5 text-xs text-neutral-700" onClick={(e) => e.stopPropagation()}>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Product Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-neutral-200 rounded px-2 py-1 text-xs focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Price (PKR)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full border border-neutral-200 rounded px-2 py-1 text-xs focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Category</label>
                <span className="block border border-neutral-100 bg-neutral-50 rounded px-2 py-1 text-xs text-neutral-500">
                  {product.category}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-neutral-200 rounded px-2 py-1 text-xs focus:border-neutral-900 focus:outline-none h-14 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Sizes (comma sep)</label>
              <input
                type="text"
                value={editSizesStr}
                onChange={(e) => setEditSizesStr(e.target.value)}
                className="w-full border border-neutral-200 rounded px-2 py-1 text-xs focus:border-neutral-900 focus:outline-none font-mono"
                placeholder="e.g. Unstitched, S, M, L"
              />
            </div>

            <div className="flex gap-2 pt-1.5">
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-xs tracking-wider flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check size={12} />
                SAVE
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-1.5 rounded text-xs tracking-wider flex items-center justify-center gap-1 cursor-pointer"
              >
                <X size={12} />
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          /* Static Display Footer */
          <>
            {/* Category & Gender */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500 font-medium">
                {product.gender}
              </span>
            </div>

            {/* Title */}
            <h3 
              className="text-sm font-semibold text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer mb-1 line-clamp-1"
              onClick={() => onQuickView(product)}
              title={product.name}
            >
              {renderHighlightedName(product.name, searchQuery)}
            </h3>

            {/* Short Description */}
            <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-2 min-h-[32px]">
              {product.description}
            </p>

            {/* Reviews and Ratings */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    className={i < Math.floor(product.rating) ? "text-amber-500" : "text-neutral-200"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold">({product.reviewsCount})</span>
            </div>

            {/* Price Tag with Alignment */}
            <div className="mt-auto flex items-baseline gap-2 mb-3">
              <span className="text-sm sm:text-base font-bold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-neutral-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Editable Selected Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-3.5">
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-350'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instock banner indicator / Order Now Button */}
            {product.inStock ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, selectedSize);
                }}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
                id={`btn-order-now-${product.id}`}
              >
                <ShoppingCart size={13} />
                ORDER NOW
              </button>
            ) : (
              <span className="mt-1 text-[10px] text-rose-600 font-bold uppercase tracking-wider bg-rose-50 px-2 py-1 rounded text-center w-full">
                Out of Stock
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
