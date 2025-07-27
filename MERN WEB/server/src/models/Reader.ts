import mongoose, { Schema, Document, Model } from "mongoose";

export interface Reader {
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}



const readerSchema = new Schema<Reader>({
    name: {
      type: String,
      required: [true, "Reader name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Reader email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);



export const ReaderModel = mongoose.model("Reader",readerSchema
);
