import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsletterSignupBanner from './components/NewsletterSignupBanner';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistory from './components/OrderHistory';
import ContactUs from './components/ContactUs';
import FAQ from './components/FAQ';
import Wishlist from './components/Wishlist';
import ProductComparison from './components/ProductComparison';
import EmailSubscriptionModal from './components/EmailSubscriptionModal';
import { PRODUCTS, CATEGORIES } from './data';
import { Product, CartItem, Order } from './types';
import { Truck, RotateCcw, ShieldCheck, Phone, Mail, Clock, MapPin, ArrowRight, Star, ShoppingBag, Heart, CheckCircle, X, BarChart3, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        
        // Use PRODUCTS from data.ts as the definitive source of truth for images and details.
        // Merge only dynamic fields (rating, reviewsCount, inStock) from localStorage.
        const merged = PRODUCTS.map(orig => {
          const savedItem = parsed.find(p => p.id === orig.id || p.name === orig.name);
          if (savedItem) {
            return {
              ...orig,
              rating: savedItem.rating,
              reviewsCount: savedItem.reviewsCount,
              inStock: savedItem.inStock
            };
          }
          return orig;
        });
        
        localStorage.setItem('aura_products', JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error("Failed to parse aura_products", e);
      }
    }
    return PRODUCTS;
  });

  // Auto-advance slideshow
  useEffect(() => {
    if (activeTab === 'home') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(5, products.length));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab, products.length]);

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem('aura_products', JSON.stringify(updated));
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<string[]>([]);
  
  // Custom Notification State
  interface AppNotification {
    id: string;
    message: string;
    type: 'success' | 'cart';
  }
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const triggerNotification = (message: string, type: 'success' | 'cart' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    const newNotif: AppNotification = { id, message, type };
    setNotifications((prev) => [...prev, newNotif]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };
  
  // Filters for Shop Section
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women' | 'Unisex'>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'All' | 'Under 2000' | '2000-3000' | 'Above 5000'>('All');
  const [sortOption, setSortOption] = useState<'popularity' | 'priceLow' | 'priceHigh'>('popularity');
  const [isGridAnimating, setIsGridAnimating] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(true);

  const categoryStats = React.useMemo(() => {
    const stats: { [key: string]: { total: number; count: number } } = {};
    products.forEach(p => {
      const cat = p.category;
      if (!stats[cat]) {
        stats[cat] = { total: 0, count: 0 };
      }
      stats[cat].total += p.price;
      stats[cat].count += 1;
    });

    return Object.keys(stats).map(cat => ({
      category: cat,
      avgPrice: Math.round(stats[cat].total / stats[cat].count),
      count: stats[cat].count
    }));
  }, [products]);

  const priceHighlights = React.useMemo(() => {
    if (categoryStats.length === 0) return { overallAvg: 0, highestCat: 'N/A', highestVal: 0, lowestCat: 'N/A', lowestVal: 0 };
    
    const overallAvg = Math.round(products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1));
    
    let highestCat = '';
    let highestVal = -Infinity;
    let lowestCat = '';
    let lowestVal = Infinity;
    
    categoryStats.forEach(stat => {
      if (stat.avgPrice > highestVal) {
        highestVal = stat.avgPrice;
        highestCat = stat.category;
      }
      if (stat.avgPrice < lowestVal) {
        lowestVal = stat.avgPrice;
        lowestCat = stat.category;
      }
    });
    
    return { overallAvg, highestCat, highestVal, lowestCat, lowestVal };
  }, [categoryStats, products]);

  // Legal Modal states
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  // Loyalty points state (initialized from localStorage)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const saved = localStorage.getItem('aura_loyalty_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Load cart, wishlist, and compare items from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('aura_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        // Heal cart items to ensure product data (especially images) are up-to-date
        const healedCart = parsedCart.map(item => {
          const freshProduct = PRODUCTS.find(p => p.id === item.product.id || p.name === item.product.name);
          if (freshProduct) {
            return { ...item, product: freshProduct };
          }
          return item;
        });
        setCart(healedCart);
      } catch (e) {
        console.error("Failed to restore cart", e);
      }
    }

    const savedWishlist = localStorage.getItem('aura_wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to restore wishlist", e);
      }
    }

    const savedCompare = localStorage.getItem('aura_compare');
    if (savedCompare) {
      try {
        setCompareItems(JSON.parse(savedCompare));
      } catch (e) {
        console.error("Failed to restore compare list", e);
      }
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sync cart with LocalStorage on update
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aura_cart', JSON.stringify(newCart));
  };

  // Toggle item in Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const updated = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('aura_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle item in Compare
  const handleToggleCompare = (productId: string) => {
    setCompareItems(prev => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        updated = [...prev, productId];
      }
      localStorage.setItem('aura_compare', JSON.stringify(updated));
      return updated;
    });
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, size: string, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { product, selectedSize: size, quantity }]);
    }
    triggerNotification(`Added ${product.name} (Size: ${size}) to cart!`, 'cart');
  };

  // Adjust cart quantities
  const handleUpdateQuantity = (productId: string, size: string, change: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedSize === size) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });
    saveCart(updated);
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId: string, size: string) => {
    const filtered = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    saveCart(filtered);
  };

  // Handle successful order completion
  const handleOrderCompleted = (newOrder: Order) => {
    // Reset Cart
    saveCart([]);
    triggerNotification(`Order ${newOrder.id} successfully completed!`, 'success');

    // Update loyalty points!
    const earned = newOrder.earnedPoints ?? Math.floor(newOrder.total / 100) * 5;
    setLoyaltyPoints(prev => {
      const nextPoints = prev + earned;
      localStorage.setItem('aura_loyalty_points', String(nextPoints));
      return nextPoints;
    });
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal === 0 ? 0 : 300;
  const grandTotal = cartSubtotal + deliveryFee;

  // Filter products for Shop page
  const filteredProducts = products.filter((prod) => {
    // Search check
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category check
    const matchesCategory = selectedCategory === 'All' || 
                            prod.category === selectedCategory;

    // Gender check
    const matchesGender = selectedGender === 'All' || prod.gender === selectedGender;

    // Price range check
    let matchesPrice = true;
    if (selectedPriceRange === 'Under 2000') matchesPrice = prod.price < 2000;
    else if (selectedPriceRange === '2000-3000') matchesPrice = prod.price >= 2000 && prod.price <= 3000;
    else if (selectedPriceRange === 'Above 5000') matchesPrice = prod.price > 5000;

    return matchesSearch && matchesCategory && matchesGender && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'priceLow') return a.price - b.price;
    if (sortOption === 'priceHigh') return b.price - a.price;
    return b.rating * b.reviewsCount - a.rating * a.reviewsCount; // Popularity calculation
  });

  // Featured and New Arrivals subsets
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col transition-opacity duration-500 overflow-hidden">
          {/* Header Skeleton */}
          <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-4 sm:px-8 shrink-0">
            <div className="w-24 h-6 bg-neutral-200 rounded animate-pulse"></div>
            <div className="hidden md:flex gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-16 h-4 bg-neutral-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
            </div>
          </header>

          {/* Main Content Skeleton */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full mt-4">
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-3">
                <div className="w-48 h-8 bg-neutral-200 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-neutral-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col bg-white border border-neutral-100 rounded-lg overflow-hidden shadow-xs">
                  <div className="aspect-[3/4] bg-neutral-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="w-1/3 h-3 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-1/4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                      <div className="w-1/4 h-3 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loyaltyPoints={loyaltyPoints}
      />

      {/* DYNAMIC VIEWS SWITCH */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16 animate-fade-in">
            {/* HERO SECTION WITH GENERATED BACKGROUND */}
            <section className="relative h-[550px] bg-neutral-950 flex items-center justify-center text-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                {products.slice(0, 5).map((prod, idx) => (
                  <img
                    key={prod.id}
                    src={prod.image}
                    alt={`Outfit Aura Banner ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === currentSlide ? 'opacity-65 z-10' : 'opacity-0 z-0'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/40" />
              </div>

              {/* Text content card */}
              <div className="relative z-30 max-w-4xl mx-auto px-4 space-y-6 text-white">
                <span className="text-xs uppercase tracking-[0.4em] text-amber-400 font-semibold block animate-pulse">
                  Premium Lawn Collection
                </span>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  Welcome to Outfit Aura
                </h2>
                <p className="text-sm sm:text-base text-neutral-200 max-w-xl mx-auto font-light leading-relaxed">
                  Discover elegant, comfortable, and affordable lawn dresses designed for everyday style and comfort.
                </p>
                
                {/* Call to Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveTab('shop');
                    }}
                    className="bg-white hover:bg-neutral-100 text-neutral-900 font-bold px-8 py-3.5 rounded-md text-sm cursor-pointer transition-all shadow-md flex items-center gap-2"
                    id="btn-hero-shop-now"
                  >
                    Shop Lawn Collection <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveTab('shop');
                      // Filter by New arrivals
                      // We can search or sort
                    }}
                    className="bg-transparent hover:bg-white/10 border-2 border-white/65 text-white font-bold px-8 py-3 rounded-md text-sm cursor-pointer transition-all"
                    id="btn-hero-new-arrivals"
                  >
                    New Arrivals
                  </button>
                </div>
              </div>

              {/* Carousel Navigation Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
                {products.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* THREE PROMINENT TILES: CATEGORIES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">Selected Collections</span>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">Discover Our Categories</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tile 1: Lawn Collection */}
                <div 
                  onClick={() => {
                    setSelectedCategory("Lawn Collection");
                    setSelectedGender("Women");
                    setActiveTab("shop");
                  }}
                  className="group relative h-[450px] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer"
                >
                  <img
                    src={products.find(p => p.category === 'Lawn Collection')?.image}
                    alt="Lawn Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Premium Summer Lawn</span>
                    <h4 className="text-xl font-extrabold">Lawn Collection</h4>
                    <p className="text-xs text-neutral-300 font-light flex items-center gap-1 group-hover:underline">Browse Selection <ArrowRight size={10} /></p>
                  </div>
                </div>

                {/* Tile 2: Pret Wear */}
                <div 
                  onClick={() => {
                    setSelectedCategory("Pret Wear");
                    setSelectedGender("Women");
                    setActiveTab("shop");
                  }}
                  className="group relative h-[450px] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer"
                >
                  <img
                    src={products.find(p => p.category === 'Pret Wear')?.image}
                    alt="Pret Wear"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Elegant Ready to Wear</span>
                    <h4 className="text-xl font-extrabold">Pret Wear</h4>
                    <p className="text-xs text-neutral-300 font-light flex items-center gap-1 group-hover:underline">Browse Selection <ArrowRight size={10} /></p>
                  </div>
                </div>

                {/* Tile 3: Unstitched */}
                <div 
                  onClick={() => {
                    setSelectedCategory("Unstitched");
                    setSelectedGender("Women");
                    setActiveTab("shop");
                  }}
                  className="group relative h-[450px] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer"
                >
                  <img
                    src={products.find(p => p.category === 'Unstitched')?.image}
                    alt="Unstitched Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Create Your Style</span>
                    <h4 className="text-xl font-extrabold">Unstitched Fabric</h4>
                    <p className="text-xs text-neutral-300 font-light flex items-center gap-1 group-hover:underline">Browse Selection <ArrowRight size={10} /></p>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW ARRIVALS GRID */}
            <section className="bg-white py-16 border-y border-neutral-100/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">Seasonal drops</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">New Arrivals</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveTab('shop');
                    }}
                    className="text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors flex items-center gap-1.5 self-center sm:self-end cursor-pointer"
                    id="btn-view-all-new"
                  >
                    View All Outfits <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {newArrivals.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onQuickView={setSelectedProduct}
                      onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
                      isWishlisted={wishlistItems.includes(prod.id)}
                      onToggleWishlist={handleToggleWishlist}
                      isCompared={compareItems.includes(prod.id)}
                      onToggleCompare={handleToggleCompare}
                      onUpdateProduct={handleUpdateProduct}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* ABOUT US TEASER */}
            <section className="max-w-5xl mx-auto px-4 text-center space-y-6 py-8">
              <div className="w-12 h-0.5 bg-neutral-300 mx-auto" />
              <h3 className="text-2xl font-black text-neutral-900">Our Aura Story</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light max-w-2xl mx-auto">
                Outfit Aura is a Pakistani fashion brand dedicated to providing stylish, comfortable, and affordable clothing for everyone. Our goal is to combine modern fashion with premium quality, giving our customers outfits they can wear with confidence every day.
              </p>
              <button
                onClick={() => setActiveTab('about')}
                className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 underline"
                id="btn-home-learn-story"
              >
                Read More About Us
              </button>
            </section>

            {/* WHY CHOOSE US GRID */}
            <section className="bg-neutral-50 py-16 border-t border-neutral-150">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">Guaranteed Standards</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">Why Choose Outfit Aura?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Item 1 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">01</div>
                    <h4 className="text-base font-bold text-neutral-800">Premium Quality Materials</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">Every thread is chosen for comfort and wear durability, assuring you look exceptional and feel cozy.</p>
                  </div>
                  {/* Item 2 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">02</div>
                    <h4 className="text-base font-bold text-neutral-800">Affordable Prices</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">We believe high-street style should not burn a hole in your wallet. Great style is now accessible to all.</p>
                  </div>
                  {/* Item 3 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">03</div>
                    <h4 className="text-base font-bold text-neutral-800">Secure Shopping</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">Shop comfortably on our safe platform. All details and billing transactions are fully isolated and protected.</p>
                  </div>
                  {/* Item 4 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">04</div>
                    <h4 className="text-base font-bold text-neutral-800">Nationwide Fast Delivery</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">Enjoy fast delivery across Pakistan! Deliveries take 1–2 working days within Hyderabad, and 2–3 working days for other major cities.</p>
                  </div>
                  {/* Item 5 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">05</div>
                    <h4 className="text-base font-bold text-neutral-800">Easy Returns & Exchanges</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">No-fuss returns and exchange process according to our policy. Customer trust is our greatest asset.</p>
                  </div>
                  {/* Item 6 */}
                  <div className="bg-white border border-neutral-100 p-6 rounded-lg space-y-3 shadow-xs">
                    <div className="p-3 bg-neutral-950 text-white rounded-md w-fit font-bold text-sm">06</div>
                    <h4 className="text-base font-bold text-neutral-800">Friendly Customer Support</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">Need help? Dial or write to our support desk in Hyderabad. Ready to help you Monday – Saturday.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CUSTOMER TESTIMONIALS */}
            <section className="bg-white py-16 border-t border-neutral-150">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">What They Say</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">Customer Testimonials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Testimonial 1 */}
                  <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl space-y-4 shadow-sm relative transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-500" />)}
                    </div>
                    <p className="text-sm text-neutral-600 italic leading-relaxed">
                      "I absolutely love the quality of the clothes from Outfit Aura. The fabric is so comfortable and fits perfectly. Will definitely be shopping here again!"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">
                        S
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Sarah Khan</h4>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Verified Buyer</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl space-y-4 shadow-sm relative transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-500" />)}
                    </div>
                    <p className="text-sm text-neutral-600 italic leading-relaxed">
                      "The delivery was surprisingly fast, and the customer service team was very helpful when I needed to exchange a size. Highly recommend!"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">
                        A
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Ahmed Ali</h4>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Verified Buyer</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl space-y-4 shadow-sm relative transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-500" />)}
                    </div>
                    <p className="text-sm text-neutral-600 italic leading-relaxed">
                      "Great designs at affordable prices. It's hard to find trendy outfits that are also made of premium materials, but Outfit Aura nailed it."
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">
                        F
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Fatima Z.</h4>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Verified Buyer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SHOP */}
        {activeTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Catalog Price Insights Visualization */}
            <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs mb-8 transition-all duration-300">
              {/* Header bar */}
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 tracking-tight">Catalog Price Insights</h3>
                    <p className="text-[11px] text-neutral-400 font-medium">Real-time category price distribution & averages</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 text-[11px] font-bold text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors cursor-pointer"
                  id="btn-toggle-analytics"
                >
                  <TrendingUp size={12} className={showAnalytics ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
                  {showAnalytics ? "Hide Insights" : "Show Insights"}
                </button>
              </div>

              {showAnalytics && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Stats Cards - Left (4 cols) */}
                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Card 1: Overall Average */}
                    <div className="bg-slate-50/50 p-4 border border-neutral-100/80 rounded-lg flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Overall Average Price</span>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-neutral-900">Rs. {priceHighlights.overallAvg.toLocaleString()}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">PKR</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">Across all {products.length} catalog styles</p>
                    </div>

                    {/* Card 2: Highest & Lowest Categories */}
                    <div className="bg-slate-50/50 p-4 border border-neutral-100/80 rounded-lg flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">Most Premium Collection</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-neutral-850 truncate max-w-[150px]">{priceHighlights.highestCat}</span>
                          <span className="text-xs font-extrabold text-amber-600">Rs. {priceHighlights.highestVal.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-t border-neutral-200/50 pt-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">Most Accessible Collection</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-neutral-850 truncate max-w-[150px]">{priceHighlights.lowestCat}</span>
                          <span className="text-xs font-extrabold text-neutral-600">Rs. {priceHighlights.lowestVal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bar Chart - Right (8 cols) */}
                  <div className="lg:col-span-8 h-[240px] w-full bg-slate-50/20 rounded-lg p-2 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="category" 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(val) => `Rs. ${val}`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [`Rs. ${value.toLocaleString()}`, 'Avg Price']}
                          labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                        />
                        <Bar 
                          dataKey="avgPrice" 
                          fill="#d97706" 
                          radius={[6, 6, 0, 0]} 
                          maxBarSize={45}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* LEFT FILTER PANEL (3 Cols) */}
              <aside className="lg:col-span-3 space-y-6">
                
                {/* Search Bar within shop */}
                <div className="bg-white border border-neutral-150 p-5 rounded-lg space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Search Products</h4>
                  <input
                    type="text"
                    placeholder="Type to filter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-neutral-200 rounded px-3 py-2 text-xs text-neutral-850 outline-hidden focus:border-neutral-900"
                    id="shop-search-input"
                  />
                </div>

                {/* Categories filter list */}
                <div className="bg-white border border-neutral-150 p-5 rounded-lg space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Categories</h4>
                  <div className="space-y-1.5 flex flex-col items-start text-xs font-semibold text-neutral-600">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left py-1.5 px-2 rounded-sm transition-colors cursor-pointer ${
                          selectedCategory === cat 
                            ? 'bg-neutral-900 text-white font-bold' 
                            : 'hover:bg-neutral-100 hover:text-neutral-950'
                        }`}
                        id={`btn-cat-filter-${cat.replace(/[^a-zA-Z]/g, '')}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="bg-white border border-neutral-150 p-5 rounded-lg space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Filter Gender</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Men', 'Women', 'Unisex'].map((gen) => (
                      <button
                        key={gen}
                        onClick={() => setSelectedGender(gen as any)}
                        className={`text-xs font-bold px-3 py-2 border rounded-md transition-colors cursor-pointer ${
                          selectedGender === gen 
                            ? 'border-neutral-900 bg-neutral-900 text-white' 
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                        }`}
                        id={`btn-gender-${gen}`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="bg-white border border-neutral-150 p-5 rounded-lg space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Filter Price</h4>
                  <div className="flex flex-col gap-1.5">
                    {['All', 'Under 2000', '2000-3000', 'Above 5000'].map((priceOption) => (
                      <button
                        key={priceOption}
                        onClick={() => setSelectedPriceRange(priceOption as any)}
                        className={`text-xs font-bold px-3 py-2 text-left border rounded-md transition-colors cursor-pointer ${
                          selectedPriceRange === priceOption
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                        }`}
                        id={`btn-price-${priceOption.replace(/[^a-zA-Z0-9]/g, '')}`}
                      >
                        {priceOption === 'All' ? 'All Prices' : 
                         priceOption === 'Under 2000' ? 'Under PKR 2,000' :
                         priceOption === '2000-3000' ? 'PKR 2,000 – PKR 3,000' : 'Above PKR 5,000'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Buttons */}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedGender('All');
                    setSelectedPriceRange('All');
                    setSearchQuery('');
                    setSortOption('popularity');
                    setIsGridAnimating(true);
                    setTimeout(() => setIsGridAnimating(false), 300);
                  }}
                  className="w-full py-2.5 border-2 border-neutral-900 text-neutral-900 text-xs font-bold rounded-md hover:bg-neutral-50 cursor-pointer transition-colors"
                  id="btn-reset-filters"
                >
                  Clear All Filters
                </button>
              </aside>

              {/* RIGHT PRODUCT GRID (9 Cols) */}
              <section className="lg:col-span-9 space-y-6">
                
                {/* Control bar */}
                <div className="bg-white border border-neutral-100 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-neutral-500 font-bold">
                    Showing <span className="text-neutral-900">{sortedProducts.length}</span> luxury outfit results
                  </span>

                  {/* Sorting */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">Sort By</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-neutral-800 font-bold outline-hidden focus:border-neutral-900"
                      id="shop-sort-dropdown"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Grid layout */}
                <div className={`transition-all duration-300 ${isGridAnimating ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'}`}>
                  {sortedProducts.length === 0 ? (
                    <div className="bg-white border border-neutral-100 rounded-lg p-16 text-center space-y-4">
                      <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto text-neutral-400">
                        <ShoppingBag size={32} />
                      </div>
                      <h4 className="font-bold text-neutral-850">No Outfits Match Filters</h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        Try altering your category filters or spelling criteria. Our design collection updates seasonally.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onQuickView={setSelectedProduct}
                          onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
                          isWishlisted={wishlistItems.includes(prod.id)}
                          onToggleWishlist={handleToggleWishlist}
                          isCompared={compareItems.includes(prod.id)}
                          onToggleCompare={handleToggleCompare}
                          onUpdateProduct={handleUpdateProduct}
                          searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        )}

        {/* VIEW 3: ABOUT US */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 animate-fade-in font-sans">
            {/* Slogan title */}
            <div className="text-center space-y-2">
              <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">Heritage & Vision</span>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Our Outfit Legacy</h2>
              <p className="text-sm text-neutral-400 italic">"Premium clothing made with quality fabrics at affordable prices."</p>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/image/lawns/6.png"
                  alt="Aura Style"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4 text-neutral-650 leading-relaxed text-sm font-light">
                <p>
                  <span className="font-bold text-neutral-900">Outfit Aura</span> is a Pakistani fashion brand dedicated to providing stylish, comfortable, and affordable clothing for everyone. Our goal is to combine modern fashion with premium quality, giving our customers outfits they can wear with confidence every day.
                </p>
                <p>
                  We believe great style should be accessible to everyone. That's why every product is carefully selected to offer the perfect balance of quality, comfort, and value.
                </p>
                <p>
                  Founded and based in <span className="font-bold text-neutral-900">Hyderabad, Sindh</span>, we currently deliver exclusively to customers within Hyderabad, packing every bundle with personal care and delivering a touch of boutique luxury with every box.
                </p>
              </div>
            </div>

            {/* Stats section */}
            <div className="bg-neutral-900 text-white rounded-xl p-8 grid grid-cols-3 gap-6 text-center shadow-md">
              <div className="space-y-1">
                <h4 className="text-2xl sm:text-3xl font-black text-amber-400">100%</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold">Combed Cotton</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl sm:text-3xl font-black text-amber-400">Hyderabad</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold">Fast Delivery</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl sm:text-3xl font-black text-amber-400">7-Day</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold">Easy Exchanges</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: WHY CHOOSE US */}
        {activeTab === 'why-us' && (
          <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 animate-fade-in font-sans">
            <div className="text-center space-y-2">
              <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">Our Unrivaled Perks</span>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">The Aura Advantage</h2>
              <p className="text-sm text-neutral-500">How we deliver the ultimate high-street styling experience in Hyderabad.</p>
            </div>

            {/* Complete, fully formatted grid detailing all 6 points requested by the user */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Material */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-base font-bold text-neutral-800">Premium Quality Materials</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  We select raw Pakistani combed cotton, high-count Oxford weave, and pure organic linen. Our fabrics stay soft, breathable, and colorfast wash after wash.
                </p>
              </div>

              {/* Prices */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  Rs.
                </div>
                <h4 className="text-base font-bold text-neutral-800">Affordable Prices</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  By cutting out middle-man distributors and shipping directly from Hyderabad, we pass the manufacturing cost savings down to your wardrobe budget.
                </p>
              </div>

              {/* Shopping */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  🔒
                </div>
                <h4 className="text-base font-bold text-neutral-800">Secure Shopping</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our ordering flow utilizes state-of-the-art secure browser tokens. We respect customer privacy and never sell details to marketing syndicates.
                </p>
              </div>

              {/* Fast Delivery */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  <Truck size={20} />
                </div>
                <h4 className="text-base font-bold text-neutral-800">Nationwide Fast Delivery</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Fast, reliable shipping across Pakistan. Delivery takes 1–2 working days within Hyderabad, and 2–3 working days for other major cities.
                </p>
              </div>

              {/* Returns */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  <RotateCcw size={20} />
                </div>
                <h4 className="text-base font-bold text-neutral-800">Easy Returns & Exchanges</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Got the wrong size? Don't stress. Reach out to our customer care team within 7 days for quick sizing swaps or straightforward returns.
                </p>
              </div>

              {/* Support */}
              <div className="bg-white border border-neutral-150 p-6 rounded-lg space-y-3.5 hover:shadow-xs transition-shadow">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                  <Phone size={20} />
                </div>
                <h4 className="text-base font-bold text-neutral-800">Friendly Customer Support</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our specialized assistance team is based locally in Hyderabad, ready to guide you on call, email, or live chat Monday through Saturday.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 5: CONTACT US */}
        {activeTab === 'contact' && <ContactUs />}

        {/* VIEW 6: TRACK ORDERS / HISTORY */}
        {activeTab === 'track' && <OrderHistory setActiveTab={setActiveTab} loyaltyPoints={loyaltyPoints} />}

        {/* VIEW 7: FAQ */}
        {activeTab === 'faq' && <FAQ setActiveTab={setActiveTab} />}

        {/* VIEW 8: WISHLIST */}
        {activeTab === 'wishlist' && (
          <Wishlist
            wishlistItems={wishlistItems}
            compareItems={compareItems}
            products={products}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onQuickView={setSelectedProduct}
            onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 9: COMPARE */}
        {activeTab === 'compare' && (
          <ProductComparison
            compareItems={compareItems}
            products={products}
            onRemoveFromCompare={handleToggleCompare}
            onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
            setActiveTab={setActiveTab}
          />
        )}

      </main>

      <NewsletterSignupBanner />
      {/* FOOTER SECTION */}
      <Footer 
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        onOpenDelivery={() => setDeliveryOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* PRODUCT DETAILED MODAL */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* SECURE CHECKOUT FRAME MODAL */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        grandTotal={grandTotal}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* PRIVACY POLICY MODAL DIALOG */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative animate-scale-up" id="modal-privacy">
            <button 
              onClick={() => setPrivacyOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors cursor-pointer"
              id="btn-close-privacy"
            >
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4">Privacy Policy</h3>
            <div className="text-xs text-neutral-600 space-y-4 leading-relaxed overflow-y-auto max-h-[350px] pr-2 font-sans">
              <p className="font-bold text-neutral-800">Your privacy is important to us.</p>
              <p>Outfit Aura collects only the information necessary to process your orders and improve your shopping experience.</p>
              <p>We never sell your personal information to third parties. All payments and customer information are handled securely.</p>
              <p className="font-semibold text-neutral-700">What Information Do We Gather?</p>
              <p>To safely dispatch your fashion packages within Hyderabad, we request your name, physical home address, mobile contact number, and email. This is processed securely and is strictly restricted to local courier partners.</p>
              <p className="font-semibold text-neutral-700">Storage Period</p>
              <p>We securely preserve purchase history details on your local storage, so that you can trace your package status at any time without mandatory signup forms.</p>
            </div>
            <button 
              onClick={() => setPrivacyOpen(false)}
              className="mt-6 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs transition-colors cursor-pointer"
              id="btn-accept-privacy"
            >
              Close & Understand
            </button>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS MODAL DIALOG */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative animate-scale-up" id="modal-terms">
            <button 
              onClick={() => setTermsOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors cursor-pointer"
              id="btn-close-terms"
            >
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4">Terms & Conditions</h3>
            <div className="text-xs text-neutral-600 space-y-4 leading-relaxed overflow-y-auto max-h-[350px] pr-2 font-sans">
              <p>By using the Outfit Aura website, you agree to our terms of service.</p>
              <p>Product prices and availability may change without prior notice. Orders are subject to confirmation.</p>
              <p>Returns and exchanges are accepted according to our return policy.</p>
              <p className="font-semibold text-neutral-700">Order Delivery & Dispatches</p>
              <p>Standard delivery is completed in 1 to 2 working days within Hyderabad and 2 to 3 working days across other major cities in Pakistan. Cash on Delivery is collected in cash at your shipping doorstep only.</p>
              <p className="font-semibold text-neutral-700">Size Verification</p>
              <p>Please double-check size measurements against standards prior to checkout. Exchanges are accepted within 7 days from arrival provided the outfit remains unworn, undamaged, with intact labels.</p>
            </div>
            <button 
              onClick={() => setTermsOpen(false)}
              className="mt-6 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs transition-colors cursor-pointer"
              id="btn-accept-terms"
            >
              Close & Agree
            </button>
          </div>
        </div>
      )}

      {/* DELIVERY POLICY MODAL DIALOG */}
      {deliveryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative animate-scale-up" id="modal-delivery">
            <button 
              onClick={() => setDeliveryOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4">Delivery Policy</h3>
            <div className="text-xs text-neutral-600 space-y-4 leading-relaxed overflow-y-auto max-h-[350px] pr-2 font-sans">
              <p>At Outfit Aura, we are committed to delivering your fashion items securely and promptly.</p>
              
              <p className="font-semibold text-neutral-700 text-sm">Delivery Information & Timelines</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>📍 Nationwide delivery available across all major cities of Pakistan.</li>
                <li>🚚 Hyderabad: 1 to 2 working days (Same-day or next-day dispatch).</li>
                <li>🚚 Karachi, Lahore, Islamabad, & other major cities: 2 to 3 working days.</li>
                <li>💵 Cash on Delivery (COD) and Online Bank Transfer methods are supported.</li>
                <li>📞 Customers can place orders directly through the website checkout or WhatsApp support.</li>
              </ul>
              
              <p className="font-semibold text-neutral-700 text-sm">Order Tracking</p>
              <p>Once your order is dispatched, you will receive a tracking link via email/SMS. You can also track your order directly on our website using your Order ID.</p>
            </div>
            <button 
              onClick={() => setDeliveryOpen(false)}
              className="mt-6 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923478735306?text=Hi%20Outfit%20Aura!%20I%20would%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all flex items-center justify-center animate-fade-in"
        title="Order via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.056 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

      {/* Dynamic Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-neutral-900 text-white rounded-xl shadow-xl p-4 flex items-start gap-3 border border-neutral-800 font-sans backdrop-blur-md bg-opacity-95"
            >
              <div className="mt-0.5">
                {notif.type === 'success' ? (
                  <CheckCircle className="text-emerald-400 shrink-0" size={18} />
                ) : (
                  <ShoppingBag className="text-amber-400 shrink-0" size={18} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                  {notif.type === 'success' ? 'Order Successful' : 'Added to Cart'}
                </p>
                <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                  {notif.message}
                </p>
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded-full hover:bg-neutral-800 cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Auto-triggered Newsletter Popup after 30 seconds of activity */}
      <EmailSubscriptionModal />

    </div>
  );
}
