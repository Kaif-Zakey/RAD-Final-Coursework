import type { Reader, ReaderFormData } from "../types/Reader";
import { apiClient } from "./apiClient";


// Fetch all readers
export const getReaders = async (): Promise<Reader[]> => {
  const response = await apiClient.get("/readers");
  return response.data;
};

// Fetch a reader by ID
export const getReaderById = async (id: string): Promise<Reader> => {
  const response = await apiClient.get(`/readers/${id}`);
  return response.data;
};

// Create a new reader
export const createReader = async (readerData: ReaderFormData): Promise<Reader> => {
  const response = await apiClient.post("/readers", readerData);
  return response.data;
};

// Update a reader
export const updateReader = async ( id: string,updatedData:Omit<Reader,"_id"> ): Promise<Reader> => {
  const response = await apiClient.put(`/readers/${id}`, updatedData);
  return response.data;
};

// Delete a reader
export const deleteReader = async (id: string): Promise<{ message: string }> => {
  const { data } = await apiClient.delete<{ message: string }>(`/readers/${id}`);
  return data;
};


// get total readers count
export const getTotalReaders = async (): Promise<number> => {
  const { data } = await apiClient.get("/readers/count");
  return data;
};