import React, { useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

const CATEGORIES = [
  "single vision",
  "progressive",
  "zero power",
  "frame only"
];

const AddLensTab = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let imageUrl = "";
    if (image) {
      const filePath = `lenses/${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image);
      if (uploadError) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    } else {
      setMessage("Please select an image");
      setLoading(false);
      return;
    }
    const featuresArray = features.split(';').map(f => f.trim()).filter(f => f.length > 0);
    const { error } = await supabase.from("lenses").insert({
      image_url: imageUrl,
      title,
      description,
      features: featuresArray,
      original_price: parseFloat(originalPrice),
      discounted_price: discountedPrice ? parseFloat(discountedPrice) : null,
      category
    });
    if (error) {
      setMessage("Failed to add lens");
    } else {
      setMessage("Lens added successfully!");
      setTitle("");
      setDescription("");
      setFeatures("");
      setOriginalPrice("");
      setDiscountedPrice("");
      setCategory(CATEGORIES[0]);
      setImage(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span role="img" aria-label="lens">👓</span>
        Add New Lens
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Lens Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lens Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="block w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lens Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="block w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lens Features (separate by semicolon ;)</label>
          <textarea value={features} onChange={e => setFeatures(e.target.value)} className="block w-full border rounded p-2" placeholder="Feature 1; Feature 2; Feature 3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="block w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discounted Price</label>
          <input type="number" step="0.01" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} className="block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lens Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="block w-full border rounded p-2">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Adding..." : "Add Lens"}</button>
        {message && <div className="mt-2 text-center text-sm font-medium text-blue-700">{message}</div>}
      </form>
    </div>
  );
};

export default AddLensTab; 