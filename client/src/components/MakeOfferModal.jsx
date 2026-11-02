import React, { useState } from 'react';
import { X, Send, Truck, Building2, AlertCircle } from 'lucide-react';
import { offerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MakeOfferModal = ({ listing, isOpen, onClose, onSuccess }) => {
  const { user, showToast } = useAuth();
  const [quantity, setQuantity] = useState(listing ? listing.quantity : 1);
  const [price, setPrice] = useState(listing ? listing.price_per_unit_inr : 100);
  const [logistics, setLogistics] = useState('BUYER_PICKUP');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !listing) return null;

  const totalAmount = Math.round(Number(quantity) * Number(price));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(quantity) <= 0 || Number(price) <= 0) {
      setError('Quantity and price must be greater than zero');
      return;
    }

    setSubmitting(true);
    try {
      await offerAPI.createOffer({
        listing_id: listing.id,
        offered_quantity: Number(quantity),
        offered_price_per_unit_inr: Number(price),
        logistics_preference: logistics,
        message
      });

      showToast(`Offer of ₹${totalAmount.toLocaleString('en-IN')} submitted to ${listing.seller_company_name}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit offer:', err);
      setError(err.response?.data?.error || 'Failed to submit offer. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-charcoal-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-brand-300">B2B PURCHASE PROPOSAL</span>
            <h3 className="text-lg font-bold">Make an Offer</h3>
            <p className="text-xs text-slate-300 mt-0.5 truncate max-w-sm">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Listing Reference Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 block">Seller:</span>
              <strong className="text-slate-900 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {listing.seller_company_name} ({listing.city})
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Listed Asking Price:</span>
              <strong className="text-brand-700">₹{listing.price_per_unit_inr?.toLocaleString('en-IN')} / {listing.unit}</strong>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Offered Quantity ({listing.unit}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold uppercase">
                {listing.unit}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Available batch volume: {listing.quantity} {listing.unit}</p>
          </div>

          {/* Unit Price Offered */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Offered Price per {listing.unit} (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Logistics Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Logistics & Delivery Arrangement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                  logistics === 'BUYER_PICKUP'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="logistics"
                  value="BUYER_PICKUP"
                  checked={logistics === 'BUYER_PICKUP'}
                  onChange={() => setLogistics('BUYER_PICKUP')}
                  className="sr-only"
                />
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Buyer Pickup (Ex-Works)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                  logistics === 'SELLER_DELIVER'
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="logistics"
                  value="SELLER_DELIVER"
                  checked={logistics === 'SELLER_DELIVER'}
                  onChange={() => setLogistics('SELLER_DELIVER')}
                  className="sr-only"
                />
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Seller Delivers (FOR Plant)</span>
              </label>
            </div>
          </div>

          {/* Message / Commercial Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message to Seller / Processing Intent
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. We require this material for our biomass boiler line. Can dispatch transport within 48 hours..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-xs"
            />
          </div>

          {/* Dynamic Commercial Total */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-emerald-900 font-semibold">Total Contract Value:</span>
            <span className="text-lg font-extrabold text-emerald-800">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Offer...' : 'Send B2B Offer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
