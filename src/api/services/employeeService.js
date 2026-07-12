import { apiClient } from '../client';
import { mockUsers } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const employeeService = {
  /**
   * Aligned with Teammate Phase 4: GET /api/employees
   */
  getEmployees: async (departmentId = null) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (departmentId) {
        return mockUsers.filter((u) => u.departmentId === Number(departmentId));
      }
      return [...mockUsers];
    }
    const params = departmentId ? { departmentId } : {};
    return apiClient.get('/employees', { params });
  },

  /**
   * Aligned with Teammate Phase 4: PUT /api/employees/{id}/role
   * Allows ADMIN or DEPARTMENT_HEAD to promote/demote user roles
   */
  updateEmployeeRole: async (id, newRole) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('Employee not found');
      mockUsers[index] = { ...mockUsers[index], role: newRole };
      return mockUsers[index];
    }
    return apiClient.put(`/employees/${id}/role`, { role: newRole });
  },
};
