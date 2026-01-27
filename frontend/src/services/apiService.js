// Complete API Service for Hotel Booking System
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
);

// API endpoints
const api = {
  // Auth
  login: (email, password) => apiClient.post('/users/signin', { email, password }),
  register: (userData) => apiClient.post('/users/signup', userData),
  
  // Hotels
  getHotels: () => apiClient.get('/hotels'),
  getHotel: (id) => apiClient.get(`/hotels/${id}`),
  searchHotels: (params) => apiClient.get('/hotels/search', { params }),
  getHotelRooms: (hotelId) => apiClient.get(`/hotels/${hotelId}/rooms`),
  
  // Bookings
  createBooking: (data) => apiClient.post('/bookings', data),
  getUserBookings: () => apiClient.get('/bookings/my-bookings'),
  cancelBooking: (id) => apiClient.delete(`/bookings/${id}`),
  
  // Generic
  get: (url) => apiClient.get(url),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default api;