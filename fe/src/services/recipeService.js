import apiClient from './apiClient';

export const recipeService = {
  async getProducts() {
    const res = await apiClient.get('/v1/recipes/products');
    return res.data;
  },

  async getRecipeByProductId(productId) {
    const res = await apiClient.get(`/v1/recipes/product/${productId}`);
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
