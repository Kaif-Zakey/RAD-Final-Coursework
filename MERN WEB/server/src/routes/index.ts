import { Router } from "express";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import categoryRouter from "./category.routes";
import readerRouter from "./reader.routes";
import lendingRouter from "./lending.routes";


const rootRouter =Router()

rootRouter.use("/auth",authRouter);
rootRouter.use("/books",bookRouter);
rootRouter.use("/categories",categoryRouter)
rootRouter.use("/readers",readerRouter)
rootRouter.use("/lendings",lendingRouter)


export default rootRouter;