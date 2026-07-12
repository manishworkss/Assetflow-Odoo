import { apiClient } from '../client';
import { mockAuditCycles, mockAssets } from '../mockData';
import { useAuthStore } from '../../store/authStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const auditService = {
  /**
   * Aligned with Teammate Phase 6: GET /api/audits
   */
  getAuditCycles: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...mockAuditCycles];
    }
    return apiClient.get('/audits');
  },

  getAuditById: async (id) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const found = mockAuditCycles.find((a) => Number(a.id) === Number(id));
      if (!found) throw new Error('Audit cycle not found');
      return found;
    }
    return apiClient.get(`/audits/${id}`);
  },

  /**
   * Aligned with Teammate Phase 6: POST /api/audits
   */
  createAuditCycle: async ({ title, departmentId, departmentName, locationScope, startDate, endDate }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const currentUser = useAuthStore.getState().user || { name: 'Manish Kumar' };
      const scopedAssets = mockAssets.filter((a) => Number(a.departmentId) === Number(departmentId));
      const newCycle = {
        id: Date.now(),
        title,
        departmentId: Number(departmentId),
        departmentName: departmentName || 'Engineering & IT',
        locationScope: locationScope || 'All Department Floors',
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'OPEN',
        auditors: [currentUser.name],
        totalAssetsScoped: scopedAssets.length || 10,
        verifiedCount: 0,
        missingCount: 0,
        damagedCount: 0,
        discrepancyReportUrl: `/reports/audit-${Date.now()}-discrepancy.pdf`,
        items: scopedAssets.map((a) => ({
          assetTag: a.assetTag,
          assetName: a.name,
          holder: a.assignedToName || 'Unassigned',
          verificationStatus: 'PENDING',
          note: ''
        }))
      };
      mockAuditCycles.unshift(newCycle);
      return newCycle;
    }
    return apiClient.post('/audits', { title, departmentId, locationScope, startDate, endDate });
  },

  /**
   * Verify an individual item in an audit cycle (VERIFIED | MISSING | DAMAGED)
   */
  verifyAuditItem: async (auditId, assetTag, status, note = '') => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const cycle = mockAuditCycles.find((a) => Number(a.id) === Number(auditId));
      if (!cycle) throw new Error('Audit cycle not found');

      const item = cycle.items.find((i) => i.assetTag === assetTag);
      if (!item) throw new Error('Asset item not found in audit scope');

      const oldStatus = item.verificationStatus;
      item.verificationStatus = status;
      item.note = note;

      // Update counters
      if (oldStatus !== status) {
        if (oldStatus === 'VERIFIED') cycle.verifiedCount = Math.max(0, cycle.verifiedCount - 1);
        if (oldStatus === 'MISSING') cycle.missingCount = Math.max(0, cycle.missingCount - 1);
        if (oldStatus === 'DAMAGED') cycle.damagedCount = Math.max(0, cycle.damagedCount - 1);

        if (status === 'VERIFIED') cycle.verifiedCount += 1;
        if (status === 'MISSING') {
          cycle.missingCount += 1;
          const asset = mockAssets.find((a) => a.assetTag === assetTag);
          if (asset) {
            asset.status = 'LOST';
            asset.history.unshift({
              id: Date.now(),
              date: new Date().toISOString().split('T')[0],
              action: 'AUDIT_FLAGGED_MISSING',
              user: 'Audit Verification Team',
              notes: note || `Flagged missing during audit cycle #${cycle.id}`
            });
          }
        }
        if (status === 'DAMAGED') {
          cycle.damagedCount += 1;
          const asset = mockAssets.find((a) => a.assetTag === assetTag);
          if (asset) {
            asset.status = 'UNDER_MAINTENANCE';
            asset.conditionStatus = 'DAMAGED';
            asset.history.unshift({
              id: Date.now(),
              date: new Date().toISOString().split('T')[0],
              action: 'AUDIT_FLAGGED_DAMAGED',
              user: 'Audit Verification Team',
              notes: note || `Flagged damaged during audit cycle #${cycle.id}`
            });
          }
        }
      }
      return cycle;
    }
    return apiClient.put(`/audits/${auditId}/verify`, { assetTag, status, note });
  }
};
