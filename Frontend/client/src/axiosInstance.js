import axios from 'axios';
import API_BASE from './apiConfig';
import { showSuccess, showError } from './toastService';

const instance = axios.create({ baseURL: API_BASE });

// attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  return config;
});

// show success toasts for mutating requests
instance.interceptors.response.use(
  (response) => {
    try {
      const method = response.config.method || '';
      if (method && method.toLowerCase() !== 'get') {
        const msg = response.data && (response.data.message || response.data.msg || 'Success');
        if (msg) showSuccess(msg);
      }
    } catch {
      // ignore
    }
    return response;
  },
  (error) => {
    const msg = error.response?.data?.error || error.message || 'Request failed';
    showError(msg);
    return Promise.reject(error);
  }
);

export default instance;
