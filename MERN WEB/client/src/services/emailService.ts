import apiClient from "./apiClient";
import type { OverdueEmailPayload } from "../types/Email";

export const sendOverdueEmail = async (payload: OverdueEmailPayload) => {
  const response = await apiClient.post("/email/notifyOverdue", payload);
  return response.data;
};
