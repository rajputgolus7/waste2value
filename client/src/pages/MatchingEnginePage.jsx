import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  MapPin,
  Scale,
  DollarSign,
  Info,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { listingAPI, matchingAPI } from '../services/api';
import { MatchScoreCard } from '../components/MatchScoreCard';
import { MakeOfferModal } from '../components/MakeOfferModal';

export const MatchingEnginePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listingIdParam = searchParams.get('listingId');

  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(listingIdParam || '1');
  const [selectedListing, setSelectedListing] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Offer modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    if (selectedListingId) {
      calculateMatches(selectedListingId);
    }
  }, [selectedListingId]);

  const loadListings = async () => {
    try {
      const res = await listingAPI.getListings({ limit: 50 });
      setListings(res.data || []);
      if (res.data?.length > 0 && !selectedListingId) {
        setSelectedListingId(String(res.data[0].id));
      }
    } catch (err) {
      console.warn('Failed to load listings for matching engine');
    }
  };

  const calculateMatches = async (id) => {
    setLoading(true);
    try {
      const res = await matchingAPI.getMatchesForListing(id);
      setSelectedListing(res.data.listing);
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error('Failed to run matching engine:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectListing = (id) => {
    setSelectedListingId(id);
    setSearchParams({ listingId: id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Real 6-Factor Deterministic Algorithm</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Smart Waste Matching Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instantly evaluate procurement compatibility between industrial waste generators and certified buyers based on material chemistry, demand window, road distance, and pricing.
          </p>
        </div>
      </div>

      {/* Interactive Material Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Waste Material Lot to Match:
            </label>
            <p className="text-xs text-slate-400">Choose any active industrial listing to run live algorithm scoring.</p>
          </div>

          <div className="w-full sm:w-96">
            <select
              value={selectedListingId}
              onChange={(e) => handleSelectListing(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.quantity} {l.unit} - {l.city}, {l.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Lot Metadata Box */}
        {selectedListing && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Material</span>
              <strong className="text-slate-900">{selectedListing.title}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Generator / Seller</span>
              <strong className="text-slate-900">{selectedListing.seller_company_name}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Lot Size & Asking</span>
              <strong className="text-slate-900">{selectedListing.quantity} {selectedListing.unit} @ ₹{selectedListing.price_per_unit_inr}/{selectedListing.unit}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Dispatch Location</span>
              <strong className="text-brand-700">{selectedListing.city}, {selectedListing.state}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Main Algorithm Scoring Results */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              SUITABLE BUYER MATCHES ({matches.length})
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Ranked by Algorithm Compatibility Score
            </h2>
          </div>
          <Link
            to="/corridors"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors shadow-2xs w-fit"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Open in Waste Logistics Map</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Evaluating 6 compatibility factors across buyer requirements...</p>
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, idx) => (
              <MatchScoreCard
                key={idx}
                match={match}
                onAction={() => setIsOfferModalOpen(true)}
                actionLabel="Initiate Direct Offer"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            No registered buyers found matching this material lot.
          </div>
        )}
      </div>

      {/* Educational Explanation: How the 6-Factor Algorithm Works */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-8 space-y-6 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">How the Waste2Market Matching Algorithm Works</h3>
        </div>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Unlike generic marketplace keyword searches, industrial circular economy requires strict chemical feedstock tolerance, volume economics, and geographical proximity. Our engine evaluates six deterministic dimensions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">1. Material Compatibility (30%)</div>
            <p className="text-slate-500 text-[11px]">Exact category and chemical feedstock alignment with buyer processing plant setup.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">2. Quantity Compatibility (20%)</div>
            <p className="text-slate-500 text-[11px]">Checks if available lot falls within the buyer's min/max procurement window.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">3. Geographic Distance (20%)</div>
            <p className="text-slate-500 text-[11px]">Haversine highway distance calculation to minimize inter-state freight overhead.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">4. Price Compatibility (15%)</div>
            <p className="text-slate-500 text-[11px]">Ratio of asking unit price against the buyer's maximum ceiling budget.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">5. Quality Grade (10%)</div>
            <p className="text-slate-500 text-[11px]">Compares feedstock purity (Grade A $\ge$ Grade B $\ge$ Industrial Reusable).</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="font-bold text-slate-900">6. Dispatch Availability (5%)</div>
            <p className="text-slate-500 text-[11px]">Readiness date score rewarding immediate yard clearance.</p>
          </div>
        </div>
      </div>

      {/* Modal for making offer directly from match */}
      {selectedListing && (
        <MakeOfferModal
          listing={selectedListing}
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          onSuccess={() => calculateMatches(selectedListingId)}
        />
      )}
    </div>
  );
};
