import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import {
  Plus,
  Upload,
  Package,
  FileText,
  DollarSign,
  Users,
  Eye,
  Shapes,
  TrendingUp,
  Award,
  ArrowUpDown,
  Check,
  Loader2,
  Glasses,
} from "lucide-react";
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
  colors: { colors: string[]; images: string[] }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
};

const AddProductTab = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState("");
  const [shapeCategory, setShapeCategory] = useState("");
  const [latestTrend, setLatestTrend] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [bannerImage1, setBannerImage1] = useState(null);
  const [bannerImage2, setBannerImage2] = useState(null);
  const [colors, setColors] = useState([{ colors: ["#000000"], images: [] }]);
  const [sizes, setSizes] = useState([]);
  const [frameMaterial, setFrameMaterial] = useState("");
  const [features, setFeatures] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [isLensUsed, setIsLensUsed] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      type CategoryRow = { name: string };
      const genderRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "gender")
        .order("id", { ascending: true });
      const typeRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "type")
        .order("id", { ascending: true });
      const shapeRes = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "shape")
        .order("id", { ascending: true });
      setGenderOptions(
        genderRes.data
          ? (genderRes.data as CategoryRow[]).map((c) => c.name)
          : []
      );
      setTypeOptions(
        typeRes.data ? (typeRes.data as CategoryRow[]).map((c) => c.name) : []
      );
      setShapeOptions(
        shapeRes.data ? (shapeRes.data as CategoryRow[]).map((c) => c.name) : []
      );
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // --- Display Order Shift Logic ---
    const displayOrderInt = order ? parseInt(order, 10) : null;
    if (displayOrderInt !== null) {
      // Fetch all products with display_order >= new order
      const { data: productsToUpdate, error: fetchError } = await supabase
        .from("products")
        .select("id, display_order")
        .gte("display_order", displayOrderInt);

      if (fetchError) {
        setMessage("Failed to update display order");
        setLoading(false);
        return;
      }

      // Increment display_order for each
      for (const prod of productsToUpdate) {
        await supabase
          .from("products")
          .update({ display_order: prod.display_order + 1 })
          .eq("id", prod.id);
      }
    }

    // Upload banner images
    let bannerImage1Url = "";
    let bannerImage2Url = "";
    if (bannerImage1) {
      const filePath = `banners/${Date.now()}_1_${bannerImage1.name}`;
      const { error: uploadError1 } = await supabase.storage
        .from("product-images")
        .upload(filePath, bannerImage1);
      if (uploadError1) {
        setMessage("Banner Image 1 upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData1 } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      bannerImage1Url = urlData1.publicUrl;
    }
    if (bannerImage2) {
      const filePath = `banners/${Date.now()}_2_${bannerImage2.name}`;
      const { error: uploadError2 } = await supabase.storage
        .from("product-images")
        .upload(filePath, bannerImage2);
      if (uploadError2) {
        setMessage("Banner Image 2 upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData2 } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      bannerImage2Url = urlData2.publicUrl;
    }

    // Upload color images
    const colorUploads = await Promise.all(
      colors.map(async (colorObj, idx) => {
        const uploadedImages: string[] = [];
        for (let i = 0; i < colorObj.images.length; i++) {
          const img = colorObj.images[i];
          const filePath = `colors/${Date.now()}_${idx}_${i}_${img.name}`;
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, img);
          if (uploadError) {
            setMessage(`Image upload failed for color entry ${idx + 1}`);
            setLoading(false);
            return null;
          }
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);
          uploadedImages.push(urlData.publicUrl);
        }
        return { colors: colorObj.colors, images: uploadedImages };
      })
    );
    if (colorUploads.some((c) => c === null)) return; // error already set

    // Prepare features array
    const featuresArray = features
      .split(";")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    // Always include the tag
    const tags = ["manufactured by Eyeric"];

    // Insert product
    const { error } = await supabase.from("products").insert({
      title,
      description,
      original_price: parseFloat(originalPrice),
      discounted_price: discountedPrice ? parseFloat(discountedPrice) : null,
      display_order: order ? parseInt(order, 10) : null,
      bestseller,
      latest_trend: latestTrend,
      banner_image_1: bannerImage1Url,
      banner_image_2: bannerImage2Url,
      colors: colorUploads,
      sizes,
      shape_category: shapeCategory,
      frame_material: frameMaterial,
      features: featuresArray,
      tags,
      gender_category: selectedGenders,
      type_category: selectedTypes,
      is_lens_used: isLensUsed,
    });

    if (error) {
      setMessage("Failed to add product");
    } else {
      setMessage("Product added successfully!");
      setTitle("");
      setDescription("");
      setOriginalPrice("");
      setDiscountedPrice("");
      setBannerImage1(null);
      setBannerImage2(null);
      setColors([{ colors: ["#000000"], images: [] }]);
      setSizes([]);
      setFrameMaterial("");
      setFeatures("");
      setSelectedGenders([]);
      setSelectedTypes([]);
      setOrder("");
      setLatestTrend(false);
      setBestseller(false);
      setIsLensUsed(false);
    }
    setLoading(false);
  };

  // Banner Image Handlers
  const handleBannerImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage1(e.target.files[0]);
    }
  };
  const handleBannerImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage2(e.target.files[0]);
    }
  };

  // Color Handlers
  const handleColorChange = (colorIndex: number, pickerIndex: number, value: string) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].colors[pickerIndex] = value;
    setColors(updatedColors);
  };
  const handleColorImagesChange = (index: number, files: FileList) => {
    const updatedColors = [...colors];
    updatedColors[index].images = Array.from(files);
    setColors(updatedColors);
  };
  const addColorPicker = (colorIndex: number) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].colors.push("#000000");
    setColors(updatedColors);
  };
  const removeColorPicker = (colorIndex: number, pickerIndex: number) => {
    const updatedColors = [...colors];
    if (updatedColors[colorIndex].colors.length > 1) {
      updatedColors[colorIndex].colors.splice(pickerIndex, 1);
      setColors(updatedColors);
    }
  };
  const addColorField = () => {
    setColors([...colors, { colors: ["#000000"], images: [] }]);
  };
  const removeColorField = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-300 shadow-black">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600">
              Create and customize your product listing
            </p>
          </div>

          {/* Form Card */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Banner Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Banner Image 1
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImage1Change}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bannerImage1 && (
                  <Image
                    height={128}
                    width={192}
                    src={URL.createObjectURL(bannerImage1)}
                    alt="Banner 1 Preview"
                    className="w-32 h-20 object-cover rounded-xl mt-2 border shadow"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Banner Image 2
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImage2Change}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bannerImage2 && (
                  <Image
                    height={128}
                    width={192}
                    src={URL.createObjectURL(bannerImage2)}
                    alt="Banner 2 Preview"
                    className="w-32 h-20 object-cover rounded-xl mt-2 border shadow"
                  />
                )}
              </div>
            </div>

            {/* Product Colors & Images */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Product Colors & Images
              </label>
              <div className="space-y-4">
                {colors.map((colorObj, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {colorObj.colors.map((color, cidx) => (
                        <div key={cidx} className="flex items-center gap-1">
                          <input
                            type="color"
                            value={color}
                            onChange={e => handleColorChange(idx, cidx, e.target.value)}
                            className="w-8 h-8 border-2 border-slate-300 rounded"
                          />
                          {colorObj.colors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColorPicker(idx, cidx)}
                              className="text-xs text-red-500 px-1 hover:bg-red-50 rounded"
                              title="Remove this color"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addColorPicker(idx)}
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-xs hover:bg-blue-200"
                      >
                        + Add Color
                      </button>
                      <button
                        type="button"
                        onClick={() => removeColorField(idx)}
                        className="ml-2 text-red-500 font-bold px-2 hover:bg-red-50 rounded"
                        title="Remove this color entry"
                      >
                        X
                      </button>
                    </div>
                    {/* Show color swatches */}
                    <div className="flex gap-1 mb-2">
                      {colorObj.colors.map((color, cidx) => (
                        <div
                          key={cidx}
                          className="w-6 h-6 rounded-full border border-slate-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleColorImagesChange(idx, e.target.files)}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {colorObj.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colorObj.images.map((img, i) => (
                          <Image
                            height={64}
                            width={64}
                            key={i}
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${i}`}
                            className="w-16 h-16 object-cover rounded border shadow"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColorField}
                  className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
                >
                  + Add Color
                </button>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Enter product title..."
                />
              </div>
              {/* Frame Material */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Frame Material
                </label>
                <input
                  type="text"
                  value={frameMaterial}
                  onChange={(e) => setFrameMaterial(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Enter frame material..."
                />
              </div>
              {/* Original Price */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Original Price
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
              {/* Discounted Price */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Discounted Price
                </label>
                <input
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                placeholder="Describe your product..."
              />
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Shapes className="w-4 h-4" /> Features (semicolon separated)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none"
                placeholder="Feature 1; Feature 2; Feature 3"
              />
              <div className="text-xs text-slate-500 mt-1">
                Separate each feature with a semicolon (;)
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" /> Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                required
                min="0"
                step="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                placeholder="Display order..."
              />
            </div>

            {/* Sizes, Gender, Type, Shape */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sizes */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Sizes
                </label>
                <div className="flex flex-col gap-2">
                  {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) setSizes([...sizes, size]);
                          else setSizes(sizes.filter((s) => s !== size));
                        }}
                        className="accent-blue-600"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
              {/* Gender */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Gender
                </label>
                <div className="flex flex-col gap-2">
                  {genderOptions.map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedGenders([...selectedGenders, gender]);
                          else
                            setSelectedGenders(
                              selectedGenders.filter((g) => g !== gender)
                            );
                        }}
                        className="accent-blue-600"
                      />
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Type
                </label>
                <div className="flex flex-col gap-2">
                  {typeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm bg-slate-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedTypes([...selectedTypes, type]);
                          else
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                        }}
                        className="accent-indigo-600"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              {/* Shape */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shapes className="w-4 h-4" /> Shape
                </label>
                <select
                  value={shapeCategory}
                  onChange={(e) => setShapeCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                >
                  <option value="">Select Shape</option>
                  {shapeOptions.map((shape) => (
                    <option key={shape} value={shape}>
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Latest Trend & Bestseller */}
            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={latestTrend}
                    onChange={(e) => setLatestTrend(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      latestTrend
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {latestTrend && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Latest Trend</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      bestseller
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {bestseller && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Bestseller</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isLensUsed}
                    onChange={(e) => setIsLensUsed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      isLensUsed
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400 group-hover:scale-105"
                    }`}
                  >
                    {isLensUsed && (
                      <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200">
                  <Glasses className="w-4 h-4" />
                  <span className="text-sm font-medium">Lens Used</span>
                </div>
              </label>

              {/* <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isLensUsed"
                  checked={isLensUsed}
                  onChange={(e) => setIsLensUsed(e.target.checked)}
                  className="accent-blue-600"
                />
                <label
                  htmlFor="isLensUsed"
                  className="text-sm font-semibold text-slate-700"
                >
                  Is lens used in this product?
                </label>
              </div> */}
            </div>

            {/* Is Lens Used Checkbox */}

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-2xl text-sm font-medium transition-all duration-500 ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                } shadow-lg flex items-center gap-2`}
              >
                {message.includes("successfully") ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Adding Product...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductTab;
