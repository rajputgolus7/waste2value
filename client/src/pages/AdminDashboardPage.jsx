import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Package,
  Handshake,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Trash2,
  TrendingUp,
  Scale
} from 'lucide-react';
import { adminAPI, listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboardPage = () => {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('companies'); // 'companies', 'listings', 'transactions'
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, compsRes, listsRes, transRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getCompanies(),
        listingAPI.getListings({ status: 'ALL' }),
        adminAPI.getTransactions()
      ]);
      setStats(statsRes.data);
      setCompanies(compsRes.data || []);
      setListings(listsRes.data || []);
      setTransactions(transRes.data || []);
    } catch (err) {
      console.error('Failed to load admin operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (companyId) => {
    try {
      await adminAPI.verifyCompany(companyId);
      showToast('✓ Company verification credentials approved! Badge granted.');
      loadAdminData();
    } catch (err) {
      showToast('Verification approval failed', 'error');
    }
  };

  const handleRejectCompany = async (companyId) => {
    try {
      await adminAPI.rejectCompany(companyId);
      showToast('Company verification status revoked', 'info');
      loadAdminData();
    } catch (err) {
      showToast('Failed to revoke verification', 'error');
    }
  };

  const handleToggleSuspendListing = async (listingId) => {
    try {
      const res = await adminAPI.toggleSuspendListing(listingId);
      showToast(`Listing status updated to ${res.data?.status}`);
      loadAdminData();
    } catch (err) {
      showToast('Failed to modify listing status', 'error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await adminAPI.deleteListing(listingId);
      showToast('Listing permanently deleted', 'info');
      loadAdminData();
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-3">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accessing Admin Control Room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-purple-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Governance & Compliance Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations Suite</h1>
          <p className="text-xs text-slate-300">
            Verify industrial enterprises, moderate waste listings, monitor transaction integrity, and track circular KPIs.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* 7 KPI Metric Cards (As specified in Hackathon rules) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Companies</span>
          <div className="text-xl font-extrabold text-slate-900">{stats?.totalCompanies || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Registered factories</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Active Listings</span>
          <div className="text-xl font-extrabold text-brand-700">{stats?.activeListings || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Live material lots</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Pending Verification</span>
          <div className="text-xl font-extrabold text-amber-600">{stats?.pendingVerification || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Requires audit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Active Deals</span>
          <div className="text-xl font-extrabold text-blue-700">{stats?.activeDeals || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">In negotiation/transit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Completed Deals</span>
          <div className="text-xl font-extrabold text-emerald-700">{stats?.completedDeals || 0}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Closed loop deals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Waste Diverted</span>
          <div className="text-xl font-extrabold text-indigo-700">{(stats?.totalWasteDivertedKg || 0).toLocaleString('en-IN')} <span className="text-xs font-normal">kg</span></div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Audited recovery</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Economic Value</span>
          <div className="text-xl font-extrabold text-emerald-800">₹{(stats?.totalEconomicValueInr || 0).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Generated value</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full sm:w-max">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'companies'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>Companies Queue ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-brand-600" />
          <span>Material Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Handshake className="w-4 h-4 text-blue-600" />
          <span>All Transactions ({transactions.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'companies' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Registered Industrial Facilities</h3>
            <span className="text-xs text-slate-400">Review business registration & pollution consent records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Company Name</th>
                  <th className="py-3 px-5">Industry</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Verification Docs</th>
                  <th className="py-3 px-5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <Link to={`/profile/${c.id}`} className="hover:text-brand-700">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{c.industry}</td>
                    <td className="py-3.5 px-5 text-slate-600">{c.city}, {c.state}</td>
                    <td className="py-3.5 px-5">
                      {c.is_verified ? (
                        <StatusBadge type="verified" status="VERIFIED" />
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[11px] text-slate-500 font-mono max-w-xs truncate">
                      {c.verification_docs || 'No documents submitted'}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      {!c.is_verified ? (
                        <button
                          onClick={() => handleVerifyCompany(c.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                        >
                          Verify Business
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRejectCompany(c.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Material Lots Moderation Queue</h3>
            <span className="text-xs text-slate-400">Suspend fraudulent or inappropriate waste listings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Lot Code</th>
                  <th className="py-3 px-5">Material Title</th>
                  <th className="py-3 px-5">Seller Company</th>
                  <th className="py-3 px-5">Volume</th>
                  <th className="py-3 px-5">Asking Price</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-slate-500">{l.unique_code}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 max-w-xs truncate">
                      <Link to={`/marketplace/${l.id}`} className="hover:text-brand-700">
                        {l.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{l.seller_company_name}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">{l.quantity} {l.unit}</td>
                    <td className="py-3.5 px-5 font-bold text-brand-700">₹{l.price_per_unit_inr}/{l.unit}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleSuspendListing(l.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          l.status === 'SUSPENDED'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {l.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => handleDeleteListing(l.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Network B2B Transactions Log</h3>
            <span className="text-xs text-slate-400">All circular deals established across verified facilities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Deal Code</th>
                  <th className="py-3 px-5">Material Lot</th>
                  <th className="py-3 px-5">Seller ➔ Buyer</th>
                  <th className="py-3 px-5">Agreed Value</th>
                  <th className="py-3 px-5">Milestone Status</th>
                  <th className="py-3 px-5 text-right">View Contract</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-slate-500">{t.deal_code}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 max-w-xs truncate">{t.listing_title}</td>
                    <td className="py-3.5 px-5 text-slate-600">
                      <strong>{t.seller_name}</strong> ➔ <strong>{t.buyer_name}</strong>
                    </td>
                    <td className="py-3.5 px-5 font-extrabold text-emerald-700">₹{t.total_deal_value_inr?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge type="deal" status={t.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to="/deals"
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
