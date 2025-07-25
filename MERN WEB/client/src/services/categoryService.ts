import { apiClient } from "./apiClient";
import type { Category, CategoryFormData } from "../types/Category";

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get("/categories");
  return res.data;
};

export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  const res = await apiClient.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id: string, data: CategoryFormData): Promise<Category> => {
  const res = await apiClient.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
