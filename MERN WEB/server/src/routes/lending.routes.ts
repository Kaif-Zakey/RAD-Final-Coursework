import { Router } from "express";
import {
  lendBook,
  returnBook,
  getLendings,
  getLendingById,
  getOverdueLendings,
} from "../controllers/lending.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const lendingRouter = Router();

lendingRouter.use(authenticateToken);

lendingRouter.post("/", lendBook); 
lendingRouter.put("/return/:lendingId", returnBook); 
lendingRouter.get("/", getLendings); 
lendingRouter.get("/overdue", getOverdueLendings); 
lendingRouter.get("/:id", getLendingById); 

export default lendingRouter;
