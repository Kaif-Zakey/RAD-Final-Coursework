import { Router } from "express";
import {signUp, getAllUsers, login, refreshToken, logout} from "../controllers/auth.controller";
import {authenticateToken} from "../middlewares/authenticateToken";

const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/login", login);

authRouter.get("/users", authenticateToken, getAllUsers);

// /access-token
authRouter.post("/refresh-token", refreshToken)

//logout
authRouter.post("/logout", logout)

export default authRouter;