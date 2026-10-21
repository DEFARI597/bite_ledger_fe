import apiClient from './apiClient';

export const recipeService = {
  async getRecipeItems({ page = 1, limit = 20, productId = '', rawMaterialId = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (productId) params.append('productId', productId);
    if (rawMaterialId) params.append('rawMaterialId', rawMaterialId);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get(`/v1/recipes${query}`);
    return res.data;
  },

  async getRecipeByProductId(productId) {
    const res = await apiClient.get(`/v1/recipes/product/${productId}`);
    return res.data;
  },

  async getRecipesByRawMaterialId(rawMaterialId) {
    const res = await apiClient.get(`/v1/recipes/raw-material/${rawMaterialId}`);
    return res.data;
  },

  async getRecipeItemById(id) {
    const res = await apiClient.get(`/v1/recipes/${id}`);
    return res.data;
  },

  async addRecipeItem({ productId, rawMaterialId, quantityRequired }) {
    const res = await apiClient.post('/v1/recipes', {
      productId,
      rawMaterialId,
      quantityRequired,
    });
    return res.data;
  },

  async updateRecipeItem(id, { quantityRequired }) {
    const res = await apiClient.put(`/v1/recipes/${id}`, {
      quantityRequired,
    });
    return res.data;
  },

  async syncProductRecipe(productId, items) {
    const res = await apiClient.put(`/v1/recipes/product/${productId}`, {
      items,
    });
    return res.data;
  },

  async deleteRecipeItem(id) {
    const res = await apiClient.delete(`/v1/recipes/${id}`);
    return res.data;
  },
};

export default recipeService;
