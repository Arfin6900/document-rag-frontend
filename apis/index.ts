import axios from 'axios';
import createDashboardRoutes from './dashboardRoutes';
const baseUrl = 'http://localhost:5000';
export const postWithFormData = async (api, url, formData) => {
  if (!api || typeof api.post !== 'function') {
    throw new Error('Invalid Axios instance provided to postWithFormData.');
  }
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createBackendServer = (baseURL) => {
  const api = axios.create({
    baseURL: `${baseURL}`,
    headers: {
      Accept: 'application/json',
      'Ngrok-Skip-Browser-Warning': 'true', // 🔥 Bypasses the ngrok warning page
    },
    timeout: 60 * 1000,
  });

  // Request Interceptor to attach the token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error?.response?.data?.data?.error ||
        'Something went wrong. Please try again.';
      return Promise.reject(message);
    }
  );

  // ✅ Method to send FormData specifically
  const sendFormData = async (url, formData, method = 'POST') => {
    try {
      const response = await api({
        url,
        method,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...createDashboardRoutes(api), // HR APIs
    sendFormData, // ✅ FormData API
  };
};

const apis = createBackendServer(baseUrl);

export default apis;
