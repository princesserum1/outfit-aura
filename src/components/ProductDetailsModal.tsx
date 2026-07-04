import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Star, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RotateCcw, MessageSquare, Sparkles, User, Calendar, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const getDefaultReviews = (product: Product): Review[] => {
  const isPolo = product.name.toLowerCase().includes('polo') || product.category.toLowerCase().includes('polo');
  const isShirt = product.name.toLowerCase().includes('shirt') || product.category.toLowerCase().includes('shirt');
  const isHoodie = product.name.toLowerCase().includes('hoodie') || product.category.toLowerCase().includes('hoodie');

  const name1 = "Khurram Shahzad";
  const comment1 = isPolo 
    ? "Outstanding polo shirt! The fit around the arms is athletic and the cotton is extremely breathable. Highly recommended for summers." 
    : isHoodie 
    ? "Awesome hoodie! Thick premium fleece material, very cozy and stylish. Perfect stitching." 
    : "Excellent quality! Fabric feels extremely comfortable and the fit is spot on. Will order more.";

  const name2 = "Sana Malik";
  const comment2 = isPolo
    ? "Bought this for my brother and he absolutely loves it. The color didn't fade after the first wash."
    : isShirt
    ? "Very modern fit, comfortable for all-day wear. Stitching and finishing is top-notch."
    : "Exceeded my expectations. Premium quality at an affordable price, and delivery took only 2 days.";

  return [
    {
      id: `${product.id}-default-1`,
      userName: name1,
      rating: 5,
      comment: comment1,
      date: "2026-06-20"
    },
    {
      id: `${product.id}-default-2`,
      userName: name2,
      rating: 4,
      comment: comment2,
      date: "2026-06-25"
    }
  ];
};

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const [sizeError, setSizeError] = useState('');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formComment, setFormComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reset states when a new product is loaded
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
      setAddedMessage(false);
      setSizeError('');

      // Load reviews
      const saved = localStorage.getItem(`aura_reviews_${product.id}`);
      if (saved) {
        try {
          setReviews(JSON.parse(saved));
        } catch (_) {
          const defaults = getDefaultReviews(product);
          setReviews(defaults);
        }
      } else {
        const defaults = getDefaultReviews(product);
        setReviews(defaults);
        localStorage.setItem(`aura_reviews_${product.id}`, JSON.stringify(defaults));
      }
      setFormName('');
      setFormRating(5);
      setFormComment('');
      setSubmitSuccess(false);
      setSubmitError('');
    }
  }, [product]);

  if (!product) return null;

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : product.rating;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 5) {
      setSubmitError("Please write a review (minimum 5 characters).");
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName: formName.trim(),
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`aura_reviews_${product.id}`, JSON.stringify(updatedReviews));

    setFormName('');
    setFormRating(5);
    setFormComment('');
    setSubmitSuccess(true);
    setSubmitError('');

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddClick = () => {
    if (!selectedSize) {
      setSizeError("Please select a size to continue.");
      return;
    }
    onAddToCart(product, selectedSize, quantity);
    setAddedMessage(true);
    setSizeError('');
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container Frame */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-scale-up"
        id="quick-view-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-colors cursor-pointer"
          id="btn-close-quick-view"
        >
          <X size={18} />
        </button>

        {/* Left Hand: Image Column */}
        <div className="relative bg-neutral-50 h-[350px] md:h-full min-h-[400px]">
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Hand: Description Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-full max-h-[90vh] md:max-h-[600px]">
          <div>
            {/* Category / Gender Subtitle */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-amber-600 font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                • {product.gender}'s Fashion
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-bold text-neutral-900 leading-snug mb-3">
              {product.name}
            </h2>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                    className={i < Math.floor(averageRating) ? "text-amber-500" : "text-neutral-200"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-800">{averageRating}</span>
              <span className="text-xs text-neutral-400">({totalReviewsCount} customer reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-neutral-100">
              <span className="text-2xl font-extrabold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Detailed Description */}
            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500 mb-2">Description</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Picker Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Select Size</h4>
                {sizeError ? (
                  <span className="text-xs text-rose-600 font-bold animate-pulse">{sizeError}</span>
                ) : (
                  <span className="text-xs text-neutral-400 font-medium">Standard Fit</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError('');
                    }}
                    className={`min-w-11 h-11 border text-sm font-semibold flex items-center justify-center rounded-md transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                    id={`btn-size-selector-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Picker Section */}
            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500 mb-2">Quantity</h4>
              <div className="flex items-center border border-neutral-200 rounded-md w-fit bg-neutral-50">
                <button
                  onClick={handleDecrease}
                  className="p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                  id="btn-qty-decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 text-sm font-bold text-neutral-800">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  id="btn-qty-increase"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer Button */}
          <div>
            {product.inStock ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddClick}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  id="btn-add-to-cart-modal"
                >
                  <ShoppingBag size={18} />
                  Add to Shopping Bag • Rs. {(product.price * quantity).toLocaleString()}
                </button>
                {addedMessage && (
                  <span className="text-xs font-semibold text-emerald-600 text-center animate-bounce mt-1">
                    ✓ Item added to bag! Open your bag to review or checkout.
                  </span>
                )}
              </div>
            ) : (
              <button
                className="w-full bg-neutral-200 text-neutral-500 font-bold py-3.5 rounded-lg cursor-not-allowed"
                disabled
              >
                Sold Out Temporarily
              </button>
            )}

            {/* Services Guarantee Badges */}
            <div className="mt-6 pt-5 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-neutral-400" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-neutral-400" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-neutral-400" />
                <span>Aura Verified</span>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-8 pt-8 border-t border-neutral-100 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-neutral-800" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Customer Reviews</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-100">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-neutral-800">{averageRating} / 5</span>
                  <span className="text-[10px] text-neutral-400">({totalReviewsCount})</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 divide-y divide-neutral-100">
                {reviews.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-4">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                            <User size={10} />
                          </div>
                          <span className="text-xs font-bold text-neutral-800">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                fill={i < rev.rating ? "currentColor" : "none"}
                                className={i < rev.rating ? "text-amber-500" : "text-neutral-200"}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] text-neutral-400 flex items-center gap-0.5">
                            <Calendar size={9} />
                            {rev.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 pl-7 leading-relaxed font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Leave a review Form */}
              <form onSubmit={handleSubmitReview} className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 space-y-3.5">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <Sparkles size={14} className="text-amber-500 animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Share Your Experience
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      const isHighlighted = (hoverRating !== null ? hoverRating : formRating) >= starValue;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                          id={`btn-form-star-${starValue}`}
                        >
                          <Star
                            size={18}
                            fill={isHighlighted ? "currentColor" : "none"}
                            className={isHighlighted ? "text-amber-500" : "text-neutral-200"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Khan"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all text-neutral-800 placeholder:text-neutral-400 font-medium"
                      id="input-review-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      Written Review
                    </label>
                    <textarea
                      placeholder="Describe what you liked or disliked about this product..."
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all text-neutral-800 placeholder:text-neutral-400 font-medium resize-none"
                      id="input-review-comment"
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-[11px] text-rose-600 font-bold animate-pulse">
                    ⚠️ {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold">
                    ✓ Thank you! Your review has been added successfully.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                  id="btn-submit-review"
                >
                  Post Customer Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
