import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getRecentActivity } from "../controllers/recentActivity.controller";


const activityRouter = Router();

activityRouter.use(authenticateToken)
activityRouter.get("/",getRecentActivity)


export default activityRouter;