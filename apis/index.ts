import axios from 'axios';
import createDashboardRoutes from './dashboardRoutes';
const baseUrl = 'http://localhost:8000';
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
    },
    timeout: 60 * 1000,
    withCredentials: false, // Include credentials in requests
  });

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
