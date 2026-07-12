import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  Building2,
  BarChart3,
  Bell,
  Box,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']
    },
    {
      name: 'Asset Directory',
      path: '/assets',
      icon: Package,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']
    },
    {
      name: 'Asset Allocations',
      path: '/allocations',
      icon: ArrowLeftRight,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']
    },
    {
      name: 'Resource Bookings',
      path: '/bookings',
      icon: CalendarDays,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']
    },
    {
      name: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']
    },
    {
      name: 'Audit Cycles',
      path: '/audits',
      icon: ClipboardCheck,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']
    },
    {
      name: 'Organization Setup',
      path: '/organization',
      icon: Building2,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']
    },
    {
      name: 'Analytics & Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['ADMIN', 'ASSET_MANAGER']
    },
    {
      name: 'Activity Logs',
      path: '/logs',
      icon: Bell,
      roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']
    }
  ];

  const allowedItems = navigationItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1E192A] text-slate-300 transition-all duration-300 border-r border-slate-800 shadow-xl',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#714B67] to-[#AA3BFF] flex items-center justify-center shrink-0 shadow-md">
            <Box className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-none">AssetFlow</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-semibold mt-1">Enterprise Edition</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 group select-none',
                  isActive
                    ? 'bg-[#714B67] text-white shadow-md shadow-[#714B67]/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )
              }
              title={!sidebarOpen ? item.name : undefined}
            >
              <Icon className={clsx('w-5 h-5 shrink-0 transition-transform group-hover:scale-110')} />
              {sidebarOpen && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Role Info Card */}
      {sidebarOpen && user && (
        <div className="p-3 m-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-slate-400">Current Access Level:</div>
          <div className="text-sm font-bold text-purple-300 flex items-center justify-between mt-0.5">
            <span>{user.role}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      )}
    </aside>
  );
};
