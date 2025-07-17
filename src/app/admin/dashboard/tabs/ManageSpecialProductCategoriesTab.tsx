import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

const ManageSpecialProductCategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("special_product_categories").select("*").order("id");
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
      await supabase.from("special_product_categories").update({ name, description }).eq("id", editing);
      setMessage("Category updated!");
    } else {
      await supabase.from("special_product_categories").insert({ name, description });
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
    await supabase.from("special_product_categories").delete().eq("id", id);
    setMessage("Category deleted!");
    fetchCategories();
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Special Product Categories</h2>
      <form onSubmit={handleAddOrUpdate} className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border px-2 py-1 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(""); setDescription(""); }} className="ml-2 px-2 py-1 bg-gray-200 rounded">
            Cancel
          </button>
        )}
      </form>
      {message && <div className="mb-4 text-center text-blue-700 font-medium">{message}</div>}
      {loading && <div className="mb-4 text-center">Loading...</div>}
      <ul>
        {categories.map(cat => (
          <li key={cat.id} className="flex items-center gap-2 mb-2 border-b py-2">
            <span className="font-semibold">{cat.name}</span>
            <span className="text-gray-500 text-sm">{cat.description}</span>
            <button onClick={() => handleEdit(cat)} className="text-blue-600 px-2">Edit</button>
            <button onClick={() => handleDelete(cat.id)} className="text-red-600 px-2">Delete</button>
          </li>
        ))}
      </ul>
      {categories.length === 0 && !loading && <div className="text-center text-gray-500 mt-8">No categories found.</div>}
    </div>
  );
};

export default ManageSpecialProductCategoriesTab; 