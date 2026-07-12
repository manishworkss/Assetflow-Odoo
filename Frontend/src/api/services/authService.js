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
    const response = await apiClient.post('/auth/login', { email, password });
    return {
      token: response.accessToken,
      user: response.user
    };
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
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return {
      token: response.accessToken,
      user: response.user
    };
  },

  /**
   * Aligned with POST /api/auth/google
   * Google OAuth 2.0 Sign In / Sign Up — sends credential (ID token) to backend for secure verification
   */
  googleLogin: async (credential) => {
    const response = await apiClient.post('/auth/google', { credential });
    return {
      token: response.accessToken,
      user: response.user
    };
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

  /**
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return 'If that email exists, a password reset link has been sent.';
    }
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * POST /api/auth/reset-password
   */
  resetPassword: async (email, token, newPassword) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return 'Password successfully reset.';
    }
    return apiClient.post('/auth/reset-password', { email, token, newPassword });
  },
};

