import { NextFunction, Request, Response } from "express";
import { CategoryModel } from "../models/Category";
import { ApiError } from "../errors/ApiError";
import { logAudit } from "../utils/AuditLogger";



export const createCategory = async(
    req:Request,
    res:Response,
    next:NextFunction) =>
    {
        try {
            const category = new CategoryModel(req.body);
            await category.save();
            res.status(201).json(category);
            // Audit log for category creation
            await logAudit({
                req,
                action: "CREATE",
                entity: "Category",
                entityId: category._id.toString(),
                description: `Category ${category.name} created`
            });

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
        // Audit log for category deletion
        await logAudit({
            req,
            action: "DELETE",
            entity: "Category",
            entityId: deleteCategory._id.toString(),
            description: `Category ${deleteCategory.name} deleted`
        });
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
        // Audit log for category update
        await logAudit({
            req,
            action: "UPDATE",
            entity: "Category",
            entityId: category._id.toString(),
            description: `Category ${category.name} updated`
        });
    } catch (error:any) {
        next(error);
    }
}

// get total categories count
export const getTotalCategoriesCount = async(
    _req:Request,
    res:Response
) => {
    try {
        const count = await CategoryModel.countDocuments();
        res.json({ totalCategories: count });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Error fetching total categories count", error });
    }
}