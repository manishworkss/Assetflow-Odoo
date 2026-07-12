import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, departmentService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/common/Button';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Lock, Mail, User, Building, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const Signup = () => {
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isFetchingDepts, setIsFetchingDepts] = useState(true);
  const [deptError, setDeptError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useUiStore();

  // Load departments from real backend
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        setIsFetchingDepts(true);
        setDeptError(null);
        const data = await departmentService.getDepartments();
        if (data) {
          setDepartments(data);
          if (data.length > 0) {
            setDepartmentId(String(data[0].id)); // default to first real department ID
          }
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setDeptError(err.message || 'Failed to load departments');
      } finally {
        setIsFetchingDepts(false);
      }
    };
    fetchDepts();
  }, []);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      showToast('Please select your department.', 'error');
      return;
    }
    setLoading(true);
    try {
      await authService.signup(name, email, password, Number(departmentId));
      setStep('otp');
      setResendCooldown(60); // 60s cooldown before first resend
      showToast(`Verification code sent to ${email}. Check your inbox!`, 'success');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      showToast('Please enter the 6-digit code sent to your email.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await authService.verifyOtp(email, otp);
      login(user, token, true);
      showToast(`Welcome to AssetFlow, ${user.name}! Your account is now active.`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Invalid verification code. Please check your email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    try {
      await authService.resendOtp(email);
      setResendCooldown(60);
      showToast(`New verification code sent to ${email}. Check your inbox!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to resend code. Please try again.', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      const { token, user } = await authService.googleLogin(googleResponse.credential);
      login(user, token, true);
      showToast(`Signed up with Google as ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Google Sign-Up failed.', 'error');
    }
  };

  const handleGoogleError = () => {
    showToast('Google Sign-Up was cancelled or failed.', 'error');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1E192A] to-[#2B1B38] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#714B67]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#AA3BFF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Onboarding Info */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#714B67] to-[#452B3F] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <Box className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">AssetFlow</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200 bg-white/10 px-2 py-0.5 rounded-full">
                  {step === 'signup' ? 'Employee Onboarding' : 'Email Verification'}
                </span>
              </div>
            </div>

            {step === 'signup' ? (
              <>
                <h2 className="text-xl font-bold leading-snug text-white/95 mb-4">
                  Join Your Enterprise Team Workspace
                </h2>
                <p className="text-sm text-purple-100/80 leading-relaxed mb-6">
                  Create your corporate profile to requisition equipment, book shared rooms/vehicles, raise maintenance tickets, and complete asset check-ins.
                </p>
                <div className="space-y-3 text-xs text-purple-100/90 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Enterprise Security Compliant:</strong> New registrations are assigned the <code>EMPLOYEE</code> role automatically by default.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      Department Heads or Admins can promote you to higher roles directly via the Organization Setup screen.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold leading-snug text-white/95 mb-4">
                  Check Your Email Inbox
                </h2>
                <p className="text-sm text-purple-100/80 leading-relaxed mb-6">
                  A 6-digit security code has been sent to <span className="font-semibold text-white break-all">{email}</span>. Please check both your inbox and spam folder.
                </p>
                <div className="space-y-3 text-xs text-purple-100/90 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>The code expires in <strong>10 minutes</strong> from the time it was sent.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>Look for an email from <strong>AssetFlow Security & Identity Team</strong>.</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 text-[11px] text-purple-200/60 border-t border-white/10 pt-4 flex justify-between">
            <span>AssetFlow Enterprise Suite</span>
            <span>© 2026 AssetFlow Technologies Inc.</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {step === 'signup' ? (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create Employee Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Join your corporate team workspace and start accessing company assets immediately.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                    />
                  </div>
                </div>

                {/* Work Email */}
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
                      placeholder="john.doe@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Department Assignment
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      required
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all appearance-none cursor-pointer"
                    >
                      {isFetchingDepts && (
                        <option value="" disabled>Loading departments...</option>
                      )}
                      {!isFetchingDepts && deptError && (
                        <option value="" disabled>Error: {deptError}</option>
                      )}
                      {!isFetchingDepts && !deptError && departments.length === 0 && (
                        <option value="" disabled>No departments available</option>
                      )}
                      {!isFetchingDepts && departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
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
                  className="w-full justify-center mt-4"
                >
                  Proceed to OTP Verification
                </Button>
              </form>

              {/* Google OAuth 2.0 Integration */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/80 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                />
              </div>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#714B67] dark:text-purple-400 hover:underline">
                  Sign In to AssetFlow
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[#714B67] dark:text-purple-400 mb-4 shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Enter Verification Code</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
                  Check your inbox and spam folder.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="— — — — — —"
                    className="w-full text-center tracking-[0.5em] font-mono font-bold text-2xl py-4 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-[#714B67] transition-all"
                  />

                  {/* Resend section */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Didn't receive it? Check spam folder.
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading || resendCooldown > 0}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                        resendCooldown > 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-[#714B67] dark:text-purple-400 hover:underline cursor-pointer'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : resendLoading
                        ? 'Sending...'
                        : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="odoo"
                  size="lg"
                  loading={loading}
                  icon={ShieldCheck}
                  className="w-full justify-center"
                >
                  Verify & Activate Account
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setStep('signup'); setOtp(''); }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                  >
                    ← Back to edit registration details
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
