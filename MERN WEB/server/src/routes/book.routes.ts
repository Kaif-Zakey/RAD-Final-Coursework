import { Router } from "express";
import { createBook, deleteBook, getBooks, getBooksById, getTotalBooksCount, updatedBook } from "../controllers/book.controller";
import { authenticateToken } from "../middlewares/authenticateToken";


const bookRouter =Router();

bookRouter.use(authenticateToken)
bookRouter.get("/count",getTotalBooksCount);

bookRouter.post("/",createBook)
bookRouter.get("/", getBooks);
bookRouter.delete("/:id",deleteBook);
bookRouter.get("/:id", getBooksById);
bookRouter.put("/:id",updatedBook);


export default bookRouter;