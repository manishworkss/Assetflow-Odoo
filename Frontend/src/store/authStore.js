import { create } from 'zustand';

// Try to load initial session from storage
const storedToken = sessionStorage.getItem('assetflow_token') || localStorage.getItem('assetflow_token');
const storedUser = sessionStorage.getItem('assetflow_user') || localStorage.getItem('assetflow_user');

const initialUser = storedUser ? JSON.parse(storedUser) : {
  id: 1,
  name: 'Manish Kumar',
  email: 'manish@assetflow.odoo',
  role: 'ADMIN', // Default to ADMIN for instant full-access demoing
  departmentId: 101,
  departmentName: 'Engineering & IT'
};

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: storedToken || 'mock-jwt-token-assetflow-2026',
  isAuthenticated: true,

  initializeAuth: () => {
    const token = sessionStorage.getItem('assetflow_token') || localStorage.getItem('assetflow_token');
    const user = sessionStorage.getItem('assetflow_user') || localStorage.getItem('assetflow_user');
    if (token && user) {
      try {
        set({ token, user: JSON.parse(user), isAuthenticated: true });
      } catch (e) {
        set({ user: initialUser, token: 'mock-jwt-token-assetflow-2026', isAuthenticated: true });
      }
    } else {
      set({ user: initialUser, token: 'mock-jwt-token-assetflow-2026', isAuthenticated: true });
    }
  },

  login: (user, token, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('assetflow_token', token);
    storage.setItem('assetflow_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('assetflow_token');
    localStorage.removeItem('assetflow_user');
    sessionStorage.removeItem('assetflow_token');
    sessionStorage.removeItem('assetflow_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Hackathon Instant Role Switcher for live demos to judges
  setRole: (newRole) => {
    const currentUser = get().user || initialUser;
    const updatedUser = { ...currentUser, role: newRole };
    localStorage.setItem('assetflow_user', JSON.stringify(updatedUser));
    sessionStorage.setItem('assetflow_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  updateUser: (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('assetflow_user', JSON.stringify(updatedUser));
    sessionStorage.setItem('assetflow_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));
