import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(403, "Access token not found"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return next(new ApiError(403, "Access token expired!"));
      } else if (err instanceof JsonWebTokenError) {
        return next(new ApiError(403, "Invalid access token"));
      } else {
        return next(new ApiError(403, "Error verifying access token"));
      }
    }

    if (!decoded || typeof decoded === "string") {
      return next(new ApiError(500, "Access token payload error"));
    }

    req.userId = (decoded as { userId: string }).userId;
    next();
  });
};
