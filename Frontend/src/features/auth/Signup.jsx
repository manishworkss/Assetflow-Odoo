import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, departmentService } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../../components/common/Button';
import { Box, Lock, Mail, User, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState(101);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useUiStore();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepts();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await authService.signup(name, email, password, Number(departmentId));
      login(user, token, true);
      showToast(`Account created successfully! Welcome to AssetFlow, ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Registration failed. Try a different email.', 'error');
    } finally {
      setLoading(false);
    }
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
                  Employee Onboarding
                </span>
              </div>
            </div>

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
                  <strong>Teammate Phase 3 Compliant:</strong> New registrations are assigned the `EMPLOYEE` role automatically by default.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  Department Heads or Admins can promote you to higher roles directly via the Organization Setup screen!
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-purple-200/60 border-t border-white/10 pt-4 flex justify-between">
            <span>Built by Team 4</span>
            <span>Frontend Lead: Manish Kumar</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create Employee Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your details below to request access to the AssetFlow inventory
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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
                  placeholder="e.g. Vikram Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                />
              </div>
            </div>

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
                  placeholder="vikram@assetflow.odoo"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Department Assignment
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#714B67] transition-all appearance-none cursor-pointer"
                >
                  {departments.length > 0 ? (
                    departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.headName ? `Head: ${d.headName}` : 'No Head'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="101">Engineering & IT</option>
                      <option value="102">Facilities & Ops</option>
                      <option value="103">Field Operations</option>
                    </>
                  )}
                </select>
              </div>
            </div>

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
              className="w-full justify-center mt-4"
            >
              Complete Registration & Enter Workspace
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#714B67] dark:text-purple-400 hover:underline">
              Sign In to AssetFlow
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
