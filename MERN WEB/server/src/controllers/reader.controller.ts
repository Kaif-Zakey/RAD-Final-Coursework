import mongoose from "mongoose";
import { ApiError } from "../errors/ApiError";
import { ReaderModel } from "../models/Reader";
import { Request, Response, NextFunction } from "express";

export const createReader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reader = new ReaderModel(req.body);
    await reader.save();
    res.status(201).json(reader);
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
