import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/common/Button';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useUiStore();

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token, true);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      const { token, user } = await authService.googleLogin(googleResponse.credential);
      login(user, token, true);
      showToast(`Signed in with Google as ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Google Sign-In failed. Please try again.', 'error');
    }
  };

  const handleGoogleError = () => {
    showToast('Google Sign-In was cancelled or failed.', 'error');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1E192A] to-[#2B1B38] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#714B67]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#AA3BFF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Enterprise Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#714B67] to-[#452B3F] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <Box className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">AssetFlow</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200 bg-white/10 px-2 py-0.5 rounded-full">
                  Enterprise Suite
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold leading-snug text-white/95 mb-4">
              Enterprise Asset & Resource Management System
            </h2>
            <p className="text-sm text-purple-100/80 leading-relaxed mb-6">
              Complete life-cycle tracking from requisition to disposal, zero-overlap room/vehicle reservations, condition check-ins, and automated audit verifications.
            </p>

            <div className="space-y-3 text-xs text-purple-100/90 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2.5 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enterprise Role-Based Access Control (RBAC)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Real-time Lifecycle & Maintenance Tracking</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-purple-200/60 border-t border-white/10 pt-4 flex justify-between">
            <span>AssetFlow Enterprise Platform</span>
            <span>© 2026 AssetFlow Inc.</span>
          </div>
        </div>

        {/* Right Side: Login Form & Demo Quick Switches */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your corporate credentials or choose a quick role profile below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@assetflow.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-[#714B67] dark:text-purple-400 hover:underline cursor-pointer">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="odoo"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full justify-center mt-2"
            >
              Log In to AssetFlow
            </Button>
          </form>

          {/* Google OAuth 2.0 Integration */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/80 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Or sign in with</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
              width="360"
            />
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-[#714B67] dark:text-purple-400 hover:underline">
              Create Employee Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
