import { apiClient } from '../client';
import { mockDepartments } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const departmentService = {
  /**
   * Aligned with Teammate Phase 4: GET /api/departments
   */
  getDepartments: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return [...mockDepartments];
    }
    return apiClient.get('/departments');
  },

  /**
   * Aligned with Teammate Phase 4: POST /api/departments
   */
  createDepartment: async (deptData) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newDept = {
        id: Date.now(),
        name: deptData.name,
        headId: deptData.headId || null,
        headName: deptData.headName || 'Unassigned',
        parentId: deptData.parentId || null,
        parentName: deptData.parentName || null,
        status: deptData.status || 'ACTIVE',
        assetCount: 0,
      };
      mockDepartments.push(newDept);
      return newDept;
    }
    return apiClient.post('/departments', deptData);
  },

  updateDepartment: async (id, updates) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = mockDepartments.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Department not found');
      mockDepartments[index] = { ...mockDepartments[index], ...updates };
      return mockDepartments[index];
    }
    return apiClient.put(`/departments/${id}`, updates);
  },
};
