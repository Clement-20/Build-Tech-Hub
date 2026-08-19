import React from 'react';
import { Truck, ShieldCheck, Calculator, Sparkles, ArrowRight, Percent, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onBrowseAll: () => void;
  onOpenCalculator: () => void;
  onOpenAiAssistant: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onBrowseAll,
  onOpenCalculator,
  onOpenAiAssistant,
}) => {
  return (
    <div className="my-6">
      {/* Clean Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-orange-400 mb-4 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span>Direct Commercial Supplier & Logistics</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-display">
            High-Grade Building Materials, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Delivered to Your Site.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Buy certified Dangote cement, structural steel rebar, treated hardwood timber, and roofing sheets at direct wholesale prices with flatbed crane offloading.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onBrowseAll}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCalculator}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/15"
            >
              <Calculator className="w-4 h-4 text-orange-400" />
              <span>Material Calculator</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer border border-white/15"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Takeoff</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Value Highlights */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Direct Site Delivery</h4>
              <p className="text-[11px] text-slate-400">Standard & Boom Crane trucks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Certified Quality</h4>
              <p className="text-[11px] text-slate-400">SONCAP & NIS compliant specs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Bulk Tier Discounts</h4>
              <p className="text-[11px] text-slate-400">Save up to 15% on large orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
