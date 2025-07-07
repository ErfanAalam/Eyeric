import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

const ManageLensCategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("lens_categories").select("*").order("id");
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase.from("lens_categories").update({ name, description }).eq("id", editing);
      setMessage("Category updated!");
    } else {
      await supabase.from("lens_categories").insert({ name, description });
      setMessage("Category added!");
    }
    setName("");
    setDescription("");
    setEditing(null);
    fetchCategories();
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setLoading(true);
    await supabase.from("lens_categories").delete().eq("id", id);
    setMessage("Category deleted!");
    fetchCategories();
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">📂</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manage Lens Categories
          </h1>
          <p className="text-gray-600 text-lg">Organize your lens collection by creating and managing categories</p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{editing ? "✏️" : "+"}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {editing ? "Edit Category" : "Add New Category"}
            </h3>
          </div>

          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {editing ? "💾 Update Category" : "➕ Add Category"}
              </button>
              {editing && (
                <button 
                  type="button" 
                  onClick={() => { setEditing(null); setName(""); setDescription(""); }} 
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-pulse">
              {message}
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
              <div className="w-6 h-6 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Categories List</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            <span className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
              {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
            </span>
          </div>

          <div className="grid gap-4">
            {categories.map((cat, index) => (
              <div 
                key={cat.id} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition-colors duration-300">
                        {cat.name}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {cat.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(cat)} 
                      className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      disabled={loading}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)} 
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
              <span className="text-5xl opacity-50">📂</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Create your first lens category to get started</p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-6 py-3 rounded-xl">
              <span className="text-lg">💡</span>
              <span className="font-medium">Use the form above to add a new category</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLensCategoriesTab;