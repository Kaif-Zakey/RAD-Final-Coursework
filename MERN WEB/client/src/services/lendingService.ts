import apiClient from "./apiClient";
import type { Lending } from "../types/Lending";

export interface LendBookPayload {
  bookId: string;
  readerId: string;
  loanDays?: number; // optional, default 14 on backend
}

// Get all lending records
export const getLendings = async (): Promise<Lending[]> => {
  const { data } = await apiClient.get("/lendings");
  return data;
};

// Create a new lending record
export const lendBook = async (payload: LendBookPayload): Promise<Lending> => {
  const { data } = await apiClient.post("/lendings", payload);
  return data;
};

// Mark a lending as returned
export const returnBook = async (lendingId: string): Promise<Lending> => {
  const { data } = await apiClient.put(`/lendings/return/${lendingId}`);
  return data;
};

// Get lending record by ID
export const getLendingById = async (id: string): Promise<Lending> => {
  const { data } = await apiClient.get(`/lendings/${id}`);
  return data;
};

// Get all overdue lendings
export const getOverdueLendings = async (): Promise<Lending[]> => {
  const { data } = await apiClient.get("/lendings/overdue");
  return data;
};

//get total lendings count
export const getTotalLendingsCount = async (): Promise<number> => {
  const { data } = await apiClient.get("/lendings/count");
  return data;
}

//get Total overdue count
export const getTotalOverdueCount = async (): Promise<number> => {
  const { data } = await apiClient.get("/lendings/overdue/count");
  return data;
}


export interface MonthlyLending {
  month: string;
  count: number;
}

export const getMonthlyLendings = async (): Promise<MonthlyLending[]> => {
  const { data } = await apiClient.get("/lendings/monthly");
  return data;
};