/**
 * API Client Service for KickOff Platform
 * Communicates with Express Backend REST API
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('kickoff_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Clear expired token
      localStorage.removeItem('kickoff_token');
      localStorage.removeItem('kickoff_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Courts
  getCourts: (params = '') => request(`/courts${params ? `?${params}` : ''}`),
  getCourtById: (id) => request(`/courts/${id}`),
  getCourtAvailability: (id, date) => request(`/courts/${id}/availability?date=${date}`),
  createCourt: (courtData) => request('/courts', { method: 'POST', body: JSON.stringify(courtData) }),
  updateCourt: (id, courtData) => request(`/courts/${id}`, { method: 'PUT', body: JSON.stringify(courtData) }),
  deleteCourt: (id) => request(`/courts/${id}`, { method: 'DELETE' }),

  // Bookings
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyBookings: () => request('/bookings/my-bookings'),
  getBookingById: (id) => request(`/bookings/${id}`),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),

  // Payments
  createPaymentOrder: (bookingId) => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ bookingId }) }),
  verifyPayment: (paymentDetails) => request('/payments/verify', { method: 'POST', body: JSON.stringify(paymentDetails) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminBookings: (params = '') => request(`/admin/bookings${params ? `?${params}` : ''}`),
  updateBookingStatus: (id, data) => request(`/admin/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getAllUsers: () => request('/admin/users')
};
