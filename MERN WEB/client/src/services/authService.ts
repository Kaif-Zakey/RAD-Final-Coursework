import type { User } from "../types/User.ts";
import { apiClient } from "./apiClient";

export interface SignupResponse{
    name : string
    email : string
    _id : string
}

export interface LoginResponse{
    name : string
    email : string
    accessToken: string
    _id : string
}

export const signUp = async (userData: User): Promise<SignupResponse> => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
};

export const login = async (loginData: Omit<User, "name">): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", loginData);
    return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout"); // Clear refreshToken cookie on backend
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("user"); // Remove stored user data
    window.location.href = "/"; // Redirect to login page
  }
};

export const updateProfile = async (profileData: { name: string; email: string }): Promise<{ message: string; user: SignupResponse }> => {
  const response = await apiClient.put("/auth/update-profile", profileData);
  return response.data;
};


export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const response = await apiClient.put("/auth/change-password", passwordData);
  return response.data;
};


export const getCurrentUser = async (): Promise<SignupResponse> => {
  const response = await apiClient.get("/auth/profile"); // Make sure this route exists
  return response.data;
};


export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

// Example in authService.ts
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await apiClient.post(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
};

