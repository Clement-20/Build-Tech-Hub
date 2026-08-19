import React, { useState } from 'react';
import { Calculator, Check, ShoppingCart, Box, Layers, Home } from 'lucide-react';
import { Product } from '../types';

interface CalculatorsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, note?: string) => void;
}

export const Calculators: React.FC<CalculatorsProps> = ({ products, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'concrete' | 'framing' | 'roofing'>('concrete');
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<string | null>(null);

  // Concrete state
  const [slabLength, setSlabLength] = useState<number>(30);
  const [slabWidth, setSlabWidth] = useState<number>(20);
  const [slabDepth, setSlabDepth] = useState<number>(4); // inches

  // Framing state
  const [wallLength, setWallLength] = useState<number>(60);
  const [wallHeight, setWallHeight] = useState<number>(9);
  const [studSpacing, setStudSpacing] = useState<16 | 24>(16);

  // Roofing state
  const [roofArea, setRoofArea] = useState<number>(1800);
  const [roofPitch, setRoofPitch] = useState<number>(1.05);

  // Concrete calculation outputs
  const cubicFeet = slabLength * slabWidth * (slabDepth / 12);
  const cubicYards = Number((cubicFeet / 27).toFixed(2));
  const bagsNeeded = Math.ceil(cubicYards * 22.5);
  const rebarBarsNeeded = Math.ceil(slabLength / 2 + slabWidth / 2);

  // Framing outputs
  const wallStuds = Math.ceil((wallLength * 12) / studSpacing) + Math.ceil(wallLength / 10) * 2 + 4;
  const wallArea = wallLength * wallHeight * 2;
  const drywallSheets = Math.ceil((wallArea / 32) * 1.1);

  // Roofing outputs
  const adjustedRoofArea = Math.ceil(roofArea * roofPitch);
  const roofingSquares = Number((adjustedRoofArea / 100).toFixed(1));
  const sheetsNeeded = Math.ceil(roofingSquares * 3);

  const handleAddConcreteToCart = () => {
    const cementProd =
      products.find((p) => p.id === 'prod-cement-dangote-50kg') ||
      products.find((p) => p.category === 'Cement & Concrete') ||
      products[2];
    const rebarProd =
      products.find((p) => p.id === 'prod-rebar-y16-12m') ||
      products.find((p) => p.category === 'Structural Steel') ||
      products[1];

    if (cementProd) {
      onAddToCart(cementProd, bagsNeeded, `Slab Estimate: ${slabLength}x${slabWidth}ft @ ${slabDepth}" depth`);
    }
    if (rebarProd && rebarBarsNeeded > 0) {
      onAddToCart(rebarProd, rebarBarsNeeded, `Y16 Rebar Mesh for ${slabLength}x${slabWidth}ft slab`);
    }

    setAddedSuccessMessage(`Added ${bagsNeeded} Dangote cement bags & ${rebarBarsNeeded} Y16 rebar lengths!`);
    setTimeout(() => setAddedSuccessMessage(null), 3000);
  };

  const handleAddFramingToCart = () => {
    const lumberProd =
      products.find((p) => p.id === 'prod-timber-hardwood-2x6') ||
      products.find((p) => p.category === 'Lumber & Framing') ||
      products[4];
    const drywallProd =
      products.find((p) => p.id === 'prod-drywall-typex-58') ||
      products.find((p) => p.category === 'Drywall & Insulation') ||
      products[5];

    if (lumberProd) {
      onAddToCart(lumberProd, wallStuds, `Wall Framing: ${wallLength}ft wall @ ${wallHeight}ft height`);
    }
    if (drywallProd) {
      onAddToCart(drywallProd, drywallSheets, `Wall Sheathing: ${drywallSheets} sheets`);
    }

    setAddedSuccessMessage(`Added ${wallStuds} hardwood studs & ${drywallSheets} drywall sheets!`);
    setTimeout(() => setAddedSuccessMessage(null), 3000);
  };

  const handleAddRoofingToCart = () => {
    const roofingProd =
      products.find((p) => p.id === 'prod-roofing-longspan-aluguard') ||
      products.find((p) => p.category === 'Roofing & Siding') ||
      products[6];

    if (roofingProd) {
      onAddToCart(roofingProd, sheetsNeeded, `Roof Area: ${adjustedRoofArea} sq ft (${roofingSquares} Squares)`);
    }

    setAddedSuccessMessage(`Added ${sheetsNeeded} aluminum roofing sheets to cart!`);
    setTimeout(() => setAddedSuccessMessage(null), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm my-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs rounded-full mb-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Jobsite Material Estimator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Calculate Materials for Your Project
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your dimensions to estimate cement, steel rebar, timber, and roofing sheets.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start">
          <button
            onClick={() => setActiveTab('concrete')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'concrete'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-orange-500" />
            <span>Concrete Slab</span>
          </button>

          <button
            onClick={() => setActiveTab('framing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'framing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>Wall Framing</span>
          </button>

          <button
            onClick={() => setActiveTab('roofing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'roofing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-orange-500" />
            <span>Roofing</span>
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="pt-6">
        {/* CONCRETE TAB */}
        {activeTab === 'concrete' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Inputs */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">Slab Dimensions</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Length (ft):</span>
                    <span className="font-mono font-bold text-slate-900">{slabLength} ft</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={slabLength}
                    onChange={(e) => setSlabLength(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Width (ft):</span>
                    <span className="font-mono font-bold text-slate-900">{slabWidth} ft</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={slabWidth}
                    onChange={(e) => setSlabWidth(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Depth / Thickness (inches):</span>
                    <span className="font-mono font-bold text-slate-900">{slabDepth} inches</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[4, 6, 8].map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        onClick={() => setSlabDepth(depth)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          slabDepth === depth
                            ? 'bg-orange-50 border-orange-500 text-orange-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {depth}&quot; ({depth === 4 ? 'Standard' : depth === 6 ? 'Heavy Duty' : 'Foundation'})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Calculated Material Needs
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Cement Bags (50kg)</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {bagsNeeded} <span className="text-xs font-normal text-slate-500">bags</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                    Dangote Grade 42.5N
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Y16 Rebar Lengths</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {rebarBarsNeeded} <span className="text-xs font-normal text-slate-500">lengths (12m)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                    High-Yield Steel
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 pt-1">
                Volume: <strong>{cubicYards} cubic yards</strong> ({slabLength * slabWidth} sq ft area)
              </div>

              <button
                onClick={handleAddConcreteToCart}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Calculated Materials to Cart</span>
              </button>

              {addedSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium border border-emerald-200 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{addedSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FRAMING TAB */}
        {activeTab === 'framing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">Wall Framing Parameters</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Wall Total Length:</span>
                    <span className="font-mono font-bold text-slate-900">{wallLength} ft</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={wallLength}
                    onChange={(e) => setWallLength(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Wall Height:</span>
                    <span className="font-mono font-bold text-slate-900">{wallHeight} ft</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[8, 9, 10].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setWallHeight(h)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          wallHeight === h
                            ? 'bg-orange-50 border-orange-500 text-orange-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {h} ft Ceiling
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Framing & Drywall Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">2x6 Timber Studs</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {wallStuds} <span className="text-xs font-normal text-slate-500">pieces</span>
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Drywall Sheets</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {drywallSheets} <span className="text-xs font-normal text-slate-500">sheets</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddFramingToCart}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Studs & Drywall to Cart</span>
              </button>

              {addedSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium border border-emerald-200 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{addedSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROOFING TAB */}
        {activeTab === 'roofing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">Roof Area Dimensions</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Estimated Footprint Area:</span>
                    <span className="font-mono font-bold text-slate-900">{roofArea} sq ft</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="50"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Roofing Sheet Takeoff
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Aluminum Sheets</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {sheetsNeeded} <span className="text-xs font-normal text-slate-500">sheets</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                    0.55mm Metcoppo Longspan
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Roofing Squares</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {roofingSquares} <span className="text-xs font-normal text-slate-500">SQ</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddRoofingToCart}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Roofing Sheets to Cart</span>
              </button>

              {addedSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium border border-emerald-200 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{addedSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
