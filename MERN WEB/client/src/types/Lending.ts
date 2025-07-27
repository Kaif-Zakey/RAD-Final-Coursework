export type LendingStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export interface BookRef {
  _id: string;
  title: string;
  availableCopies?: number;
  totalCopies?: number;
  // add other book fields if needed
}

export interface ReaderRef {
  _id: string;
  name: string;
  email: string; // optional, as not all readers may have an email
  // add other reader fields if needed
}

export interface Lending {
  _id: string;
  book: BookRef;
  reader: ReaderRef;
  borrowedAt: string;  // ISO date string
  dueDate: string;     // ISO date string
  returnedAt?: string | null;
  status: LendingStatus;
}
