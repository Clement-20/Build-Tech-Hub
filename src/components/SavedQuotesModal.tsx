import React from 'react';
import { X, FileText, ShoppingCart, Calendar } from 'lucide-react';
import { SavedQuote } from '../types';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: SavedQuote[];
  onLoadQuoteToCart: (quote: SavedQuote) => void;
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  onLoadQuoteToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6 sm:p-8 text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none">Saved Project Quotes</h2>
              <p className="text-xs text-slate-500 mt-1">Saved material lists and formal jobsite estimates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quotes list */}
        <div className="my-6 space-y-4">
          {savedQuotes.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No saved quotes found</p>
              <p className="text-xs text-slate-400">Save a quote from your cart to view it here anytime.</p>
            </div>
          ) : (
            savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-orange-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        {quote.id}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {quote.createdAt}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{quote.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      ₦{quote.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {quote.items.map((item, i) => (
                    <div key={i} className="py-1.5 flex justify-between">
                      <span className="font-medium text-slate-800">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-mono text-slate-500">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => {
                      onLoadQuoteToCart(quote);
                      onClose();
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Load Quote to Cart</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
