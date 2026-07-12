import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request Interceptor: Attach Spring Boot JWT Bearer Token (`Authorization: Bearer eyJ...`)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically unwrap Teammate's { success, message, data, timestamp } payload
apiClient.interceptors.response.use(
  (response) => {
    // Teammate's standard Spring Boot response structure:
    // { success: true, message: "Asset retrieved", data: { ... }, timestamp: "..." }
    if (response.data && response.data.success !== undefined) {
      if (response.data.success === false) {
        const errorMsg = response.data.message || 'API operation failed';
        useUiStore.getState().showToast(errorMsg, 'error');
        return Promise.reject(errorMsg);
      }
      // Return clean DTO payload directly inside .data
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || error.message || 'Network or Server Error';

    // Handle Spring Boot Security 401 Unauthorized (invalid or expired JWT token)
    if (status === 401) {
      useAuthStore.getState().logout();
      useUiStore.getState().showToast('Session expired. Please log in again.', 'warning');
      window.location.href = '/login';
      return Promise.reject('Unauthorized: Session expired');
    }

    // Handle 403 Forbidden (RBAC violation)
    if (status === 403) {
      useUiStore.getState().showToast('Access denied: You do not have permission for this action.', 'error');
      return Promise.reject('Forbidden: Access denied');
    }

    // General error toast notification
    useUiStore.getState().showToast(errorMessage, 'error');
    return Promise.reject(errorMessage);
  }
);
