import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate delivery fee
  const deliveryFee = subtotal === 0 ? 0 : 300;
  
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0 overflow-hidden">
        {/* Click background to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Sliding Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
          <div 
            className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-left"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-neutral-900" />
                <h2 className="text-lg font-bold text-neutral-900">Your Shopping Bag</h2>
                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-50 rounded-full transition-colors cursor-pointer"
                id="btn-close-cart-drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4 animate-bounce">
                    <ShoppingBag size={48} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">Your bag is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mt-1">
                    Looks like you haven't added any premium outfits yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-neutral-900 text-white font-semibold text-xs py-3 px-6 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                    id="btn-cart-continue-shopping"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${index}`}
                    className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-none"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-md bg-neutral-50 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details and quantity controls */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-800 truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-bold uppercase">
                          Size: {item.selectedSize}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900">
                          Rs. {item.product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center mt-2.5 border border-neutral-200 rounded-md w-fit bg-neutral-50 scale-90 origin-left">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                          disabled={item.quantity <= 1}
                          id={`btn-cart-decrease-${item.product.id}-${item.selectedSize}`}
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-3 text-xs font-bold text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                          id={`btn-cart-increase-${item.product.id}-${item.selectedSize}`}
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Trash remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      className="p-2 text-neutral-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                      title="Remove item"
                      id={`btn-cart-remove-${item.product.id}-${item.selectedSize}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total Breakdowns Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-4">
                {/* Financial breakdown */}
                <div className="space-y-2 text-xs border-b border-neutral-200/60 pb-3">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Delivery Charges</span>
                    <span>Rs. {deliveryFee.toLocaleString()}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-800">Estimated Total</span>
                  <span className="text-lg font-black text-neutral-900">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={onProceedToCheckout}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-2"
                  id="btn-cart-checkout"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
