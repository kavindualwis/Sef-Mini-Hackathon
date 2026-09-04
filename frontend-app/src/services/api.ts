import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Auth API calls
export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),

  verify: (data: { email: string; code: string }) =>
    api.post('/auth/verify', data),

  resendCode: (data: { email: string }) =>
    api.post('/auth/resend-code', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Service API calls
export const serviceAPI = {
  create: (data: {
    userId?: string;
    providerName: string;
    providerEmail: string;
    title: string;
    category: string;
    experience: string;
    price: string;
    description: string;
    location: { address: string; lat: number; lng: number; city: string };
  }) => api.post('/services', data),

  getAll: (params?: { category?: string; search?: string }) =>
    api.get('/services', { params }),

  getMyServices: (email: string) =>
    api.get('/services/my-services', { params: { email } }),

  getById: (id: string) => api.get(`/services/${id}`),

  update: (id: string, data: {
    title: string;
    category: string;
    experience: string;
    price: string;
    description: string;
    location: { address: string; lat: number; lng: number; city: string };
  }) => api.put(`/services/${id}`, data),

  delete: (id: string) => api.delete(`/services/${id}`),
};

export default api;
