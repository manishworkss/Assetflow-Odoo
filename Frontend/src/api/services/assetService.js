import { apiClient } from '../client';
import { mockAssets, mockCategories, mockDepartments } from '../mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const assetService = {
  /**
   * Aligned with Teammate Phase 4: GET /api/assets
   * Supports filtering by status, categoryId, departmentId, search query
   */
  getAssets: async (filters = {}) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...mockAssets];
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter((a) => a.status === filters.status);
      }
      if (filters.categoryId && filters.categoryId !== 'ALL') {
        results = results.filter((a) => a.categoryId === Number(filters.categoryId));
      }
      if (filters.departmentId && filters.departmentId !== 'ALL') {
        results = results.filter((a) => a.departmentId === Number(filters.departmentId));
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.assetTag.toLowerCase().includes(query) ||
            a.serialNumber.toLowerCase().includes(query) ||
            (a.assignedToName && a.assignedToName.toLowerCase().includes(query))
        );
      }
      return results;
    }
    return apiClient.get('/assets', { params: filters });
  },

  getAssetById: async (idOrTag) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const found = mockAssets.find((a) => String(a.id) === String(idOrTag) || a.assetTag === idOrTag);
      if (!found) throw new Error('Asset not found');
      return found;
    }
    return apiClient.get(`/assets/${idOrTag}`);
  },

  getAssetByTag: async (tag) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const found = mockAssets.find((a) => a.assetTag === tag);
      if (!found) throw new Error('Asset not found');
      return found;
    }
    return apiClient.get(`/assets/tag/${tag}`);
  },

  /**
   * Aligned with Teammate Phase 4: POST /api/assets
   */
  createAsset: async (assetData) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const cat = mockCategories.find((c) => c.id === Number(assetData.categoryId));
      const dept = mockDepartments.find((d) => d.id === Number(assetData.departmentId));
      const newAsset = {
        id: Date.now(),
        assetTag: assetData.assetTag || `AF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: assetData.name,
        categoryId: Number(assetData.categoryId),
        categoryName: cat ? cat.name : 'General Equipment',
        serialNumber: assetData.serialNumber || 'N/A',
        acquisitionDate: assetData.acquisitionDate || new Date().toISOString().split('T')[0],
        acquisitionCost: Number(assetData.acquisitionCost) || 0,
        conditionStatus: assetData.conditionStatus || 'NEW',
        location: assetData.location || 'HQ Main Store',
        status: 'AVAILABLE',
        isSharedBookable: assetData.isSharedBookable || false,
        assignedToId: null,
        assignedToName: null,
        departmentId: Number(assetData.departmentId) || 101,
        departmentName: dept ? dept.name : 'Engineering & IT',
        photoUrl: assetData.photoUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        history: [
          {
            id: Date.now() + 1,
            date: new Date().toISOString().split('T')[0],
            action: 'REGISTERED',
            user: 'Current User',
            notes: assetData.initialNotes || 'Initial registration into AssetFlow inventory'
          }
        ]
      };
      mockAssets.unshift(newAsset);
      if (cat) cat.totalAssets = (cat.totalAssets || 0) + 1;
      if (dept) dept.assetCount = (dept.assetCount || 0) + 1;
      return newAsset;
    }
    return apiClient.post('/assets', assetData);
  },

  updateAssetStatus: async (id, status, notes = '') => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = mockAssets.findIndex((a) => String(a.id) === String(id));
      if (index === -1) throw new Error('Asset not found');
      mockAssets[index].status = status;
      if (notes) {
        mockAssets[index].history.unshift({
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          action: `STATUS_UPDATED_${status}`,
          user: 'Current User',
          notes
        });
      }
      return mockAssets[index];
    }
    return apiClient.put(`/assets/${id}/status`, { status, notes });
  }
};
