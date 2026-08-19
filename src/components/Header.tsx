import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Building2,
  MapPin,
  FileText,
  User,
  Calculator,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Category, UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenQuotes: () => void;
  onOpenAccount: () => void;
  currentUser: UserProfile | null;
  onScrollToCalculators: () => void;
  onScrollToAiAssistant: () => void;
  zipCode: string;
  onChangeZipCode: (zip: string) => void;
}

const POPULAR_LOCATIONS = [
  'Lagos (Ikeja / Mainland)',
  'Lagos (Lekki / Island)',
  'Abuja (FCT)',
  'Ibadan (Oyo)',
  'Port Harcourt (Rivers)',
  'Enugu',
  'Kano'
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenQuotes,
  onOpenAccount,
  currentUser,
  onScrollToCalculators,
  onScrollToAiAssistant,
  zipCode,
  onChangeZipCode,
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="font-medium text-slate-200">
              ⚡ Same-Day & Scheduled Site Delivery across Nigeria
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-emerald-400 font-medium">
              ✓ 100% Certified Quality Materials
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <button
              onClick={onScrollToCalculators}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-orange-400" />
              <span>Material Calculator</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onScrollToAiAssistant}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Takeoff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none tracking-tight font-display">
                Build<span className="text-orange-500">Tech</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase mt-0.5">
                Building Materials Hub
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cement, rebar, timber, blocks, roofing sheets, pipes..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-slate-900 text-sm placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate max-w-[130px]">{zipCode}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLocationMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-fadeIn">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Delivery Destination
                  </div>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onChangeZipCode(loc);
                        setShowLocationMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Quotes */}
            <button
              onClick={onOpenQuotes}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Saved Quotes"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Quotes</span>
            </button>

            {/* User Account */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">
                {cartTotal > 0 ? `₦${cartTotal.toLocaleString()}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
