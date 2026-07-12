import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Sun,
  Moon,
  Plus,
  LogOut,
  UserCheck,
  Building,
  Menu,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

export const TopNavbar = () => {
  const { user, setRole, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, openModal, toggleSidebar } = useUiStore();

  const availableRoles = [
    { code: 'ADMIN', label: 'Admin (Full Access)' },
    { code: 'ASSET_MANAGER', label: 'Asset Manager' },
    { code: 'DEPARTMENT_HEAD', label: 'Department Head' },
    { code: 'EMPLOYEE', label: 'Employee' }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Building className="w-4 h-4 text-[#714B67]" />
          <span>Department:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {user?.departmentName || 'Engineering & IT'}
          </span>
        </div>
      </div>

      {/* Right Section: Role Switcher & Action Tools */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hackathon Instant Role Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/60 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#714B67] dark:text-purple-400 animate-pulse hidden sm:block" />
          <span className="text-xs font-semibold text-[#714B67] dark:text-purple-300 hidden md:inline">Demo Role:</span>
          <select
            value={user?.role || 'ADMIN'}
            onChange={(e) => setRole(e.target.value)}
            className="text-xs font-bold bg-transparent text-[#714B67] dark:text-purple-200 focus:outline-none cursor-pointer pr-1"
            title="Switch role instantly to test RBAC live across screens!"
          >
            {availableRoles.map((r) => (
              <option key={r.code} value={r.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action + Asset Registration Button */}
        {(user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD') && (
          <Button
            variant="odoo"
            size="sm"
            icon={Plus}
            onClick={() => openModal('REGISTER_ASSET')}
            className="hidden sm:inline-flex"
          >
            New Asset
          </Button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-[#714B67] text-white font-bold text-xs flex items-center justify-center shadow-xs select-none">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'MK'}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Manish Kumar'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {user?.email || 'manish@assetflow.odoo'}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
