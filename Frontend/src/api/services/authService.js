import { apiClient } from '../client';
import { mockUsers } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authService = {
  /**
   * Aligned with Teammate Phase 3: POST /api/auth/login
   * Returns: { token: string, user: UserDto }
   */
  login: async (email, password) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        throw new Error('Invalid email or password. Try marcus.s@assetflow.com / admin2026');
      }
      return {
        token: `mock-jwt-token-${foundUser.id}-${Date.now()}`,
        user: foundUser,
      };
    }
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Aligned with Teammate Phase 3: POST /api/auth/signup
   * Note: Signup creates an EMPLOYEE account by default without role selection
   */
  signup: async (name, email, password, departmentId = 101) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already registered');
      }
      const newUser = {
        id: Date.now(),
        name,
        email,
        role: 'EMPLOYEE', // Strict business rule: always EMPLOYEE on signup
        departmentId,
        departmentName: 'Engineering & IT',
        status: 'ACTIVE',
      };
      mockUsers.push(newUser);
      return {
        token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
        user: newUser,
      };
    }
    return apiClient.post('/auth/signup', { name, email, password, departmentId });
  },
};
