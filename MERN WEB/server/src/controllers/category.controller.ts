import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "../models/Category";
import { ApiError } from "../errors/ApiError";



export const createCategory = async(
    req:Request,
    res:Response,
    next:NextFunction) =>
    {
        try {
            const category = new CategoryModel(req.body);
            await category.save();
            res.status(201).json(category);
        } catch (error:any) {
            next(error);
        }

    }

export const getCategories = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (error:any) {
        next(error);
    }
}
export const deleteCategory = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id);
        if (!deleteCategory) {
            throw new ApiError(404, "Category not found!");
        }
        res.status(200).json({message: "Category deleted!"});
    } catch (error:any) {
        next(error);
    }
}


export const getCategoryById = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            throw new ApiError(404, "Category not found!");
        }
        res.status(200).json(category);
    } catch (error:any) {
        next(error);
    }
}


export const updateCategory = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const category = await CategoryModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) {
            throw new ApiError(404, "Category not found!");
        }
        res.status(200).json(category);
    } catch (error:any) {
        next(error);
    }
}