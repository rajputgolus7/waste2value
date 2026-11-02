import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Lock,
  Mail,
  Building2,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, switchDemoPersona } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      await switchDemoPersona(role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-800 to-limeaccent-500 p-0.5 mx-auto shadow-md">
          <div className="w-full h-full bg-charcoal-900 rounded-[14px] flex items-center justify-center">
            <Recycle className="w-6 h-6 text-brand-400" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to Waste2Market</h1>
        <p className="text-xs text-slate-500">B2B Industrial Circular Economy Platform</p>
      </div>

      {/* 3 Instant Demo Login Buttons */}
      <div className="bg-brand-50/50 border border-brand-200/80 rounded-3xl p-5 space-y-3 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 block text-center">
          ⚡ 1-Click Hackathon Evaluator Logins:
        </span>

        <button
          onClick={() => handleDemoLogin('seller')}
          className="w-full p-3 rounded-2xl bg-white border border-brand-300 hover:border-brand-500 shadow-2xs hover:shadow text-left flex items-center gap-3 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 group-hover:text-brand-700">1. Seller Persona (Punjab Rice)</div>
            <p className="text-[11px] text-slate-500">Industrial Waste Generator • Basmati Mill</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => handleDemoLogin('buyer')}
          className="w-full p-3 rounded-2xl bg-white border border-blue-200 hover:border-blue-400 shadow-2xs hover:shadow text-left flex items-center gap-3 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 group-hover:text-blue-700">2. Buyer Persona (Green Biomass)</div>
            <p className="text-[11px] text-slate-500">Circular Feedstock Processor • 15 MW Cogen</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => handleDemoLogin('admin')}
          className="w-full p-3 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 shadow-2xs hover:shadow text-left flex items-center gap-3 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 group-hover:text-purple-700">3. Admin Persona (Operations)</div>
            <p className="text-[11px] text-slate-500">Platform Compliance & Auditing Suite</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Manual Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Or Sign in with Credentials
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="seller@waste2market.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:text-brand-900">
            Register Facility
          </Link>
        </p>
      </div>
    </div>
  );
};
