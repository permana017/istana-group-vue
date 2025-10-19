import { apiClient } from "./api";

export const cartService = {
  async getUserCarts(userId) {
    try {
      const response = await apiClient.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user carts"
      );
    }
  },

  async createCart(cartData) {
    try {
      const response = await apiClient.post("/carts", cartData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create cart");
    }
  },

  async updateCart(id, cartData) {
    try {
      const response = await apiClient.put(`/carts/${id}`, cartData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update cart");
    }
  },
};
