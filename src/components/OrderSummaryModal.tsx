import React, { useState } from 'react';
import { Order } from '../types';
import { 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  X, 
  Printer, 
  Copy, 
  Check, 
  ShoppingBag, 
  Receipt,
  Truck,
  FileText,
  Award
} from 'lucide-react';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderSummaryModal({ isOpen, onClose, order }: OrderSummaryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const itemsText = order.items.map((item, idx) => 
      `${idx + 1}. ${item.product.name} (Size: ${item.selectedSize}) x ${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const summaryText = `
--- OUTFIT AURA ORDER SUMMARY ---
Order ID: ${order.id}
Date: ${order.date}
Status: ${order.status}

[Shipping Details]
Name: ${order.shippingDetails.fullName}
Phone: ${order.shippingDetails.phone}
Email: ${order.shippingDetails.email}
City: ${order.shippingDetails.city}
Address: ${order.shippingDetails.address}
${order.orderNotes ? `Delivery Instructions: ${order.orderNotes}\n` : ''}
[Items Ordered]
${itemsText}

[Payment & Price Breakdown]
Payment Method: ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
Subtotal: Rs. ${order.subtotal.toLocaleString()}
Discount: Rs. ${order.discount.toLocaleString()}
Delivery Charges: Rs. ${order.shippingFee.toLocaleString()}
---------------------------------
TOTAL PAID: Rs. ${order.total.toLocaleString()}
=================================
Thank you for shopping with Outfit Aura!
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Custom Printer-Friendly styles to override screen formatting during browser print operations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide all general webpage elements on print */
          body * {
            visibility: hidden !important;
          }
          /* Expose only the order receipt card and its descendants */
          #order-summary-modal-card,
          #order-summary-modal-card * {
            visibility: visible !important;
          }
          /* Position printable receipt card at the very top-left of the printed document */
          #order-summary-modal-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            overflow: visible !important;
            max-height: none !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide interactive buttons, close controllers, and footer actions */
          #btn-close-summary-header,
          #print-actions-footer,
          #btn-summary-copy,
          #btn-summary-print,
          #btn-summary-continue,
          .fixed, .backdrop-blur-xs {
            display: none !important;
            visibility: hidden !important;
          }
          /* Style tweaks for elegant ink usage & premium high-contrast readability */
          .bg-neutral-900 {
            background-color: #f5f5f5 !important;
            color: #000000 !important;
            border-bottom: 2px solid #111111 !important;
            padding: 16px !important;
          }
          .text-white {
            color: #000000 !important;
          }
          .text-neutral-400 {
            color: #374151 !important;
          }
          .bg-neutral-50, .bg-emerald-50\\/40, .bg-amber-50\\/50 {
            background-color: #fafafa !important;
            border: 1px solid #e5e5e5 !important;
          }
          img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border: 1px solid #e5e5e5 !important;
          }
        }
      `}} />

      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up border border-neutral-100 max-h-[90vh] flex flex-col"
        id="order-summary-modal-card"
      >
        {/* Sticky Header */}
        <div className="bg-neutral-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Receipt className="text-amber-400 shrink-0" size={20} />
            <div>
              <h2 className="text-base font-black uppercase tracking-wider">Order Receipt</h2>
              <p className="text-[10px] text-neutral-400 font-mono">ID: {order.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-white"
            title="Close summary"
            id="btn-close-summary-header"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Receipt Content */}
        <div className="overflow-y-auto p-6 space-y-6 font-sans flex-1">
          {/* Status Message */}
          <div className="text-center py-4 space-y-2 bg-emerald-50/40 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-lg font-black text-neutral-900">Order Placed Successfully!</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto px-4">
              Your fashion upgrades are locked in. A confirmation email has been dispatched via our secure networks.
            </p>
          </div>

          {/* Loyalty Points Earned Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-amber-500/10 rounded-2xl border border-amber-500/25 p-5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                <Award size={22} className="animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">Loyalty Rewards Dispatched</h4>
                <p className="text-[11px] text-amber-700 font-semibold">Earned 5 Aura Points for every Rs. 100 spent!</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600">+{order.earnedPoints ?? Math.floor(order.total / 100) * 5}</span>
              <span className="text-[9px] text-amber-700 block font-black uppercase tracking-widest">Aura Points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Order Details */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-neutral-500" />
                Order Info
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Placed Date</span>
                  <span className="font-semibold text-neutral-800">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Mode</span>
                  <span className="font-semibold text-neutral-800">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Customer Shipping Details */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-neutral-500" />
                Shipping To
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-800 font-semibold">
                  <User size={12} className="text-neutral-400" />
                  <span>{order.shippingDetails.fullName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Phone size={12} className="text-neutral-400" />
                  <span>{order.shippingDetails.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600 truncate">
                  <Mail size={12} className="text-neutral-400" />
                  <span>{order.shippingDetails.email}</span>
                </div>
                <div className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-200/50 pt-1.5 mt-1.5">
                  <span className="font-bold text-neutral-700">Address: </span>
                  {order.shippingDetails.address}, {order.shippingDetails.city}
                </div>
              </div>
            </div>
          </div>

          {order.orderNotes && (
            <div className="bg-amber-50/20 border border-amber-200/40 rounded-xl p-4 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <FileText size={13} className="text-amber-600" />
                Delivery Instructions / Notes
              </h4>
              <p className="text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {order.orderNotes}
              </p>
            </div>
          )}

          {/* Items Review List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <ShoppingBag size={13} className="text-neutral-500" />
              Items In This Order
            </h4>
            <div className="border border-neutral-100 rounded-xl divide-y divide-neutral-100 overflow-hidden">
              {order.items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${index}`} className="flex items-center gap-4 p-3 hover:bg-neutral-50/50 transition-colors">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-12 h-14 object-cover object-top rounded-md border border-neutral-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-neutral-800 truncate">{item.product.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                      <span>Size: <span className="font-bold text-neutral-700">{item.selectedSize}</span></span>
                      <span>•</span>
                      <span>Qty: <span className="font-bold text-neutral-700">{item.quantity}</span></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-neutral-800">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[9px] text-neutral-400">
                        Rs. {item.product.price.toLocaleString()} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Price Summary */}
          <div className="bg-neutral-50 border border-neutral-200/50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Items Subtotal</span>
              <span className="font-semibold text-neutral-800">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span>- Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Delivery Charges (Across Pakistan)</span>
              <span className="font-semibold text-neutral-800">Rs. {order.shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-neutral-900 border-t border-neutral-200/60 pt-3.5 pb-2">
              <span>Final Order Total</span>
              <span className="text-base text-neutral-900">Rs. {order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-amber-700 font-bold border-t border-dashed border-neutral-200/80 pt-2 pb-0.5">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Award size={12} className="text-amber-500 shrink-0" />
                Loyalty Points Earned
              </span>
              <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md">+{order.earnedPoints ?? Math.floor(order.total / 100) * 5} Pts</span>
            </div>
          </div>

          {/* Courier Warning Info */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/60 flex items-start gap-3">
            <Truck className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div className="text-[11px] text-neutral-600 space-y-1 font-sans">
              <p className="font-bold text-neutral-800">Dispatch & Delivery Timelines</p>
              <p>Your package is scheduled for courier dispatch with TCS. Deliveries are typically completed within 1–2 working days for Hyderabad, and 2–3 working days for other major Pakistani destinations.</p>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div id="print-actions-footer" className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-3 justify-between shrink-0">
          <div className="flex gap-2">
            <button
              onClick={handleCopySummary}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 hover:text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              id="btn-summary-copy"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 hover:text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              id="btn-summary-print"
            >
              <Printer size={14} />
              <span>Print Receipt</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            id="btn-summary-continue"
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
