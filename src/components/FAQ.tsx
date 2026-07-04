import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, HelpCircle, Truck, Ruler, CreditCard, RotateCcw, MessageSquare, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'shipping' | 'sizing' | 'payments' | 'returns';
}

export default function FAQ({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'sizing', label: 'Sizing & Fit', icon: Ruler },
    { id: 'payments', label: 'Payments & Orders', icon: CreditCard },
    { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw },
  ];

  const faqData: FAQItem[] = [
    {
      id: 'ship-1',
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'We offer rapid delivery timelines across Pakistan! Hyderabad orders are delivered within 1 to 2 working days (Same-day or Next-day dispatch). For Karachi, Lahore, Islamabad, and other major cities, standard delivery takes 2 to 3 working days.'
    },
    {
      id: 'ship-2',
      category: 'shipping',
      question: 'What are the shipping charges?',
      answer: 'We charge a flat delivery fee of Rs. 300 nationwide across Pakistan for all orders.'
    },
    {
      id: 'ship-3',
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order is processed, we will send you a tracking number and link via SMS and Email. You can also copy your Order ID and head over to our "Track Orders" tab at the top of the page for real-time tracking.'
    },
    {
      id: 'size-1',
      category: 'sizing',
      question: 'How do I know which size to order?',
      answer: 'We design our clothing to be true to standard Pakistani sizes. We provide a comprehensive Size Guide on every product page to help you select your perfect fit. We recommend comparing the chest and length measurements of one of your favorite fitting garments with our size chart.'
    },
    {
      id: 'size-2',
      category: 'sizing',
      question: 'Do your garments shrink or fade after washing?',
      answer: 'Outfit Aura uses premium pre-shrunk fabrics. To keep your clothes looking fresh and new, we highly recommend washing garments inside-out in cold water with similar colors. Avoid harsh bleaching agents and tumble dry on low. Iron at low-medium temperature.'
    },
    {
      id: 'pay-1',
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'To make your shopping experience as smooth as possible, we support: Cash on Delivery (COD) exclusively within Hyderabad, EasyPaisa, JazzCash, and direct Bank Transfers. You can select your preferred method during checkout.'
    },
    {
      id: 'pay-2',
      category: 'payments',
      question: 'Can I cancel or modify my order after placing it?',
      answer: 'Yes, but you must act quickly! You can cancel or modify your order (such as changing a size, adding an item, or updating your address) within 2 hours of placement. Please call or WhatsApp our customer support immediately at +92 347 8735306.'
    },
    {
      id: 'ret-1',
      category: 'returns',
      question: 'What is your return and exchange policy?',
      answer: 'We have a customer-friendly 14-day return and exchange policy. If an item is not the right fit, or you received a damaged product, you can request an exchange or a full refund. Items must be in their original condition: unworn, unwashed, with all tags intact, and in original packaging.'
    },
    {
      id: 'ret-2',
      category: 'returns',
      question: 'Who pays for the exchange shipping cost?',
      answer: 'If we made an error or delivered a damaged/faulty item, we will bear 100% of the return and exchange shipping fees. For voluntary exchanges (e.g., size change or change of mind), the customer pays the standard return shipping fee of Rs. 200 to send the package back to our center.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq => {
      const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in" id="faq-view-container">
      <div className="max-w-4xl mx-auto">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20">
            <HelpCircle size={15} className="text-amber-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Have questions? We’ve got answers! Find out everything you need to know about delivery timelines, accurate sizing, checkout payments, and hassle-free returns.
          </p>
        </div>

        {/* Search Bar Row */}
        <div className="relative max-w-lg mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g., delivery, sizing, COD...)"
            className="w-full bg-white text-sm text-neutral-800 pl-11 pr-4 py-4 rounded-2xl shadow-sm border border-neutral-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all placeholder:text-neutral-400"
            id="faq-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setExpandedId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-md scale-102'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                }`}
                id={`faq-tab-${cat.id}`}
              >
                <IconComponent size={14} className={isSelected ? 'text-amber-400' : 'text-neutral-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordions List */}
        <div className="space-y-3.5 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="bg-white rounded-2xl border border-neutral-200/50 shadow-xs overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                      id={`faq-question-btn-${index}`}
                    >
                      <div className="flex items-center gap-3.5 pr-4">
                        <span className="p-2 rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors shrink-0">
                          {faq.category === 'shipping' && <Truck size={16} />}
                          {faq.category === 'sizing' && <Ruler size={16} />}
                          {faq.category === 'payments' && <CreditCard size={16} />}
                          {faq.category === 'returns' && <RotateCcw size={16} />}
                        </span>
                        <span className="font-bold text-sm sm:text-base text-neutral-800 group-hover:text-neutral-950 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <span className={`text-neutral-400 group-hover:text-neutral-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : ''}`}>
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 border-t border-neutral-100/60 leading-relaxed bg-slate-50/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-2xl border border-neutral-200/60"
              >
                <HelpCircle size={40} className="mx-auto text-neutral-300 mb-3" />
                <p className="font-bold text-neutral-700">No matching FAQs found</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Try adjusting your search query or choosing another category above.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support CTA Card */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-850 shadow-lg text-white">
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2 text-white">
              <MessageSquare size={20} className="text-amber-400" />
              Still have a specific question?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed">
              Our support team is live Monday through Saturday, 10:00 AM – 8:00 PM. We'd love to help you sort sizing or tracking queries directly.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('contact')}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            id="faq-btn-contact"
          >
            <span>Contact Support</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
