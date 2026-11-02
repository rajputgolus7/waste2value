import React, { useState, useEffect } from 'react';
import {
  Handshake,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Building2,
  MapPin,
  Truck,
  ArrowRight,
  Filter,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { offerAPI, dealAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { DealTimeline } from '../components/DealTimeline';
import { CounterOfferModal } from '../components/CounterOfferModal';
import { getMaterialImage } from '../utils/materialImages';

export const DealsPage = () => {
  const { user, isSeller, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('deals'); // 'deals' or 'offers'
  const [deals, setDeals] = useState([]);
  const [offersReceived, setOffersReceived] = useState([]);
  const [offersSent, setOffersSent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Counter offer modal
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsRes, offersRes] = await Promise.all([
        dealAPI.getDeals(),
        offerAPI.getMyOffers()
      ]);
      setDeals(dealsRes.data || []);
      setOffersReceived(offersRes.data?.received || []);
      setOffersSent(offersRes.data?.sent || []);
    } catch (err) {
      console.error('Failed to load deals and offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      const res = await offerAPI.acceptOffer(offerId);
      showToast('Offer accepted! Deal contract created with unique ID: ' + res.data.deal?.deal_code);
      setActiveTab('deals');
      loadData();
    } catch (err) {
      console.error('Failed to accept offer:', err);
      showToast(err.response?.data?.error || 'Failed to accept offer', 'error');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await offerAPI.rejectOffer(offerId, 'Declined by seller');
      showToast('Offer declined', 'info');
      loadData();
    } catch (err) {
      showToast('Failed to decline offer', 'error');
    }
  };

  const handleOpenCounter = (offer) => {
    setSelectedOfferForCounter(offer);
    setIsCounterModalOpen(true);
  };

  const handleAdvanceDealStatus = async (dealId, nextStatus, note) => {
    try {
      await dealAPI.updateDealStatus(dealId, nextStatus, note);
      if (nextStatus === 'COMPLETED') {
        showToast('🎉 Transaction completed! Waste diverted and value logged to circular registry.');
      } else {
        showToast(`Deal milestone advanced to ${nextStatus.replace('_', ' ')}`);
      }
      loadData();
    } catch (err) {
      console.error('Failed to advance deal status:', err);
      showToast('Failed to update deal status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            CIRCULAR TRANSACTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            B2B Deals & Offer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage contract negotiations, confirm logistics dispatch, and monitor closed-loop transaction status.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'deals'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Handshake className="w-4 h-4 text-brand-600" />
            <span>Active Deals ({deals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'offers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Offers & Negotiations ({offersReceived.length + offersSent.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Querying transaction ledger...</p>
        </div>
      ) : activeTab === 'deals' ? (
        /* DEALS TAB */
        <div className="space-y-8">
          {deals.length > 0 ? (
            deals.map((deal) => (
              <div key={deal.id} className="space-y-4">
                {/* Deal Header Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={getMaterialImage({ title: deal.listing_title, image_url: deal.listing_image })}
                      alt={deal.listing_title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getMaterialImage({ title: deal.listing_title });
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{deal.deal_code}</span>
                        <StatusBadge type="deal" status={deal.status} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-0.5">{deal.listing_title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Seller: <strong>{deal.seller_name}</strong> ({deal.seller_city})</span>
                        <span>➔</span>
                        <span>Buyer: <strong>{deal.buyer_name}</strong> ({deal.buyer_city})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Agreed Volume</span>
                      <strong className="text-sm font-extrabold text-slate-800">{deal.agreed_quantity} {deal.unit}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Agreed Price</span>
                      <strong className="text-sm font-extrabold text-slate-800">₹{deal.agreed_price_per_unit_inr}/{deal.unit}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Deal Value</span>
                      <strong className="text-base font-extrabold text-emerald-700">₹{deal.total_deal_value_inr?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Timeline Component */}
                <DealTimeline
                  deal={deal}
                  onAdvanceStatus={handleAdvanceDealStatus}
                  isUserAuthorized={true}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Handshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No active deals yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a seller accepts a buyer's purchase offer, the deal contract and milestone timeline will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* OFFERS TAB */
        <div className="space-y-8">
          {/* Incoming Offers (For Seller) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>Incoming Offers Received ({offersReceived.length})</span>
            </h3>

            {offersReceived.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {offersReceived.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge type="offer" status={offer.status} />
                          <span className="text-xs text-slate-400 font-mono">Lot: {offer.listing_code}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{offer.listing_title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>From: <strong>{offer.buyer_name}</strong> ({offer.buyer_city}, {offer.buyer_state})</span>
                        </p>
                      </div>

                      <div className="flex items-baseline gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Quantity</span>
                          <strong className="text-slate-800 text-sm">{offer.offered_quantity} {offer.unit}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Offered Unit Price</span>
                          <strong className="text-brand-700 text-sm">₹{offer.offered_price_per_unit_inr?.toLocaleString('en-IN')}/{offer.unit}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Value</span>
                          <strong className="text-emerald-700 text-base font-extrabold">₹{offer.total_amount_inr?.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Logistics and Buyer Message */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Logistics Term:</span>
                        <strong className="text-slate-800">{offer.logistics_preference === 'BUYER_PICKUP' ? 'Buyer Arranges Pickup (Ex-Works)' : 'Seller Delivery Required'}</strong>
                      </div>
                      {offer.message && (
                        <div className="sm:text-right max-w-md">
                          <span className="text-slate-400 font-bold uppercase text-[10px] block">Buyer's Note:</span>
                          <p className="text-slate-600 italic">"{offer.message}"</p>
                        </div>
                      )}
                    </div>

                    {/* Actions if Pending */}
                    {offer.status === 'OFFER_SENT' && (
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleOpenCounter(offer)}
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-colors border border-amber-200"
                        >
                          Counter-Offer
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Offer & Create Deal</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No incoming offers received yet.
              </div>
            )}
          </div>

          {/* Outgoing Offers (For Buyer) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>Outgoing Offers Sent ({offersSent.length})</span>
            </h3>

            {offersSent.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {offersSent.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge type="offer" status={offer.status} />
                        <span className="font-mono text-slate-400 text-[11px]">{offer.listing_code}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{offer.listing_title}</h4>
                      <p className="text-slate-500 mt-0.5">Seller: {offer.seller_name} ({offer.seller_city})</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Offered Volume</span>
                        <strong className="text-slate-900">{offer.offered_quantity} {offer.unit}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Value</span>
                        <strong className="text-emerald-700 font-extrabold text-sm">₹{offer.total_amount_inr?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                You have not submitted any outgoing offers yet. Browse the marketplace to submit an offer!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      <CounterOfferModal
        offer={selectedOfferForCounter}
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
