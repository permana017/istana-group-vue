import { apiClient } from "./api";

export const userService = {
  async getAllUsers() {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  async createUser(userData) {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },

  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },
};
