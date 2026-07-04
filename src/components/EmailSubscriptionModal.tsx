import React, { useState, useEffect } from 'react';
import { Mail, X, Send, Check, Sparkles, Loader2, Gift } from 'lucide-react';

export default function EmailSubscriptionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user has already subscribed or dismissed the modal previously
    const hasSubscribed = localStorage.getItem('aura_newsletter_subscribed_popup') === 'true';
    const isDismissed = localStorage.getItem('aura_newsletter_dismissed_popup') === 'true';

    if (hasSubscribed || isDismissed) {
      return;
    }

    // Set timer to trigger the modal after 30 seconds (30000 ms)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as dismissed so we don't annoy the user in the same session
    localStorage.setItem('aura_newsletter_dismissed_popup', 'true');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Send email subscription payload to FormSubmit AJAX endpoint
      const response = await fetch("https://formsubmit.co/ajax/bd33fbe675e7d89ea20e2c63fb97601a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: cleanEmail,
          _subject: "New Newsletter Subscription via Homepage Popup - Outfit Aura",
          message: `User has successfully subscribed to Outfit Aura promotional updates and newsletter drops via the 30-second homepage popup.`
        })
      });

      if (!response.ok) {
        throw new Error("FormSubmit submission failed.");
      }

      // Add to general subscription list if not present
      const existing = localStorage.getItem('aura_newsletter_subscriptions');
      const list = existing ? JSON.parse(existing) : [];
      if (!list.includes(cleanEmail)) {
        list.push(cleanEmail);
        localStorage.setItem('aura_newsletter_subscriptions', JSON.stringify(list));
      }

      // Record popup action to prevent showing again
      localStorage.setItem('aura_newsletter_subscribed_popup', 'true');
      
      setIsSubscribed(true);
      setEmail('');
      setError('');

      // Auto close after 2.5 seconds on successful subscription
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);

    } catch (err) {
      console.error("Error submitting newsletter subscription:", err);
      setError('Could not connect to subscription services. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-neutral-100 relative"
        id="email-subscription-popup-card"
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-full transition-colors cursor-pointer focus:outline-hidden"
          title="Dismiss Offer"
          id="btn-close-popup"
        >
          <X size={16} />
        </button>

        {/* Header Visual with Warm Glow */}
        <div className="bg-neutral-900 text-white px-6 py-8 text-center space-y-3 relative overflow-hidden">
          {/* Subtle abstract background glows */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
          
          <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-400/20">
            <Gift size={22} className="animate-bounce" />
          </div>
          
          <h3 className="text-xl font-black uppercase tracking-wider font-sans">
            Unlock <span className="text-amber-400">10% OFF</span>
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Join the Outfit Aura newsletter list for exclusive collection drops, seasonal style updates, and secret discounts!
          </p>
        </div>

        {/* Main Content Area */}
        <div className="p-6 space-y-4">
          {isSubscribed ? (
            <div className="text-center py-6 space-y-2 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <Check size={20} />
              </div>
              <h4 className="text-sm font-black text-neutral-900">You Are On The List!</h4>
              <p className="text-xs text-neutral-500">Your coupon code <strong className="text-neutral-900 font-extrabold font-mono">AURA10</strong> has been unlocked.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="popup-email-input" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    id="popup-email-input"
                    type="email"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-sm text-neutral-900 pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-amber-400 focus:outline-hidden transition-all placeholder:text-neutral-400 font-sans"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-red-500 font-semibold text-center leading-tight animate-shake">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 focus:outline-hidden cursor-pointer shadow-sm"
                id="btn-popup-subscribe"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Signing up...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock 10% Discount</span>
                    <Send size={12} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-sans">
                <Sparkles size={11} className="text-amber-400" />
                <span>Zero spam. Unsubscribe at any time.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
