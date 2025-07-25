import {Request, Response, NextFunction} from "express";
import {ApiError} from "../errors/ApiError";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken"


interface AuthenticatedRequest extends Request{
    user?: {
        UserId: string;
        name: string;
        email: string;
        
    };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) =>{
    try{
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]

        // 401 -> unauthorized
        // 403 -> forbidden

        if (!token){
            throw new ApiError(403, "Access token not found")
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
            (err, decoded) => {
                if (err){
                    if (err instanceof TokenExpiredError){
                        throw new ApiError(403, "Access token expired!")
                    }else if (err instanceof JsonWebTokenError){
                        throw new ApiError(403, "Invalid access token")
                    }else{
                        throw new ApiError(403, "Error verifying access token")
                    }
                }
                if (!decoded || typeof decoded === "string"){
                    throw new ApiError(500, "Access token payload error")
                }

                next()

            }
        )

    }catch (error) {
        next(error)
    }
}