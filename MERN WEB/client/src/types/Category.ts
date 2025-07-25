// Plain frontend types (no mongoose imports!)
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For create/update forms
export interface CategoryFormData {
  name: string;
  description?: string;
}
