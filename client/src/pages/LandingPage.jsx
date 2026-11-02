import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Recycle,
  Factory,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Scale,
  CheckCircle2,
  Building2,
  ArrowDown,
  Layers,
  ChevronRight,
  MapPin,
  Truck
} from 'lucide-react';
import { listingAPI, impactAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const LandingPage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [stats, setStats] = useState({
    wasteDivertedKg: 12450,
    economicValueCreatedInr: 840000,
    businessesConnected: 126,
    materialReuseRate: 78.4
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listRes, impactRes] = await Promise.all([
        listingAPI.getListings({ limit: 4 }),
        impactAPI.getSummary()
      ]);
      setFeaturedListings(listRes.data?.slice(0, 4) || []);
      if (impactRes.data) {
        setStats(impactRes.data);
      }
    } catch (err) {
      console.warn('Landing data fallback');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-charcoal-800">
        {/* Decorative Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Next-Gen B2B Circular Economy Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            TURN WASTE <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-limeaccent-400 bg-clip-text text-transparent">
              INTO VALUE.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-slate-300 max-w-3xl mx-auto">
            Connect industrial waste with industries that need it.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Waste2Market is a B2B circular economy marketplace that helps industries sell, source, reuse and monetize industrial waste and by-products.
            <span className="text-brand-300 font-semibold block mt-1">
              "One industry's waste can be another industry's raw material."
            </span>
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-brand-900/40 hover:shadow-xl transition-all flex items-center gap-2 group"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/list-waste"
              className="px-7 py-4 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-100 font-bold text-sm border border-charcoal-700 hover:border-slate-500 shadow-md transition-all flex items-center gap-2"
            >
              <span>List Your Waste</span>
              <ChevronRight className="w-4 h-4 text-brand-400" />
            </Link>

            <Link
              to="/corridors"
              className="px-6 py-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-sm border border-blue-400/30 hover:border-blue-400/50 transition-all flex items-center gap-2 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Waste Logistics Map</span>
            </Link>
          </div>
        </div>

        {/* VISUAL FLOW DIAGRAM: Industry -> Waste -> Waste2Market -> Matching Engine -> Buyer -> Value */}
        <div className="max-w-5xl mx-auto mt-16 pt-10 border-t border-charcoal-800/80">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-400">
              The Closed-Loop Circular Flow
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {/* Step 1 */}
            <div className="bg-charcoal-800/60 border border-charcoal-700/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Factory className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase">Industry</div>
              <p className="text-[10px] text-slate-400 mt-1">Generates by-products</p>
            </div>

            {/* Step 2 */}
            <div className="bg-charcoal-800/60 border border-charcoal-700/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Scale className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase">Waste Stream</div>
              <p className="text-[10px] text-slate-400 mt-1">Husk, ash, scrap, oil</p>
            </div>

            {/* Step 3 */}
            <div className="bg-brand-950/60 border border-brand-700/60 rounded-xl p-3.5 backdrop-blur-sm ring-1 ring-brand-500/40">
              <Recycle className="w-6 h-6 text-brand-400 mx-auto mb-2 animate-spin-slow" />
              <div className="text-xs font-bold text-white uppercase">Waste2Market</div>
              <p className="text-[10px] text-brand-300 mt-1">B2B Platform</p>
            </div>

            {/* Step 4 */}
            <div className="bg-charcoal-800/60 border border-charcoal-700/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Cpu className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase">Matching Engine</div>
              <p className="text-[10px] text-slate-400 mt-1">6-Factor algorithm</p>
            </div>

            {/* Step 5 */}
            <div className="bg-charcoal-800/60 border border-charcoal-700/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Building2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase">Buyer Industry</div>
              <p className="text-[10px] text-slate-400 mt-1">Recycler / Processor</p>
            </div>

            {/* Step 6 */}
            <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-emerald-300 uppercase">Value Created</div>
              <p className="text-[10px] text-slate-300 mt-1">Revenue + Zero landfill</p>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="text-center pt-4 lg:pt-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              WASTE DIVERTED
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {stats.wasteDivertedKg?.toLocaleString('en-IN')} <span className="text-brand-600 text-xl font-bold">KG</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Diverted from industrial dumping</p>
          </div>

          <div className="text-center pt-4 lg:pt-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              ECONOMIC VALUE CREATED
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-emerald-700">
              ₹{(stats.economicValueCreatedInr / 100000).toFixed(1)} <span className="text-xl font-bold">LAKH</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Recovered net cashflow</p>
          </div>

          <div className="text-center pt-4 lg:pt-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              BUSINESSES CONNECTED
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-brand-700">
              {stats.businessesConnected}+
            </div>
            <p className="text-xs text-slate-500 mt-1">Verified manufacturing plants</p>
          </div>

          <div className="text-center pt-4 lg:pt-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              MATERIAL REUSE RATE
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-indigo-700">
              {stats.materialReuseRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Circular throughput efficiency</p>
          </div>
        </div>
      </section>

      {/* FEATURED INDUSTRIAL LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>LIVE INDUSTRIAL FEEDSTOCK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Available By-Products & Waste Streams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Industrial grade listings verified for purity, moisture specifications, and immediate dispatch.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 group"
          >
            <span>View All 22+ Material Lots</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-charcoal-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {item.category_name}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge type="grade" status={item.quality_grade} />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{item.seller_company_name}</span>
                    <span>•</span>
                    <span>{item.city}, {item.state}</span>
                  </p>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Lot</span>
                      <span className="text-sm font-extrabold text-slate-800">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Price</span>
                      <span className="text-sm font-extrabold text-brand-700">
                        ₹{item.price_per_unit_inr?.toLocaleString('en-IN')}/{item.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/marketplace/${item.id}`}
                    className="flex-1 py-2 text-center bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/matching?listingId=${item.id}`}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                    title="Find Matching Buyers"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY WASTE2MARKET / VALUE PROPOSITION */}
      <section className="bg-slate-100/70 border-y border-slate-200/90 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              CIRCULAR ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Why Indian Industries Choose Waste2Market
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Transforming costly regulatory waste burdens into high-margin recovered revenue streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Net Recovered Revenue</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stop paying ₹15,000–₹50,000/month for landfill dumping and incineration permits. Convert agro husks, plastic offcuts, and foundry sands directly into cashflow.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Smart Matching Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic 6-factor algorithm matches exact chemical categories, volume windows, transit radii, and price thresholds to find buyers with 90%+ compatibility.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Verified B2B Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated Pollution Control Board verification simulation, audited freight logs, and milestone status contracts for corporate ESG and Scope 3 reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED INDUSTRIES / CIRCULAR EXAMPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            CROSS-INDUSTRY SYNERGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Real Industrial Symbiosis in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How divergent manufacturing sectors cross-pollinate raw materials through Waste2Market:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              01
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Rice Mill ➔ Biomass Energy Plant</h4>
              <p className="text-xs text-slate-600 mt-1">
                A food-processing mill in Ludhiana produces 10 tonnes of rice husk. Rather than paying dumping fees, Green Biomass Energy procures it as carbon-neutral boiler feedstock.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹45,000 Value Recovered • 18,000 kg CO₂ Avoided</span>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              02
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Plastic Molder ➔ Polyester Yarn Spinner</h4>
              <p className="text-xs text-slate-600 mt-1">
                Supreme PolyPlast in Manesar trims 4 tonnes of clear PET bottle scrap. EcoCycle pellets it for yarn spinners who manufacture recycled fleeces and athletic shoes.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹244,000 Value Recovered • 10,000 kg CO₂ Avoided</span>
              </div>
            </div>
          </div>

          {/* Example 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              03
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Thermal Power Plant ➔ Green Cement Manufacturer</h4>
              <p className="text-xs text-slate-600 mt-1">
                Bathinda power plant discharges 45 tonnes of siliceous dry fly ash. Shree Ram Cement incorporates it as pozzolanic binder in eco-friendly PPC mortar.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹51,750 Value Recovered • 40,500 kg CO₂ Avoided</span>
              </div>
            </div>
          </div>

          {/* Example 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              04
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">E-Commerce Packaging ➔ Duplex Paper Mill</h4>
              <p className="text-xs text-slate-600 mt-1">
                FMCG fulfillment centers bundle 8 tonnes of corrugated cardboard boxes. Jaipur Paper pulps the OCC fiber to produce 100% recycled carton fluting boards.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹112,000 Value Recovered • 11,200 kg CO₂ Avoided</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-charcoal-900 to-brand-950 rounded-3xl p-10 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-brand-800">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Monetize Your Industrial Waste?
            </h2>
            <p className="text-sm text-slate-300">
              Join 126+ forward-thinking manufacturing facilities across Punjab, Haryana, Delhi NCR, and Rajasthan converting industrial by-products into high-value raw materials.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/list-waste"
                className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-charcoal-950 font-bold text-xs shadow-lg transition-all"
              >
                List Your Waste Lot Now
              </Link>
              <Link
                to="/calculator"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                Calculate Potential Recovery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
