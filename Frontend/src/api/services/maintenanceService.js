import { apiClient } from '../client';
import { mockMaintenanceRequests, mockAssets } from '../mockData';
import { useAuthStore } from '../../store/authStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const maintenanceService = {
  /**
   * Aligned with Teammate Phase 6: GET /api/maintenance
   */
  getMaintenanceRequests: async (status = null) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (status && status !== 'ALL') {
        return mockMaintenanceRequests.filter((m) => m.status === status);
      }
      return [...mockMaintenanceRequests];
    }
    const params = status && status !== 'ALL' ? { status } : {};
    return apiClient.get('/maintenance', { params });
  },

  /**
   * Aligned with Teammate Phase 6: POST /api/maintenance
   */
  createMaintenanceRequest: async ({ assetId, issueDescription, priority, photoUrl }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const asset = mockAssets.find((a) => String(a.id) === String(assetId) || a.assetTag === assetId);
      if (!asset) throw new Error('Asset not found');

      // Update asset status to UNDER_MAINTENANCE
      asset.status = 'UNDER_MAINTENANCE';
      asset.conditionStatus = 'NEEDS_SERVICING';

      const currentUser = useAuthStore.getState().user || { id: 1, name: 'Marcus Sterling', departmentName: 'Engineering & IT' };
      const newReq = {
        id: Date.now(),
        assetTag: asset.assetTag,
        assetName: asset.name,
        raisedById: currentUser.id,
        raisedByName: currentUser.name,
        departmentName: currentUser.departmentName || 'Engineering & IT',
        issueDescription,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        technicianAssigned: 'Unassigned',
        raisedDate: new Date().toISOString().split('T')[0],
        costEstimate: null,
        photoUrl: photoUrl || null
      };
      mockMaintenanceRequests.unshift(newReq);

      asset.history.unshift({
        id: Date.now() + 1,
        date: newReq.raisedDate,
        action: 'MAINTENANCE_RAISED',
        user: currentUser.name,
        notes: issueDescription
      });

      return newReq;
    }
    return apiClient.post('/maintenance', { assetId, issueDescription, priority, photoUrl });
  },

  updateMaintenanceStatus: async (id, status, technicianAssigned = '', costEstimate = null) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockMaintenanceRequests.findIndex((m) => Number(m.id) === Number(id));
      if (index === -1) throw new Error('Maintenance request not found');

      const req = mockMaintenanceRequests[index];
      req.status = status;
      if (technicianAssigned) req.technicianAssigned = technicianAssigned;
      if (costEstimate !== null && costEstimate !== undefined) req.costEstimate = Number(costEstimate);

      // If resolved, put asset back to AVAILABLE and GOOD
      if (status === 'RESOLVED') {
        const asset = mockAssets.find((a) => a.assetTag === req.assetTag);
        if (asset) {
          asset.status = 'AVAILABLE';
          asset.conditionStatus = 'GOOD';
          asset.history.unshift({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            action: 'MAINTENANCE_RESOLVED',
            user: 'Service Tech / Admin',
            notes: `Resolved repair ticket #${req.id}. Cost: $${req.costEstimate || 0}`
          });
        }
      }
      return req;
    }
    return apiClient.put(`/maintenance/${id}`, { status, technicianAssigned, costEstimate });
  }
};
