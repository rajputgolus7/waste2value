import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  Sparkles,
  PlusCircle,
  Calculator,
  Scan,
  TrendingUp,
  Handshake,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  Menu,
  X,
  Building,
  User,
  LogOut,
  MapPin
} from 'lucide-react';
import { notificationAPI } from '../services/api';

export const Navbar = () => {
  const { user, isSeller, isBuyer, isAdmin, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.data?.filter(n => !n.is_read)?.length || 0);
    } catch (err) {
      // Quiet fallback
    }
  };

  const handleMarkRead = async (id, link) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (link) {
        setNotificationsOpen(false);
        navigate(link);
      }
    } catch (err) {
      // Quiet
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-800 via-brand-600 to-limeaccent-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  Waste<span className="text-brand-600">2</span>Market
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                  Circular B2B Exchange
                </span>
              </div>
            </Link>

            {/* Desktop Main Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Link
                to="/marketplace"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/marketplace') ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Marketplace
              </Link>

              <Link
                to="/matching"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/matching') ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Smart Matching</span>
              </Link>

              <Link
                to="/calculator"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/calculator') ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-blue-500" />
                <span>Value Calculator</span>
              </Link>

              <Link
                to="/ai-scanner"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/ai-scanner') ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Scan className="w-3.5 h-3.5 text-purple-500" />
                <span>AI Scanner</span>
              </Link>

              <Link
                to="/corridors"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/corridors') || isActive('/map')
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Logistics Map</span>
              </Link>

              <Link
                to="/impact"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/impact') ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Circular Impact</span>
              </Link>
            </div>
          </div>

          {/* Right Header Section (CTA, Notifications, Account) */}
          <div className="flex items-center gap-2.5">
            {/* Primary Action Button */}
            {isSeller ? (
              <Link
                to="/list-waste"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-limeaccent-400" />
                <span>List Waste Material</span>
              </Link>
            ) : (
              <Link
                to="/marketplace"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
              >
                <span>Browse Feedstock</span>
              </Link>
            )}

            {/* Authenticated Links: Deals & Dashboard */}
            {isAuthenticated && (
              <>
                <Link
                  to="/deals"
                  className={`p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors ${
                    isActive('/deals') ? 'bg-brand-50 text-brand-700 font-bold' : ''
                  }`}
                  title="Active Deals & Offers"
                >
                  <Handshake className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className={`p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                    isActive('/dashboard') ? 'bg-brand-50 text-brand-700 font-bold' : ''
                  }`}
                  title="Company Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors ${
                      isActive('/admin') ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} unread)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Live B2B alerts</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkRead(n.id, n.link)}
                              className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                                !n.is_read ? 'bg-brand-50/40 font-medium' : 'text-slate-600'
                              }`}
                            >
                              <div className="font-bold text-slate-900 text-[11px] mb-0.5">{n.title}</div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{n.message}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar / Menu */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 group"
                  title="View Company Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 text-brand-800 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    {user?.company_name ? user.company_name.charAt(0) : 'U'}
                  </div>
                </Link>
              </>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-xs font-semibold animate-fade-in">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            Marketplace
          </Link>
          <Link
            to="/matching"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            Smart Waste Matching
          </Link>
          <Link
            to="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            Waste Value Calculator
          </Link>
          <Link
            to="/ai-scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            AI Waste Classifier
          </Link>
          <Link
            to="/corridors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            Waste Logistics Map (Google Maps)
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-brand-700"
          >
            Circular Impact & ESG
          </Link>
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-900 font-bold"
            >
              Dashboard
            </Link>
            <Link
              to="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-900 font-bold"
            >
              Deals & Offers
            </Link>
            <Link
              to="/list-waste"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-brand-700 font-bold"
            >
              + List Waste Material
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-purple-700 font-bold"
              >
                Admin Control Room
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
