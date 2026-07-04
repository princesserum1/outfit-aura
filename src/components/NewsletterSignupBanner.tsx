import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewsletterSignupBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch("https://formsubmit.co/ajax/bd33fbe675e7d89ea20e2c63fb97601a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "✨ NEW NEWSLETTER SUBSCRIPTION - Outfit Aura",
          email: email,
          source: "Banner CTA Above Footer",
          date: new Date().toLocaleString()
        })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-neutral-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
          alt="Newsletter Background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={12} />
              Exclusive Access
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Join the Aura Inner Circle & Get <span className="text-amber-400">10% Off</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
              Subscribe to our newsletter and be the first to know about new collections, exclusive seasonal drops, and special offers.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>One-click unsubscribe</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Welcome to the Club!</h3>
                <p className="text-neutral-400">
                  Check your inbox for your welcome discount code and the latest news from Outfit Aura.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-amber-400 font-bold text-sm hover:underline cursor-pointer"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-neutral-600 text-neutral-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  {status === 'loading' ? (
                    'Joining Circle...'
                  ) : (
                    <>
                      Get My 10% Discount <ArrowRight size={20} />
                    </>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-rose-400 text-xs text-center font-bold">{errorMessage}</p>
                )}
                <p className="text-[10px] text-neutral-500 text-center uppercase tracking-widest font-bold">
                  By subscribing, you agree to our Terms of Service & Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
    </section>
  );
}
