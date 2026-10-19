import apiClient from './apiClient';

export const inventoryService = {
  async getRawMaterials({ page = 1, limit = 10, search = '', supplierId = '', lowStock = false } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search && search.trim()) params.append('search', search.trim());
    if (supplierId) params.append('supplierId', supplierId);
    if (lowStock) params.append('lowStock', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/v1/raw-materials${query}`);
    return res.data;
  },

  async getRawMaterialById(id) {
    const res = await apiClient.get(`/v1/raw-materials/${id}`);
    return res.data;
  },

  async createRawMaterial(data) {
    const res = await apiClient.post('/v1/raw-materials', data);
    return res.data;
  },

  async updateRawMaterial(id, data) {
    const res = await apiClient.put(`/v1/raw-materials/${id}`, data);
    return res.data;
  },

  async adjustStock(id, { change, setStock }) {
    const res = await apiClient.patch(`/v1/raw-materials/${id}/stock`, {
      change,
      setStock,
    });
    return res.data;
  },

  async deleteRawMaterial(id) {
    const res = await apiClient.delete(`/v1/raw-materials/${id}`);
    return res.data;
  },
};

export default inventoryService;
