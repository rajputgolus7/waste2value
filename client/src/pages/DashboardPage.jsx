import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Scale,
  Handshake,
  Leaf,
  DollarSign,
  PlusCircle,
  Sparkles,
  RefreshCw,
  Building2,
  PackageCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { impactAPI, listingAPI, dealAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

const PIE_COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export const DashboardPage = () => {
  const { user, isSeller } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await impactAPI.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syncing Enterprise Analytics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};
  const recentListings = data?.recentListings || [];
  const recentDeals = data?.recentDeals || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              OPERATIONAL INTELLIGENCE
            </span>
            {user?.is_verified ? (
              <StatusBadge type="verified" status="VERIFIED" />
            ) : null}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {user?.company_name || 'Enterprise'} Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time material flows, closed deals, recovered revenue, and environmental diversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboard}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          <Link
            to="/list-waste"
            className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-limeaccent-400" />
            <span>List New Waste</span>
          </Link>
        </div>
      </div>

      {/* 7 KPI Metric Cards (As specified in Hackathon prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* Card 1: Total Waste Listed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Waste Listed</span>
          <div className="text-xl font-extrabold text-slate-900">{metrics.totalWasteListedTonnes || 0} <span className="text-xs font-normal text-slate-500">T</span></div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Active & archived lots</span>
        </div>

        {/* Card 2: Total Waste Sold */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Waste Sold</span>
          <div className="text-xl font-extrabold text-brand-700">{metrics.totalWasteSoldTonnes || 0} <span className="text-xs font-normal text-slate-500">T</span></div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Commercial contracts</span>
        </div>

        {/* Card 3: Revenue Generated */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Revenue Generated</span>
          <div className="text-xl font-extrabold text-emerald-700">₹{(metrics.revenueGeneratedInr || 0).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Recovered cashflow</span>
        </div>

        {/* Card 4: Active Deals */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Active Deals</span>
          <div className="text-xl font-extrabold text-blue-700">{metrics.activeDealsCount || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">In negotiation/transit</span>
        </div>

        {/* Card 5: Waste Diverted */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Waste Diverted</span>
          <div className="text-xl font-extrabold text-indigo-700">{(metrics.wasteDivertedKg || 0).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">kg</span></div>
          <span className="text-[10px] text-slate-400 block mt-0.5">From landfill</span>
        </div>

        {/* Card 6: CO2 Impact */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">CO₂ Impact</span>
          <div className="text-xl font-extrabold text-emerald-600">{(metrics.co2ImpactKg || 0).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">kg</span></div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Emissions avoided</span>
        </div>

        {/* Card 7: Successful Matches */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Matches Found</span>
          <div className="text-xl font-extrabold text-amber-600">{metrics.successfulMatchesCount || 4}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">90%+ compatible</span>
        </div>
      </div>

      {/* Charts Grid: Category Breakdown + Monthly Revenue & Waste Diverted */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Donut Chart: Waste by Category */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Waste by Category</h3>
              <p className="text-[11px] text-slate-400">Stream distribution by volume</p>
            </div>
            <span className="text-xs font-bold text-brand-700 font-mono">TONNES</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.categoryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} Tonnes`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {(charts.categoryBreakdown || []).map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-slate-600 truncate">{cat.name}</span>
                <strong className="text-slate-900 ml-auto">{cat.value}t</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Area & Bar Chart: Monthly Transactions & Diverted Volume */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Revenue & Waste Diverted</h3>
              <p className="text-[11px] text-slate-400">Cumulative circular cashflow growth</p>
            </div>
            <span className="text-xs font-bold text-emerald-700">₹ INR / Tonnes</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyRevenue || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Listings & Deals Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Listings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Your Active Material Lots</h3>
            <Link to="/marketplace" className="text-xs font-bold text-brand-700 hover:text-brand-800">
              Explore All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentListings.length > 0 ? (
              recentListings.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{l.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{l.quantity} {l.unit} • ₹{l.price_per_unit_inr}/{l.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={l.status} />
                    <Link
                      to={`/marketplace/${l.id}`}
                      className="p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-slate-400">No active listings yet</p>
            )}
          </div>
        </div>

        {/* Active Deals Tracking */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Deals & Transactions</h3>
            <Link to="/deals" className="text-xs font-bold text-brand-700 hover:text-brand-800">
              Manage Deals
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentDeals.length > 0 ? (
              recentDeals.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{d.deal_code}</span>
                    <h4 className="font-bold text-slate-900 text-xs mt-0.5">{d.listing_title}</h4>
                    <p className="text-slate-500 text-[11px]">Value: ₹{d.total_deal_value_inr?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="deal" status={d.status} />
                    <Link
                      to="/deals"
                      className="p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-slate-400">No active deals yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
