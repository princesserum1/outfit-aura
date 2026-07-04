import React from 'react';
import { Mail, Phone, MapPin, Clock, CreditCard, ShieldCheck, ArrowUpRight, Facebook, Instagram, Twitter } from 'lucide-react';
import NewsletterSubscription from './NewsletterSubscription';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDelivery: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenDelivery, setActiveTab }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-300 font-sans border-t border-neutral-800">
      {/* Top Banner Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="p-3 bg-neutral-800 text-amber-400 rounded-full w-fit">
            <ShieldCheck size={24} />
          </div>
          <h4 className="text-white font-semibold text-base mt-2">100% Secure Shopping</h4>
          <p className="text-xs text-neutral-400 max-w-xs">We use fully secured protocols to safeguard your personal data and provide secure payment options.</p>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="p-3 bg-neutral-800 text-amber-400 rounded-full w-fit">
            <Clock size={24} />
          </div>
          <h4 className="text-white font-semibold text-base mt-2">Monday – Saturday Support</h4>
          <p className="text-xs text-neutral-400 max-w-xs">Our professional support team is available from 10:00 AM – 8:00 PM (PKT) to assist you with order queries.</p>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="p-3 bg-neutral-800 text-amber-400 rounded-full w-fit">
            <CreditCard size={24} />
          </div>
          <h4 className="text-white font-semibold text-base mt-2">Cash on Delivery (COD)</h4>
          <p className="text-xs text-neutral-400 max-w-xs">Pay conveniently at your doorstep with Cash on Delivery available within Hyderabad.</p>
        </div>
      </div>



      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold tracking-widest text-white">
            OUTFIT <span className="font-light text-neutral-400">AURA</span>
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Discover premium-quality fashion designed for comfort, confidence, and everyday style. At Outfit Aura, we bring you modern clothing made with quality fabrics at affordable prices.
          </p>
          <p className="text-xs italic text-amber-400">"Style That Defines You"</p>
          
          {/* Social Media Links */}
          <div className="pt-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Follow Our Aura</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-900 rounded-full transition-all duration-300 text-neutral-400 inline-flex items-center justify-center cursor-pointer"
                title="Follow us on Facebook"
                id="footer-social-facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-900 rounded-full transition-all duration-300 text-neutral-400 inline-flex items-center justify-center cursor-pointer"
                title="Follow us on Instagram"
                id="footer-social-instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-900 rounded-full transition-all duration-300 text-neutral-400 inline-flex items-center justify-center cursor-pointer"
                title="Follow us on Twitter"
                id="footer-social-twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Categories Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Shop</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <button onClick={() => setActiveTab('shop')} className="hover:text-white hover:underline transition-all flex items-center gap-1">
                Men's Collection <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('shop')} className="hover:text-white hover:underline transition-all flex items-center gap-1">
                Women's Collection <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('shop')} className="hover:text-white hover:underline transition-all flex items-center gap-1">
                New Arrivals <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('shop')} className="hover:text-white hover:underline transition-all flex items-center gap-1">
                Accessories <ArrowUpRight size={12} />
              </button>
            </li>
          </ul>
        </div>

        {/* Help & Support Column */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Help & Information</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition-all text-left">About Our Brand</button>
            </li>
            <li>
              <button onClick={() => setActiveTab('why-us')} className="hover:text-white transition-all text-left">Why Choose Us</button>
            </li>
            <li>
              <button onClick={() => setActiveTab('faq')} className="hover:text-white transition-all text-left" id="btn-footer-faq">Frequently Asked Questions (FAQ)</button>
            </li>
            <li>
              <button onClick={onOpenDelivery} className="hover:text-white transition-all text-left" id="btn-footer-delivery">Delivery Policy</button>
            </li>
            <li>
              <button onClick={onOpenPrivacy} className="hover:text-white transition-all text-left" id="btn-footer-privacy">Privacy Policy</button>
            </li>
            <li>
              <button onClick={onOpenTerms} className="hover:text-white transition-all text-left" id="btn-footer-terms">Terms & Conditions</button>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider text-amber-400">Get In Touch</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <span>Hyderabad, Sindh, Pakistan</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-neutral-500 shrink-0" />
              <a href="tel:+923478735306" className="hover:text-white transition-all">+92 347 8735306</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-neutral-500 shrink-0" />
              <a href="mailto:outfitaura02@gmail.com" className="hover:text-white transition-all">outfitaura02@gmail.com</a>
            </li>
            <li className="flex items-start space-x-3">
              <Clock size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <span>Monday – Saturday<br />10:00 AM – 8:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <NewsletterSubscription />

      {/* Copyright Bar */}
      <div className="bg-neutral-950 py-6 text-center text-xs text-neutral-500 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Outfit Aura. All Rights Reserved.</span>
          <span className="text-[10px] text-neutral-600">Premium Pakistani High-Street Fashion</span>
        </div>
      </div>
    </footer>
  );
}
