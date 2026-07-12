import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Toast } from './Toast';
import { useUiStore } from '../../store/uiStore';
import clsx from 'clsx';

export const AppLayout = () => {
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-20'
        )}
      >
        {/* Top Header Navbar */}
        <TopNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60">
          AssetFlow ERP v1.0 • Odoo Hackathon 2026 • Engineered for seamless Spring Boot + MySQL + JWT Backend Integration
        </footer>
      </div>

      {/* Global Toast Notification System */}
      <Toast />
    </div>
  );
};
