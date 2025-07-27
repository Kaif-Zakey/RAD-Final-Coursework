import mongoose from "mongoose";
import { ApiError } from "../errors/ApiError";
import { ReaderModel } from "../models/Reader";
import { Request, Response, NextFunction } from "express";
import { logAudit } from "../utils/AuditLogger";

export const createReader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reader = new ReaderModel(req.body);
    await reader.save();
    res.status(201).json(reader);
    // Audit log for reader creation
    await logAudit({
      req,
      action: "CREATE",
      entity: "Reader",
      entityId: reader._id
        .toString(),
      description: `Created reader with name ${reader.name} and email ${reader.email}`,
    });

  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
    next(error);
  }
};

export const getReaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const readers = await ReaderModel.find();
    res.status(200).json(readers);
  } catch (error: any) {
    next(error);
  }
};

export const deleteReader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedReader = await ReaderModel.findByIdAndDelete(req.params.id);
    if (!deletedReader) {
      throw new ApiError(404, "Reader not found!");
    }
    res.status(200).json({ message: "Reader deleted!" });
    
    // Audit log for reader deletion
    await logAudit({
      req,
      action: "DELETE",
      entity: "Reader",
      entityId: deletedReader._id.toString(),
      description: `Deleted reader with name ${deletedReader.name} and email ${deletedReader.email}`,
    });

  } catch (error: any) {
    next(error);
  }
};

export const getReaderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reader = await ReaderModel.findById(req.params.id);
    if (!reader) {
      throw new ApiError(404, "Reader not found!");
    }
    res.status(200).json(reader);
  } catch (error: any) {
    next(error);
  }
};

export const updateReader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedReader = await ReaderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReader) {
      throw new ApiError(404, "Reader not found!");
    }
    res.status(200).json(updatedReader);
    // Audit log for reader update
    await logAudit({
      req,
      action: "UPDATE",
      entity: "Reader",
      entityId: updatedReader._id.toString(),
      description: `Updated reader with name ${updatedReader.name} and email ${updatedReader.email}`,
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
    next(error);
  }
};


// get total counter of readers
export const getTotalReaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalReaders = await ReaderModel.countDocuments();
    res.status(200).json( totalReaders );
  } catch (error: any) {
    next(error);
  }
};
