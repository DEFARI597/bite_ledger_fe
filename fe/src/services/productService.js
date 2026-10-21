import apiClient from './apiClient';

export const productService = {
  async getProducts({ page = 1, limit = 50, search = '', category = '', isActive = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search && search.trim()) params.append('search', search.trim());
    if (category) params.append('category', category);
    if (isActive !== '' && isActive !== undefined) params.append('isActive', isActive);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/v1/products${query}`);
    return res.data;
  },

  async getProductById(id) {
    const res = await apiClient.get(`/v1/products/${id}`);
    return res.data;
  },

  async createProduct(data) {
    const res = await apiClient.post('/v1/products', data);
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await apiClient.put(`/v1/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await apiClient.delete(`/v1/products/${id}`);
    return res.data;
  },
};

export default productService;
