import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { offerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CounterOfferModal = ({ offer, isOpen, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [counterPrice, setCounterPrice] = useState(offer ? offer.offered_price_per_unit_inr : 0);
  const [counterNote, setCounterNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !offer) return null;

  const totalCounterAmount = Math.round(Number(offer.offered_quantity) * Number(counterPrice));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(counterPrice) <= 0) {
      setError('Please enter a valid counter price');
      return;
    }

    setSubmitting(true);
    try {
      await offerAPI.counterOffer(offer.id, Number(counterPrice), counterNote);
      showToast(`Counter-offer of ₹${Number(counterPrice).toLocaleString('en-IN')}/${offer.unit} submitted!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit counter-offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-charcoal-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">NEGOTIATION</span>
            <h3 className="text-base font-bold">Propose Counter-Offer</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Buyer's Offer:</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              ₹{offer.offered_price_per_unit_inr?.toLocaleString('en-IN')} / {offer.unit} (Total: ₹{offer.total_amount_inr?.toLocaleString('en-IN')})
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Your Counter Asking Price per {offer.unit} (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={counterPrice}
              onChange={(e) => setCounterPrice(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason / Commercial Terms</label>
            <textarea
              rows={2}
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              placeholder="e.g. Price revised to cover certified pallet packaging and moisture testing report."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-amber-900 font-semibold">Total Counter Value:</span>
            <span className="text-base font-extrabold text-amber-800">
              ₹{totalCounterAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-slate-600">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Counter-Offer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
