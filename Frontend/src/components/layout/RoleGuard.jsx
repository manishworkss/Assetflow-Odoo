import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert } from 'lucide-react';

export const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.role) {
    return null;
  }

  // If user role is in allowedRoles list, render children
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // If fallback component provided, render that
  if (fallback !== null) {
    return fallback;
  }

  // Default clean RBAC denied message
  return (
    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg mx-auto my-12">
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Access Restricted</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Your current role (<span className="font-semibold text-slate-700 dark:text-slate-200">{user.role}</span>) does not have authorization to view or perform actions on this section.
      </p>
      <div className="text-xs text-slate-400">
        Tip: Use the instant **Role Switcher** in the top navbar during the hackathon demo to test different permissions!
      </div>
    </div>
  );
};
