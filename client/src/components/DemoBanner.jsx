import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Building2, ShoppingCart, ShieldCheck } from 'lucide-react';

export const DemoBanner = () => {
  const { user, isSeller, isBuyer, isAdmin, switchDemoPersona } = useAuth();

  return (
    <div className="bg-charcoal-900 border-b border-charcoal-800 text-white text-xs py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1 bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] border border-brand-500/30">
            <Sparkles className="w-3 h-3 text-brand-400 animate-pulse" />
            Hackathon Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium">
            Active Persona: <strong className="text-white">{user?.name || 'Guest User'}</strong>
            {user?.company_name && (
              <span className="text-slate-400 ml-1">({user.company_name})</span>
            )}
          </span>
        </div>

        {/* Persona quick switch buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Quick Switch:</span>

          <button
            onClick={() => switchDemoPersona('seller')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] font-medium ${
              isSeller
                ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-400'
                : 'bg-charcoal-800 text-slate-300 hover:bg-charcoal-700 hover:text-white'
            }`}
          >
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span>1. Seller (Punjab Rice)</span>
          </button>

          <button
            onClick={() => switchDemoPersona('buyer')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] font-medium ${
              isBuyer
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-charcoal-800 text-slate-300 hover:bg-charcoal-700 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3 h-3 text-blue-400" />
            <span>2. Buyer (Green Biomass)</span>
          </button>

          <button
            onClick={() => switchDemoPersona('admin')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] font-medium ${
              isAdmin
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-charcoal-800 text-slate-300 hover:bg-charcoal-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>3. Admin (Ops & Compliance)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
