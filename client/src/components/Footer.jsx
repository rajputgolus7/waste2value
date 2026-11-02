import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-slate-300 border-t border-charcoal-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-limeaccent-400 p-0.5">
                <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Waste<span className="text-brand-500">2</span>Market
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              Centralized B2B circular economy platform connecting industrial waste generators with buyers, processors, and recyclers.
              <strong> One industry's waste is another industry's raw material.</strong>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/40 text-brand-400 border border-brand-700/50 text-[11px] font-semibold">
                <Leaf className="w-3.5 h-3.5 text-brand-400" />
                Zero Landfill Mission
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 text-blue-400 border border-blue-700/50 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Verified B2B Network
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Core Marketplace</h4>
            <ul className="space-y-2.5">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Browse Waste Feedstocks</Link></li>
              <li><Link to="/matching" className="hover:text-white transition-colors">Smart Waste Matching Engine</Link></li>
              <li><Link to="/list-waste" className="hover:text-white transition-colors">List Waste Materials</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">B2B Deal Negotiations</Link></li>
              <li><Link to="/corridors" className="hover:text-white transition-colors">Indian Freight Corridors</Link></li>
            </ul>
          </div>

          {/* Tools & AI */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Circular Tools</h4>
            <ul className="space-y-2.5">
              <li><Link to="/calculator" className="hover:text-white transition-colors">Waste Value Calculator</Link></li>
              <li><Link to="/ai-scanner" className="hover:text-white transition-colors">AI Waste Classifier</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">ESG & CO₂ Impact Board</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Enterprise Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Verified Business Profile</Link></li>
            </ul>
          </div>

          {/* Supported Hubs */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Key Industrial Belts</h4>
            <ul className="space-y-2 text-slate-400">
              <li>• Punjab (Ludhiana, Rajpura, Bathinda)</li>
              <li>• Haryana (Panipat, Manesar, Gurugram)</li>
              <li>• Delhi NCR (Okhla, Faridabad, Noida)</li>
              <li>• Rajasthan (Bhiwadi, Jaipur, Alwar)</li>
              <li>• Gujarat & Maharashtra Industrial SEZs</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Waste2Market Technologies. All rights reserved. Hackathon Prototype Edition.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Privacy Policy</span>
            <span className="text-slate-400">Industrial Terms of Trade</span>
            <span className="text-slate-400">Pollution Board Compliance Disclaimers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
