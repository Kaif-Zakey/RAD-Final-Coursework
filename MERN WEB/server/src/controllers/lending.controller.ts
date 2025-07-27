import { Request, Response } from "express";
import { BookModel } from "../models/Book";
import { ReaderModel } from "../models/Reader";
import { LendingModel } from "../models/Lending";
import { logAudit } from "../utils/AuditLogger";


export const lendBook = async (req: Request, res: Response) => {
  try {
    const { bookId, readerId, loanDays = 14 } = req.body; // loanDays defaults to 14 days

    // Check if book exists
    const book = await BookModel.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if reader exists
    const reader = await ReaderModel.findById(readerId);
    if (!reader) return res.status(404).json({ message: "Reader not found" });

    // Check available copies
    if (book.availableCopies <= 0)
      return res.status(400).json({ message: "No available copies of this book" });

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    // Create lending record
    const lending = await LendingModel.create({
      book: book._id,
      reader: reader._id,
      borrowedAt: new Date(),
      dueDate,
      status: "BORROWED",
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(await lending.populate(["book", "reader"]));

    // Audit log for lending
    await logAudit({
      req,
      action: "LEND",
      entity: "Lending Record",
      entityId: lending._id.toString(),
      description: `Lent book "${book.title}" to reader "${reader.name}" for ${loanDays} days.`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error lending book", error });
  }
};

/**
 * Mark a book as returned
 */
export const returnBook = async (req: Request, res: Response) => {
  try {
    const  lendingId  = req.params.lendingId.trim();

    const lending = await LendingModel.findById(lendingId);
    if (!lending) return res.status(404).json({ message: "Lending record not found" });

    if (lending.returnedAt)
      return res.status(400).json({ message: "Book already returned" });

    // Mark returned
    lending.returnedAt = new Date();
    lending.status = "RETURNED";
    await lending.save();

    // Increase available copies
    const book = await BookModel.findById(lending.book);
    if (book) {
      book.availableCopies += 1;
      if (book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }
      await book.save();
    }

    res.json(await lending.populate(["book", "reader"]));

    // Audit log for returning
    await logAudit({
      req,
      action: "RETURN",
      entity: "Lending Record",
      entityId: lending._id.toString(),
      description: `Returned book "${book?.title}" from reader "${lending.reader}".`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error returning book", error });
  }
};

/**
 * Get all lending records
 */
export const getLendings = async (_req: Request, res: Response) => {
  try {
    const lendings = await LendingModel.find()
      .populate("book")
      .populate("reader")
      .sort({ borrowedAt: -1 });
    res.json(lendings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lending records", error });
  }
};

/**
 * Get lending by ID
 */
export const getLendingById = async (req: Request, res: Response) => {
  try {
    const lending = await LendingModel.findById(req.params.id)
      .populate("book")
      .populate("reader");
    if (!lending) return res.status(404).json({ message: "Lending record not found" });
    res.json(lending);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lending record", error });
  }
};

/**
 * Get overdue lendings
 */
export const getOverdueLendings = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    // Fetch lendings that are either still borrowed or already marked overdue but not returned, and are past due date
    const overdue = await LendingModel.find({
      status: { $in: ["BORROWED", "OVERDUE"] },
      dueDate: { $lt: now },
    })
      .populate("book")
      .populate("reader");

    // Update status to OVERDUE for any newly overdue records that are still marked BORROWED
    for (const record of overdue) {
      if (record.status === "BORROWED") {
        record.status = "OVERDUE";
        await record.save();
      }
    }

    res.json(overdue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching overdue records", error });
  }
};

// get total lendings count
export const getTotalLendingsCount = async (_req: Request, res: Response) => {
  try {
    const count = await LendingModel.countDocuments();
    res.json( count );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total lendings count", error });
  }
};


// get total overdue count
export const getTotalOverdueCount = async (_req: Request, res: Response) =>
{
  try {
    const now = new Date();
    const count = await LendingModel.countDocuments({
      status: { $in: ["BORROWED", "OVERDUE"] },
      dueDate: { $lt: now },
    });
    res.json( count );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total overdue count", error });
  }
};


// monthly lending

export const getMonthlyLendings = async (_req: Request, res: Response) => {
  try {
    const monthlyLendings = await LendingModel.aggregate([
      {
        $match: {
          borrowedAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: { $month: "$borrowedAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Map the month number to month name if you want:
    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const result = monthlyLendings.map(({ _id, count }) => ({
      month: monthNames[_id] || _id,
      count
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching monthly lending data", error });
  }
};