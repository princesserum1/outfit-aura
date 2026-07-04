import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Check, Phone, Mail, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loyaltyPoints: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  loyaltyPoints
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About Us' },
    { id: 'why-us', label: 'Why Choose Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'track', label: 'Track Orders' },
    { id: 'faq', label: 'FAQ' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'compare', label: 'Compare' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Promo Notification Ribbon */}
      <div className="bg-neutral-900 text-white text-[10px] sm:text-xs py-2 px-4 text-center tracking-wider uppercase font-medium">
        <span className="inline-block animate-pulse mr-2">✦</span>
        Fast Delivery Across Pakistan for a Flat Rate of Rs. 300!
        <span className="inline-block animate-pulse ml-2">✦</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle Menu"
            id="btn-toggle-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo & Slogan */}
          <div className="flex flex-col items-center cursor-pointer select-none" onClick={() => handleNavClick('home')}>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-widest text-neutral-900 font-sans">
              OUTFIT <span className="font-light text-neutral-500">AURA</span>
            </h1>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400">
              Style That Defines You
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 font-sans font-medium text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-2 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer ${
                activeTab === item.id ? 'text-neutral-950 font-semibold' : ''
              }`}
              id={`nav-${item.id}`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-900 animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Quick Search Trigger */}
          <div className="relative">
            {searchOpen ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-neutral-100 rounded-md border border-neutral-200 px-2 py-1 w-48 sm:w-64">
                <input
                  id="header-search-input"
                  aria-label="Search outfits"
                  type="text"
                  placeholder="Search outfits..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'shop') setActiveTab('shop');
                  }}
                  className="w-full text-xs bg-transparent border-none outline-hidden text-neutral-800 pr-5"
                  autoFocus
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-neutral-400 hover:text-neutral-600"
                  id="btn-close-search"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
                aria-label="Open Search"
                id="btn-open-search"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors relative"
            aria-label="Shopping Cart"
            id="btn-shopping-cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  activeTab === item.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
