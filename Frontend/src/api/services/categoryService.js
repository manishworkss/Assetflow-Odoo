import { apiClient } from '../client';
import { mockCategories } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const categoryService = {
  /**
   * Aligned with Teammate Phase 4: GET /api/categories
   */
  getCategories: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...mockCategories];
    }
    return apiClient.get('/categories');
  },

  /**
   * Aligned with Teammate Phase 4: POST /api/categories
   */
  createCategory: async (categoryData) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newCat = {
        id: Date.now(),
        name: categoryData.name,
        warrantyPeriodMonths: Number(categoryData.warrantyPeriodMonths) || 12,
        requiresSerial: categoryData.requiresSerial ?? true,
        totalAssets: 0,
      };
      mockCategories.push(newCat);
      return newCat;
    }
    return apiClient.post('/categories', categoryData);
  },
};
