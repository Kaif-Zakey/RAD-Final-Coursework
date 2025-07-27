import { Request, Response, NextFunction } from "express";
import { LendingModel } from "../models/Lending";
import { ReaderModel } from "../models/Reader";
import { BookModel } from "../models/Book";

interface Activity {
  type: string;
  message: string;
  timestamp: Date;
}

export const getRecentActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recentLendings = await LendingModel.find()
      .populate("book reader")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentReturns = await LendingModel.find({ returnedAt: { $ne: null } })
      .populate("book reader")
      .sort({ returnedAt: -1 })
      .limit(5)
      .lean();

    const recentReaders = await ReaderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentBooks = await BookModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const activities: Activity[] = [
      ...recentLendings.map((lending) => ({
        type: "LEND",
        message: `📚 Book '${(lending.book as any).title}' lent to ${(lending.reader as any).name}`,
        timestamp: lending.createdAt ?? new Date(0),
      })),
      ...recentReturns.map((lending) => ({
        type: "RETURN",
        message: `✅ Book '${(lending.book as any).title}' returned by ${(lending.reader as any).name}`,
        timestamp: lending.returnedAt ?? new Date(0),
      })),
      ...recentReaders.map((reader) => ({
        type: "READER",
        message: `👤 New reader '${reader.name}' registered`,
        timestamp: reader.createdAt ?? new Date(0),
      })),
      ...recentBooks.map((book) => ({
        type: "BOOK",
        message: `📖 New book '${book.title}' added`,
        timestamp: book.createdAt ?? new Date(0),
      })),
    ];

    // Sort by newest timestamp
    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return top 10
    res.status(200).json(activities.slice(0, 10));
  } catch (error) {
    next(error);
  }
};
