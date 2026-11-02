import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Sparkles,
  Building2,
  RefreshCw,
  ArrowUpDown,
  Tag,
  Scale,
  Handshake,
  Check,
  X
} from 'lucide-react';
import { listingAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { MakeOfferModal } from '../components/MakeOfferModal';
import { getMaterialImage } from '../utils/materialImages';

export const MarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [sort, setSort] = useState('newest');

  // Offer modal state
  const [selectedListingForOffer, setSelectedListingForOffer] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedState, selectedGrade, selectedUnit, sort]);

  const loadCategories = async () => {
    try {
      const res = await listingAPI.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        state: selectedState,
        grade: selectedGrade,
        unit: selectedUnit,
        sort: sort,
        search: search.trim() || undefined,
        maxPrice: maxPrice || undefined,
        minQuantity: minQuantity || undefined
      };
      const res = await listingAPI.getListings(params);
      setListings(res.data || []);
    } catch (err) {
      console.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedGrade('all');
    setSelectedUnit('all');
    setMaxPrice('');
    setMinQuantity('');
    setSort('newest');
  };

  const handleOpenOffer = (listing) => {
    setSelectedListingForOffer(listing);
    setIsOfferModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="bg-gradient-to-r from-charcoal-900 to-brand-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
            INDUSTRIAL B2B REPOSITORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Industrial Waste & By-Product Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Source high-grade industrial raw materials directly from verified manufacturing facilities across India.
          </p>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-3xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by material (e.g. Rice Husk, PET, Fly Ash, Oil, Cotton)..."
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 text-sm font-medium rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Feedstock</span>
          </button>
        </form>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Layout: Filters Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-sm sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filter Lots</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Location State Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State / Region</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="all">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Quality / Specification</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="all">All Grades</option>
              <option value="Grade A">Grade A (Direct Feedstock)</option>
              <option value="Grade B">Grade B (Pre-treatment Needed)</option>
              <option value="Industrial Reusable">Industrial Reusable</option>
            </select>
          </div>

          {/* Unit Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Measurement Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="all">All Units</option>
              <option value="tonne">Tonnes (Heavy Bulk)</option>
              <option value="kg">Kilograms (KG)</option>
              <option value="litre">Litres (Liquids/Oils)</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Asking Price (₹)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
              />
              <button
                onClick={fetchListings}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Min Quantity Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Min Available Volume</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 5"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
              />
              <button
                onClick={fetchListings}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls: Count & Sort */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <span className="text-xs font-bold text-slate-600">
              Showing <strong className="text-slate-900">{listings.length}</strong> available material lot{listings.length !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-1.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 font-bold focus:bg-white"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="quantity_desc">Quantity: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings Cards Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Querying live industrial catalog...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  {/* Photo & Badges */}
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={getMaterialImage(item)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getMaterialImage({ category_id: item.category_id });
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-charcoal-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                          {item.category_name}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <StatusBadge type="grade" status={item.quality_grade} />
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {item.unique_code}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-brand-700 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.city}, {item.state}</span>
                        </span>
                        {item.seller_is_verified ? (
                          <StatusBadge type="verified" status="VERIFIED" />
                        ) : null}
                      </div>

                      {/* Economics & Volume Box */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-baseline justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Available Lot</span>
                          <span className="text-sm font-extrabold text-slate-800">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Asking Price</span>
                          <span className="text-base font-extrabold text-brand-700">
                            ₹{item.price_per_unit_inr?.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-slate-500">/{item.unit}</span>
                          </span>
                        </div>
                      </div>

                      {item.expected_use && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">
                          Use: {item.expected_use}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/marketplace/${item.id}`}
                        className="py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        Technical Specs
                      </Link>
                      <button
                        onClick={() => handleOpenOffer(item)}
                        className="py-2 text-center bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        Make an Offer
                      </button>
                    </div>

                    <Link
                      to={`/matching?listingId=${item.id}`}
                      className="w-full py-1.5 flex items-center justify-center gap-1.5 text-center bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg transition-colors border border-amber-200/60"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Find 90%+ Compatible Buyers</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching waste lots found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No materials currently meet the selected criteria. Try adjusting your category, price range, or state filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
        listing={selectedListingForOffer}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={() => fetchListings()}
      />
    </div>
  );
};
