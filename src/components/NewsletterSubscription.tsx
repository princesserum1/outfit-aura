import React, { useState } from 'react';
import { Mail, Send, Check, Sparkles, Loader2 } from 'lucide-react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    // Simple robust email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
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
          _subject: "New Newsletter Subscription - Outfit Aura",
          message: `User has successfully subscribed to Outfit Aura promotional updates and newsletter drops.`
        })
      });

      if (!response.ok) {
        throw new Error("FormSubmit submission failed.");
      }

      const existing = localStorage.getItem('aura_newsletter_subscriptions');
      const list = existing ? JSON.parse(existing) : [];
      if (!list.includes(cleanEmail)) {
        list.push(cleanEmail);
        localStorage.setItem('aura_newsletter_subscriptions', JSON.stringify(list));
      }
      setIsSubscribed(true);
      setEmail('');
      setError('');
    } catch (err) {
      console.error("Error submitting newsletter subscription:", err);
      setError('Could not connect to subscription services. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-neutral-800 bg-neutral-900/40 py-12" id="newsletter-subscription-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-4">
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">Be the First to Know</span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Join our Newsletter
        </h3>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Enter your email to subscribe and be the first to know about our upcoming premium lawn collection drops.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          {isSubscribed ? (
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-6 text-amber-400 transition-all duration-300">
              <div className="mx-auto p-2 bg-amber-400 text-neutral-950 rounded-full w-fit mb-3">
                <Check size={20} strokeWidth={3} />
              </div>
              <h4 className="font-bold text-base text-white">Thank you!</h4>
              <p className="text-xs text-neutral-300 mt-1">
                You are now subscribed to our newsletter. Keep an eye on your inbox for notifications about our upcoming drops!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                    <Mail size={18} />
                  </div>
                  <input
                    id="newsletter-email"
                    aria-label="Email address for newsletter"
                    type="email"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-neutral-950/80 hover:bg-neutral-950 focus:bg-neutral-950 disabled:bg-neutral-900 disabled:text-neutral-500 text-sm text-white pl-11 pr-4 py-3.5 rounded-xl border border-neutral-700/50 focus:border-amber-400 focus:outline-none transition-all placeholder:text-neutral-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  id="btn-newsletter-subscribe-new"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-500 active:bg-amber-500 text-neutral-950 font-bold rounded-xl text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer sm:shrink-0 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-xs text-rose-400 pl-1 text-left font-medium">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
