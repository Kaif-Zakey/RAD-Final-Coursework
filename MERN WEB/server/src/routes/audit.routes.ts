// routes/audit.routes.ts
import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const auditRouter = Router();

auditRouter.get("/audit-logs", authenticateToken, getAuditLogs);
export default auditRouter;
