import { Request, Response, NextFunction } from "express";
import { AuditLogModel } from "../models/AuditLog";


export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLogModel.find()
      .populate("user", "name email") // populates user's name and email
      .sort({ timestamp: -1 });       // most recent first

    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    next(error); // passes error to global error handler
  }
};
