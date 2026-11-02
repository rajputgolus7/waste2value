import React from 'react';
import { Check, Clock, Truck, Factory, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';

const STAGES = [
  { key: 'OFFER_SENT', label: 'Offer Sent', icon: Clock, desc: 'Initial inquiry & price offer submitted' },
  { key: 'NEGOTIATION', label: 'Negotiation', icon: AlertCircle, desc: 'Commercial terms & delivery options reviewed' },
  { key: 'ACCEPTED', label: 'Accepted', icon: Check, desc: 'Commercial agreement confirmed; deal created' },
  { key: 'PROCESSING', label: 'Processing & Logistics', icon: Factory, desc: 'Material in transit or receiving QA inspection' },
  { key: 'COMPLETED', label: 'Completed', icon: PackageCheck, desc: 'Recycled/reused into new economic products' }
];

export const DealTimeline = ({ deal, onAdvanceStatus, isUserAuthorized = true }) => {
  if (!deal) return null;

  // Determine stage index
  const getStageIndex = (status) => {
    switch (status) {
      case 'OFFER_SENT': return 0;
      case 'NEGOTIATION': return 1;
      case 'ACCEPTED': return 2;
      case 'LOGISTICS_ARRANGED': return 3;
      case 'PROCESSING': return 3;
      case 'COMPLETED': return 4;
      default: return 2;
    }
  };

  const currentIndex = getStageIndex(deal.status);
  const events = deal.timeline_events || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            TRANSACTION TRACKER
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Deal Milestone Status</h3>
          <p className="text-xs text-slate-500">Contract ID: <span className="font-mono font-semibold text-slate-700">{deal.deal_code}</span></p>
        </div>
        {deal.status === 'COMPLETED' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            Circular Loop Closed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            In Progress
          </span>
        )}
      </div>

      {/* Horizontal Visual Stepper */}
      <div className="relative mb-8 px-2">
        {/* Connecting bar */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-brand-600 transition-all duration-500 rounded"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex || deal.status === 'COMPLETED';
            const isCurrent = idx === currentIndex && deal.status !== 'COMPLETED';
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-amber-700' : isCompleted ? 'text-brand-900' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-500 hidden md:block max-w-[110px] leading-tight mt-0.5">
                  {stage.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Timeline Log */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Event Audit Trail</h4>
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((evt, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700 uppercase">{evt.status.replace('_', ' ')}</span>
                    <span>{new Date(evt.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{evt.note}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Deal established. Awaiting initial logistics confirmation.</p>
          )}
        </div>
      </div>

      {/* Action Workflow Controls */}
      {isUserAuthorized && deal.status !== 'COMPLETED' && onAdvanceStatus && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Current Status: <strong className="text-slate-900">{deal.status.replace('_', ' ')}</strong>
          </div>
          <div className="flex items-center gap-2">
            {deal.status === 'ACCEPTED' && (
              <button
                onClick={() => onAdvanceStatus(deal.id, 'LOGISTICS_ARRANGED', 'Logistics vehicles dispatched and freight schedule confirmed.')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Confirm Logistics Dispatch</span>
              </button>
            )}

            {(deal.status === 'ACCEPTED' || deal.status === 'LOGISTICS_ARRANGED') && (
              <button
                onClick={() => onAdvanceStatus(deal.id, 'PROCESSING', 'Material arrived at buyer reprocessing facility. Lab QA test passed.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Factory className="w-3.5 h-3.5" />
                <span>Mark as In Processing</span>
              </button>
            )}

            {deal.status === 'PROCESSING' && (
              <button
                onClick={() => onAdvanceStatus(deal.id, 'COMPLETED', 'Industrial waste converted into secondary raw materials. Circular transaction complete!')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 animate-bounce-subtle"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Complete Transaction & Divert Waste</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
