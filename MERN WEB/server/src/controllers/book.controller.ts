import { Request, Response, NextFunction } from "express";
import { BookModel } from "../models/Book";
import { ApiError } from "../errors/ApiError";
import { logAudit } from "../utils/AuditLogger";


export const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const book = new BookModel(req.body);
        await book.save();
        res.status(201).json(book);
        // Audit log for book creation
        await logAudit({
            req,
            action: "CREATE",
            entity: "Book",
            entityId: book._id.toString(),
            description: `Book ${book.title} created`
        });
    } catch (error:any) {
        next(error);
        
    }
}

export const getBooks = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const books = await BookModel.find().populate("category");
        res.status(200).json(books);
    } catch (error:any) {
        next(error);
    }
}

export const deleteBook = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const deleteBook= await BookModel.findByIdAndDelete(req.params.id)
        if (!deleteBook){
            throw new ApiError(404, "Book not found!");
        }
        res.status(200).json({message: "Book deleted!"});
        // Audit log for book deletion
        await logAudit({
            req,
            action: "DELETE",
            entity: "Book",
            entityId: deleteBook._id.toString(),
            description: `Book ${deleteBook.title} deleted`
        });

    } catch (error:any) {
        next(error);
    }
}

export const getBooksById = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const book = await BookModel.findById(req.params.id).populate("category");
        if (!book) {
            throw new ApiError(404, "Book not found!");
        }
        res.status(200).json(book);
    } catch (error:any) {
        next(error);
    }
}

export const updatedBook = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const updateBook = await BookModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // return the updated book
                runValidators: true // validate the updated book
            }
        );
        if (!updateBook) {
            throw new ApiError(404, "Book not found!");
        }
        res.status(200).json(updateBook);
        // Audit log for book update
        await logAudit({
            req,
            action: "UPDATE",
            entity: "Book",
            entityId: updateBook._id.toString(),
            description: `Book ${updateBook.title} updated`
        });
        
    } catch (error:any) {
        next(error);
    }
}


// get total books count
export const getTotalBooksCount = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const count = await BookModel.countDocuments();
        res.status(200).json( count );
    } catch (error:any) {
        next(error);
    }
}