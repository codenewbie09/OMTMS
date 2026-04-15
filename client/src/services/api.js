import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

export const movieService = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
};

export const hallService = {
  getAll: () => api.get('/halls'),
  getById: (id) => api.get(`/halls/${id}`),
  create: (data) => api.post('/halls', data),
  update: (id, data) => api.put(`/halls/${id}`, data),
  delete: (id) => api.delete(`/halls/${id}`),
};

export const showService = {
  getAll: () => api.get('/shows'),
  getById: (id) => api.get(`/shows/${id}`),
  getByMovie: (movieId) => api.get(`/shows/movie/${movieId}`),
  getByHall: (hallId) => api.get(`/shows/hall/${hallId}`),
  getShowSeats: (showId) => api.get(`/shows/${showId}/seats`),
  create: (data) => api.post('/shows', data),
  update: (id, data) => api.put(`/shows/${id}`, data),
  delete: (id) => api.delete(`/shows/${id}`),
};

export const bookingService = {
  getAll: () => api.get('/booking'),
  getById: (id) => api.get(`/booking/${id}`),
  getByCustomer: (customerId) => api.get(`/booking/customer/${customerId}`),
  create: (data) => api.post('/booking', data),
  updateStatus: (id, status) => api.put(`/booking/${id}/status?status=${status}`),
  cancel: (id, reason) => api.post(`/booking/cancel/${id}`, { reason }),
  refund: (id, amount) => api.post(`/booking/refund/${id}`, { amount }),
  verifyTicket: (ticketCode) => api.post(`/booking/verify/${ticketCode}`),
};

export const reportService = {
  getMovieReport: () => api.get('/reports/movies'),
  getHallReport: () => api.get('/reports/halls'),
  getBookingReport: () => api.get('/reports/bookings'),
  getShowReport: () => api.get('/reports/shows'),
  getSummaryReport: () => api.get('/reports/summary'),
};

export default api;