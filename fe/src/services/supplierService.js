import apiClient from './apiClient';

export const supplierService = {
  async getSuppliers({ page = 1, limit = 10, search = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search && search.trim()) params.append('search', search.trim());

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/v1/suppliers${query}`);
    return res.data;
  },

  async getSupplierById(id) {
    const res = await apiClient.get(`/v1/suppliers/${id}`);
    return res.data;
  },

  async createSupplier({ name, contactPerson, phone, address }) {
    const res = await apiClient.post('/v1/suppliers', {
      name,
      contactPerson,
      phone,
      address,
    });
    return res.data;
  },

  async updateSupplier(id, { name, contactPerson, phone, address }) {
    const res = await apiClient.put(`/v1/suppliers/${id}`, {
      name,
      contactPerson,
      phone,
      address,
    });
    return res.data;
  },

  async deleteSupplier(id) {
    const res = await apiClient.delete(`/v1/suppliers/${id}`);
    return res.data;
  },
};

export default supplierService;
