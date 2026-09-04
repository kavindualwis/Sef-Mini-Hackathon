import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5001/api';

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

export default api;
