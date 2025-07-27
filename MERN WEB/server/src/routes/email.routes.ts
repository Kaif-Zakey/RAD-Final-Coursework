// src/routes/emailRoutes.ts
import express from "express"
import { sendOverdueNotification } from "../controllers/email.controller"

const emailRouter = express.Router()
emailRouter.post("/notifyOverdue", sendOverdueNotification)

export default emailRouter;