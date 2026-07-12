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
        return Promise.reject(new Error(errorMsg));
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
    const requestUrl = error.config?.url || '';

    // Auth endpoints (login, signup, verify-otp, resend-otp) — NEVER auto-redirect on 401.
    // A 401 here means wrong credentials, not an expired session.
    const isAuthEndpoint = requestUrl.includes('/auth/');
    const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/signup');

    if (status === 401 && !isAuthEndpoint && !isAuthPage) {
      // Session token expired on a protected route — log out and redirect
      useAuthStore.getState().logout();
      useUiStore.getState().showToast('Session expired. Please log in again.', 'warning');
      window.location.href = '/login';
      return Promise.reject(new Error('Unauthorized: Session expired'));
    }

    // Handle 403 Forbidden (RBAC violation)
    if (status === 403) {
      useUiStore.getState().showToast('Access denied: You do not have permission for this action.', 'error');
      return Promise.reject(new Error('Forbidden: Access denied'));
    }

    // Propagate the error — let the calling component's catch() show its own toast
    return Promise.reject(new Error(errorMessage));
  }
);
