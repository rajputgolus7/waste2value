import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show auto-dismissing toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const initAuth = async () => {
    const savedToken = localStorage.getItem('w2m_token');
    const savedUser = localStorage.getItem('w2m_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with server in background
        const res = await authAPI.getMe();
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('w2m_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Session verification fallback to stored user');
      }
    } else {
      // Default to Seller Demo for seamless judging experience
      try {
        await switchDemoPersona('seller', false);
      } catch (err) {
        console.error('Initial demo login error:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('w2m_token', newToken);
    localStorage.setItem('w2m_user', JSON.stringify(newUser));
    localStorage.removeItem('w2m_demo_user_id');
    showToast(`Welcome back, ${newUser.name}!`);
    return newUser;
  };

  const switchDemoPersona = async (role, showNotification = true) => {
    try {
      const res = await authAPI.demoLogin(role);
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('w2m_token', newToken);
      localStorage.setItem('w2m_user', JSON.stringify(newUser));
      localStorage.setItem('w2m_demo_user_id', newUser.id);
      if (showNotification) {
        showToast(`Switched persona to ${role.toUpperCase()}: ${newUser.name} (${newUser.company_name || 'System Admin'})`, 'info');
      }
      return newUser;
    } catch (err) {
      console.error('Demo switch error:', err);
      showToast(`Failed to switch demo persona to ${role}`, 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('w2m_token');
    localStorage.removeItem('w2m_user');
    localStorage.removeItem('w2m_demo_user_id');
    showToast('Signed out successfully', 'info');
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('w2m_token', newToken);
    localStorage.setItem('w2m_user', JSON.stringify(newUser));
    showToast(`Account registered successfully for ${newUser.company_name || newUser.name}!`);
    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        switchDemoPersona,
        showToast,
        isAuthenticated: !!user,
        isSeller: user?.role === 'seller',
        isBuyer: user?.role === 'buyer',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in transition-all">
          <div
            className={`flex items-start space-x-3 p-4 rounded-xl shadow-2xl border ${
              toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700'
                : toast.type === 'info'
                ? 'bg-slate-900/95 text-white border-slate-700'
                : 'bg-emerald-900/95 text-white border-emerald-700'
            }`}
          >
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
