import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('voicebiz_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('voicebiz_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState('welcome'); // 'welcome' | 'login' | 'signup'

  // Store & Application Data
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [business, setBusiness] = useState({
    name: 'Murugan Maligai & Department Store',
    tagline: 'Daily Provisions & Fresh Essentials',
    ownerName: 'S. Murugan',
    phone: '+91 98421 23456',
    email: 'murugan@voicebiz.in',
    address: '124, West Tower Street, Madurai',
    currency: '₹',
    avatarIcon: '🏪',
    preferredLanguage: 'ta'
  });

  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('voicebiz_gemini_key') || '');
  const [activeLang, setActiveLang] = useState(() => localStorage.getItem('voicebiz_lang') || 'ta');
  const [inventoryStockFilter, setInventoryStockFilter] = useState('all'); // 'all' | 'out_of_stock' | 'low_stock' | 'in_stock'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  // Save Gemini Key
  const saveGeminiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('voicebiz_gemini_key', key);
    showToast('Gemini API key updated successfully');
  };

  // Language Switch
  const changeLanguage = (lang) => {
    setActiveLang(lang);
    localStorage.setItem('voicebiz_lang', lang);
  };

  // Auth Operations
  const loginUser = (newToken, newUser) => {
    localStorage.setItem('voicebiz_token', newToken);
    localStorage.setItem('voicebiz_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const logoutUser = () => {
    localStorage.removeItem('voicebiz_token');
    localStorage.removeItem('voicebiz_user');
    setToken(null);
    setUser(null);
    setAuthView('welcome');
    showToast('Logged out successfully. See you soon!', 'warning');
  };

  // Check / Validate Session on initial load
  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('voicebiz_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('voicebiz_user', JSON.stringify(res.user));
          } else {
            logoutUser();
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logoutUser();
        }
      }
      setAuthLoading(false);
    }
    verifyAuth();
  }, []);

  // Refresh Business Store Data
  const refreshAll = useCallback(async () => {
    if (!token && !user) return; // Only fetch if user is authenticated
    try {
      setLoading(true);
      const [statsRes, prodRes, custRes, txRes, bizRes] = await Promise.all([
        api.getDashboardStats().catch(() => ({ stats: null })),
        api.getProducts().catch(() => ({ products: [] })),
        api.getCustomers().catch(() => ({ customers: [] })),
        api.getTransactions().catch(() => ({ transactions: [] })),
        api.getBusiness().catch(() => ({ business: null }))
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (prodRes.products) setProducts(prodRes.products);
      if (custRes.customers) setCustomers(custRes.customers);
      if (txRes.transactions) setTransactions(txRes.transactions);
      if (bizRes.business) setBusiness(bizRes.business);
    } catch (err) {
      console.error('Error refreshing business data:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (token) {
      refreshAll();
    }
  }, [token, refreshAll]);

  const value = {
    // Auth
    token,
    user,
    isAuthenticated: Boolean(token && user),
    authLoading,
    authView,
    setAuthView,
    loginUser,
    logoutUser,

    // Store State
    stats,
    products,
    customers,
    transactions,
    business,
    geminiApiKey,
    saveGeminiKey,
    activeLang,
    changeLanguage,
    inventoryStockFilter,
    setInventoryStockFilter,
    loading,
    toast,
    showToast,
    refreshAll
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
