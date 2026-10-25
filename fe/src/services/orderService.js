import apiClient from "./apiClient";

export const orderService = {
  async getOrders(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.status) searchParams.append("status", params.status);
    if (params.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);
    if (params.userId) searchParams.append("userId", params.userId);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    if (params.search && params.search.trim()) searchParams.append("search", params.search.trim());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await apiClient.get(`/v1/orders${query}`);
    return res.data;
  },

  async getOrderById(id) {
    const res = await apiClient.get(`/v1/orders/${id}`);
    return res.data;
  },

  async createOrder(data) {
    const res = await apiClient.post("/v1/orders", data);
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const res = await apiClient.patch(`/v1/orders/${id}/status`, { status });
    return res.data;
  },

  async getOrderStatistics(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await apiClient.get(`/v1/orders/statistics${query}`);
    return res.data;
  },
};

export default orderService;
