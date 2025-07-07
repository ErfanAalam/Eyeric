import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

const ManageLensTab = () => {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lensCategories, setLensCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editingLens, setEditingLens] = useState(null);
  const [editFields, setEditFields] = useState({ title: "", description: "", original_price: "", features: "", category: "", lens_category_id: "" });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  const fetchLenses = async () => {
    setLoading(true);
    let query = supabase.from("lenses").select("*").order("created_at", { ascending: false });
    if (selectedCategoryId) query = query.eq("lens_category_id", selectedCategoryId);
    const { data, error } = await query;
    if (!error && data) setLenses(data);
    setLoading(false);
  };

  const fetchLensCategories = async () => {
    const { data } = await supabase.from("lens_categories").select("*").order("id");
    setLensCategories(data || []);
    if (data && data.length > 0 && !selectedCategoryId) setSelectedCategoryId(data[0].id.toString());
  };

  useEffect(() => { fetchLensCategories(); }, []);
  useEffect(() => { fetchLenses(); }, [selectedCategoryId]);

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this lens?")) return;
    setLoading(true);
    setMessage("");
    const path = imageUrl.split("/product-images/")[1];
    if (path) await supabase.storage.from("product-images").remove([path]);
    const { error } = await supabase.from("lenses").delete().eq("id", id);
    if (error) {
      setMessage("Failed to delete lens");
    } else {
      setMessage("Lens deleted successfully");
      setLenses(lenses.filter((l) => l.id !== id));
    }
    setLoading(false);
  };

  const handleEditClick = (lens) => {
    setEditingLens(lens);
    setEditFields({
      title: lens.title || "",
      description: lens.description || "",
      original_price: lens.original_price?.toString() || "",
      features: lens.features ? lens.features.join("; ") : "",
      category: lens.category || "",
      lens_category_id: lens.lens_category_id || ""
    });
    setEditImageFile(null);
    setEditImagePreview("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
      setEditImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditSave = async () => {
    setLoading(true);
    let imageUrl = editingLens.image_url;
    if (editImageFile) {
      // Remove old image
      if (editingLens.image_url) {
        const path = editingLens.image_url.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
      }
      // Upload new image
      const filePath = `lenses/${Date.now()}_${editImageFile.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, editImageFile);
      if (uploadError) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
    const featuresArray = editFields.features.split(";").map(f => f.trim()).filter(f => f.length > 0);
    const { error } = await supabase.from("lenses").update({
      title: editFields.title,
      description: editFields.description,
      original_price: parseFloat(editFields.original_price),
      features: featuresArray,
      category: editFields.category,
      lens_category_id: editFields.lens_category_id,
      image_url: imageUrl,
    }).eq("id", editingLens.id);
    if (error) {
      setMessage("Failed to update lens");
    } else {
      setMessage("Lens updated successfully");
      setEditingLens(null);
      fetchLenses();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">👓</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manage Lenses
          </h1>
          <p className="text-gray-600 text-lg">Organize and manage your lens collection with style</p>
        </div>

        {/* Category Tabs with Enhanced Design */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            {lensCategories.map((cat) => (
              <button
                key={cat.id}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategoryId == cat.id 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-white hover:shadow-md"
                }`}
                onClick={() => setSelectedCategoryId(cat.id.toString())}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium animate-pulse">
              {message}
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Loading your lenses...</span>
            </div>
          </div>
        )}

        {/* Lens Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lenses.map((lens) => (
            <div key={lens.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              {/* Image Section */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                {lens.image_url ? (
                  <Image 
                    src={lens.image_url} 
                    alt={lens.title} 
                    width={300} 
                    height={300} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                ) : (
                  <div className="text-6xl opacity-50">👓</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{lens.title}</h3>
                  <span className="text-2xl font-bold text-green-600">${lens.original_price}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200">
                    {lens.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lens.description}</p>
                
                {lens.features && lens.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {lens.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {lens.features.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{lens.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEditClick(lens)}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lens.id, lens.image_url)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "🗑️ Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {lenses.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
              <span className="text-5xl opacity-50">👓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No lenses found</h3>
            <p className="text-gray-500">Start by adding some lenses to this category</p>
          </div>
        )}
      </div>

      {/* Enhanced Edit Modal */}
      {editingLens && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <h4 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">✏️</span>
                Edit Lens
              </h4>
              <p className="text-blue-100 mt-1">Update lens information</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={editFields.title} 
                    onChange={handleEditChange} 
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                    placeholder="Enter lens title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Original Price</label>
                  <input 
                    type="number" 
                    name="original_price" 
                    value={editFields.original_price} 
                    onChange={handleEditChange} 
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lens Image</label>
                {editImagePreview ? (
                  <img src={editImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
                ) : editingLens.image_url ? (
                  <img src={editingLens.image_url} alt="Current" className="w-32 h-32 object-cover rounded mb-2" />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="block w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={editFields.description} 
                  onChange={handleEditChange} 
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none resize-none"
                  rows={4}
                  placeholder="Enter lens description"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Features</label>
                <div className="relative">
                  <textarea 
                    name="features" 
                    value={editFields.features} 
                    onChange={handleEditChange} 
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none resize-none"
                    rows={3}
                    placeholder="Enter features separated by semicolons"
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                    Use ; to separate
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <input 
                    type="text" 
                    name="category" 
                    value={editFields.category} 
                    onChange={handleEditChange} 
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lens Category</label>
                  <select 
                    name="lens_category_id" 
                    value={editFields.lens_category_id} 
                    onChange={handleEditChange} 
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                  >
                    <option value="">Select Lens Category</option>
                    {lensCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 p-6 bg-gray-50 rounded-b-3xl">
              <button 
                onClick={handleEditSave} 
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                💾 Save Changes
              </button>
              <button 
                onClick={() => setEditingLens(null)} 
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLensTab;