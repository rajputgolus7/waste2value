import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Sparkles,
  Compass,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

/**
 * Interactive Presentation-Ready Map Canvas modeled after Google Maps Platform.
 * Supports:
 * - Roadmap & Satellite view modes
 * - Zoom & pan interactions
 * - Supplier pin (green), Buyer pins (blue), Best Value Buyer pin (gold star)
 * - Animated curved highway route with truck indicator
 * - Polished InfoWindow on pin hover / click
 * - Seamless drop-in interface for future Google Maps JS API script swap
 */
export const MockGoogleMapCanvas = ({
  supplier,
  buyers = [],
  selectedBuyerId,
  onSelectBuyer,
  routeInfo
}) => {
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHoverPin, setActiveHoverPin] = useState(null);
  const [clickedPin, setClickedPin] = useState(null);

  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];

  // Coordinates normalized to percentage positioning on our regional industrial map canvas (Northern India Corridor)
  const getCoordinates = (city) => {
    switch (city) {
      case 'Ludhiana':
        return { x: 26, y: 32 };
      case 'Rajpura':
        return { x: 52, y: 44 };
      case 'Bathinda':
        return { x: 16, y: 58 };
      case 'Karnal':
        return { x: 64, y: 65 };
      case 'Yamunanagar':
        return { x: 76, y: 48 };
      case 'Panipat':
        return { x: 66, y: 76 };
      case 'Delhi':
      case 'Okhla':
        return { x: 74, y: 88 };
      case 'Manesar':
      case 'Bhiwadi':
        return { x: 62, y: 92 };
      default:
        return { x: 50, y: 50 };
    }
  };

  const supplierPos = getCoordinates(supplier?.city || 'Ludhiana');
  const selectedBuyerPos = selectedBuyer ? getCoordinates(selectedBuyer.city) : { x: 52, y: 44 };

  // Calculate curve midpoint for SVG road routing
  const midX = (supplierPos.x + selectedBuyerPos.x) / 2 + (supplierPos.x < selectedBuyerPos.x ? 2 : -2);
  const midY = (supplierPos.y + selectedBuyerPos.y) / 2 - 4;

  const activePinData = clickedPin || activeHoverPin;

  // External Google Maps Route URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${supplier?.companyName || 'Punjab Rice Industries'}, ${supplier?.city || 'Ludhiana'}, ${supplier?.state || 'Punjab'}`
  )}&destination=${encodeURIComponent(
    `${selectedBuyer?.companyName || 'Green Biomass Energy Ltd'}, ${selectedBuyer?.city || 'Rajpura'}, ${selectedBuyer?.state || 'Punjab'}`
  )}&travelmode=driving`;

  return (
    <div className="relative w-full h-[580px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-slate-300 bg-slate-900 select-none group">
      {/* MAP BACKGROUND CANVAS */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          mapType === 'satellite'
            ? 'bg-[#1b2a1e] bg-[radial-gradient(#2d4a32_1px,transparent_1px)] [background-size:24px_24px]'
            : 'bg-[#e5e3df]'
        }`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Map Water Bodies & Regional Geography */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5bfdd" />
              <stop offset="100%" stopColor="#7ba4cc" />
            </linearGradient>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Regional Land Mass & Subtle terrain blocks */}
          {mapType === 'roadmap' ? (
            <>
              {/* Green belt zone (Punjab/Haryana agricultural belts) */}
              <path
                d="M 50 150 Q 180 80 400 120 T 800 180 L 800 650 L 0 650 Z"
                fill="#d8e8d8"
                opacity="0.45"
              />
              <path
                d="M 0 0 L 350 0 L 220 280 L 0 200 Z"
                fill="#ece9df"
                opacity="0.6"
              />

              {/* Sutlej / Beas River Simulation */}
              <path
                d="M 10 90 Q 180 140 280 200 T 520 290 T 800 340"
                stroke="url(#riverGrad)"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                opacity="0.65"
              />
              {/* Secondary canal */}
              <path
                d="M 280 200 Q 340 340 480 480 T 700 620"
                stroke="#bed2e8"
                strokeWidth="6"
                fill="none"
                opacity="0.5"
              />

              {/* Major Highway Network (NH 44 GT Road, NH 7, NH 5) */}
              {/* NH 44 Trunk Route (Ludhiana -> Rajpura -> Karnal -> Panipat -> Delhi) */}
              <path
                d="M 200 180 L 400 240 L 520 380 L 560 480 L 620 580"
                stroke="#f9d77e"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 200 180 L 400 240 L 520 380 L 560 480 L 620 580"
                stroke="#ffffff"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Trans-Haryana Express Arterial */}
              <path
                d="M 120 320 L 400 240 L 680 270"
                stroke="#fed7aa"
                strokeWidth="5"
                fill="none"
                opacity="0.75"
              />

              {/* Secondary city grid lines */}
              <g stroke="#ffffff" strokeWidth="2" opacity="0.7">
                <line x1="160" y1="120" x2="260" y2="240" />
                <line x1="360" y1="190" x2="480" y2="290" />
                <line x1="460" y1="360" x2="600" y2="400" />
                <line x1="500" y1="470" x2="680" y2="520" />
              </g>
            </>
          ) : (
            <>
              {/* Satellite topography terrain lines */}
              <path
                d="M 0 0 L 800 0 L 800 650 L 0 650 Z"
                fill="#1c2f21"
              />
              <path
                d="M 20 180 Q 240 100 520 180 T 800 280"
                stroke="#122518"
                strokeWidth="24"
                fill="none"
              />
              <path
                d="M 200 180 L 400 240 L 520 380 L 560 480 L 620 580"
                stroke="#e2b842"
                strokeWidth="4"
                fill="none"
                opacity="0.8"
              />
            </>
          )}

          {/* ACTIVE LOGISTICS ROUTE (Drawn on actual road vector) */}
          {selectedBuyer && (
            <g>
              {/* Route shadow / outer glow */}
              <path
                d={`M ${supplierPos.x}% ${supplierPos.y}% Q ${midX}% ${midY}% ${selectedBuyerPos.x}% ${selectedBuyerPos.y}%`}
                stroke="#2563eb"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                opacity="0.25"
                filter="url(#glow)"
              />
              {/* Real road route polyline */}
              <path
                d={`M ${supplierPos.x}% ${supplierPos.y}% Q ${midX}% ${midY}% ${selectedBuyerPos.x}% ${selectedBuyerPos.y}%`}
                stroke="#2563eb"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Animated transit flow dashes */}
              <path
                d={`M ${supplierPos.x}% ${supplierPos.y}% Q ${midX}% ${midY}% ${selectedBuyerPos.x}% ${selectedBuyerPos.y}%`}
                stroke="#93c5fd"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="8,8"
                strokeLinecap="round"
                className="animate-[dash_1.5s_linear_infinite]"
              />
            </g>
          )}
        </svg>

        {/* City and State Territorial Watermarks (Google Maps typography style) */}
        <div className="absolute inset-0 pointer-events-none text-slate-400 font-sans tracking-wide uppercase select-none">
          <div className="absolute top-14 left-16 text-xs font-black tracking-widest text-slate-500/70">
            PUNJAB INDUSTRIAL CORRIDOR
          </div>
          <div className="absolute top-52 right-20 text-xs font-black tracking-widest text-slate-500/70">
            HARYANA INDUSTRIAL BELT
          </div>
          <div className="absolute bottom-16 right-16 text-[10px] font-bold text-slate-500/60">
            DELHI NCR REGION
          </div>

          {/* Road tags */}
          <div className="absolute top-[37%] left-[38%] bg-white/90 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-slate-300">
            NH 44 • GT ROAD
          </div>
          <div className="absolute top-[49%] left-[64%] bg-white/90 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-slate-300">
            NH 7
          </div>
        </div>

        {/* MID-ROUTE STATS BADGE FLOATING ON ROAD */}
        {selectedBuyer && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/badge"
            style={{ left: `${midX}%`, top: `${midY}%` }}
          >
            <div className="bg-slate-900/95 hover:bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-2xl border border-blue-400/50 flex items-center gap-2 backdrop-blur-md transition-transform hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <div className="text-[11px] font-mono font-bold">
                <span className="text-white">{routeInfo?.distanceKm || selectedBuyer.distanceKm} km</span>
                <span className="text-slate-400 mx-1">•</span>
                <span className="text-amber-300">{routeInfo?.durationText || `${Math.round(selectedBuyer.distanceKm * 1.15)} mins`}</span>
              </div>
            </div>
          </div>
        )}

        {/* 1. SUPPLIER PIN (Distinctive Green Factory Pin) */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
          style={{ left: `${supplierPos.x}%`, top: `${supplierPos.y}%` }}
          onClick={() => setClickedPin({ ...supplier, type: 'supplier' })}
          onMouseEnter={() => setActiveHoverPin({ ...supplier, type: 'supplier' })}
          onMouseLeave={() => setActiveHoverPin(null)}
        >
          {/* Supplier Pin Visual */}
          <div className="relative flex flex-col items-center">
            {/* Pulsing beacon ring */}
            <span className="absolute -bottom-1 w-6 h-6 rounded-full bg-emerald-500/40 animate-ping" />
            <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-xl shadow-xl border-2 border-white flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>SUPPLIER: {supplier?.companyName || 'Punjab Rice Industries'}</span>
            </div>
            {/* Stem & Point */}
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-emerald-600 drop-shadow" />
            <div className="w-2 h-1 bg-black/40 rounded-full mt-0.5 filter blur-[1px]" />
          </div>
        </div>

        {/* 2. BUYER PINS */}
        {buyers.map((buyer) => {
          const pos = getCoordinates(buyer.city);
          const isSelected = buyer.id === selectedBuyerId;
          const isBest = buyer.isBestValue;

          return (
            <div
              key={buyer.id}
              className={`absolute z-30 -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${
                isSelected ? 'scale-110 z-40' : 'hover:scale-105'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                onSelectBuyer(buyer.id);
                setClickedPin({ ...buyer, type: 'buyer' });
              }}
              onMouseEnter={() => setActiveHoverPin({ ...buyer, type: 'buyer' })}
              onMouseLeave={() => setActiveHoverPin(null)}
            >
              <div className="relative flex flex-col items-center">
                {isBest && (
                  <span className="absolute -top-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-0.5 animate-bounce">
                    <Sparkles className="w-2.5 h-2.5" /> Best Value
                  </span>
                )}

                <div
                  className={`px-2.5 py-1 rounded-xl shadow-xl border-2 border-white flex items-center gap-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                    isBest
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white ring-4 ring-amber-300/60'
                      : isSelected
                      ? 'bg-blue-600 text-white ring-4 ring-blue-300/60'
                      : 'bg-slate-800 text-slate-100 hover:bg-blue-700'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{buyer.companyName}</span>
                  <span className="text-[10px] bg-black/25 px-1.5 py-0.2 rounded font-mono">
                    ₹{buyer.pricePerTonne?.toLocaleString('en-IN')}/T
                  </span>
                </div>

                {/* Pin Tip */}
                <div
                  className={`w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] drop-shadow ${
                    isBest ? 'border-t-amber-600' : isSelected ? 'border-t-blue-600' : 'border-t-slate-800'
                  }`}
                />
                <div className="w-2 h-1 bg-black/40 rounded-full mt-0.5 filter blur-[1px]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* GOOGLE MAPS BRANDING WATERMARK & ATTRIBUTION (Bottom Left) */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-md border border-slate-200/80 flex items-center gap-1.5">
          {/* Official Google colored "G" representation */}
          <div className="flex font-black text-xs tracking-tight">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 border-l border-slate-300 pl-1.5">
            Logistics Engine
          </span>
        </div>
        <span className="text-[9px] text-slate-600 bg-white/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
          Map data ©2026 Survey of India • Terms of Use
        </span>
      </div>

      {/* TOP-LEFT CONTROLS: MAP / SATELLITE TOGGLE */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200">
        <button
          type="button"
          onClick={() => setMapType('roadmap')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            mapType === 'roadmap'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            mapType === 'satellite'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* TOP-RIGHT CONTROLS: EXTERNAL GOOGLE MAPS LINK */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-lg border border-slate-200 transition-all hover:shadow-xl hover:text-blue-600"
          title="Open real turn-by-turn route directly in Google Maps"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>View on Google Maps</span>
        </a>
      </div>

      {/* BOTTOM-RIGHT MAP CONTROLS (ZOOM & PEGMAN) */}
      <div className="absolute bottom-5 right-4 z-20 flex flex-col items-center gap-2">
        {/* Pegman Street View icon representation */}
        <div
          className="w-9 h-9 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center text-amber-500 hover:bg-slate-50 cursor-pointer"
          title="Street View Navigation"
        >
          <Compass className="w-5 h-5 text-amber-500" />
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col divide-y divide-slate-100">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45))}
            className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85))}
            className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INTERACTIVE B2B INFOWINDOW (POPS UP ON CLICK OR HOVER) */}
      {activePinData && (
        <div className="absolute bottom-16 left-4 z-30 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/90 animate-fade-in text-xs space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    activePinData.type === 'supplier'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activePinData.isBestValue
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {activePinData.type === 'supplier'
                    ? 'Waste Supplier / Origin'
                    : activePinData.isBestValue
                    ? '⭐ Best Value Recommended Buyer'
                    : 'Target Processor / Buyer'}
                </span>
                {activePinData.verified && (
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {activePinData.companyName}
              </h4>
              <p className="text-[11px] text-slate-500">
                {activePinData.city}, {activePinData.state}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveHoverPin(null);
                setClickedPin(null);
              }}
              className="text-slate-400 hover:text-slate-700 p-1 text-sm leading-none"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-400 block text-[10px]">Material</span>
              <strong className="text-slate-800 font-bold truncate block">
                {activePinData.material || 'Rice Husk (Agro Waste)'}
              </strong>
            </div>

            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-400 block text-[10px]">
                {activePinData.type === 'supplier' ? 'Lot Volume' : 'Quote Price'}
              </span>
              <strong className="text-brand-700 font-black block">
                {activePinData.type === 'supplier'
                  ? `${activePinData.quantity || 10} Tonnes`
                  : `₹${activePinData.pricePerTonne?.toLocaleString('en-IN')}/Tonne`}
              </strong>
            </div>

            {activePinData.type !== 'supplier' && (
              <>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Road Distance</span>
                  <strong className="text-slate-800 font-bold block">
                    {activePinData.distanceKm} km (via NH 44)
                  </strong>
                </div>

                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Estimated Freight</span>
                  <strong className="text-slate-800 font-bold block">
                    ₹{activePinData.logisticsCostInr?.toLocaleString('en-IN')}
                  </strong>
                </div>
              </>
            )}
          </div>

          {activePinData.type !== 'supplier' && activePinData.id !== selectedBuyerId && (
            <button
              type="button"
              onClick={() => {
                onSelectBuyer(activePinData.id);
                setClickedPin(null);
              }}
              className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Select as Active Routing Target</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
