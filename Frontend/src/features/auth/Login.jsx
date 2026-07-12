import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/common/Button';
import { Box, Lock, Mail, Sparkles, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('marcus.s@assetflow.com');
  const [password, setPassword] = useState('admin2026');
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
      showToast(`Welcome back to AssetFlow, ${user.name}! (${user.role})`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoName, roleLabel) => {
    setEmail(demoEmail);
    setPassword('admin2026');
    setLoading(true);
    try {
      const { token, user } = await authService.login(demoEmail, 'admin2026');
      login(user, token, true);
      showToast(`Logged in as ${user.name} (${roleLabel})`, 'success');
      navigate('/');
    } catch (err) {
      showToast('Could not load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { name: 'Marcus Sterling', email: 'marcus.s@assetflow.com', role: 'ADMIN', badge: 'bg-purple-100 text-purple-800' },
    { name: 'Sarah Jenkins', email: 'sarah.j@assetflow.com', role: 'ASSET_MANAGER', badge: 'bg-indigo-100 text-indigo-800' },
    { name: 'David Chen', email: 'david.c@assetflow.com', role: 'DEPARTMENT_HEAD', badge: 'bg-cyan-100 text-cyan-800' },
    { name: 'Elena Rostova', email: 'elena.r@assetflow.com', role: 'EMPLOYEE', badge: 'bg-slate-100 text-slate-800' },
  ];

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
                <span className="text-xs text-[#714B67] dark:text-purple-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
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

          {/* Role Profiles Quick Evaluation Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#714B67] dark:text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1-Click Role Profiles for Evaluation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(account.email, account.name, account.role)}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#714B67] dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-left transition-all group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-[#714B67] dark:group-hover:text-purple-300 truncate">
                      {account.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${account.badge}`}>
                      {account.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                    {account.email}
                  </span>
                </button>
              ))}
            </div>
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
