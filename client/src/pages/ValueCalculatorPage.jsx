import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Truck,
  Leaf,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Scale
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculatorAPI } from '../services/api';

export const ValueCalculatorPage = () => {
  const [presets, setPresets] = useState([]);
  const [material, setMaterial] = useState('Rice Husk');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('tonne');
  const [disposalCost, setDisposalCost] = useState(20000);
  const [marketPrice, setMarketPrice] = useState(4500);
  const [transportCost, setTransportCost] = useState(8000);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  useEffect(() => {
    computeValue();
  }, [material, quantity, disposalCost, marketPrice, transportCost]);

  const loadPresets = async () => {
    try {
      const res = await calculatorAPI.getPresets();
      setPresets(res.data || []);
    } catch (err) {
      console.warn('Failed to load presets');
    }
  };

  const handleSelectPreset = (p) => {
    setMaterial(p.material);
    setUnit(p.unit);
    setQuantity(p.defaultQty);
    setDisposalCost(p.disposalCostPerUnit * p.defaultQty);
    setMarketPrice(p.marketPricePerUnit);
    setTransportCost(p.transportCostPerUnit * p.defaultQty);
  };

  const computeValue = async () => {
    try {
      const res = await calculatorAPI.compute({
        material,
        quantity: Number(quantity),
        unit,
        currentDisposalCost: Number(disposalCost),
        estimatedMarketPrice: Number(marketPrice),
        transportationCost: Number(transportCost)
      });
      setResult(res.data);
    } catch (err) {
      console.error('Computation error:', err);
    }
  };

  const chartData = result ? [
    { name: 'Disposal Loss', amount: result.currentDisposalCost, color: '#f43f5e' },
    { name: 'Gross Revenue', amount: result.potentialSellingRevenue, color: '#3b82f6' },
    { name: 'Logistics', amount: result.transportationCost, color: '#f59e0b' },
    { name: 'Net Recovered', amount: result.netEconomicValue, color: '#10b981' }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-charcoal-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-brand-400" />
            <span>Industrial Circular Economics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Industrial Waste Value Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Calculate your exact economic swing from converting landfill disposal costs into net cashflow revenue by selling to B2B recyclers.
          </p>
        </div>
      </div>

      {/* Quick Material Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Quick Preset Templates (Industrial Baselines):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                material.toLowerCase() === p.material.toLowerCase()
                  ? 'bg-brand-700 text-white shadow-sm ring-2 ring-brand-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {p.material} ({p.defaultQty} {p.unit})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dynamic Inputs */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Input Production Parameters</h3>
            <p className="text-slate-500 mt-0.5">Adjust volumes and costs for real-time recalculation.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Waste Material Stream</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Generated Volume</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-sm"
              >
                <option value="tonne">Tonnes</option>
                <option value="kg">Kilograms (KG)</option>
                <option value="litre">Litres</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Current Disposal / Dumping Cost (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                value={disposalCost}
                onChange={(e) => setDisposalCost(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-sm text-rose-700"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Landfill tipping fee, incinerator charges, or disposal contractors.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Estimated Market Selling Price per {unit} (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                value={marketPrice}
                onChange={(e) => setMarketPrice(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-sm text-brand-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Transportation & Handling Cost (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                value={transportCost}
                onChange={(e) => setTransportCost(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold text-sm text-amber-700"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Economic Outputs & Charts */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Highlight Banner Required in Hackathon Prompt */}
              <div className="bg-gradient-to-r from-emerald-800 to-brand-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-limeaccent-400 bg-black/20 px-3 py-1 rounded-full border border-limeaccent-400/30">
                  ECONOMIC RECOVERY ESTIMATE
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                  Net Recovered Value: <span className="text-limeaccent-400">₹{result.netEconomicValue?.toLocaleString('en-IN')}</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-200 border-l-2 border-limeaccent-400 pl-3 leading-relaxed font-medium">
                  {result.summaryText}
                </blockquote>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Disposal Cost</span>
                  <strong className="text-lg font-extrabold text-rose-600">
                    ₹{result.currentDisposalCost?.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Eliminated expense</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Gross Selling</span>
                  <strong className="text-lg font-extrabold text-blue-600">
                    ₹{result.potentialSellingRevenue?.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Top-line revenue</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Transportation</span>
                  <strong className="text-lg font-extrabold text-amber-600">
                    ₹{result.transportationCost?.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Freight deduction</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-brand-200 shadow-sm text-center bg-brand-50/50">
                  <span className="text-[10px] text-brand-700 font-bold uppercase block mb-1">CO₂ Avoided</span>
                  <strong className="text-lg font-extrabold text-brand-800">
                    {result.co2AvoidedKg?.toLocaleString('en-IN')} kg
                  </strong>
                  <span className="text-[10px] text-brand-600 block mt-0.5">Carbon abatement</span>
                </div>
              </div>

              {/* Visual Cashflow Comparison Bar Chart */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Financial Comparison Breakdown (INR)
                  </h4>
                  <span className="text-[11px] text-slate-400">Current Loss vs Circular Profit</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action CTA to List Waste */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Turn this estimate into real cash?</h4>
                  <p className="text-[11px] text-slate-500">List this lot on Waste2Market in under 2 minutes.</p>
                </div>
                <Link
                  to="/list-waste"
                  className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>List Waste Lot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
