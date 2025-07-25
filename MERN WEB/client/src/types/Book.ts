// Frontend Book type (matches backend model fields, no mongoose imports)
export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: {
    _id: string;
    name?: string;       // optional, usually populated from backend
    description?: string;
  };
  totalCopies: number;
  availableCopies: number;
  createdAt?: string;
  updatedAt?: string;
}

// For forms: only the input data sent to backend (category is _id string)
export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;         // just the category _id string, not full object
  totalCopies: number;
  availableCopies: number;  // required by backend
}
