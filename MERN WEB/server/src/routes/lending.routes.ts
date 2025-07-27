import { Router } from "express";
import {
  lendBook,
  returnBook,
  getLendings,
  getLendingById,
  getOverdueLendings,
  getTotalLendingsCount,
  getTotalOverdueCount,
  getMonthlyLendings,
} from "../controllers/lending.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const lendingRouter = Router();

lendingRouter.use(authenticateToken);

lendingRouter.get("/count",getTotalLendingsCount)
lendingRouter.get("/overdue/count", getTotalOverdueCount);
lendingRouter.get("/monthly",getMonthlyLendings)
lendingRouter.post("/", lendBook); 
lendingRouter.put("/return/:lendingId", returnBook); 
lendingRouter.get("/", getLendings); 
lendingRouter.get("/overdue", getOverdueLendings); 
lendingRouter.get("/:id", getLendingById); 

export default lendingRouter;
