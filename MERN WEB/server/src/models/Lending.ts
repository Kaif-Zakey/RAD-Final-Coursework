import mongoose, { Schema, Document } from "mongoose";

export type LendingStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export interface Lending {
  book: mongoose.Types.ObjectId;
  reader: mongoose.Types.ObjectId;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date | null;
  status: LendingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const lendingSchema = new Schema<Lending>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    reader: {
      type: Schema.Types.ObjectId,
      ref: "Reader",
      required: [true, "Reader is required"],
    },
    borrowedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED", "OVERDUE"],
      default: "BORROWED",
      required: true,
    },
  },
  { timestamps: true }
);

lendingSchema.pre("save", function (next) {
  if (this.returnedAt) {
    this.status = "RETURNED";
  } else {
    const now = new Date();
    this.status = now > this.dueDate ? "OVERDUE" : "BORROWED";
  }
  next();
});

export const LendingModel = mongoose.model("Lending", lendingSchema);
