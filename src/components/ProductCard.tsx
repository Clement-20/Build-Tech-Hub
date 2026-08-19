import React, { useState } from 'react';
import { Star, Plus, Minus, Check, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const [qty, setQty] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const maxDiscount = Math.max(...product.bulkDiscount.map((b) => b.discountPercent), 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty((prev) => Math.max(1, prev - 1));
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
              Featured
            </span>
          )}
          {maxDiscount > 0 && (
            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md shadow-sm">
              Save up to {maxDiscount}%
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded-md border border-slate-200/60 shadow-sm">
            {product.brand}
          </span>
        </div>

        {/* In-stock indicator */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            In Stock ({product.inStockCount} {product.unit}s)
          </span>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Key specs row */}
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(product.specifications).slice(0, 2).map(([key, val]) => (
              <span
                key={key}
                className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium truncate max-w-[140px]"
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Price display */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 font-mono">
                ₦{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ {product.unit}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart Row */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button
                onClick={handleDecrement}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer text-xs"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 text-xs font-bold text-slate-900 min-w-[24px] text-center font-mono">
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer text-xs"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-orange-500/20'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
