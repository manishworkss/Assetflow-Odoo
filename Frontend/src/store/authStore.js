import { create } from 'zustand';

// Try to load initial session from storage
const storedToken = sessionStorage.getItem('assetflow_token') || localStorage.getItem('assetflow_token');
const storedUser = sessionStorage.getItem('assetflow_user') || localStorage.getItem('assetflow_user');

const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken && storedUser),

  initializeAuth: () => {
    const token = sessionStorage.getItem('assetflow_token') || localStorage.getItem('assetflow_token');
    const user = sessionStorage.getItem('assetflow_user') || localStorage.getItem('assetflow_user');
    if (token && user) {
      try {
        set({ token, user: JSON.parse(user), isAuthenticated: true });
      } catch (e) {
        set({ user: null, token: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, token: null, isAuthenticated: false });
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

  // Instant Role Switcher for profile elevation and evaluation
  setRole: (newRole) => {
    const defaultAdmin = {
      id: 1,
      name: 'Marcus Sterling',
      email: 'marcus.s@assetflow.com',
      role: 'ADMIN',
      departmentId: 101,
      departmentName: 'Engineering & IT'
    };
    const currentUser = get().user || defaultAdmin;
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
