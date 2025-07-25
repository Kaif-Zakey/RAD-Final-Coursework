import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { createReader, deleteReader, getReaderById, getReaders, updateReader } from "../controllers/reader.controller";



const readerRouter = Router();

readerRouter.use(authenticateToken);
readerRouter.post("/",createReader);
readerRouter.get("/", getReaders);
readerRouter.delete("/:id", deleteReader);
readerRouter.get("/:id", getReaderById);
readerRouter.put("/:id", updateReader);


export default readerRouter;
