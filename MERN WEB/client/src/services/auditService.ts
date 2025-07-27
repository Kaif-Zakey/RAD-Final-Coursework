import { apiClient } from "./apiClient";
import type { AuditLog } from "../types/AuditLog";

// Fetch all audit logs
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const res = await apiClient.get("/audit/audit-logs");
  return res.data;
};
