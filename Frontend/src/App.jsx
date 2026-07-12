import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';
import { AppLayout } from './components/layout/AppLayout';
import { RoleGuard } from './components/layout/RoleGuard';

// Phase 2 Screens
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { Dashboard } from './features/dashboard/Dashboard';
import { OrgSetup } from './features/organization/OrgSetup';
import { AssetDirectory } from './features/assets/AssetDirectory';

export function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const { darkMode } = useUiStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />} />

        {/* Protected Enterprise ERP Portal */}
        <Route
          path="/"
          element={
            isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          {/* Operational Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Asset Management & Catalog */}
          <Route path="assets" element={<AssetDirectory />} />

          {/* Organization & RBAC Setup (Admin / Head Only) */}
          <Route
            path="organization"
            element={
              <RoleGuard allowedRoles={['ADMIN', 'DEPARTMENT_HEAD']}>
                <OrgSetup />
              </RoleGuard>
            }
          />

          {/* Placeholders for upcoming Phase 3 & 4 routes */}
          <Route path="allocations" element={<div className="p-8 text-center text-slate-500 font-bold">Allocations Module Loading...</div>} />
          <Route path="bookings" element={<div className="p-8 text-center text-slate-500 font-bold">Shared Resource Bookings Module Loading...</div>} />
          <Route path="maintenance" element={<div className="p-8 text-center text-slate-500 font-bold">Maintenance Tickets Module Loading...</div>} />
          <Route path="audits" element={<div className="p-8 text-center text-slate-500 font-bold">Q2/Q3 Audit Verification Module Loading...</div>} />
          <Route path="analytics" element={<div className="p-8 text-center text-slate-500 font-bold">Executive Analytics Module Loading...</div>} />
          <Route path="activity-logs" element={<div className="p-8 text-center text-slate-500 font-bold">System Activity Logs Module Loading...</div>} />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
