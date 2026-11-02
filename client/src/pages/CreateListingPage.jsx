import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  FileText,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  AlertCircle
} from 'lucide-react';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

const SAMPLE_IMAGES = [
  { name: 'Rice Husk Bales', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { name: 'PET Plastic Scraps', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fly Ash Powder', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cotton Yarn & Textile Waste', url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hydraulic Lube Oil Drums', url: 'https://images.unsplash.com/photo-1618090584176-7132b9911661?auto=format&fit=crop&w=800&q=80' },
  { name: 'Metal Scrap & Swarf', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sugarcane Bagasse Bales', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Corrugated Cardboard OCC', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' }
];

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    category_id: 1,
    title: '',
    description: '',
    expected_use: '',
    quality_grade: 'Grade A',
    quantity: 10,
    unit: 'tonne',
    price_per_unit_inr: 4500,
    state: user?.state || 'Punjab',
    city: user?.city || 'Ludhiana',
    availability_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    image_url: SAMPLE_IMAGES[0].url
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await listingAPI.getCategories();
      setCategories(res.data || []);
      if (res.data?.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (err) {
      console.warn('Failed to load categories');
    }
  };

  const handleNext = () => {
    setError('');

    if (step === 1 && !formData.category_id) {
      setError('Please select a material category to continue');
      return;
    }

    if (step === 2) {
      if (!formData.title.trim()) {
        setError('Please provide a specific material name');
        return;
      }
      if (!formData.description.trim()) {
        setError('Please describe the industrial process and material composition');
        return;
      }
    }

    if (step === 3) {
      if (Number(formData.quantity) <= 0 || Number(formData.price_per_unit_inr) <= 0) {
        setError('Quantity and asking price must be greater than zero');
        return;
      }
    }

    if (step === 4) {
      if (!formData.state.trim() || !formData.city.trim()) {
        setError('State and city location are required for freight calculation');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await listingAPI.createListing({
        ...formData,
        category_id: Number(formData.category_id),
        quantity: Number(formData.quantity),
        price_per_unit_inr: Number(formData.price_per_unit_inr)
      });

      showToast(`Material lot listed successfully! Reference ID: ${res.data.listing?.unique_code}`);
      navigate(`/marketplace/${res.data.listing?.id}`);
    } catch (err) {
      console.error('Publish listing error:', err);
      setError(err.response?.data?.error || 'Failed to publish listing. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find(c => c.id === Number(formData.category_id)) || categories[0];
  const totalValuation = Math.round(Number(formData.quantity) * Number(formData.price_per_unit_inr));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          6-STEP LISTING WIZARD
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          List Industrial Waste / By-Product
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Monetize industrial scrap by listing verified specifications for circular feedstock buyers.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Category' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Economics' },
            { num: 4, label: 'Location' },
            { num: 5, label: 'Image' },
            { num: 6, label: 'Publish' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                s.num === step
                  ? 'text-brand-700 font-bold'
                  : s.num < step
                  ? 'text-slate-700 font-medium'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 font-bold ${
                  s.num === step
                    ? 'bg-brand-600 text-white ring-2 ring-brand-200'
                    : s.num < step
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s.num < step ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[10px] hidden sm:block uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Step 1: Select Material Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the primary industrial classification for your waste or by-product.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category_id: cat.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    Number(formData.category_id) === cat.id
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    Number(formData.category_id) === cat.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{cat.description}</p>
                    <span className="text-[10px] text-brand-700 font-semibold block mt-1">
                      Avg Market: ₹{cat.avg_market_price_inr?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Step 2: Enter Material Details</h3>
              <p className="text-slate-500 mt-0.5">
                Provide technical specifications and industrial origin.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Material Name / Stream Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Parboiled Basmati Rice Husk (Moisture <9%)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quality Grade / Specification <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.quality_grade}
                  onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="Grade A">Grade A (Direct Industrial Feedstock)</option>
                  <option value="Grade B">Grade B (Reprocessing Required)</option>
                  <option value="Industrial Reusable">Industrial Reusable (Conditioned)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Circular Application
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biomass boiler fuel, green cement pozzolan..."
                  value={formData.expected_use}
                  onChange={(e) => setFormData({ ...formData, expected_use: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Technical Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Specify generation source, moisture %, ash content, chemical impurities, packaging type (baled, loose, tankers)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: QUANTITY & PRICING */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Step 3: Enter Quantity and Pricing</h3>
              <p className="text-slate-500 mt-0.5">
                Set commercially competitive pricing in INR (₹).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Available Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Measurement Unit <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-bold"
                >
                  <option value="tonne">Tonnes (Heavy Solid Bulk)</option>
                  <option value="kg">Kilograms (KG)</option>
                  <option value="litre">Litres (Liquids/Solvents/Oils)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Asking Price per {formData.unit} (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={formData.price_per_unit_inr}
                  onChange={(e) => setFormData({ ...formData, price_per_unit_inr: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-sm font-bold"
                />
              </div>
            </div>

            {/* Total Valuation Preview Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">Gross Lot Economic Value</span>
                <span className="text-xs text-emerald-700">Calculated as {formData.quantity} {formData.unit} × ₹{formData.price_per_unit_inr}</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-800">
                ₹{totalValuation.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION & AVAILABILITY */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Step 4: Location and Availability</h3>
              <p className="text-slate-500 mt-0.5">
                Specify plant site for freight estimation and pickup scheduling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  State / Region <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                >
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  City / Industrial Hub <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ludhiana, Panipat, Manesar..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dispatch / Pickup Readiness Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.availability_date}
                onChange={(e) => setFormData({ ...formData, availability_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 5: UPLOAD IMAGE */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Step 5: Upload Material Photography</h3>
              <p className="text-slate-500 mt-0.5">
                Select a verified industrial material sample or supply an image URL.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Curated High-Res Industrial Material Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SAMPLE_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setFormData({ ...formData, image_url: img.url })}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      formData.image_url === img.url ? 'border-brand-600 ring-2 ring-brand-300' : 'border-slate-200'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-24 object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 bg-charcoal-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded text-center truncate block">
                      {img.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Or Enter Custom Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW AND PUBLISH */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                FINAL VERIFICATION
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Step 6: Preview and Publish to Marketplace</h3>
              <p className="text-slate-500">
                Review your material lot specifications before publishing to prospective buyers.
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden max-w-lg mx-auto shadow-sm">
              <div className="relative h-48 bg-slate-200">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-charcoal-900/90 text-white text-[10px] font-bold px-2 py-1 rounded">
                    {selectedCategoryObj?.name}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge type="grade" status={formData.quality_grade} />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">{formData.title || 'Untitled Material'}</h4>
                <p className="text-slate-600 text-xs line-clamp-2">{formData.description}</p>

                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Lot Size</span>
                    <strong className="text-slate-900">{formData.quantity} {formData.unit}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Asking Price</span>
                    <strong className="text-brand-700">₹{Number(formData.price_per_unit_inr).toLocaleString('en-IN')}/{formData.unit}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>Location: <strong>{formData.city}, {formData.state}</strong></span>
                  <span>Ready: <strong>{formData.availability_date}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handlePublish}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Publishing Lot...' : 'Publish to Marketplace'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
