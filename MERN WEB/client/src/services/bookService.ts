import { apiClient } from "./apiClient";
import type { Book, BookFormData } from "../types/Book";

// Fetch all books (backend returns category populated)
export const getBooks = async (): Promise<Book[]> => {
  const res = await apiClient.get("/books");
  return res.data;
};

// Create a new book
export const createBook = async (bookData: BookFormData): Promise<Book> => {
  const res = await apiClient.post("/books", bookData);
  return res.data;
};

// Update a book by ID
export const updateBook = async (
  id: string,
  bookData: BookFormData
): Promise<Book> => {
  const res = await apiClient.put(`/books/${id}`, bookData);
  return res.data;
};

// Delete a book by ID
export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};



export const getTotalBooksCount = async (): Promise<number> => {
  const response = await apiClient.get("/books/count");
  return response.data;
};