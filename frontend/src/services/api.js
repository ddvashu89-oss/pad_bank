import axios from 'axios';

// In dev, the API runs as a separate local process (npm run api:dev), so it
// needs an explicit URL. In a Vercel build, the API is deployed as
// serverless functions under the same origin (api/), so a relative path
// just works without needing VITE_API_URL set at all.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('padbank_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('padbank_token');
      localStorage.removeItem('padbank_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
