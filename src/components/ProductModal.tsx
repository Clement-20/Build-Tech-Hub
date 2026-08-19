import React, { useState } from 'react';
import { X, ShieldCheck, Star, Plus, Minus, Check, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, note?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [jobNote, setJobNote] = useState<string>('');
  const [added, setAdded] = useState<boolean>(false);

  // Compute tier discount if quantity matches threshold
  const applicableDiscountTier = product.bulkDiscount
    .slice()
    .reverse()
    .find((tier) => quantity >= tier.threshold);

  const discountPercent = applicableDiscountTier ? applicableDiscountTier.discountPercent : 0;
  const unitPriceAfterDiscount = product.price * (1 - discountPercent / 100);
  const totalPrice = unitPriceAfterDiscount * quantity;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, jobNote);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 text-slate-900 space-y-6 border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* Left Column: Image */}
          <div className="sm:col-span-5 space-y-3">
            <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Certification info */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certification</span>
              </div>
              <p className="text-emerald-900 font-mono text-[11px]">{product.certification}</p>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-orange-600">{product.brand}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} contractor reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications grid */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-1">
                Material Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="text-[11px]">
                    <span className="text-slate-500 block">{k}</span>
                    <strong className="text-slate-800 font-mono">{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk tier discounts */}
            {product.bulkDiscount.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                  Wholesale Bulk Tier Pricing
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {product.bulkDiscount.map((tier, idx) => {
                    const isActive = quantity >= tier.threshold;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isActive
                            ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500">{tier.threshold}+ {product.unit}s</div>
                        <div className="text-xs font-bold text-orange-600">Save {tier.discountPercent}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price & Quantity Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Unit Price</span>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    ₦{unitPriceAfterDiscount.toLocaleString()}{' '}
                    <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Total</span>
                  <div className="text-xl font-black text-orange-600 font-mono">
                    ₦{totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center font-mono font-bold text-slate-900 focus:outline-none text-sm"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-orange-500/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart (₦{totalPrice.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
