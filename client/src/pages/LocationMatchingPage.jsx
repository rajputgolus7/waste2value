import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Sparkles,
  ArrowRight,
  Building2,
  Navigation,
  Scale,
  DollarSign,
  Fuel
} from 'lucide-react';

const CORRIDOR_PRESETS = [
  {
    sellerCity: 'Ludhiana',
    sellerState: 'Punjab',
    sellerCompany: 'Punjab Rice Industries',
    material: 'Paddy Rice Husk (10 Tonnes)',
    buyerCity: 'Rajpura',
    buyerState: 'Punjab',
    buyerCompany: 'Green Biomass Energy Ltd',
    distanceKm: 85,
    logisticsCostInr: 4500,
    matchScore: 94,
    highway: 'NH 44 (Grand Trunk Corridor)'
  },
  {
    sellerCity: 'Panipat',
    sellerState: 'Haryana',
    sellerCompany: 'Panipat Textile Mills',
    material: 'Cotton Yarn Comber Noils (1.5 Tonnes)',
    buyerCity: 'Okhla',
    buyerState: 'Delhi',
    buyerCompany: 'EcoCycle Recyclers',
    distanceKm: 98,
    logisticsCostInr: 5200,
    matchScore: 91,
    highway: 'Delhi-Panipat Expressway'
  },
  {
    sellerCity: 'Bhiwadi',
    sellerState: 'Rajasthan',
    sellerCompany: 'Apex Auto Components',
    material: 'Filtered Hydraulic Oil (1,200 Litres)',
    buyerCity: 'Manesar',
    buyerState: 'Haryana',
    buyerCompany: 'Supreme PolyPlast Ltd',
    distanceKm: 48,
    logisticsCostInr: 3400,
    matchScore: 93,
    highway: 'Delhi-Jaipur Highway (NH 48)'
  },
  {
    sellerCity: 'Bathinda',
    sellerState: 'Punjab',
    sellerCompany: 'Shree Ram Thermal & Power',
    material: 'Dry Class F Fly Ash (45 Tonnes)',
    buyerCity: 'Rajpura',
    buyerState: 'Punjab',
    buyerCompany: 'Green Biomass & Mortar',
    distanceKm: 165,
    logisticsCostInr: 7800,
    matchScore: 88,
    highway: 'Bathinda-Patiala Corridor'
  },
  {
    sellerCity: 'Dahej',
    sellerState: 'Gujarat',
    sellerCompany: 'Gujarat Chemical Synthetics',
    material: 'Distilled Hydrochloric Acid (3,000 L)',
    buyerCity: 'Surat',
    buyerState: 'Gujarat',
    buyerCompany: 'Surat Dyeing & Chemicals',
    distanceKm: 112,
    logisticsCostInr: 6100,
    matchScore: 86,
    highway: 'Golden Corridor NH 48'
  },
  {
    sellerCity: 'Pune',
    sellerState: 'Maharashtra',
    sellerCompany: 'National Heavy Engineering',
    material: 'Spent Foundry Green Sand (30 Tonnes)',
    buyerCity: 'Mumbai',
    buyerState: 'Maharashtra',
    buyerCompany: 'Western Infrastructure Aggregates',
    distanceKm: 148,
    logisticsCostInr: 7200,
    matchScore: 89,
    highway: 'Mumbai-Pune Expressway'
  }
];

export const LocationMatchingPage = () => {
  const [selectedCorridor, setSelectedCorridor] = useState(CORRIDOR_PRESETS[0]);
  const [customWeight, setCustomWeight] = useState(10);

  const estimatedFreight = Math.round(1200 + (Number(customWeight) * selectedCorridor.distanceKm * 3.8));
  const estimatedFuelLitres = Math.round((selectedCorridor.distanceKm / 4.2) * (1 + (customWeight / 50)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Industrial Logistics & Corridor Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Location-Based Matching & Freight Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Analyze proximity matching, transit route economics, and hauler costs across India's premier manufacturing belts.
          </p>
        </div>
      </div>

      {/* Preset Corridors Horizontal Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Select Verified Industrial Freight Corridor:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CORRIDOR_PRESETS.map((corr, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCorridor(corr)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                selectedCorridor.sellerCity === corr.sellerCity && selectedCorridor.buyerCity === corr.buyerCity
                  ? 'border-brand-600 bg-brand-50/50 shadow-sm ring-2 ring-brand-200'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {corr.sellerCity} ➔ {corr.buyerCity}
                </span>
                <span className="bg-brand-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                  {corr.matchScore}% MATCH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{corr.material}</p>
              <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                <span>Distance: <strong>{corr.distanceKm} km</strong></span>
                <span>Logistics: <strong>₹{corr.logisticsCostInr.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor Analysis Details & Visual Map Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Route Diagram Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">ROUTE LOGISTICS ANALYSIS</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedCorridor.sellerCity} ({selectedCorridor.sellerState}) ➔ {selectedCorridor.buyerCity} ({selectedCorridor.buyerState})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedCorridor.highway}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">COMPATIBILITY</span>
              <span className="text-2xl font-black text-brand-700">{selectedCorridor.matchScore}%</span>
            </div>
          </div>

          {/* Graphical Route Schematic */}
          <div className="bg-gradient-to-r from-slate-900 via-charcoal-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between relative z-10">
              {/* Origin Hub */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                  A
                </div>
                <div className="font-bold text-sm">{selectedCorridor.sellerCity}</div>
                <div className="text-[10px] text-slate-400">{selectedCorridor.sellerCompany}</div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-brand-300">Origin Generator</span>
              </div>

              {/* Transit Highway Animation */}
              <div className="flex-1 px-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-slate-600" />
                  <div className="absolute bg-charcoal-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 shadow">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>{selectedCorridor.distanceKm} KM</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-3 font-medium">{selectedCorridor.highway}</span>
              </div>

              {/* Destination Hub */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                  B
                </div>
                <div className="font-bold text-sm">{selectedCorridor.buyerCity}</div>
                <div className="text-[10px] text-slate-400">{selectedCorridor.buyerCompany}</div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-blue-300">Target Recycler</span>
              </div>
            </div>
          </div>

          {/* Dynamic Weight Sensitivity Slider */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Adjust Payload Weight for Dynamic Quote:</span>
              <strong className="text-brand-700">{customWeight} Tonnes</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 Tonne (Small Truck)</span>
              <span>25 Tonnes (Multi-axle)</span>
              <span>50 Tonnes (Bulk Hauler)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Economics & Match Score Breakdown Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Freight & Economics Breakdown</h3>
            <p className="text-slate-500 mt-0.5">Estimated logistics tariffs and carbon emissions.</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Estimated Logistics Fee:</span>
              <strong className="text-base font-black text-brand-700">₹{estimatedFreight.toLocaleString('en-IN')}</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Freight Rate per Tonne-Km:</span>
              <strong className="text-slate-900">₹3.80 / T-km</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Transit Diesel Fuel Estimate:</span>
              <strong className="text-slate-900">{estimatedFuelLitres} Litres</strong>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-900 font-semibold">Net Recovered Advantage:</span>
              <strong className="text-emerald-800 font-extrabold text-sm">+84% vs Long-Haul Disposal</strong>
            </div>
          </div>

          {/* 4 Match Breakdown Criteria (Prompt Example) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Proximity Match Factors:</span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Short road haul: {selectedCorridor.distanceKm} km (under 200 km threshold)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Fast round-trip turnaround: ~{Math.round(selectedCorridor.distanceKm / 45)} hours transit</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Freight quote ₹{estimatedFreight.toLocaleString('en-IN')} leaves high net positive margin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
