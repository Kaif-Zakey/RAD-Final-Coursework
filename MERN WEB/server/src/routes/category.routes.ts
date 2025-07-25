import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller";


const categoryRouter =Router();

categoryRouter.use(authenticateToken)
categoryRouter.post("/",createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id",updateCategory);


export default categoryRouter;
