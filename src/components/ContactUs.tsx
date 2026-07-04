import React, { useState, useEffect } from 'react';
import { ContactInquiry } from '../types';
import { Send, Phone, Mail, MapPin, Clock, MessageSquare, Check } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load inquiries on mount
  useEffect(() => {
    const loaded = localStorage.getItem('aura_inquiries');
    if (loaded) {
      try {
        setInquiries(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const validate = () => {
    const errs: Partial<typeof formData> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errs.message = 'Message details are required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/bd33fbe675e7d89ea20e2c63fb97601a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          _subject: `New Inquiry from ${formData.name}`,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newInquiry: ContactInquiry = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        date: new Date().toLocaleDateString('en-PK', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('aura_inquiries', JSON.stringify(updated));

      setSuccessMessage('✓ Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage('An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Title */}
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Connect With Us</span>
        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Let's Keep In Touch</h2>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          Have a question about fabric, sizing, or delivery? Reach out to our customer support team based in Hyderabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Grid: Contact Information (5 Cols) */}
        <div className="lg:col-span-5 space-y-8 bg-neutral-900 text-neutral-300 rounded-xl p-8 shadow-lg">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Contact Info</h3>
            <p className="text-xs text-neutral-400">Feel free to ring us, send an email, or stop by our headquarters during standard business hours.</p>
          </div>

          <ul className="space-y-6">
            {/* Address */}
            <li className="flex items-start gap-4">
              <div className="p-3 bg-neutral-800 text-amber-400 rounded-full shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">HQ Address</h4>
                <p className="text-sm text-white font-semibold">Hyderabad, Sindh, Pakistan</p>
              </div>
            </li>

            {/* Phone */}
            <li className="flex items-start gap-4">
              <div className="p-3 bg-neutral-800 text-amber-400 rounded-full shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Cellular Phone</h4>
                <p className="text-sm">
                  <a href="tel:+923478735306" className="text-white hover:text-amber-400 transition-colors font-semibold">+92 347 8735306</a>
                </p>
              </div>
            </li>
            {/* Email */}
            <li className="flex items-start gap-4">
              <div className="p-3 bg-neutral-800 text-amber-400 rounded-full shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Email Support</h4>
                <p className="text-sm">
                  <a href="mailto:outfitaura02@gmail.com" className="text-white hover:text-amber-400 transition-colors font-semibold">outfitaura02@gmail.com</a>
                </p>
              </div>
            </li>

            {/* Hours */}
            <li className="flex items-start gap-4">
              <div className="p-3 bg-neutral-800 text-amber-400 rounded-full shrink-0">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Business Hours</h4>
                <p className="text-sm text-white font-semibold">Monday – Saturday</p>
                <p className="text-xs text-neutral-400">10:00 AM – 8:00 PM</p>
              </div>
            </li>
          </ul>

          <div className="border-t border-neutral-800 pt-6">
            <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2">Our Promise</h4>
            <p className="text-xs leading-relaxed text-neutral-400">
              Great style should be accessible to everyone. That's why every single clothing item is thoroughly inspected for fabric standard, seam strength, and size tolerance before dispatch.
            </p>
          </div>
        </div>

        {/* Right Grid: Form Sheet (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-100 rounded-xl p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">Send a Message</h3>

            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-neutral-600 mb-1.5">Full Name *</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 focus:bg-white transition-all ${
                  formErrors.name ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                }`}
              />
              {formErrors.name && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.name}</p>}
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-neutral-600 mb-1.5">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="e.g., mail@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 focus:bg-white transition-all ${
                    formErrors.email ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                  }`}
                />
                {formErrors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-semibold text-neutral-600 mb-1.5">Phone Number (Optional)</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  placeholder="e.g., +92 347 8735306"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold text-neutral-600 mb-1.5">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-neutral-600 mb-1.5">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Tell us what you need support with..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 focus:bg-white transition-all resize-none ${
                  formErrors.message ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                }`}
              />
              {formErrors.message && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.message}</p>}
            </div>

            {/* Submission triggers */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:bg-neutral-400"
                id="btn-contact-submit"
              >
                {isSubmitting ? (
                  <span>Sending to Outfit Aura...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-2.5 text-xs text-emerald-800 font-semibold animate-fade-in">
                <Check className="text-emerald-600 shrink-0" size={16} />
                <p>{successMessage}</p>
              </div>
            )}
          </form>

          {/* User's recent local inquiries */}
          {inquiries.length > 0 && (
            <div className="mt-8 border-t border-neutral-100 pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MessageSquare size={14} /> Your Previous Submissions ({inquiries.length})
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-neutral-50 rounded p-3 text-xs border border-neutral-200/50">
                    <div className="flex justify-between items-center font-bold text-neutral-800 mb-1">
                      <span>{inq.subject}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{inq.date}</span>
                    </div>
                    <p className="text-neutral-600 line-clamp-2">{inq.message}</p>
                    <span className="text-[9px] text-emerald-600 font-semibold mt-1 block">Status: Received (Awaiting Representative)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
