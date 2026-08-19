import React from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Category, FilterOptions } from '../types';
import { BRANDS } from '../data/products';

interface FilterBarProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  onResetFilters: () => void;
  totalResults: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'All Products', value: 'All' },
  { label: 'Steel & Rebar', value: 'Structural Steel' },
  { label: 'Cement & Concrete', value: 'Cement & Concrete' },
  { label: 'Timber & Lumber', value: 'Lumber & Framing' },
  { label: 'Roofing Sheets', value: 'Roofing & Siding' },
  { label: 'Drywall & Plywood', value: 'Drywall & Insulation' },
  { label: 'Electrical & Plumbing', value: 'Plumbing & Electrical' },
  { label: 'Fasteners & Hardware', value: 'Fasteners & Hardware' },
  { label: 'Equipment & Tools', value: 'Heavy Equipment & Tools' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  onFilterChange,
  onResetFilters,
  totalResults,
  selectedCategory,
  onCategoryChange,
}) => {
  const isFiltered =
    selectedCategory !== 'All' ||
    filterOptions.brand !== 'All Brands' ||
    filterOptions.inStockOnly ||
    filterOptions.sortBy !== 'featured';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 my-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="font-semibold text-slate-500 text-[11px]">Brand:</span>
            <select
              value={filterOptions.brand}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, brand: e.target.value })
              }
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="All Brands">All Brands</option>
              {BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* In-Stock Toggle */}
          <button
            onClick={() =>
              onFilterChange({
                ...filterOptions,
                inStockOnly: !filterOptions.inStockOnly,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              filterOptions.inStockOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                filterOptions.inStockOnly
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {filterOptions.inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>In Stock Only</span>
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-slate-500 font-medium text-xs">
            Showing <strong className="text-slate-900">{totalResults}</strong> materials
          </span>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterOptions.sortBy}
              onChange={(e) =>
                onFilterChange({ ...filterOptions, sortBy: e.target.value as any })
              }
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-orange-600 font-semibold text-xs transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
