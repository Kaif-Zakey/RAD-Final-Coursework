import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";
import { ApiError } from "../errors/ApiError";

//implement jwt
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken"

//jwt token access
const createAccessToken = (userId: string) =>{
    return jwt.sign(
        {userId},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: '200s'}
    )
}

//jwt token refresh
const createRefreshToken = (userId: string) => {
    return jwt.sign(
        {userId},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: '7d'}
    )
}


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const{email, name, password} = req.body
        const SALT = 10
        const hashedPassword = await bcrypt.hash(password, SALT)
        const user = new UserModel({
            email, name,
            password : hashedPassword
        });
        await user.save();
        //res.status(201).json(user); now try to get user data without password showing
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email : user.email
        }
        res.status(201).json(userWithoutPassword)
    } catch (error: any) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find().select("-password"); //excluded password
        res.status(200).json(users);
    } catch (error: any) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const {email, password} = req.body

        const user = await UserModel.findOne({email})

        if(!user){
            throw new ApiError(404, "User not found")
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            throw new ApiError(401, "Invalid email or password")
        }

        //jwt 2 types token addition

        const accessToken = createAccessToken(user._id.toString())

        const refreshToken = createRefreshToken(user._id.toString())

        const isProd = process.env.NODE_ENV === "production"

        //cookie

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure : isProd,
            maxAge : 7 * 24 * 60 * 60 * 1000,//7 days,
            path :"/api/auth/refresh-token"
        })

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email : user.email,
            accessToken
        }

        res.status(200).json(userWithoutPassword)

    }catch (err: any) {
        next(err)
    }
}

export const refreshToken = async (req: Request, res: Response, next : NextFunction) => {
    try{
       const token = req.cookies?.refreshToken
       if(!token){
           throw new ApiError(401, "Refresh token missing")
       }

       jwt.verify(
           token,
           process.env.REFRESH_TOKEN_SECRET!,
           async (err: Error | null, decoded:string |jwt.JwtPayload | undefined)=>{
               if (err){
                   if (err instanceof TokenExpiredError){
                       return next (new ApiError(401,"Refresh token expired"))
                   }else if (err instanceof JsonWebTokenError){
                       return next(new ApiError(401,"Invalid refresh token"))
                   }else{
                       return next(new ApiError(401, "Refresh token error"))
                   }
               }

               if(!decoded || typeof  decoded === "string"){
                   return next(new ApiError(401, "Refresh token payload error"))
               }

               const userId = decoded.userId as string

               const user = await UserModel.findById(userId)

               if(!user){
                   return next(new ApiError(401, "User not found"))
               }

               const newAccessToken = createAccessToken(user._id.toString())

               res.status(200).json({
                   accessToken : newAccessToken
               })

           }
       )

    }catch (error) {
        next(error)
    }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try{
        const isProd = process.env.NODE_ENV === "production"

        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure:isProd,
            expires: new Date(0),
            path: "/api/auth/refresh-token",
        })

        res.status(200).json({message: "Logout successfully"})
    }catch (err) {
        next(err)
    }
}