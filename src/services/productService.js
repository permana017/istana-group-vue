import { apiClient } from "./api";

export const productService = {
  async getAll(params) {
    try {
      const response = await apiClient.get("/products", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  },

  async create(product) {
    try {
      const response = await apiClient.post("/products", product);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  },

  async update(id, product) {
    try {
      const response = await apiClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  },

  async remove(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  },

  async getCategories() {
    try {
      const response = await apiClient.get("/products/categories");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  },

  async getByCategory(category) {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products by category"
      );
    }
  },
};
