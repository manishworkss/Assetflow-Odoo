import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';
import { AppLayout } from './components/layout/AppLayout';
import { RoleGuard } from './components/layout/RoleGuard';

// Phase 2 Screens
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { ResetPassword } from './features/auth/ResetPassword';
import { Dashboard } from './features/dashboard/Dashboard';
import { OrgSetup } from './features/organization/OrgSetup';
import { AssetDirectory } from './features/assets/AssetDirectory';

// Phase 3 Screens
import { Allocations } from './features/allocations/Allocations';
import { ResourceBooking } from './features/bookings/ResourceBooking';
import { MaintenanceKanban } from './features/maintenance/MaintenanceKanban';

// Phase 4 Screens
import { AuditCycle } from './features/audits/AuditCycle';
import { AnalyticsReports } from './features/reports/AnalyticsReports';
import { ActivityLogs } from './features/notifications/ActivityLogs';

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
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" replace />} />
        <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" replace />} />

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

          {/* Phase 3 Advanced Workflows */}
          <Route path="allocations" element={<Allocations />} />
          <Route path="bookings" element={<ResourceBooking />} />
          <Route path="maintenance" element={<MaintenanceKanban />} />

          {/* Phase 4 Audits, Analytics & Logs */}
          <Route path="audits" element={<AuditCycle />} />
          <Route path="analytics" element={<AnalyticsReports />} />
          <Route path="activity-logs" element={<ActivityLogs />} />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
