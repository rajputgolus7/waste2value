import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token or demo session
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('w2m_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const demoUserId = localStorage.getItem('w2m_demo_user_id');
  if (demoUserId) {
    config.headers['x-demo-user-id'] = demoUserId;
  }
  return config;
});

// API helper functions
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const listingAPI = {
  getCategories: () => api.get('/categories'),
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  getMyListings: () => api.get('/listings/user/my'),
  updateStatus: (id, status) => api.patch(`/listings/${id}/status`, { status }),
  deleteListing: (id) => api.delete(`/listings/${id}`)
};

export const matchingAPI = {
  getMatchesForListing: (listingId) => api.get(`/matching/listing/${listingId}`),
  getMatchesForBuyer: (buyerCompanyId) => api.get('/matching/buyer', { params: { buyerCompanyId } }),
  getAllMatches: () => api.get('/matching/all')
};

export const offerAPI = {
  createOffer: (data) => api.post('/offers', data),
  getMyOffers: () => api.get('/offers/my'),
  acceptOffer: (id) => api.post(`/offers/${id}/accept`),
  rejectOffer: (id, reason) => api.post(`/offers/${id}/reject`, { reason }),
  counterOffer: (id, counter_price_inr, counter_message) => api.post(`/offers/${id}/counter`, { counter_price_inr, counter_message })
};

export const dealAPI = {
  getDeals: () => api.get('/deals'),
  getDealById: (id) => api.get(`/deals/${id}`),
  updateDealStatus: (id, status, note) => api.patch(`/deals/${id}/status`, { status, note })
};

export const calculatorAPI = {
  getPresets: () => api.get('/calculator/presets'),
  compute: (data) => api.post('/calculator/compute', data)
};

export const aiAPI = {
  getCatalog: () => api.get('/ai/catalog'),
  classify: (data) => api.post('/ai/classify', data)
};

export const companyAPI = {
  getCompanies: (params) => api.get('/companies', { params }),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  updateProfile: (data) => api.put('/companies/profile', data),
  requestVerification: (data) => api.post('/companies/verify', data)
};

export const impactAPI = {
  getSummary: () => api.get('/impact/summary'),
  getDashboard: () => api.get('/dashboard')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCompanies: () => api.get('/admin/companies'),
  verifyCompany: (id) => api.post(`/admin/companies/${id}/verify`),
  rejectCompany: (id) => api.post(`/admin/companies/${id}/reject`),
  toggleSuspendListing: (id) => api.post(`/admin/listings/${id}/toggle-suspend`),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
  getTransactions: () => api.get('/admin/transactions')
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.post(`/notifications/${id}/read`)
};

export default api;
