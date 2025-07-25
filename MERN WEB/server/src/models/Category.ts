import mongoose from "mongoose";

type Category = {
  name: string;
  description: string;
};

const categorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: [true, "Category name is required 2"],
    unique: true,
    trim: true,
    minlength: [2, "Category name must be at least 2 characters"],
  },
  description: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

export const CategoryModel = mongoose.model("Category", categorySchema);
