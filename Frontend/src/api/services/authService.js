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

  /**
   * Aligned with POST /api/auth/verify-otp
   */
  verifyOtp: async (email, otp) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (!otp || otp.trim().length !== 6) {
        throw new Error('Please enter the exact 6-digit OTP verification code sent to your email.');
      }
      let foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        foundUser = {
          id: Date.now(),
          name: email.split('@')[0],
          email,
          role: 'EMPLOYEE',
          departmentId: 101,
          departmentName: 'Engineering & IT',
          status: 'ACTIVE',
        };
        mockUsers.push(foundUser);
      }
      return {
        token: `mock-jwt-token-${foundUser.id}-${Date.now()}`,
        user: foundUser,
      };
    }
    return apiClient.post('/auth/verify-otp', { email, otp });
  },

  /**
   * Aligned with POST /api/auth/google
   * Google OAuth 2.0 Sign In / Sign Up
   */
  googleLogin: async (email = 'alex.rivera@assetflow.com', name = 'Alex Rivera (Google OAuth)') => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      let foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        foundUser = {
          id: Date.now(),
          name,
          email,
          role: 'EMPLOYEE',
          departmentId: 101,
          departmentName: 'Engineering & IT',
          status: 'ACTIVE',
        };
        mockUsers.push(foundUser);
      }
      return {
        token: `mock-jwt-token-google-${foundUser.id}-${Date.now()}`,
        user: foundUser,
      };
    }
    return apiClient.post('/auth/google', { email, name, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' });
  },
  /**
   * POST /api/auth/resend-otp
   * Regenerates a fresh OTP and dispatches it to the user's registered email
   */
  resendOtp: async (email) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return 'A new verification code has been sent to ' + email;
    }
    return apiClient.post('/auth/resend-otp', { email });
  },
};

