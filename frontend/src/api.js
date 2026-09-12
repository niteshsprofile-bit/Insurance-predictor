import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to all requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (email, password, full_name) =>
    api.post('/auth/register', { email, password, full_name }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  verify: () =>
    api.post('/auth/verify'),
};

// Prediction endpoints
export const predictionAPI = {
  predict: (data) =>
    api.post('/predict', data),
  
  getHistory: () =>
    api.get('/history'),
};

export default api;
