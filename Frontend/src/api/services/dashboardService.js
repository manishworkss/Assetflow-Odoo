import { apiClient } from '../client';
import { mockAssets, mockDepartments, mockBookings, mockMaintenanceRequests, mockAuditCycles, mockLogs } from '../mockData';
import { useAuthStore } from '../../store/authStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const dashboardService = {
  /**
   * Aligned with Teammate Phase 7: GET /api/dashboard
   * Computes dynamic KPI cards, distribution charts, alerts, and activity logs tailored to the current user's role.
   */
  getDashboardSummary: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const user = useAuthStore.getState().user || { role: 'ADMIN', departmentId: 101, name: 'Manish Kumar' };
      const role = user.role;

      let assets = [...mockAssets];
      let bookings = [...mockBookings];
      let repairs = [...mockMaintenanceRequests];
      let audits = [...mockAuditCycles];

      // If DEPARTMENT_HEAD or EMPLOYEE, scope metrics to their department or assigned assets
      if (role === 'DEPARTMENT_HEAD') {
        assets = assets.filter((a) => Number(a.departmentId) === Number(user.departmentId));
        bookings = bookings.filter((b) => b.departmentName === user.departmentName);
        repairs = repairs.filter((r) => r.departmentName === user.departmentName);
      } else if (role === 'EMPLOYEE') {
        assets = assets.filter((a) => Number(a.assignedToId) === Number(user.id));
        bookings = bookings.filter((b) => Number(b.bookedById) === Number(user.id));
        repairs = repairs.filter((r) => Number(r.raisedById) === Number(user.id));
      }

      const totalAssetsCount = assets.length;
      const allocatedAssetsCount = assets.filter((a) => a.status === 'ALLOCATED').length;
      const availableAssetsCount = assets.filter((a) => a.status === 'AVAILABLE').length;
      const maintenanceCount = assets.filter((a) => a.status === 'UNDER_MAINTENANCE').length;
      const lostCount = assets.filter((a) => a.status === 'LOST').length;

      const totalValuation = assets.reduce((acc, curr) => acc + (curr.acquisitionCost || 0), 0);

      // Overdue Return alerts
      const todayStr = new Date().toISOString().split('T')[0];
      const overdueAssets = assets.filter(
        (a) => a.status === 'ALLOCATED' && a.expectedReturnDate && a.expectedReturnDate < todayStr
      );

      // Category Distribution Chart Data
      const categoryDistribution = [
        { name: 'Electronics & IT', count: assets.filter((a) => a.categoryId === 201).length, color: '#714B67' },
        { name: 'Office Furniture', count: assets.filter((a) => a.categoryId === 202).length, color: '#9D6B91' },
        { name: 'Company Vehicles', count: assets.filter((a) => a.categoryId === 203).length, color: '#64748B' },
        { name: 'Shared AV Equipment', count: assets.filter((a) => a.categoryId === 204).length, color: '#AA3BFF' }
      ];

      // Department Asset Breakdown (For Admin & Asset Manager)
      const departmentBreakdown = mockDepartments.map((d) => {
        const deptAssets = mockAssets.filter((a) => Number(a.departmentId) === Number(d.id));
        const valuation = deptAssets.reduce((sum, item) => sum + (item.acquisitionCost || 0), 0);
        return {
          id: d.id,
          name: d.name,
          assetCount: deptAssets.length,
          valuation: Math.round(valuation)
        };
      });

      return {
        role,
        kpis: {
          totalAssets: totalAssetsCount,
          allocatedAssets: allocatedAssetsCount,
          availableAssets: availableAssetsCount,
          underMaintenance: maintenanceCount,
          lostOrFlagged: lostCount,
          totalValuation: Math.round(totalValuation),
          activeBookings: bookings.filter((b) => b.status === 'ONGOING' || b.status === 'UPCOMING').length,
          pendingRepairs: repairs.filter((r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length,
          openAudits: audits.filter((a) => a.status === 'OPEN').length
        },
        alerts: {
          overdueCount: overdueAssets.length,
          overdueAssets,
          discrepancyCount: lostCount + (repairs.filter((r) => r.priority === 'HIGH' && r.status !== 'RESOLVED').length)
        },
        categoryDistribution,
        departmentBreakdown,
        recentLogs: mockLogs.slice(0, 5),
        recentBookings: bookings.slice(0, 4),
        recentMaintenance: repairs.slice(0, 4)
      };
    }
    return apiClient.get('/dashboard');
  }
};
