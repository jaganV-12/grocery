// VoiceBiz AI Frontend API Client
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('voicebiz_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),
  resetDemoData: () => request('/dashboard/reset-demo', { method: 'POST' }),

  // Voice Assistant
  processVoice: (transcript, language = 'ta', apiKey = '') =>
    request('/voice/process', {
      method: 'POST',
      body: JSON.stringify({ transcript, language, apiKey })
    }),

  // Products (Inventory)
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request('/customers'),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  settleCustomerPayment: (customerId, amount, paymentMethod = 'cash', notes = '') =>
    request('/payments/settle', {
      method: 'POST',
      body: JSON.stringify({ customerId, amount, paymentMethod, notes })
    }),

  // Transactions
  getTransactions: (limit = 100) => request(`/transactions?limit=${limit}`),
  createTransaction: (txData) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData)
    }),

  // Payments
  getPayments: () => request('/payments'),

  // Business Profile
  getBusiness: () => request('/business'),
  updateBusiness: (data) => request('/business', { method: 'PUT', body: JSON.stringify(data) })
};

export default api;
