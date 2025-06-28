import React, { useEffect, useState } from "react";
import { Edit3, Trash2, Package, Save, X, Upload, Tag, FileText, Plus, Check } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

export type Product = {
  id?: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  display_order?: number;
  bestseller?: boolean;
  latest_trend?: boolean;
  banner_image_1?: string;
  banner_image_2?: string;
  colors: { color: string; images: string[] }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
};

const GENDER_TABS = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const ManageProductTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOrder, setEditOrder] = useState("");
  const [editFrameMaterial, setEditFrameMaterial] = useState("");
  const [editGenderCategory, setEditGenderCategory] = useState<string[]>([]);
  const [editTypeCategory, setEditTypeCategory] = useState<string[]>([]);
  const [editShapeCategory, setEditShapeCategory] = useState("");
  const [editLatestTrend, setEditLatestTrend] = useState(false);
  const [editBestseller, setEditBestseller] = useState(false);
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editColors, setEditColors] = useState<{ color: string; images: string[] }[]>([]);
  const [editFeatures, setEditFeatures] = useState<string>("");
  const [editDiscountedPrice, setEditDiscountedPrice] = useState("");
  const [editBannerImage1File, setEditBannerImage1File] = useState<File | null>(null);
  const [editBannerImage2File, setEditBannerImage2File] = useState<File | null>(null);
  const [editColorImageFiles, setEditColorImageFiles] = useState<(File[] | null)[]>([]);
  const [activeGender, setActiveGender] = useState<string>("men");

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMessage = (text: string, type: "success" | "error" | "info" = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    setMessage("");
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      showMessage("Failed to delete product", "error");
    } else {
      showMessage("Product deleted successfully", "success");
      setProducts(products.filter((p) => p.id !== id));
    }
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditPrice(product.original_price.toString());
    setEditDiscountedPrice(product.discounted_price?.toString() || "");
    setEditOrder(product.display_order?.toString() || "");
    setEditFrameMaterial(product.frame_material || "");
    setEditGenderCategory(product.gender_category || []);
    setEditTypeCategory(product.type_category || []);
    setEditShapeCategory(product.shape_category || "");
    setEditSizes(product.sizes || []);
    setEditColors(product.colors || []);
    setEditFeatures((product.features || []).join('; '));
    setEditLatestTrend(!!product.latest_trend);
    setEditBestseller(!!product.bestseller);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    setMessage("");

    let bannerImage1Url = editingProduct.banner_image_1 || "";
    let bannerImage2Url = editingProduct.banner_image_2 || "";

    // Banner Image 1
    if (editBannerImage1File) {
      // Remove old image from storage if exists
      if (editingProduct.banner_image_1) {
        const path = editingProduct.banner_image_1.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
      }
      const filePath = `banners/${Date.now()}_1_${editBannerImage1File.name}`;
      const { error: uploadError1 } = await supabase.storage.from("product-images").upload(filePath, editBannerImage1File);
      if (uploadError1) {
        showMessage("Banner Image 1 upload failed", "error");
        setLoading(false);
        return;
      }
      const { data: urlData1 } = supabase.storage.from("product-images").getPublicUrl(filePath);
      bannerImage1Url = urlData1.publicUrl;
    }
    // Banner Image 2
    if (editBannerImage2File) {
      if (editingProduct.banner_image_2) {
        const path = editingProduct.banner_image_2.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
      }
      const filePath = `banners/${Date.now()}_2_${editBannerImage2File.name}`;
      const { error: uploadError2 } = await supabase.storage.from("product-images").upload(filePath, editBannerImage2File);
      if (uploadError2) {
        showMessage("Banner Image 2 upload failed", "error");
        setLoading(false);
        return;
      }
      const { data: urlData2 } = supabase.storage.from("product-images").getPublicUrl(filePath);
      bannerImage2Url = urlData2.publicUrl;
    }

    // Handle color images
    const colorUploads = await Promise.all(editColors.map(async (colorObj, idx) => {
      // If new files are selected for this color, upload them and remove old ones
      if (editColorImageFiles[idx] && editColorImageFiles[idx]?.length) {
        // Remove old images
        if (colorObj.images && colorObj.images.length > 0) {
          for (const imgUrl of colorObj.images) {
            const path = imgUrl.split("/product-images/")[1];
            if (path) await supabase.storage.from("product-images").remove([path]);
          }
        }
        // Upload new images
        const uploadedImages: string[] = [];
        for (let i = 0; i < editColorImageFiles[idx]!.length; i++) {
          const img = editColorImageFiles[idx]![i];
          const filePath = `colors/${Date.now()}_${idx}_${i}_${img.name}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, img);
          if (uploadError) {
            showMessage(`Image upload failed for color ${colorObj.color}`, "error");
            setLoading(false);
            return null;
          }
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
          uploadedImages.push(urlData.publicUrl);
        }
        return { color: colorObj.color, images: uploadedImages };
      } else {
        // No new files, keep old images
        return { color: colorObj.color, images: colorObj.images };
      }
    }));
    if (colorUploads.some(c => c === null)) return; // error already set

    const { error } = await supabase.from("products").update({
      title: editTitle,
      description: editDescription,
      original_price: parseFloat(editPrice),
      discounted_price: editDiscountedPrice ? parseFloat(editDiscountedPrice) : null,
      display_order: editOrder ? parseInt(editOrder, 10) : null,
      bestseller: editBestseller,
      latest_trend: editLatestTrend,
      banner_image_1: bannerImage1Url,
      banner_image_2: bannerImage2Url,
      colors: colorUploads,
      sizes: editSizes,
      frame_material: editFrameMaterial,
      features: editFeatures.split(';').map(f => f.trim()).filter(f => f.length > 0),
      tags: editingProduct.tags,
      gender_category: editGenderCategory,
      type_category: editTypeCategory,
      shape_category: editShapeCategory,
    }).eq("id", editingProduct.id);
    if (error) {
      showMessage("Failed to update product", "error");
    } else {
      showMessage("Product updated successfully!", "success");
      setEditingProduct(null);
      fetchProducts();
    }
    setLoading(false);
  };

  const getMessageStyles = () => {
    const baseStyles = "mb-6 p-4 rounded-lg font-medium text-sm flex items-center gap-2 animate-in fade-in duration-300";
    switch (messageType) {
      case "success":
        return `${baseStyles} bg-emerald-50 text-emerald-700 border border-emerald-200`;
      case "error":
        return `${baseStyles} bg-red-50 text-red-700 border border-red-200`;
      default:
        return `${baseStyles} bg-blue-50 text-blue-700 border border-blue-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Gender Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {GENDER_TABS.map((tab, index) => {
            const isActive = activeGender === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveGender(tab.value)}
                className={`
                  group relative px-2 md:px-6 py-4 rounded-2xl font-semibold transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg
                  ${isActive 
                    ? `bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-200` 
                    : 'bg-white/70 text-slate-700 hover:bg-white hover:shadow-md border border-slate-200'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 text-sm md:text-base">
                  <span className="capitalize">{tab.label}</span>
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Product Management</h1>
          </div>
          <p className="text-slate-600">Manage your product catalog with ease</p>
        </div>

        {/* Message */}
        {message && (
          <div className={getMessageStyles()}>
            <div className="w-2 h-2 bg-current rounded-full"></div>
            {message}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
              <span className="font-medium text-slate-700">Loading...</span>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-300 shadow-black">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-600" />
                    Edit Product
                  </h4>
                  <button type="button" onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                {/* Banner Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Banner Image 1
                    </label>
                    <input type="file" accept="image/*" onChange={e => setEditBannerImage1File(e.target.files?.[0] || null)} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {editingProduct.banner_image_1 && (
                      <Image height={128} width={192} src={editingProduct.banner_image_1} alt="Banner 1 Preview" className="w-32 h-20 object-cover rounded-xl mt-2 border shadow" />
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Banner Image 2
                    </label>
                    <input type="file" accept="image/*" onChange={e => setEditBannerImage2File(e.target.files?.[0] || null)} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {editingProduct.banner_image_2 && (
                      <Image height={128} width={192} src={editingProduct.banner_image_2} alt="Banner 2 Preview" className="w-32 h-20 object-cover rounded-xl mt-2 border shadow" />
                    )}
                  </div>
                </div>
                {/* Product Colors & Images */}
                <div>
                  <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Product Colors & Images
                  </label>
                  <div className="space-y-4">
                    {editColors.map((colorObj, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input type="text" value={colorObj.color} onChange={e => {
                            const updated = [...editColors];
                            updated[idx].color = e.target.value;
                            setEditColors(updated);
                          }} placeholder="Color name (e.g., Black)" className="px-3 py-2 border border-slate-300 rounded-lg flex-1" />
                        </div>
                        <input type="file" accept="image/*" multiple onChange={e => {
                          const files = e.target.files ? Array.from(e.target.files) : null;
                          const updated = [...editColorImageFiles];
                          updated[idx] = files;
                          setEditColorImageFiles(updated);
                        }} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        {colorObj.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {colorObj.images.map((img, i) => (
                              <Image height={64} width={64} key={i} src={img} alt={`Preview ${i}`} className="w-16 h-16 object-cover rounded border shadow" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Product Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Product Title
                    </label>
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300" placeholder="Enter product title..." />
                  </div>
                  {/* Frame Material */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Frame Material
                    </label>
                    <input type="text" value={editFrameMaterial} onChange={e => setEditFrameMaterial(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300" placeholder="Enter frame material..." />
                  </div>
                  {/* Original Price */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Original Price
                    </label>
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} required min="0" step="0.01" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300" placeholder="0.00" />
                  </div>
                  {/* Discounted Price */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Discounted Price
                    </label>
                    <input type="number" value={editDiscountedPrice} onChange={e => setEditDiscountedPrice(e.target.value)} required min="0" step="0.01" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300" placeholder="0.00" />
                  </div>
                </div>
                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description
                  </label>
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none" placeholder="Describe your product..." />
                </div>
                {/* Features */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Features (semicolon separated)
                  </label>
                  <textarea value={editFeatures} onChange={e => setEditFeatures(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none" placeholder="Feature 1; Feature 2; Feature 3" />
                  <div className="text-xs text-slate-500 mt-1">Separate each feature with a semicolon (;)</div>
                </div>
                {/* Sizes, Gender, Type, Shape */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sizes */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Sizes
                    </label>
                    <div className="flex flex-col gap-2">
                      {['Small', 'Medium', 'Large', 'Extra Large'].map(size => (
                        <label key={size} className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50">
                          <input type="checkbox" checked={editSizes.includes(size)} onChange={e => { if (e.target.checked) setEditSizes([...editSizes, size]); else setEditSizes(editSizes.filter(s => s !== size)); }} className="accent-blue-600" />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Gender */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Gender
                    </label>
                    <div className="flex flex-col gap-2">
                      {['men', 'women', 'kids', 'unisex'].map(gender => (
                        <label key={gender} className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50">
                          <input type="checkbox" checked={editGenderCategory.includes(gender)} onChange={e => { if (e.target.checked) setEditGenderCategory([...editGenderCategory, gender]); else setEditGenderCategory(editGenderCategory.filter(g => g !== gender)); }} className="accent-blue-600" />
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Type */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Type
                    </label>
                    <div className="flex flex-col gap-2">
                      {['sunglasses', 'eyeglasses', 'computerglasses', 'powered sunglasses'].map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50">
                          <input type="checkbox" checked={editTypeCategory.includes(type)} onChange={e => { if (e.target.checked) setEditTypeCategory([...editTypeCategory, type]); else setEditTypeCategory(editTypeCategory.filter(t => t !== type)); }} className="accent-indigo-600" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Shape */}
                  <div>
                    <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Shape
                    </label>
                    <select value={editShapeCategory} onChange={e => setEditShapeCategory(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300">
                      <option value="">Select Shape</option>
                      <option value="round">Round</option>
                      <option value="cat-eye">Cat-Eye</option>
                      <option value="aviator">Aviator</option>
                      <option value="wayfarer">Wayfarer</option>
                      <option value="oval">Oval</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
                {/* Latest Trend & Bestseller */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={editLatestTrend} onChange={e => setEditLatestTrend(e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${editLatestTrend ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110' : 'border-slate-300 group-hover:border-blue-400 group-hover:scale-105'}`}>{editLatestTrend && <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />}</div>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">Latest Trend</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={editBestseller} onChange={e => setEditBestseller(e.target.checked)} className="sr-only" />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${editBestseller ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110' : 'border-slate-300 group-hover:border-blue-400 group-hover:scale-105'}`}>{editBestseller && <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />}</div>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">Bestseller</span>
                    </div>
                  </label>
                </div>
                {/* Display Order */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Display Order
                  </label>
                  <input type="number" value={editOrder} onChange={e => setEditOrder(e.target.value)} required min="0" step="1" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300" placeholder="Display order..." />
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={handleEditSubmit} disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter(product => product.gender_category && product.gender_category.includes(activeGender))
            .map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Product Images */}
                <div className="relative mb-4 overflow-hidden rounded-xl flex gap-2">
                  {product.banner_image_1 ? (
                    <Image height={96} width={96} src={product.banner_image_1} alt={product.title} className="w-24 h-24 object-cover rounded-xl shadow" />
                  ) : null}
                  {product.banner_image_2 ? (
                    <Image height={96} width={96} src={product.banner_image_2} alt={product.title} className="w-24 h-24 object-cover rounded-xl shadow" />
                  ) : null}
                </div>
                {/* Product Info */}
                {/* "text-lg font-semibold text-blue-600 line-through" */}
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{product.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-blue-600 line-through">₹{product.original_price.toLocaleString()}</span>
                    {product.discounted_price && <span className="text-xl font-bold text-emerald-600">₹{product.discounted_price.toLocaleString()}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">Order: {product.display_order ?? '-'}</span>
                    <span className="px-2 py-1 bg-blue-100 rounded text-xs">{product.gender_category.join(", ")}</span>
                    <span className="px-2 py-1 bg-green-100 rounded text-xs">{product.type_category.join(", ")}</span>
                    <span className="px-2 py-1 bg-purple-100 rounded text-xs">{product.shape_category}</span>
                    {product.latest_trend && <span className="px-2 py-1 bg-pink-100 rounded text-xs">Latest Trend</span>}
                    {product.bestseller && <span className="px-2 py-1 bg-yellow-100 rounded text-xs">Bestseller</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes && product.sizes.length > 0 && <span className="px-2 py-1 bg-slate-200 rounded text-xs">Sizes: {product.sizes.join(", ")}</span>}
                    {product.features && product.features.length > 0 && <span className="px-2 py-1 bg-slate-200 rounded text-xs">Features: {product.features.join(", ")}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors && product.colors.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 border rounded text-xs">{c.color}</span>
                    ))}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg" onClick={() => startEdit(product)} disabled={loading}>
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg" onClick={() => handleDelete(product.id || "")} disabled={loading}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 mb-6">Get started by adding your first product to the catalog.</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200">
              <Plus className="w-4 h-4" />
              Add First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductTab;