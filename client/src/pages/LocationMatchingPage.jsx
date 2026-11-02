import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Sparkles,
  ArrowRight,
  Building2,
  DollarSign,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Scale,
  Award,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { WasteLogisticsMap } from '../components/maps/WasteLogisticsMap';

// Industrial Waste Scenario Presets for Hackathon Demonstration
const WASTE_SCENARIOS = [
  {
    id: 'rice-husk-ludhiana',
    title: 'Paddy Rice Husk (High Calorific Agro By-product)',
    material: 'Paddy Rice Husk (10 Tonnes)',
    quantity: 10,
    unit: 'Tonnes',
    avoidedLandfillCostInr: 12000,
    supplier: {
      companyName: 'Punjab Rice Industries',
      industry: 'Agro Processing & Rice Milling',
      city: 'Ludhiana',
      state: 'Punjab',
      address: 'Focal Point Phase V, Ludhiana',
      material: 'Rice Husk (Grade A parboiled, <9% moisture)',
      quantity: 10,
      unit: 'Tonnes',
      verified: true
    },
    buyers: [
      {
        id: 'buyer-green-biomass',
        companyName: 'Green Biomass Energy Ltd',
        industry: 'Biofuel & Renewable Power',
        city: 'Rajpura',
        state: 'Punjab',
        distanceKm: 85,
        highway: 'NH 44 (Grand Trunk Corridor)',
        pricePerTonne: 4500,
        totalGrossOffer: 45000,
        logisticsCostInr: 4430,
        netValueInr: 40570,
        netValuePerTonne: 4057,
        matchScore: 96,
        isBestValue: true,
        verified: true,
        rating: 4.9,
        turnaroundTime: '1 hr 45 min',
        description: 'Needs continuous bulk agro-husk for 15 MW biomass cogen plant. Highest net margin after transport.'
      },
      {
        id: 'buyer-northern-bio',
        companyName: 'Northern Bio-Fertilizers',
        industry: 'Organic Fertilizer & Soil Amendments',
        city: 'Karnal',
        state: 'Haryana',
        distanceKm: 142,
        highway: 'NH 44 (Trans-Haryana Trunk)',
        pricePerTonne: 4700, // Higher quoted price, but further away!
        totalGrossOffer: 47000,
        logisticsCostInr: 7800,
        netValueInr: 39200,
        netValuePerTonne: 3920,
        matchScore: 89,
        isBestValue: false,
        verified: true,
        rating: 4.8,
        turnaroundTime: '3 hr 10 min',
        description: 'Offers ₹200 more per tonne, but additional 57 km road haul eats ₹3,370 in diesel & tolls!'
      },
      {
        id: 'buyer-maha-clean',
        companyName: 'Maha Clean Energy Corp',
        industry: 'Gasification & Industrial Biofuels',
        city: 'Yamunanagar',
        state: 'Haryana',
        distanceKm: 138,
        highway: 'State Highway 1 & NH 344',
        pricePerTonne: 4200,
        totalGrossOffer: 42000,
        logisticsCostInr: 7550,
        netValueInr: 34450,
        netValuePerTonne: 3445,
        matchScore: 83,
        isBestValue: false,
        verified: true,
        rating: 4.7,
        turnaroundTime: '3 hr 05 min',
        description: 'Lower quote and medium-distance freight yields lowest net realized value.'
      }
    ]
  },
  {
    id: 'fly-ash-bathinda',
    title: 'Dry Class F Fly Ash (IS:3812 Certified)',
    material: 'Electrostatic Precipitator Fly Ash (40 Tonnes)',
    quantity: 40,
    unit: 'Tonnes',
    avoidedLandfillCostInr: 18000,
    supplier: {
      companyName: 'Shree Ram Thermal & Power',
      industry: 'Thermal Power & Pozzolanic Minerals',
      city: 'Bathinda',
      state: 'Punjab',
      address: 'Thermal Road Industrial Zone, Bathinda',
      material: 'Dry Class F Fly Ash (>55% reactive silica)',
      quantity: 40,
      unit: 'Tonnes',
      verified: true
    },
    buyers: [
      {
        id: 'buyer-rajpura-cement',
        companyName: 'Green Biomass & Mortar Works',
        industry: 'PPC Ready Mix & Precast Concrete',
        city: 'Rajpura',
        state: 'Punjab',
        distanceKm: 165,
        highway: 'Bathinda-Patiala-Rajpura Corridor',
        pricePerTonne: 1250,
        totalGrossOffer: 50000,
        logisticsCostInr: 16800,
        netValueInr: 33200,
        netValuePerTonne: 830,
        matchScore: 94,
        isBestValue: true,
        verified: true,
        rating: 4.8,
        turnaroundTime: '3 hr 40 min',
        description: 'Immediate bulk tanker unloading capacity. High volume absorption.'
      },
      {
        id: 'buyer-ludhiana-brick',
        companyName: 'Ludhiana Eco AAC Blocks',
        industry: 'Autoclaved Lightweight Blocks',
        city: 'Ludhiana',
        state: 'Punjab',
        distanceKm: 132,
        highway: 'NH 7 & NH 5',
        pricePerTonne: 1100,
        totalGrossOffer: 44000,
        logisticsCostInr: 14200,
        netValueInr: 29800,
        netValuePerTonne: 745,
        matchScore: 88,
        isBestValue: false,
        verified: true,
        rating: 4.6,
        turnaroundTime: '2 hr 55 min',
        description: 'Closer distance but lower base quote yields lower net profit.'
      }
    ]
  },
  {
    id: 'hydraulic-oil-bhiwadi',
    title: 'Filtered Used Hydraulic Oil (ISO VG 46/68)',
    material: 'Recovered Machine Hydraulic Fluid (1,200 L)',
    quantity: 1.2,
    unit: 'Tonnes',
    avoidedLandfillCostInr: 8500,
    supplier: {
      companyName: 'Apex Auto Components',
      industry: 'Automotive Precision Press Stamping',
      city: 'Bhiwadi',
      state: 'Rajasthan',
      address: 'RIICO Industrial Area Phase III, Bhiwadi',
      material: 'Filtered Hydraulic Fluid (<0.8% moisture)',
      quantity: 1.2,
      unit: 'Tonnes',
      verified: true
    },
    buyers: [
      {
        id: 'buyer-supreme-poly',
        companyName: 'Supreme PolyPlast Ltd',
        industry: 'Industrial Lubricant Reprocessing',
        city: 'Manesar',
        state: 'Haryana',
        distanceKm: 48,
        highway: 'NH 48 (Delhi-Jaipur Expressway)',
        pricePerTonne: 28000,
        totalGrossOffer: 33600,
        logisticsCostInr: 3200,
        netValueInr: 30400,
        netValuePerTonne: 25333,
        matchScore: 97,
        isBestValue: true,
        verified: true,
        rating: 4.9,
        turnaroundTime: '1 hr 10 min',
        description: 'Short express highway haul ensures maximum value preservation.'
      },
      {
        id: 'buyer-okhla-oil',
        companyName: 'EcoCycle Recyclers',
        industry: 'Solvent & Lube Re-refining',
        city: 'Okhla',
        state: 'Delhi',
        distanceKm: 76,
        highway: 'NH 48 & Outer Ring Road',
        pricePerTonne: 29000,
        totalGrossOffer: 34800,
        logisticsCostInr: 5100,
        netValueInr: 29700,
        netValuePerTonne: 24750,
        matchScore: 90,
        isBestValue: false,
        verified: true,
        rating: 4.8,
        turnaroundTime: '2 hr 15 min',
        description: 'City toll congestion and longer transit reduces overall payout.'
      }
    ]
  }
];

export const LocationMatchingPage = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const currentScenario = WASTE_SCENARIOS[selectedScenarioIndex];

  const [selectedBuyerId, setSelectedBuyerId] = useState(currentScenario.buyers[0].id);
  const [customPayloadWeight, setCustomPayloadWeight] = useState(currentScenario.quantity);

  // Sync selected buyer when scenario changes
  const handleScenarioChange = (idx) => {
    setSelectedScenarioIndex(idx);
    setSelectedBuyerId(WASTE_SCENARIOS[idx].buyers[0].id);
    setCustomPayloadWeight(WASTE_SCENARIOS[idx].quantity);
  };

  const selectedBuyer =
    currentScenario.buyers.find((b) => b.id === selectedBuyerId) || currentScenario.buyers[0];
  const bestValueBuyer =
    currentScenario.buyers.find((b) => b.isBestValue) || currentScenario.buyers[0];

  // Dynamic calculations based on slider weight
  const dynamicFreightCost = Math.round(
    1400 + Number(customPayloadWeight) * selectedBuyer.distanceKm * 3.8
  );
  const dynamicGrossValue = Math.round(Number(customPayloadWeight) * selectedBuyer.pricePerTonne);
  const dynamicNetValue = dynamicGrossValue - dynamicFreightCost;
  const estimatedDieselLitres = Math.round(
    (selectedBuyer.distanceKm / 4.1) * (1 + customPayloadWeight / 60)
  );

  // External Google Maps directions URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${currentScenario.supplier.companyName}, ${currentScenario.supplier.city}, ${currentScenario.supplier.state}`
  )}&destination=${encodeURIComponent(
    `${selectedBuyer.companyName}, ${selectedBuyer.city}, ${selectedBuyer.state}`
  )}&travelmode=driving`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. HERO TITLE HEADER */}
      <div className="bg-gradient-to-r from-charcoal-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Waste Logistics Map • Real Road Network Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Waste Logistics Map & Value Optimization Engine
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            In industrial circular waste, distance eats margins. We evaluate real road network
            distances, toll tariffs, and hauling fees across India's premier industrial clusters to
            recommend the single <strong>most profitable buyer</strong>.
          </p>
        </div>
      </div>

      {/* 2. INDUSTRIAL SCENARIOS SELECTOR TABS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            Select Active Waste Supply Stream:
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Showing Northern India Manufacturing Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {WASTE_SCENARIOS.map((scen, idx) => (
            <button
              key={scen.id}
              type="button"
              onClick={() => handleScenarioChange(idx)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                selectedScenarioIndex === idx
                  ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-200 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                <span className="truncate">{scen.supplier.companyName}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                  {scen.supplier.city}
                </span>
              </div>
              <p className="text-[11px] text-brand-700 font-semibold truncate">{scen.title}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/60">
                <span>Lot: <strong>{scen.quantity} {scen.unit}</strong></span>
                <span className="text-emerald-700 font-bold">{scen.buyers.length} Matched Buyers</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. CORE USP BANNER: "BEST VALUE MATCH" */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>The Waste2Market Advantage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
            ♻️ BEST VALUE MATCH: “We don't just find a buyer. We find the most valuable buyer.”
          </h2>
          <p className="text-xs text-emerald-100 max-w-2xl">
            A buyer offering ₹200 more per tonne 140 km away leaves you with less profit than a
            closer buyer due to transit diesel and highway tolls. Waste2Market computes the exact
            true net margin.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[220px]">
          <span className="text-[10px] uppercase font-bold text-emerald-200 block">
            Recommended Highest Net Value
          </span>
          <div className="text-2xl font-black text-white mt-0.5">
            ₹{bestValueBuyer.netValueInr.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-bold text-amber-300 block mt-0.5">
            {bestValueBuyer.companyName} ({bestValueBuyer.city})
          </span>
        </div>
      </div>

      {/* 4. MAIN MAP WORKSPACE: LEFT PANEL (USP COMPARISON & LISTING) + RIGHT PANEL (LARGE GOOGLE MAP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL (5 COLS): LISTING SPECS & MULTI-BUYER NET VALUE EVALUATOR */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Listing Spec Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">ORIGIN SUPPLIER</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentScenario.supplier.companyName}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentScenario.supplier.city}, {currentScenario.supplier.state}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Supplier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Material Stream</span>
                <strong className="text-slate-900 font-bold truncate block">
                  {currentScenario.title}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Batch Quantity</span>
                <strong className="text-brand-700 font-extrabold text-sm block">
                  {currentScenario.quantity} {currentScenario.unit}
                </strong>
              </div>
            </div>

            {/* Dynamic Payload Slider */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Evaluate Truck Payload:</span>
                <strong className="text-brand-700">{customPayloadWeight} Tonnes</strong>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={customPayloadWeight}
                onChange={(e) => setCustomPayloadWeight(e.target.value)}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Small Truck (1T)</span>
                <span>Standard (10T)</span>
                <span>Heavy Hauler (50T)</span>
              </div>
            </div>
          </div>

          {/* MULTI-BUYER COMPARISON LIST (The Core USP Demonstration) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Candidate Buyer Comparison
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select a buyer to update route visualization on Google Maps
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {currentScenario.buyers.length} Offers
              </span>
            </div>

            <div className="space-y-3">
              {currentScenario.buyers.map((buyer, bIdx) => {
                const isSelected = buyer.id === selectedBuyerId;
                const isBest = buyer.isBestValue;

                // Scaled dynamically by payload
                const buyerGross = Math.round(Number(customPayloadWeight) * buyer.pricePerTonne);
                const buyerFreight = Math.round(
                  1400 + Number(customPayloadWeight) * buyer.distanceKm * 3.8
                );
                const buyerNet = buyerGross - buyerFreight;

                return (
                  <div
                    key={buyer.id}
                    onClick={() => setSelectedBuyerId(buyer.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative space-y-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-200'
                        : isBest
                        ? 'border-amber-400/80 bg-amber-50/30 hover:border-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">
                            {bIdx + 1}. {buyer.companyName}
                          </h4>
                          {isBest && (
                            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" /> Best Value
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {buyer.city}, {buyer.state} • {buyer.distanceKm} km ({buyer.highway})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          MATCH
                        </span>
                        <span className="text-xs font-black text-brand-700">
                          {buyer.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Matrix */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Offer / Tonne</span>
                        <strong className="text-slate-800">
                          ₹{buyer.pricePerTonne.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Transport Cost</span>
                        <strong className="text-rose-600">
                          -₹{buyerFreight.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">True Net Value</span>
                        <strong className={`font-black ${isBest ? 'text-amber-700' : 'text-emerald-700'}`}>
                          ₹{buyerNet.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {/* Explanatory note */}
                    <p className="text-[10px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-200/50">
                      💡 {buyer.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (7 COLS): LARGE REAL GOOGLE MAPS COMPONENT + LIVE ROUTE METRICS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real Google Map Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Active Road Transit: {currentScenario.supplier.city} ➔ {selectedBuyer.city}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Routing via {selectedBuyer.highway}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Map Canvas Component */}
            <WasteLogisticsMap
              supplier={currentScenario.supplier}
              buyers={currentScenario.buyers}
              selectedBuyerId={selectedBuyerId}
              onSelectBuyer={(id) => setSelectedBuyerId(id)}
              routeInfo={{
                distanceKm: selectedBuyer.distanceKm,
                durationText: selectedBuyer.turnaroundTime,
                logisticsCostInr: dynamicFreightCost
              }}
            />
          </div>

          {/* Real Route Economics & Environmental Metrics */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Calculated Road Haul
              </span>
              <div className="text-2xl font-black text-blue-900">
                {selectedBuyer.distanceKm} km
              </div>
              <span className="text-[11px] text-blue-700 block">
                ~{selectedBuyer.turnaroundTime} transit duration
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Estimated Freight Tariff
              </span>
              <div className="text-2xl font-black text-slate-900">
                ₹{dynamicFreightCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 block">
                ₹3.80/T-km + ₹1,400 base handling
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Avoided Landfill Penalty
              </span>
              <div className="text-2xl font-black text-emerald-900">
                +₹{currentScenario.avoidedLandfillCostInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-700 block">
                Net circular ESG credit earned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
