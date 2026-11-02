import React from 'react';
import { Check, X, MapPin, Truck, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const MatchScoreCard = ({ match, onAction, actionLabel = 'Make Offer', compact = false }) => {
  if (!match) return null;

  const score = match.score || 0;
  const isHighMatch = score >= 85;
  const isMediumMatch = score >= 70 && score < 85;

  const scoreColor = isHighMatch
    ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
    : isMediumMatch
    ? 'text-blue-700 bg-blue-50 border-blue-300'
    : 'text-amber-700 bg-amber-50 border-amber-300';

  const badgeBg = isHighMatch ? 'bg-emerald-600' : isMediumMatch ? 'bg-blue-600' : 'bg-amber-600';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header with Match Score */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded text-white ${badgeBg}`}>
              <Sparkles className="w-3 h-3" />
              MATCH ENGINE
            </span>
            {match.buyerCompany?.is_verified && (
              <StatusBadge type="verified" status="VERIFIED" />
            )}
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            {match.buyerCompany?.name || match.sellerName || 'Industrial Partner'}
          </h4>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {match.buyerCompany?.city || match.listingCity}, {match.buyerCompany?.state || 'India'}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-700">{match.buyerCompany?.industry || match.categoryName}</span>
          </p>
        </div>

        {/* Big Match Score Badge */}
        <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${scoreColor}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">MATCH SCORE</span>
          <span className="text-2xl font-extrabold tracking-tight">{score}%</span>
        </div>
      </div>

      {/* Logistics & Corridor Info */}
      <div className="grid grid-cols-2 gap-2 my-3.5 bg-slate-50 p-2.5 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Truck className="w-3.5 h-3.5 text-brand-600" />
          <span>Distance: <strong>{match.distanceKm} km</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 text-right justify-end">
          <span>Est. Freight: <strong>₹{match.estimatedLogisticsInr?.toLocaleString('en-IN')}</strong></span>
        </div>
      </div>

      {/* 6-Factor Algorithm Checklist */}
      <div className="space-y-1.5 my-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Compatibility Factors (Algorithm Evaluation):
        </p>
        {match.factors && match.factors.map((factor, idx) => (
          <div key={idx} className="flex items-start text-xs gap-2">
            {factor.status ? (
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mt-0.5">
                <X className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="flex-1 leading-snug">
              <span className={`font-semibold ${factor.status ? 'text-slate-800' : 'text-slate-600'}`}>
                {factor.name}
              </span>
              {!compact && (
                <span className="text-slate-500 text-[11px] block">{factor.explanation}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action CTA */}
      {onAction && (
        <button
          onClick={() => onAction(match)}
          className="mt-4 w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
