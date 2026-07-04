import React, { useState } from 'react';
import { CartItem, ShippingDetails, Order } from '../types';
import OrderSummaryModal from './OrderSummaryModal';
import { PAKISTANI_CITIES } from '../data';
import { X, CheckCircle, ShieldCheck, ShoppingCart, User, Phone, Mail, MapPin, CreditCard, Landmark, Copy, Check, FileText } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  onOrderCompleted: (newOrder: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryFee,
  grandTotal,
  onOrderCompleted
}: CheckoutModalProps) {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    address: ''
  });
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank'>('COD');
  const [formErrors, setFormErrors] = useState<Partial<ShippingDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionRef = React.useRef(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Bank transfer editable states
  const [bankDetails, setBankDetails] = useState(() => {
    return localStorage.getItem('aura_bank_details') || 
      'Bank Name: Meezan Bank Ltd.\nAccount Title: Outfit Aura\nAccount No: 1201-029384756-01\nIBAN: PK49MEZN0012010293847561';
  });
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [tempBankDetails, setTempBankDetails] = useState(bankDetails);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => {
      setCopiedLabel(null);
    }, 2000);
  };

  const handleSaveBankDetails = () => {
    localStorage.setItem('aura_bank_details', tempBankDetails);
    setBankDetails(tempBankDetails);
    setIsEditingBank(false);
  };

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Partial<ShippingDetails> = {};
    
    if (!shippingDetails.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    
    if (!shippingDetails.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^((\+92)|(0092)|(0))?3[0-9]{9}$/.test(shippingDetails.phone.trim().replace(/[-\s]/g, ''))) {
      errors.phone = 'Please enter a valid Pakistani mobile number (e.g., 03001234567)';
    }

    if (!shippingDetails.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!shippingDetails.address.trim()) {
      errors.address = 'Detailed delivery address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error immediately when typing
    if (formErrors[name as keyof ShippingDetails]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting || submissionRef.current) {
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    submissionRef.current = true;
    setSubmitError(null);

    const orderId = `AURA-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(100 + Math.random() * 899)}`;
    const formattedDate = new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const earnedPoints = Math.floor(grandTotal / 100) * 5;

    const newOrder: Order = {
      id: orderId,
      date: formattedDate,
      items: [...cartItems],
      shippingDetails,
      paymentMethod,
      subtotal,
      shippingFee: deliveryFee,
      discount: 0,
      total: grandTotal,
      status: 'Processing',
      orderNotes: orderNotes.trim() || undefined,
      earnedPoints
    };

    // Format items details for beautiful inbox layout
    const itemsFormatted = cartItems.map((item, index) => 
      `${index + 1}. Product: ${item.product.name}\n   Size: ${item.selectedSize}\n   Qty: ${item.quantity}\n   Price: PKR ${item.product.price.toLocaleString()}\n   Subtotal: PKR ${(item.product.price * item.quantity).toLocaleString()}`
    ).join('\n\n');

    try {
      const payload = {
        _subject: `📦 NEW OUTFIT AURA ORDER - ${orderId}`,
        _replyto: shippingDetails.email,
        _captcha: "false",
        "Order ID": orderId,
        "Order Date": formattedDate,
        "Customer Name": shippingDetails.fullName,
        "Customer Phone": shippingDetails.phone,
        "Customer Email": shippingDetails.email,
        "Destination City": shippingDetails.city,
        "Full Shipping Address": shippingDetails.address,
        "Order Notes": orderNotes.trim() || "None",
        "Payment Method": paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : paymentMethod,
        "Order Items": itemsFormatted,
        "Subtotal": `PKR ${subtotal.toLocaleString()}`,
        "Delivery Charges": `PKR ${deliveryFee.toLocaleString()}`,
        "Grand Total": `PKR ${grandTotal.toLocaleString()}`
      };

      const response = await fetch("https://formsubmit.co/ajax/bd33fbe675e7d89ea20e2c63fb97601a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes or force complete locally.');
        }
        throw new Error('Could not submit the order via FormSubmit. The email endpoint returned a non-ok response.');
      }

      await response.json();

      // Save to localStorage
      const existingOrders: Order[] = JSON.parse(localStorage.getItem('aura_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('aura_orders', JSON.stringify(existingOrders));

      // Dispatch automated SMS notification via Twilio API
      try {
        await fetch("/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: shippingDetails.phone,
            orderId: newOrder.id,
            status: "Processing",
            customerName: shippingDetails.fullName,
            total: grandTotal
          })
        });
      } catch (smsErr) {
        console.error("SMS dispatch error during checkout:", smsErr);
      }

      setPlacedOrder(newOrder);
      onOrderCompleted(newOrder);
    } catch (err: any) {
      console.error("Order submission error:", err);
      submissionRef.current = false; // Allow retry on error
      setSubmitError(err.message || "Failed to reach the checkout mail server. Please try again or force complete your order below.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <OrderSummaryModal
        isOpen={true}
        onClose={onClose}
        order={placedOrder}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        /* CHECKOUT FORM SCREEN */
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 animate-scale-up"
          id="checkout-form-container"
        >
          {/* Header */}
          <div className="col-span-12 px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingCart size={20} className="text-neutral-500" />
              Secure Checkout
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors cursor-pointer"
              id="btn-checkout-close-form"
            >
              <X size={20} />
            </button>
          </div>

          {/* Left: Input Form (7 Cols) */}
          <form onSubmit={handleSubmit} className="col-span-12 md:col-span-7 p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">1. Delivery Information</h3>
              
              {/* Recipient Name */}
              <div>
                <label htmlFor="checkout-fullName" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                  <User size={12} /> Full Name *
                </label>
                <input
                  id="checkout-fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 ${
                    formErrors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                  }`}
                />
                {formErrors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.fullName}</p>}
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <Phone size={12} /> Pakistani Mobile No *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    placeholder="e.g., 03001234567"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 ${
                      formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                    }`}
                  />
                  {formErrors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <Mail size={12} /> Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    name="email"
                    placeholder="outfitaura02@gmail.com"
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 ${
                      formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                    }`}
                  />
                  {formErrors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.email}</p>}
                </div>
              </div>

              {/* City Selection dropdown */}
              <div>
                <label htmlFor="checkout-city" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} /> Destination City *
                </label>
                <select
                  id="checkout-city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900"
                >
                  {PAKISTANI_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Shipping Address */}
              <div>
                <label htmlFor="checkout-address" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} /> Full Shipping Address *
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  rows={3}
                  placeholder="Street No, House No, Area / Town name, Landmark description"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className={`w-full bg-neutral-50 border rounded-md px-3 py-2.5 text-sm outline-hidden focus:border-neutral-900 resize-none ${
                    formErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                  }`}
                />
                {formErrors.address && <p className="text-[10px] text-rose-600 font-bold mt-1">{formErrors.address}</p>}
              </div>

              {/* Order Notes (Optional) */}
              <div>
                <label htmlFor="checkout-notes" className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                  <FileText size={12} /> Order Notes (Optional)
                </label>
                <textarea
                  id="checkout-notes"
                  name="orderNotes"
                  rows={2}
                  placeholder="Specific delivery instructions e.g. gate codes, preferred delivery times, or nearby landmarks"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2 text-sm outline-hidden focus:border-neutral-900 resize-none"
                />
              </div>
            </div>

            {/* Payment selection panel */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">2. Payment Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <MapPin size={18} className="text-neutral-500" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Cash on Delivery (COD)</p>
                    <p className="text-[10px] text-neutral-400">Available only in Hyderabad, Sindh</p>
                  </div>
                </div>

                {/* EasyPaisa */}
                <div 
                  onClick={() => setPaymentMethod('EasyPaisa')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'EasyPaisa' ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <Landmark size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">EasyPaisa</p>
                    <p className="text-[10px] text-neutral-400">Instant Wallet transfer</p>
                  </div>
                </div>

                {/* JazzCash */}
                <div 
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'JazzCash' ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <Landmark size={18} className="text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">JazzCash</p>
                    <p className="text-[10px] text-neutral-400">Instant Wallet transfer</p>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div 
                  onClick={() => setPaymentMethod('Bank')}
                  className={`border rounded-lg p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Bank' ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <CreditCard size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Bank Transfer</p>
                    <p className="text-[10px] text-neutral-400">Direct local bank deposit</p>
                  </div>
                </div>
              </div>

              {/* Dynamic details drawer */}
              {paymentMethod === 'COD' && (
                <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-lg text-xs space-y-1 font-sans">
                  <p className="font-bold text-neutral-800">Cash on Delivery Information:</p>
                  <p className="text-neutral-600 leading-relaxed">
                    Available for orders across major cities in Pakistan. Pay cash at your doorstep when the delivery representative arrives (Standard transit of 1-2 working days for Hyderabad, 2-3 working days for other cities).
                  </p>
                </div>
              )}

              {paymentMethod === 'EasyPaisa' && (
                <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-lg text-xs space-y-2 font-sans">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-neutral-800">EasyPaisa Wallet Details:</p>
                    <button
                      type="button"
                      onClick={() => handleCopy('+92 347 8735306', 'easypaisa')}
                      className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] font-semibold text-neutral-700 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      {copiedLabel === 'easypaisa' ? (
                        <>
                          <Check size={10} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-neutral-500">Wallet Provider:</span> EasyPaisa</p>
                    <p><span className="text-neutral-500">Account Title:</span> Outfit Aura</p>
                    <p><span className="text-neutral-500">Wallet Number:</span> <strong className="text-neutral-800 font-bold">+92 347 8735306</strong></p>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold italic">Please share your transaction ID or receipt screenshot with our Whatsapp Support (+92 347 8735306) after sending.</p>
                </div>
              )}

              {paymentMethod === 'JazzCash' && (
                <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-lg text-xs space-y-2 font-sans">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-neutral-800">JazzCash Wallet Details:</p>
                    <button
                      type="button"
                      onClick={() => handleCopy('+92 347 8735306', 'jazzcash')}
                      className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] font-semibold text-neutral-700 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      {copiedLabel === 'jazzcash' ? (
                        <>
                          <Check size={10} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-neutral-500">Wallet Provider:</span> JazzCash</p>
                    <p><span className="text-neutral-500">Account Title:</span> Outfit Aura</p>
                    <p><span className="text-neutral-500">Wallet Number:</span> <strong className="text-neutral-800 font-bold">+92 347 8735306</strong></p>
                  </div>
                  <p className="text-[10px] text-amber-600 font-semibold italic">Please share your transaction receipt with our Whatsapp Support (+92 347 8735306) or email outfitaura02@gmail.com referencing your Order ID.</p>
                </div>
              )}

              {paymentMethod === 'Bank' && (
                <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-lg text-xs space-y-2 font-sans">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-neutral-800">Bank Account Details (Editable):</p>
                    {!isEditingBank ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTempBankDetails(bankDetails);
                          setIsEditingBank(true);
                        }}
                        className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] font-semibold text-neutral-700 cursor-pointer transition-all"
                      >
                        Edit Details
                      </button>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={handleSaveBankDetails}
                          className="px-2 py-1 bg-neutral-900 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-neutral-800 transition-all"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingBank(false)}
                          className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] font-semibold text-neutral-700 cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingBank ? (
                    <textarea
                      value={tempBankDetails}
                      onChange={(e) => setTempBankDetails(e.target.value)}
                      className="w-full text-xs bg-white border border-neutral-200 p-2.5 rounded-md focus:border-neutral-900 focus:outline-none min-h-[90px] font-mono leading-relaxed"
                      placeholder="Enter bank transfer instructions..."
                    />
                  ) : (
                    <div className="bg-white border border-neutral-200/60 p-3 rounded-md font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-neutral-700">
                      {bankDetails}
                    </div>
                  )}

                  <p className="text-[10px] text-blue-600 font-semibold italic">Please send transaction receipt screenshot to our Whatsapp Support (+92 347 8735306) to confirm your order.</p>
                </div>
              )}
            </div>

            {/* Confirm buttons */}
            <div className="pt-4 space-y-3">
              {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg p-4 space-y-2 font-sans animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-rose-600">⚠️</span>
                    <span>FormSubmit Integration Error</span>
                  </div>
                  <p className="leading-relaxed">{submitError}</p>
                  <p className="text-[10px] text-neutral-500 font-semibold italic">Since FormSubmit requires email confirmation in test environments, you can force save this order locally to view it instantly in order history!</p>
                  <button
                    type="button"
                    onClick={() => {
                      const orderId = `AURA-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(100 + Math.random() * 899)}`;
                      const formattedDate = new Date().toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      const fallbackOrder: Order = {
                        id: orderId,
                        date: formattedDate,
                        items: [...cartItems],
                        shippingDetails,
                        paymentMethod,
                        subtotal,
                        shippingFee: deliveryFee,
                        discount: 0,
                        total: grandTotal,
                        status: 'Processing'
                      };
                      const existingOrders: Order[] = JSON.parse(localStorage.getItem('aura_orders') || '[]');
                      existingOrders.unshift(fallbackOrder);
                      localStorage.setItem('aura_orders', JSON.stringify(existingOrders));
                      setPlacedOrder(fallbackOrder);
                      onOrderCompleted(fallbackOrder);
                    }}
                    className="mt-1 text-neutral-900 hover:text-neutral-700 font-bold underline text-xs block transition-all hover:translate-x-0.5 cursor-pointer"
                  >
                    Force Complete Order (Local Storage) →
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:bg-neutral-400"
                id="btn-confirm-order-submit"
              >
                {isSubmitting ? 'Verifying Order with Aura Server...' : `Confirm & Place Order (Rs. ${grandTotal.toLocaleString()})`}
              </button>
            </div>
          </form>

          {/* Right: Order Summary Sidebar (5 Cols) */}
          <div className="col-span-12 md:col-span-5 bg-neutral-50 border-t md:border-t-0 md:border-l border-neutral-100 p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Order Summary</h3>
              
              {/* Product mini list scrollable */}
              <div className="max-h-[300px] overflow-y-auto space-y-3.5 pr-2">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="flex items-start gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-15 object-cover rounded-md bg-white border border-neutral-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-6 border-t border-neutral-200/60 mt-6 space-y-3 font-sans">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-xs text-neutral-500 font-medium">
                <span>Delivery Charges</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-800 pt-3 border-t border-neutral-200/50">
                <span>Grand Total</span>
                <span className="text-base font-black text-neutral-900">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
