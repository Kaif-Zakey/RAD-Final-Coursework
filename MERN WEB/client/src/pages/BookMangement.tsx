import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { Book, BookFormData } from "../types/Book";
import type { Category } from "../types/Category";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/bookService";
import { getCategories } from "../services/categoryService";
import Loading from "../components/PageLoading";

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("All");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    id: string | null;
  }>({ show: false, id: null });

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
    availableCopies: 1,
  });

  const fetchBooksAndCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      if (categoriesData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category: categoriesData[0]._id,
        }));
        setFilterCategoryId("All");
      }

      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      toast.error("Failed to load books or categories");
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksAndCategories();
  }, []);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
    if (name === "totalCopies") {
      const total = Number(value);
      setFormData((prev) => ({
        ...prev,
        totalCopies: total,
        availableCopies: editingId === null ? total : prev.availableCopies,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: categories.length > 0 ? categories[0]._id : "",
      totalCopies: 1,
      availableCopies: 1,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.author.trim()) newErrors.author = "Author is required.";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (formData.totalCopies < 1)
      newErrors.totalCopies = "Must be at least 1 copy.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBook = async () => {
    if (!validateForm()) return;
    try {
      const toCreate = {
        ...formData,
        availableCopies: formData.totalCopies,
      };
      const newBook = await createBook(toCreate);
      setBooks((prev) => [...prev, newBook]);
      toast.success("Book added");
      resetForm();
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add book");
      console.error(error);
    }
  };

  const startEditing = (book: Book) => {
    setEditingId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category._id,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });
    setIsAdding(false);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  const saveEditing = async (id: string) => {
    if (!validateForm()) return;
    try {
      const updatedBook = await updateBook(id, formData);
      setBooks((prev) => prev.map((b) => (b._id === id ? updatedBook : b)));
      toast.success("Book updated");
      setEditingId(null);
      fetchBooksAndCategories();
      resetForm();
    } catch (error) {
      toast.error("Failed to update book");
      console.error(error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.isbn.toLowerCase().includes(search);

    const matchesCategory =
      filterCategoryId === "All" || book.category._id === filterCategoryId;

    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "";
  };

  if (loading) {
    return (
     <Loading/>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        Book Management
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-white/20 rounded bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-300 w-full md:w-1/2"
          aria-label="Search books"
        />
        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          className="p-2 border border-white/20 rounded bg-white/10 text-white focus:ring-2 focus:ring-blue-300 w-full md:w-1/4"
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id} className="text-black">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId !== null) && (
        <div className="mb-8 p-6 border border-white/20 rounded bg-white/5">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            {editingId ? "Edit Book" : "Add New Book"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["title", "author", "isbn", "totalCopies"].map((field) => (
              <div key={field}>
                <input
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={field === "totalCopies" ? "number" : "text"}
                  value={formData[field as keyof BookFormData]}
                  onChange={handleChange}
                  min={field === "totalCopies" ? 1 : undefined}
                  className="p-2 border border-white/20 rounded bg-white/10 text-white w-full"
                />
                {errors[field] && (
                  <p className="text-red-400 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
            <div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2 border border-white/20 rounded bg-white/10 text-white w-full"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            {editingId ? (
              <>
                <button
                  onClick={() => saveEditing(editingId)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAddBook}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Book
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setIsAdding(false);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {!isAdding && editingId === null && (
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
        >
          + Add New Book
        </button>
      )}

      <div className="overflow-x-auto rounded shadow-lg">
        {filteredBooks.length === 0 ? (
          <p className="p-6 text-center text-gray-300">No books found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <th className="border border-white/10 px-4 py-2 text-left">Title</th>
                <th className="border border-white/10 px-4 py-2 text-left">Author</th>
                <th className="border border-white/10 px-4 py-2 text-left">Category</th>
                <th className="border border-white/10 px-4 py-2 text-left">ISBN</th>
                <th className="border border-white/10 px-4 py-2 text-left">Total Copies</th>
                <th className="border border-white/10 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-white/5 transition"
                >
                  <td className="border border-white/10 px-4 py-2">{book.title}</td>
                  <td className="border border-white/10 px-4 py-2">{book.author}</td>
                  <td className="border border-white/10 px-4 py-2">{getCategoryName(book.category._id)}</td>
                  <td className="border border-white/10 px-4 py-2">{book.isbn}</td>
                  <td className="border border-white/10 px-4 py-2">{book.totalCopies}</td>
                  <td className="border border-white/10 px-4 py-2 space-x-2">
                    <button
                      onClick={() => startEditing(book)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, id: book._id })}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  try {
                    if (deleteModal.id) {
                      await deleteBook(deleteModal.id);
                      setBooks((prev) => prev.filter((b) => b._id !== deleteModal.id));
                      toast.success("Book deleted");
                    }
                  } catch (error) {
                    toast.error("Failed to delete book");
                    console.error(error);
                  } finally {
                    setDeleteModal({ show: false, id: null });
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
