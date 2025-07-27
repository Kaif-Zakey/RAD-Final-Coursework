export interface OverdueBook {
  title: string;
  dueDate: string; // or Date if you're managing Date objects
}

export interface OverdueEmailPayload {
  email: string;
  readerName: string;
  books: OverdueBook[];
}
