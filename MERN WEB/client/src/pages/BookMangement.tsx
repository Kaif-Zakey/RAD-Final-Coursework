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

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
    availableCopies: 1,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("All");

  const fetchBooksAndCategories = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchBooksAndCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
  };

  const handleAddBook = async () => {
    const { title, author, isbn, category, totalCopies } = formData;
    if (!title.trim() || !author.trim() || !isbn.trim() || !category || totalCopies < 1) {
      toast.error("Please fill all fields correctly");
      return;
    }
    try {
      const toCreate = { ...formData, availableCopies: totalCopies };
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
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
  };

  const saveEditing = async (id: string) => {
    const { title, author, isbn, category, totalCopies, availableCopies } = formData;
    if (!title.trim() || !author.trim() || !isbn.trim() || !category || totalCopies < 1 || availableCopies < 0) {
      toast.error("Please fill all fields correctly");
      return;
    }
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

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book deleted");
    } catch (error) {
      toast.error("Failed to delete book");
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

      {(isAdding || editingId !== null) && (
        <div className="mb-8 p-6 border border-white/20 rounded bg-white/5">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            {editingId ? "Edit Book" : "Add New Book"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
            <input
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-black">
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              name="isbn"
              placeholder="ISBN"
              value={formData.isbn}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
            <input
              type="number"
              name="totalCopies"
              min={1}
              placeholder="Total Copies"
              value={formData.totalCopies}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
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
              {filteredBooks.map((book) =>
                editingId === book._id ? (
                  <tr key={book._id} className="bg-yellow-50 text-black">
                    <td className="border px-4 py-2">
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      >
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        name="totalCopies"
                        type="number"
                        min={1}
                        value={formData.totalCopies}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => saveEditing(book._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={book._id} className="hover:bg-white/5 transition">
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
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookManagement;
