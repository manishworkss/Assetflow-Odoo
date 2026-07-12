import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/common/Button';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useUiStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
      showToast('If that email exists, a reset link has been sent.', 'success');
      // For development, we auto-redirect to reset password so they can type it in
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      showToast(err.message || 'Failed to send reset link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1E192A] to-[#2B1B38] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/80 overflow-hidden p-8">
        
        <div className="mb-6">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </button>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reset your password</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {!isSent 
              ? "Enter your work email address and we'll send you a link to reset your password."
              : "Check your email for the reset code."}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              variant="odoo"
              size="lg"
              loading={loading}
              className="w-full justify-center mt-4"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                We've sent an email to <strong>{email}</strong>. 
                <br /><br />
                Redirecting to reset page...
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/reset-password', { state: { email } })}
            >
              Enter Reset Code Manually
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
