import React from 'react';
import { Product } from '../types';
import { ArrowLeftRight, X, Star, Check, AlertCircle } from 'lucide-react';

interface ProductComparisonProps {
  compareItems: string[];
  products: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function ProductComparison({
  compareItems,
  products,
  onRemoveFromCompare,
  onAddToCart,
  setActiveTab
}: ProductComparisonProps) {
  const comparedProducts = products.filter(p => compareItems.includes(p.id));
  const minPrice = comparedProducts.length >= 2 
    ? Math.min(...comparedProducts.map(p => p.price)) 
    : null;

  if (comparedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center mt-12 bg-white p-12 rounded-2xl border border-neutral-100 shadow-sm">
          <ArrowLeftRight size={48} className="text-neutral-200 mb-4" />
          <h3 className="text-xl font-bold text-neutral-800 mb-2">No products to compare</h3>
          <p className="text-neutral-500 text-center mb-8">
            Add up to 3 products to see their features side-by-side.
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <ArrowLeftRight size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Compare Products</h1>
          <p className="text-neutral-500 mt-2 max-w-lg">
            Compare features, prices, and ratings to make the best choice.
          </p>
          {compareItems.length === 3 && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertCircle size={14} /> You've reached the maximum of 3 items.
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-200 divide-x divide-neutral-200">
                <th className="p-6 bg-neutral-50 w-1/4 font-semibold text-neutral-500">
                  Product Details
                </th>
                {comparedProducts.map(product => (
                  <th key={product.id} className="p-6 w-1/4 relative align-top bg-white">
                    <button
                      onClick={() => onRemoveFromCompare(product.id)}
                      className="absolute top-4 right-4 p-1.5 bg-neutral-100 hover:bg-rose-100 text-neutral-400 hover:text-rose-500 rounded-full transition-colors"
                      title="Remove from comparison"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-24 h-32 md:w-32 md:h-40 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-neutral-900 text-sm md:text-base line-clamp-2">{product.name}</h4>
                        <div className="text-lg font-black text-neutral-900 flex flex-col items-center gap-1">
                          <span>Rs. {product.price.toLocaleString()}</span>
                          {minPrice !== null && (
                            product.price === minPrice ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full shadow-3xs uppercase tracking-wider">
                                <Check size={10} className="stroke-[3px]" /> Lowest Price
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 bg-neutral-50 text-neutral-500 border border-neutral-200 text-[10px] font-semibold rounded-full shadow-3xs uppercase tracking-wider">
                                + Rs. {(product.price - minPrice).toLocaleString()} higher
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <button
                        disabled={!product.inStock}
                        onClick={() => onAddToCart(product, product.sizes[0] || 'M')}
                        className="w-full mt-2 py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </th>
                ))}
                {/* Empty placeholders if less than 3 */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-6 w-1/4 bg-neutral-50 border-neutral-200">
                    <div className="flex flex-col items-center justify-center h-full text-neutral-300 gap-2">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center">
                        <span className="text-2xl font-light">+</span>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider">Add Item</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {comparedProducts.length >= 2 && (
                <tr className="divide-x divide-neutral-200 bg-amber-50/5">
                  <td className="p-4 font-black text-amber-900 bg-amber-50/10">Price Difference</td>
                  {comparedProducts.map(product => {
                    const isLowest = product.price === minPrice;
                    const diff = product.price - (minPrice ?? 0);
                    return (
                      <td key={`price-diff-${product.id}`} className="p-4 text-center">
                        {isLowest ? (
                          <div className="text-xs text-emerald-700 font-extrabold flex flex-col items-center gap-1.5">
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest text-[9px] font-black">Cheapest Option</span>
                            <span className="text-[10px] font-bold text-neutral-400">Best financial deal</span>
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-800 font-bold flex flex-col items-center gap-1.5">
                            <span className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200/60 uppercase tracking-widest text-[9px] font-black">+{diff.toLocaleString()} PKR Diff</span>
                            <span className="text-[10px] font-bold text-neutral-400 font-sans">({Math.round((diff / (minPrice ?? 1)) * 100)}% higher)</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-price-diff-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                  ))}
                </tr>
              )}
              <tr className="divide-x divide-neutral-200">
                <td className="p-4 font-medium text-neutral-500 bg-neutral-50">Rating</td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star size={16} className="fill-amber-500 text-amber-500" />
                      <span className="font-bold text-neutral-900">{product.rating}</span>
                      <span className="text-neutral-400 text-xs">({product.reviewsCount})</span>
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <td key={`empty-rating-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                ))}
              </tr>
              <tr className="divide-x divide-neutral-200">
                <td className="p-4 font-medium text-neutral-500 bg-neutral-50">Category</td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4 text-center text-neutral-700 capitalize">
                    {product.category}
                  </td>
                ))}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <td key={`empty-cat-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                ))}
              </tr>
              <tr className="divide-x divide-neutral-200">
                <td className="p-4 font-medium text-neutral-500 bg-neutral-50">Gender</td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4 text-center text-neutral-700">
                    {product.gender}
                  </td>
                ))}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <td key={`empty-gender-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                ))}
              </tr>
              <tr className="divide-x divide-neutral-200">
                <td className="p-4 font-medium text-neutral-500 bg-neutral-50">Available Sizes</td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.sizes.map(size => (
                        <span key={size} className="px-2 py-1 text-[10px] font-bold uppercase bg-neutral-100 rounded text-neutral-600">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <td key={`empty-size-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                ))}
              </tr>
              <tr className="divide-x divide-neutral-200">
                <td className="p-4 font-medium text-neutral-500 bg-neutral-50">Description</td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4">
                    <p className="text-xs text-neutral-600">
                      {product.description}
                    </p>
                  </td>
                ))}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <td key={`empty-desc-${i}`} className="p-4 bg-neutral-50 border-neutral-200" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
