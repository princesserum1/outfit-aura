import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { initAuth, googleSignIn, getAccessToken } from '../lib/firebase';
import { Order } from '../types';

interface ExportToDocsButtonProps {
  order: Order;
}

export default function ExportToDocsButton({ order }: ExportToDocsButtonProps) {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      () => setNeedsAuth(false),
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleExport = async () => {
    setError(null);
    setExportSuccess(null);
    setIsExporting(true);

    try {
      let token = await getAccessToken();
      
      if (!token) {
        const result = await googleSignIn();
        if (result) {
          token = result.accessToken;
        } else {
          throw new Error('Failed to sign in');
        }
      }

      // Create document
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Order Invoice - ${order.id}`,
        }),
      });

      if (!createRes.ok) {
        throw new Error('Failed to create document');
      }

      const doc = await createRes.json();
      const documentId = doc.documentId;

      // Prepare document content
      let textContent = `Order Invoice: ${order.id}\n`;
      textContent += `Date: ${order.date}\n`;
      textContent += `Status: ${order.status}\n\n`;
      
      textContent += `Shipping Details:\n`;
      textContent += `${order.shippingDetails.fullName}\n`;
      textContent += `${order.shippingDetails.phone}\n`;
      textContent += `${order.shippingDetails.email}\n`;
      textContent += `${order.shippingDetails.address}, ${order.shippingDetails.city}\n\n`;

      textContent += `Items:\n`;
      order.items.forEach(item => {
        textContent += `- ${item.product.name} (Size: ${item.selectedSize}) x${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
      });
      
      textContent += `\nTotal: Rs. ${order.total.toLocaleString()}\n`;

      // Update document content
      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: textContent,
              }
            }
          ]
        }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update document');
      }

      setExportSuccess(`https://docs.google.com/document/d/${documentId}/edit`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs text-neutral-500">
        Export this order details to your Google Docs.
      </div>
      
      <div className="flex items-center gap-3">
        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
        {exportSuccess && (
          <a 
            href={exportSuccess}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
          >
            Open Document
          </a>
        )}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
          {needsAuth ? 'Sign in & Export to Docs' : 'Export to Docs'}
        </button>
      </div>
    </div>
  );
}
