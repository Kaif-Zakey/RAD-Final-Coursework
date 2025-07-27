import { Router } from "express";
import {
  signUp,
  getAllUsers,
  login,
  refreshToken,
  logout,
  changePassword,
  updateProfile,
  getCurrentUser,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller";

import { authenticateToken } from "../middlewares/authenticateToken";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/users", authenticateToken, getAllUsers);
authRouter.post("/refresh-token", refreshToken);
authRouter.put("/change-password", authenticateToken, changePassword);
authRouter.put("/update-profile", authenticateToken, updateProfile);
authRouter.get("/profile", authenticateToken, getCurrentUser);
authRouter.post("/logout",authenticateToken, logout);

// ✅ Forgot & Reset Password routes
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
