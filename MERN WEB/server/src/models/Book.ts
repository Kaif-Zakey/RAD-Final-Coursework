import mongoose from "mongoose";

type Book = {
 title: string;
  author: string;
  isbn: string;
  totalCopies: number;       
  availableCopies: number;    
  category: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};


 const bookSchema = new mongoose.Schema<Book>({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    minlength: [2, "Book title must be at least 2 characters"],
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    minlength: [2, "Author name must be at least 2 characters"],
  },
  isbn: {
    type: String,
    required: [true, "ISBN is required"],
    unique: true,
    trim: true,
    minlength: [10, "ISBN must be at least 10 characters"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Book category is required"],
  },
  totalCopies: {
    type: Number,
    required: [true, "Total copies are required"],
    min: [0, "Total copies must be at least 0"],
  },
  availableCopies: {
    type: Number,
    required: [true, "Available copies are required"],
    min: [0, "Available copies must be at least 0"],
  },
}, { timestamps: true });

export const BookModel = mongoose.model("Book", bookSchema);