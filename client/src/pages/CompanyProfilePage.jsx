import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  Edit,
  Award,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { companyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const CompanyProfilePage = () => {
  const { id } = useParams();
  const { user, showToast } = useAuth();

  const targetId = id || user?.company_id || 1;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [gstin, setGstin] = useState('03AAACP1948Q1Z4');
  const [pcbConsent, setPcbConsent] = useState('PPCB/CTO/IND/2024/9842');
  const [isoCert, setIsoCert] = useState('ISO 14001:2015 Environmental System');
  const [submittingVerify, setSubmittingVerify] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [targetId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await companyAPI.getCompanyById(targetId);
      setProfileData(res.data);
    } catch (err) {
      console.error('Failed to load company profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVerification = async (e) => {
    e.preventDefault();
    setSubmittingVerify(true);
    try {
      await companyAPI.requestVerification({
        gstin,
        pcbConsent,
        isoCertification: isoCert
      });
      showToast('✓ Business credentials verified! "Verified Business" badge awarded.');
      setIsVerifyModalOpen(false);
      loadProfile();
    } catch (err) {
      showToast('Verification submission failed', 'error');
    } finally {
      setSubmittingVerify(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Business Profile...</p>
      </div>
    );
  }

  const company = profileData?.company;
  const listings = profileData?.listings || [];
  const transactions = profileData?.transactionHistory || [];
  const reviews = profileData?.reviews || [];
  const stats = profileData?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Company Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-800 to-emerald-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md flex-shrink-0">
              {company?.name ? company.name.charAt(0) : 'B'}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {company?.name}
                </h1>
                {company?.is_verified ? (
                  <StatusBadge type="verified" status="VERIFIED" />
                ) : (
                  <button
                    onClick={() => setIsVerifyModalOpen(true)}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
                  >
                    <span>Get Verified</span>
                  </button>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-brand-800">{company?.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company?.city}, {company?.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {company?.rating} / 5.0
                </span>
              </p>

              <p className="text-xs text-slate-500 max-w-2xl pt-2 leading-relaxed">
                {company?.about || 'Industrial manufacturing and processing partner registered on Waste2Market.'}
              </p>
            </div>
          </div>

          {/* Verification Badge / Status Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 text-xs space-y-2 md:w-72">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Verification Status:</span>
              {company?.is_verified ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <span className="text-amber-700 font-bold">Pending Review</span>
              )}
            </div>

            {company?.verification_docs && (
              <p className="text-[10px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-100 break-words">
                {company.verification_docs}
              </p>
            )}

            {!company?.is_verified && (
              <button
                onClick={() => setIsVerifyModalOpen(true)}
                className="w-full py-2 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-brand-800 transition-all"
              >
                Simulate Business Verification
              </button>
            )}
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
          {company?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{company.phone}</span>
            </div>
          )}
          {company?.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{company.email}</span>
            </div>
          )}
          {company?.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{company.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Materials Stream Taxonomy (Generated vs Required) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials Generated */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Materials & By-Products Generated (Outputs)</span>
          </div>
          <p className="text-xs text-slate-500">
            Industrial streams regularly produced by this facility available for circular reuse:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {company?.materials_generated ? (
              company.materials_generated.split(',').map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                >
                  ✓ {mat.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No output materials listed</span>
            )}
          </div>
        </div>

        {/* Materials Required */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Raw Materials & Feedstocks Required (Inputs)</span>
          </div>
          <p className="text-xs text-slate-500">
            Secondary by-products this company can purchase, reprocess, or incinerate in cogen boilers:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {company?.materials_required ? (
              company.materials_required.split(',').map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200"
                >
                  🔍 {mat.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No feedstock requirements listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Current Waste Material Lots</h3>
            <p className="text-xs text-slate-500">Material lots currently published by {company?.name}</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{listings.length} lots</span>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-slate-400 text-[10px]">{l.unique_code}</span>
                    <StatusBadge type="grade" status={l.quality_grade} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{l.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{l.quantity} {l.unit} • ₹{l.price_per_unit_inr}/{l.unit}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <StatusBadge status={l.status} />
                  <Link
                    to={`/marketplace/${l.id}`}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900"
                  >
                    View Lot ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No active listings published yet.</p>
        )}
      </div>

      {/* Transaction History & Verified Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Completed Transactions ({transactions.length})</h3>
            <span className="text-xs text-emerald-700 font-bold">100% Fulfillment</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{t.deal_code}</span>
                    <div className="font-bold text-slate-900 text-xs">{t.listing_title}</div>
                    <span className="text-slate-500 text-[11px]">
                      Partner: {t.seller_company_id === company.id ? t.buyer_name : t.seller_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="text-emerald-700 text-xs block">₹{t.total_deal_value_inr?.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-slate-400">{t.agreed_quantity} {t.unit}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-slate-400">No completed transactions on record.</p>
            )}
          </div>
        </div>

        {/* Reviews Received */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Verified Industrial Reviews</h3>
            <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {company?.rating} Average Rating
            </span>
          </div>

          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-xs">{rev.from_company_name}</strong>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-slate-400 text-xs">No customer reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-300">COMPLIANCE REVIEW</span>
                <h3 className="text-base font-bold">Simulate Business Verification</h3>
              </div>
              <button onClick={() => setIsVerifyModalOpen(false)} className="text-white hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleSimulateVerification} className="p-6 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-[11px] leading-relaxed">
                <strong>Simulated Compliance System:</strong> Enter sample industrial registration parameters to test the verified business badge without government API dependency.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State Pollution Control Board Consent No.</label>
                <input
                  type="text"
                  value={pcbConsent}
                  onChange={(e) => setPcbConsent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality / ISO Standard</label>
                <input
                  type="text"
                  value={isoCert}
                  onChange={(e) => setIsoCert(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerify}
                  className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow"
                >
                  {submittingVerify ? 'Verifying...' : 'Submit & Grant Verified Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
