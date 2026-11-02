import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, XCircle, Truck, PackageCheck } from 'lucide-react';

export const StatusBadge = ({ status, type = 'status', className = '' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  // Verification Badge
  if (type === 'verified' || normalized === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Verified Business
      </span>
    );
  }

  // Quality Grades
  if (type === 'grade' || normalized.startsWith('GRADE') || normalized.includes('REUSABLE')) {
    const isGradeA = normalized.includes('A');
    const isGradeB = normalized.includes('B');

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide ${
          isGradeA
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : isGradeB
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        } ${className}`}
      >
        {status}
      </span>
    );
  }

  // Deal Lifecycle Statuses
  if (type === 'deal' || ['ACCEPTED', 'LOGISTICS_ARRANGED', 'PROCESSING', 'COMPLETED'].includes(normalized)) {
    const config = {
      'ACCEPTED': { label: 'Deal Accepted', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2 },
      'LOGISTICS_ARRANGED': { label: 'Logistics Dispatched', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
      'PROCESSING': { label: 'In Processing', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
      'COMPLETED': { label: 'Completed & Recovered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: PackageCheck }
    };

    const cfg = config[normalized] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: CheckCircle2 };
    const Icon = cfg.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${className}`}>
        <Icon className="w-3.5 h-3.5" />
        {cfg.label}
      </span>
    );
  }

  // Offer Statuses
  if (type === 'offer' || ['OFFER_SENT', 'COUNTERED', 'REJECTED'].includes(normalized)) {
    const config = {
      'OFFER_SENT': { label: 'Offer Sent', bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: Clock },
      'NEGOTIATION': { label: 'In Negotiation', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
      'ACCEPTED': { label: 'Offer Accepted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
      'COUNTERED': { label: 'Counter-Offered', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: AlertTriangle },
      'REJECTED': { label: 'Declined', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle }
    };

    const cfg = config[normalized] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    const Icon = cfg.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${className}`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    );
  }

  // General Listing Statuses
  const listingConfig = {
    'ACTIVE': { label: 'Active in Market', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'IN_NEGOTIATION': { label: 'In Negotiation', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    'SOLD': { label: 'Sold / Diverted', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: PackageCheck },
    'SUSPENDED': { label: 'Suspended by Admin', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle }
  };

  const cfg = listingConfig[normalized] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: CheckCircle2 };
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${className}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};
