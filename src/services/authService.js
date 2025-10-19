import { apiClient } from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async getUserProfile() {
    try {
      // Since FakeStore API doesn't have a profile endpoint that uses token,
      // we'll get the user by username johnd for demo purposes
      const response = await apiClient.get("/users/1");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  },
};
