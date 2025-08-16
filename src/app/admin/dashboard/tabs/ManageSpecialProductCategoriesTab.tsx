import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  description?: string;
  display_order?: number;
  banner_image?: string;
}

const ManageSpecialProductCategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("special_product_categories").select("*").order("display_order", { ascending: true }).order("id");
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `special-category-banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('special-category-banner')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('special-category-banner')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderValue = displayOrder ? parseInt(displayOrder) : null;
      let imageUrl = null;

      if (bannerImage) {
        imageUrl = await uploadImage(bannerImage);
      }

      if (editing) {
        const updateData: Partial<Category> = { 
          name, 
          description, 
          display_order: orderValue 
        };
        
        if (imageUrl) {
          updateData.banner_image = imageUrl;
        }

        await supabase.from("special_product_categories").update(updateData).eq("id", editing);
        setMessage("Category updated!");
      } else {
        await supabase.from("special_product_categories").insert({ 
          name, 
          description, 
          display_order: orderValue,
          banner_image: imageUrl
        });
        setMessage("Category added!");
      }
      
      setName("");
      setDescription("");
      setDisplayOrder("");
      setBannerImage(null);
      setImagePreview("");
      setEditing(null);
      fetchCategories();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessage(`Error: ${errorMessage}`);
    }
    
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setDisplayOrder(cat.display_order ? cat.display_order.toString() : "");
    setBannerImage(null);
    setImagePreview(cat.banner_image || "");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category?")) return;
    setLoading(true);
    await supabase.from("special_product_categories").delete().eq("id", id);
    await supabase.storage.from('special-category-banner').remove([`${id}.jpg`]);
    setMessage("Category deleted!");
    fetchCategories();
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDisplayOrder("");
    setBannerImage(null);
    setImagePreview("");
    setEditing(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Special Product Categories</h2>
      
      <form onSubmit={handleAddOrUpdate} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              placeholder="Display Order"
              value={displayOrder}
              onChange={e => setDisplayOrder(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Category Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                width={128}
                height={80}
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Processing..." : (editing ? "Update" : "Add")}
          </button>
          
          {editing && (
            <button 
              type="button" 
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {message && (
        <div className={`mb-4 text-center font-medium p-3 rounded ${
          message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </div>
      )}
      
      {loading && <div className="mb-4 text-center">Loading...</div>}
      
      <div className="grid gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {cat.banner_image && (
                <Image 
                  width={128}
                  height={80}
                  src={cat.banner_image} 
                  alt={cat.name}
                  className="w-24 h-16 object-cover rounded border"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm bg-gray-100 px-2 py-1 rounded">
                    #{cat.display_order || '-'}
                  </span>
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                </div>
                
                {cat.description && (
                  <p className="text-gray-600 mb-3">{cat.description}</p>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(cat)} 
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8 py-8">
          No categories found.
        </div>
      )}
    </div>
  );
};

export default ManageSpecialProductCategoriesTab; 