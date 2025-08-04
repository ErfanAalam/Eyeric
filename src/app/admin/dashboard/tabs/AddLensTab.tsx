import React, { useState, useEffect } from "react";
import { Upload, Eye, Camera, Package, DollarSign, Tag, FileText, Star } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";


const CATEGORIES = [
  "single vision",
  'progressive + Biofocal',
  "zero power",
];

// Define Lens type for this file
export type Lens = {
  id?: string;
  title: string;
  description: string;
  features: string[];
  original_price: number;
  category: string;
  image_url?: string;
  lens_category_id?: string | number;
  display_order?: number;
  name?: string; // Add name for category dropdowns
};

// Add prop types for edit mode
export type AddLensTabProps = {
  editLens?: Lens;
  onFinishEdit?: () => void;
};

const AddLensTab = ({ editLens, onFinishEdit }: AddLensTabProps) => {
  const [title, setTitle] = useState(editLens?.title || "");
  const [description, setDescription] = useState(editLens?.description || "");
  const [features, setFeatures] = useState(editLens?.features ? editLens.features.join('; ') : "");
  const [originalPrice, setOriginalPrice] = useState(editLens?.original_price?.toString() || "");
  const [category, setCategory] = useState(editLens?.category || CATEGORIES[0]);
  const [image, setImage] = useState<File | null>(null); // File
  const [imagePreview, setImagePreview] = useState(editLens?.image_url || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lensCategories, setLensCategories] = useState<Lens[]>([]);
  const [lensCategoryId, setLensCategoryId] = useState(editLens?.lens_category_id?.toString() || "");
  const [displayOrder, setDisplayOrder] = useState(editLens?.display_order?.toString() || "");

  // When editLens changes, update state
  useEffect(() => {
    // console.log('useEffect triggered, editLens:', editLens); // Debug log
    if (editLens) {
      setTitle(editLens.title || "");
      setDescription(editLens.description || "");
      setFeatures(editLens.features ? editLens.features.join('; ') : "");
      setOriginalPrice(editLens.original_price?.toString() || "");
      setCategory(editLens.category || CATEGORIES[0]);
      setImage(null);
      setImagePreview(editLens.image_url || "");
      setLensCategoryId(editLens.lens_category_id?.toString() || "");
      setDisplayOrder(editLens.display_order?.toString() || "");
    } else {
      setTitle("");
      setDescription("");
      setFeatures("");
      setOriginalPrice("");
      setCategory(CATEGORIES[0]);
      setImage(null);
      setImagePreview("");
      setLensCategoryId("");
      setDisplayOrder("");
    }
  }, [editLens]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("lens_categories").select("*");
      setLensCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    let imageUrl = editLens?.image_url || "";
    // If new image selected, upload and remove old if editing
    if (image) {
      if (editLens && editLens.image_url) {
        const path = editLens.image_url.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
      }
      const filePath = `lenses/${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image);
      if (uploadError) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    } else if (!editLens && !image) {
      setMessage("Please select an image");
      setLoading(false);
      return;
    }
    
    const featuresArray = features.split(';').map(f => f.trim()).filter(f => f.length > 0);

    // Handle display order properly - only parse if it's a valid number
    const displayOrderValue = displayOrder && displayOrder.trim() !== "" ? parseInt(displayOrder, 10) : 0;
    // console.log('Submitting display order:', { displayOrder, displayOrderValue }); // Debug log

    if (editLens) {
      // Update existing lens
      const { error } = await supabase.from("lenses").update({
        image_url: imageUrl,
        title,
        description,
        features: featuresArray,
        original_price: parseFloat(originalPrice),
        category,
        lens_category_id: lensCategoryId,
        display_order: displayOrderValue,
      }).eq("id", editLens.id);
      if (error) {
        setMessage("Failed to update lens");
      } else {
        setMessage("Lens updated successfully!");
        if (onFinishEdit) onFinishEdit();
      }
      setLoading(false);
      return;
    }

    // Add new lens
    const { error } = await supabase.from("lenses").insert({
      image_url: imageUrl,
      title,
      description,
      features: featuresArray,
      original_price: parseFloat(originalPrice),
      category,
      lens_category_id: lensCategoryId,
      display_order: displayOrderValue,
    });
    if (error) {
      setMessage("Failed to add lens");
    } else {
      setMessage("Lens added successfully!");
      setTitle("");
      setDescription("");
      setFeatures("");
      setOriginalPrice("");
      setCategory(CATEGORIES[0]);
      setImage(null);
      setImagePreview("");
      setLensCategoryId("");
      setDisplayOrder("");
      if (onFinishEdit) onFinishEdit();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Add New Lens
          </h1>
          <p className="text-gray-600">Create a new lens product for your inventory</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Camera className="w-4 h-4" />
                Lens Image
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200">
                    <Image
                      width={400}
                      height={500}
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Lens Title */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Package className="w-4 h-4" />
                  Lens Title
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="Enter lens title"
                  required 
                />
              </div>

              {/* Lens Category Dropdown */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Tag className="w-4 h-4" />
                  Lens Category
                </label>
                <select
                  value={lensCategoryId}
                  onChange={e => setLensCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                >
                  <option value="">Select Lens Category</option>
                  {lensCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Package className="w-4 h-4" />
                  Display Order
                </label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayOrder} 
                  onChange={e => {
                    const value = e.target.value;
                    // console.log('Display order input changed:', value); // Debug log
                    // Only allow positive integers or empty string
                    if (value === "" || /^\d+$/.test(value)) {
                      setDisplayOrder(value);
                    }
                  }} 
                  // onBlur={e => {
                  //   // console.log('Display order on blur:', e.target.value); // Debug log
                  // }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-2">Enter a number (0, 1, 2, etc.) - lower numbers appear first</p>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Original Price
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={originalPrice} 
                  onChange={e => setOriginalPrice(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="0.00"
                  required 
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                rows={4}
                placeholder="Describe the lens features and benefits"
                required 
              />
            </div>

            {/* Features */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Star className="w-4 h-4" />
                Features
              </label>
              <textarea 
                value={features} 
                onChange={e => setFeatures(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                rows={3}
                placeholder="Feature 1; Feature 2; Feature 3"
              />
              <p className="text-xs text-gray-500 mt-2">Separate features with semicolon (;)</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Lens...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-5 h-5" />
                    Add Lens to Inventory
                  </div>
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLensTab;