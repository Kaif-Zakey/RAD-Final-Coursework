import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Category, CategoryFormData } from "../types/Category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import Loading from "../components/PageLoading";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const[loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditing = (category: Category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, description: category.description || "" });
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const saveEditing = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const updated = await updateCategory(editingId!, formData);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingId ? updated : cat))
      );
      toast.success("Category updated");
      cancelEditing();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const newCategory = await createCategory(formData);
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category added");
      setFormData({ name: "", description: "" });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <Loading/>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
        Category Management
      </h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-white/20 rounded bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-300 w-full md:w-1/2"
          aria-label="Search categories"
        />
      </div>

      {/* Add Category Button */}
      {!isAdding && editingId === null && (
        <button
          onClick={() => {
            setFormData({ name: "", description: "" });
            setIsAdding(true);
          }}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
        >
          + Add New Category
        </button>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId !== null) && (
        <div className="mb-8 p-6 border border-white/20 rounded bg-white/5">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Category Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description || ""}
              onChange={handleChange}
              className="p-2 border border-white/20 rounded bg-white/10 text-white"
            />
          </div>
          <div className="flex space-x-4 mt-4">
            {editingId ? (
              <>
                <button
                  onClick={saveEditing}
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
                  onClick={handleAddCategory}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Category
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({ name: "", description: "" });
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

      {/* Categories Table */}
      <div className="overflow-x-auto rounded shadow-lg">
        {filteredCategories.length === 0 ? (
          <p className="p-6 text-center text-gray-300">No categories found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <th className="border border-white/10 px-4 py-2 text-left">Category Name</th>
                <th className="border border-white/10 px-4 py-2 text-left">Description</th>
                <th className="border border-white/10 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) =>
                editingId === cat._id ? (
                  <tr key={cat._id} className="bg-yellow-50 text-black">
                    <td className="border px-4 py-2">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={saveEditing}
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
                  <tr key={cat._id} className="hover:bg-white/5 transition">
                    <td className="border border-white/10 px-4 py-2">{cat.name}</td>
                    <td className="border border-white/10 px-4 py-2">{cat.description || "—"}</td>
                    <td className="border border-white/10 px-4 py-2 space-x-2">
                      <button
                        onClick={() => startEditing(cat)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
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

export default CategoryManagement;
