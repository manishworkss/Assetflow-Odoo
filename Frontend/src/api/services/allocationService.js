import { apiClient } from '../client';
import { mockAssets, mockUsers } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const allocationService = {
  /**
   * Aligned with Teammate Phase 5: POST /api/allocations/assign
   * Enforces business rule: An asset with status ALLOCATED cannot be allocated to another employee without returning first.
   */
  assignAsset: async ({ assetId, employeeId, expectedReturnDate, allocationNotes }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const assetIndex = mockAssets.findIndex((a) => String(a.id) === String(assetId) || a.assetTag === assetId);
      if (assetIndex === -1) throw new Error('Asset not found');
      
      const asset = mockAssets[assetIndex];
      if (asset.status === 'ALLOCATED') {
        throw new Error(`Business Rule Violation: Asset ${asset.assetTag} is already ALLOCATED to ${asset.assignedToName}. Return it first!`);
      }
      if (asset.status === 'UNDER_MAINTENANCE' || asset.status === 'LOST') {
        throw new Error(`Cannot allocate asset in status: ${asset.status}`);
      }

      const employee = mockUsers.find((u) => String(u.id) === String(employeeId));
      if (!employee) throw new Error('Target employee not found');

      mockAssets[assetIndex] = {
        ...asset,
        status: 'ALLOCATED',
        assignedToId: employee.id,
        assignedToName: employee.name,
        departmentId: employee.departmentId,
        departmentName: employee.departmentName,
        expectedReturnDate: expectedReturnDate || null,
        history: [
          {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            action: 'ALLOCATED',
            user: employee.name,
            notes: allocationNotes || `Allocated to ${employee.name} (${employee.departmentName})`
          },
          ...asset.history
        ]
      };
      return mockAssets[assetIndex];
    }
    return apiClient.post('/allocations/assign', { assetId, employeeId, expectedReturnDate, allocationNotes });
  },

  /**
   * Aligned with Teammate Phase 5: POST /api/allocations/return
   * Requires condition inspection and updates inventory status.
   */
  returnAsset: async ({ assetId, returnCondition, returnNotes }) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const assetIndex = mockAssets.findIndex((a) => String(a.id) === String(assetId) || a.assetTag === assetId);
      if (assetIndex === -1) throw new Error('Asset not found');

      const asset = mockAssets[assetIndex];
      const previousHolder = asset.assignedToName || 'Employee';
      const newStatus = returnCondition === 'DAMAGED' || returnCondition === 'NEEDS_SERVICING' 
        ? 'UNDER_MAINTENANCE' 
        : 'AVAILABLE';

      mockAssets[assetIndex] = {
        ...asset,
        status: newStatus,
        conditionStatus: returnCondition || 'GOOD',
        assignedToId: null,
        assignedToName: null,
        expectedReturnDate: null,
        history: [
          {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            action: `RETURNED_${returnCondition || 'GOOD'}`,
            user: previousHolder,
            notes: returnNotes || `Returned in ${returnCondition || 'GOOD'} condition from ${previousHolder}`
          },
          ...asset.history
        ]
      };
      return mockAssets[assetIndex];
    }
    return apiClient.post('/allocations/return', { assetId, returnCondition, returnNotes });
  }
};
