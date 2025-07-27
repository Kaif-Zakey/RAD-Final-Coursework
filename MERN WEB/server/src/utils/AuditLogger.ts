import { AuditLogModel } from "../models/AuditLog";
import { Request } from "express";

interface AuditParams {
  req: Request;
  userId?: string; // 👈 Added for cases like login
  action: "CREATE" | "UPDATE" | "DELETE" | "LEND" | "RETURN" | "LOGIN" | "LOGOUT" | "RESET_PASSWORD" | "SEND_EMAIL";
  entity: string;
  entityId?: string;
  description?: string;
}

export const logAudit = async ({
  req,
  userId,
  action,
  entity,
  entityId,
  description,
}: AuditParams) => {
  try {
    const finalUserId = userId || (req as any).userId;

    if (!finalUserId) {
      console.warn("Audit log skipped: no user ID available");
      return;
    }

    await AuditLogModel.create({
      user: finalUserId,
      action,
      entity,
      entityId,
      description,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
};
