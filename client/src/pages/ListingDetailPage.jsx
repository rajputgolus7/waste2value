import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Scale,
  Leaf,
  Layers,
  Send,
  Share2
} from 'lucide-react';
import { listingAPI, matchingAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { MakeOfferModal } from '../components/MakeOfferModal';
import { MatchScoreCard } from '../components/MatchScoreCard';
import { useAuth } from '../context/AuthContext';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [listing, setListing] = useState(null);
  const [matchingBuyers, setMatchingBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    loadListingDetails();
  }, [id]);

  const loadListingDetails = async () => {
    setLoading(true);
    try {
      const res = await listingAPI.getListingById(id);
      setListing(res.data);

      // Load matching buyers for this listing
      try {
        const matchRes = await matchingAPI.getMatchesForListing(res.data.id);
        setMatchingBuyers(matchRes.data?.matches || []);
      } catch (e) {
        console.warn('Matching buyers lookup fallback');
      }
    } catch (err) {
      console.error('Failed to load listing details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Listing reference URL copied to clipboard!', 'info');
  };

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Material Specifications...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-xs text-slate-500">The requested material lot could not be located in the catalog.</p>
        <Link to="/marketplace" className="inline-block px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const totalLotValue = Math.round(Number(listing.quantity) * Number(listing.price_per_unit_inr));
  let totalKg = listing.quantity;
  if (listing.unit === 'tonne') totalKg = listing.quantity * 1000;
  if (listing.unit === 'litre') totalKg = listing.quantity * 0.9;
  const estimatedCo2Avoided = Math.round(totalKg * (listing.co2_factor_per_kg || 1.5));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Reference</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media + Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="relative h-80 sm:h-96 bg-slate-100">
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-charcoal-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  {listing.category_name}
                </span>
                <StatusBadge type="grade" status={listing.quality_grade} />
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/95 backdrop-blur-md text-slate-900 font-mono text-xs font-bold px-3 py-1 rounded-md shadow">
                  REF: {listing.unique_code}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {listing.title}
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span className="font-medium text-slate-700">{listing.city}, {listing.state} (Industrial Hub)</span>
                  <span>•</span>
                  <span>Listed on {new Date(listing.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Description</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Material Attributes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Volume / Lot Size</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">{listing.quantity} {listing.unit}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Quality Grade</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">{listing.quality_grade}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Dispatch Readiness</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">{listing.availability_date || 'Immediate'}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Circular Application</span>
                    <strong className="text-slate-900 text-xs mt-0.5 block">{listing.expected_use || 'Industrial Feedstock'}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">State / Jurisdiction</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">{listing.state}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Packaging Standard</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">Bulk / Palletized</strong>
                  </div>
                </div>
              </div>

              {/* Environmental Carbon Abatement Callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                    Circular Economy Impact Score
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Recovering this lot diverts <strong>{totalKg.toLocaleString('en-IN')} kg</strong> of industrial waste and avoids an estimated <strong>{estimatedCo2Avoided.toLocaleString('en-IN')} kg of CO₂ equivalent</strong> compared to virgin manufacturing or landfill disposal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SMART MATCHING SECTION: Potential Buyers For This Material */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  REAL-TIME ALGORITHM RESULTS
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Matching Industrial Buyers for this Waste Lot</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated using 6-factor compatibility (feedstock specifications, volume window, transit logistics, and budget).
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {matchingBuyers.length > 0 ? (
                matchingBuyers.slice(0, 3).map((match, idx) => (
                  <MatchScoreCard
                    key={idx}
                    match={match}
                    onAction={() => setIsOfferModalOpen(true)}
                    actionLabel="Submit Purchase Offer"
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400">
                  No registered buyer criteria directly overlap this lot right now. Open for custom spot offers!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Seller Profile & Action Box */}
        <div className="space-y-6">
          {/* Commercial Valuation Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-20">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Asking Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-brand-700">
                  ₹{listing.price_per_unit_inr?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-500">/ {listing.unit}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Lot Volume:</span>
                <strong className="text-slate-900">{listing.quantity} {listing.unit}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Lot Contract Value:</span>
                <strong className="text-emerald-700 text-sm">₹{totalLotValue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Terms:</span>
                <span className="text-slate-700 font-medium">B2B Escrow / Gate Verification</span>
              </div>
            </div>

            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="w-full py-3.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Make an Offer on this Lot</span>
            </button>

            {/* Seller Company Card */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Listing Generator Enterprise</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{listing.seller_company_name}</h4>
                  {listing.seller_is_verified ? (
                    <StatusBadge type="verified" status="VERIFIED" />
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">{listing.seller_industry}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{listing.seller_address || `${listing.city}, ${listing.state}`}</span>
                </p>
              </div>

              {listing.seller_about && (
                <p className="text-[11px] text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{listing.seller_about}"
                </p>
              )}

              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-600">
                {listing.seller_phone && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{listing.seller_phone}</span>
                  </div>
                )}
                {listing.seller_email && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{listing.seller_email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <MakeOfferModal
        listing={listing}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={() => loadListingDetails()}
      />
    </div>
  );
};
