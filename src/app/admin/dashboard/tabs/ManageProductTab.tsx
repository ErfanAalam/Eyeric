import React, { useEffect, useState } from "react";
import { Edit3, Trash2, Package, X, Tag, Plus, Shapes, Search } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

import type { Product } from "../../../../types/product";

const GENDER_TABS = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const ManageProductTab = ({ onEditProduct }: { onEditProduct: (product: Product) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [activeGender, setActiveGender] = useState<string>("men");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterShape, setFilterShape] = useState<string[]>([]);
  const [filterStyle, setFilterStyle] = useState<string[]>([]);
  const [filterQuantity, setFilterQuantity] = useState("");
  const [filterLatestTrend, setFilterLatestTrend] = useState("");
  const [filterBestseller, setFilterBestseller] = useState("");
  const [specialCategories, setSpecialCategories] = useState([]);
  const [filterSpecialCategories, setFilterSpecialCategories] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState("");
  const [productSpecialCategories, setProductSpecialCategories] = useState({}); // { productId: [catId, ...] }
  
  // Filter options state
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [styleOptions, setStyleOptions] = useState<string[]>([]);

  // Dropdown open/close states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [shapeDropdownOpen, setShapeDropdownOpen] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [specialCategoriesDropdownOpen, setSpecialCategoriesDropdownOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setTypeDropdownOpen(false);
        setShapeDropdownOpen(false);
        setStyleDropdownOpen(false);
        setSpecialCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      // Fetch type options from categories table
      const { data: typeData } = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "type");
      if (typeData) {
        setTypeOptions(typeData.map(cat => cat.name));
      }

      // Fetch shape options from categories table
      const { data: shapeData } = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "shape");
      if (shapeData) {
        setShapeOptions(shapeData.map(cat => cat.name));
      }

      // Fetch style options from categories table
      const { data: styleData } = await supabase
        .from("categories")
        .select("name")
        .eq("category_type", "style");
      if (styleData) {
        setStyleOptions(styleData.map(cat => cat.name));
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchSpecialCategories = async () => {
      const { data } = await supabase.from("special_product_categories").select("*");
      setSpecialCategories(data || []);
    };
    fetchSpecialCategories();
    // Fetch product_special_categories for all products
    const fetchProductSpecialCategories = async () => {
      const { data } = await supabase.from("product_special_categories").select("*");
      // Map: productId -> [catId, ...]
      const map = {};
      (data || []).forEach(row => {
        if (!map[row.product_id]) map[row.product_id] = [];
        map[row.product_id].push(row.special_category_id);
      });
      setProductSpecialCategories(map);
    };
    fetchProductSpecialCategories();
    const fetchCoupons = async () => {
      await supabase.from("coupons").select("id, code, discount_type, discount_value, is_active");
      // setAllCoupons(data || []); // Removed unused state
    };
    fetchCoupons();
    // Fetch product_coupons for all products
    const fetchProductCoupons = async () => {
      const { data } = await supabase.from("product_coupons").select("product_id, coupon_id");
      const map = {};
      (data || []).forEach(row => {
        if (!map[row.product_id]) map[row.product_id] = [];
        map[row.product_id].push(row.coupon_id);
      });
      // setProductCoupons(map); // Removed unused state
    };
    fetchProductCoupons();
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
    console.log(id)
    
    try {
      // First, delete related records from product_coupons table
      const { error: couponError } = await supabase
        .from("product_coupons")
        .delete()
        .eq("product_id", id);
      
      if (couponError) {
        console.log("Error deleting product coupons:", couponError);
      }
      
      // Delete related records from product_special_categories table
      const { error: specialCatError } = await supabase
        .from("product_special_categories")
        .delete()
        .eq("product_id", id);
      
      if (specialCatError) {
        console.log("Error deleting product special categories:", specialCatError);
      }
      
      // Finally, delete the product
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        showMessage("Failed to delete product", "error");
        console.log(error)
      } else {
        showMessage("Product deleted successfully", "success");
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.log("Error during deletion:", error);
      showMessage("Failed to delete product", "error");
    }
    
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    onEditProduct(product);
  };

  // Helper function to check if arrays have any intersection
  const hasIntersection = (arr1: string[], arr2: string[]) => {
    if (arr1.length === 0) return true;
    return arr1.some(item => arr2.includes(item));
  };

  // const toggleActiveStatus = async (productId: string, currentStatus: boolean) => {
  //   setLoading(true);
  //   try {
  //     const { error } = await supabase
  //       .from("products")
  //       .update({ is_active: !currentStatus })
  //       .eq("id", productId);
      
  //     if (error) {
  //       showMessage("Failed to update product status", "error");
  //     } else {
  //       // Update the local state
  //       setProducts(products.map(p => 
  //         p.id === productId ? { ...p, is_active: !currentStatus } : p
  //       ));
  //       showMessage(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`, "success");
  //     }
  //   } catch (error) {
  //     console.error("Error toggling product status:", error);
  //     showMessage("Failed to update product status", "error");
  //   }
  //   setLoading(false);
  // };

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
                  group relative px-4 py-2 rounded-full font-semibold transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg
                  ${isActive 
                    ? `bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-200` 
                    : 'bg-white/90 text-slate-700 hover:bg-white hover:shadow-md border border-slate-200'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="capitalize flex items-center gap-2">
                  {tab.label}
                </span>
              </button>
            );
          })}
          <button
            className="ml-4 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all flex items-center gap-2"
            onClick={() => setFilterOpen(v => !v)}
            type="button"
          >
            <Tag className="w-4 h-4" />
            Filter
          </button>
        </div>
        {/* 1. FILTER BAR UI */}
        {filterOpen && (
          <div className="mb-8 bg-white/90 p-6 rounded-2xl shadow-lg border border-blue-100">
            {/* Search Bar */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                <Search className="w-3 h-3 text-blue-600" />
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by product name..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                />
              </div>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {/* Type Filter */}
              <div className="space-y-2 filter-dropdown">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-600" />
                  Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => setTypeDropdownOpen(prev => !prev)}
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm text-left flex items-center justify-between transition-colors"
                  >
                    <span className={filterType.length > 0 ? "text-blue-700" : "text-slate-500"}>
                      {filterType.length === 0 
                        ? "Select types..." 
                        : filterType.length === 1 
                          ? filterType[0] 
                          : `${filterType.length} types selected`
                      }
                    </span>
                    <svg className={`w-4 h-4 text-blue-600 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Options */}
                  {typeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {typeOptions.map(type => (
                        <label key={type} className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterType.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilterType([...filterType, type]);
                              } else {
                                setFilterType(filterType.filter(t => t !== type));
                              }
                            }}
                            className="mr-2 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Types Display */}
                {filterType.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterType.map(type => (
                      <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {type}
                        <button
                          onClick={() => setFilterType(filterType.filter(t => t !== type))}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Shape Filter */}
              <div className="space-y-2 filter-dropdown">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Shapes className="w-3 h-3 text-green-600" />
                  Shape
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShapeDropdownOpen(prev => !prev)}
                    className="w-full px-3 py-2 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 text-sm text-left flex items-center justify-between transition-colors"
                  >
                    <span className={filterShape.length > 0 ? "text-green-700" : "text-slate-500"}>
                      {filterShape.length === 0 
                        ? "Select shapes..." 
                        : filterShape.length === 1 
                          ? filterShape[0] 
                          : `${filterShape.length} shapes selected`
                      }
                    </span>
                    <svg className={`w-4 h-4 text-green-600 transition-transform ${shapeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Options */}
                  {shapeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-green-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {shapeOptions.map(shape => (
                        <label key={shape} className="flex items-center px-3 py-2 hover:bg-green-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterShape.includes(shape)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilterShape([...filterShape, shape]);
                              } else {
                                setFilterShape(filterShape.filter(s => s !== shape));
                              }
                            }}
                            className="mr-2 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-700">{shape}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Shapes Display */}
                {filterShape.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterShape.map(shape => (
                      <span key={shape} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {shape}
                        <button
                          onClick={() => setFilterShape(filterShape.filter(s => s !== shape))}
                          className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Style Filter */}
              <div className="space-y-2 filter-dropdown">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-purple-600" />
                  Style
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStyleDropdownOpen(prev => !prev)}
                    className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm text-left flex items-center justify-between transition-colors"
                  >
                    <span className={filterStyle.length > 0 ? "text-purple-700" : "text-slate-500"}>
                      {filterStyle.length === 0 
                        ? "Select styles..." 
                        : filterStyle.length === 1 
                          ? filterStyle[0] 
                          : `${filterStyle.length} styles selected`
                      }
                    </span>
                    <svg className={`w-4 h-4 text-purple-600 transition-transform ${styleDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Options */}
                  {styleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {styleOptions.map(style => (
                        <label key={style} className="flex items-center px-3 py-2 hover:bg-purple-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterStyle.includes(style)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilterStyle([...filterStyle, style]);
                              } else {
                                setFilterStyle(filterStyle.filter(s => s !== style));
                              }
                            }}
                            className="mr-2 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                          <span className="text-sm text-slate-700">{style}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Styles Display */}
                {filterStyle.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterStyle.map(style => (
                      <span key={style} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {style}
                        <button
                          onClick={() => setFilterStyle(filterStyle.filter(s => s !== style))}
                          className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Categories Filter */}
              <div className="space-y-2 filter-dropdown">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-yellow-600" />
                  Special Categories
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSpecialCategoriesDropdownOpen(prev => !prev)}
                    className="w-full px-3 py-2 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200 text-sm text-left flex items-center justify-between transition-colors"
                  >
                    <span className={filterSpecialCategories.length > 0 ? "text-yellow-700" : "text-slate-500"}>
                      {filterSpecialCategories.length === 0 
                        ? "Select categories..." 
                        : filterSpecialCategories.length === 1 
                          ? specialCategories.find(cat => cat.id === filterSpecialCategories[0])?.name || 'Unknown'
                          : `${filterSpecialCategories.length} categories selected`
                      }
                    </span>
                    <svg className={`w-4 h-4 text-yellow-600 transition-transform ${specialCategoriesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Options */}
                  {specialCategoriesDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-yellow-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {specialCategories.map(cat => (
                        <label key={cat.id} className="flex items-center px-3 py-2 hover:bg-yellow-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterSpecialCategories.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilterSpecialCategories([...filterSpecialCategories, cat.id]);
                              } else {
                                setFilterSpecialCategories(filterSpecialCategories.filter(id => id !== cat.id));
                              }
                            }}
                            className="mr-2 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
                          />
                          <span className="text-sm text-slate-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Special Categories Display */}
                {filterSpecialCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterSpecialCategories.map(catId => {
                      const cat = specialCategories.find(c => c.id === catId);
                      return cat ? (
                        <span key={catId} className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          {cat.name}
                          <button
                            onClick={() => setFilterSpecialCategories(filterSpecialCategories.filter(id => id !== catId))}
                            className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Quantity Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gray-600" />
                  Quantity
                </label>
                <input
                  type="number"
                  value={filterQuantity}
                  onChange={e => setFilterQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                  placeholder="Enter quantity..."
                  min="0"
                />
              </div>

              {/* Latest Trend Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-pink-600" />
                  Latest Trend
                </label>
                <select 
                  value={filterLatestTrend} 
                  onChange={e => setFilterLatestTrend(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                >
                  <option value="">All Products</option>
                  <option value="true">Trending Only</option>
                  <option value="false">Not Trending</option>
                </select>
              </div>

              {/* Bestseller Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-600" />
                  Bestseller
                </label>
                <select 
                  value={filterBestseller} 
                  onChange={e => setFilterBestseller(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 text-sm"
                >
                  <option value="">All Products</option>
                  <option value="true">Bestsellers Only</option>
                  <option value="false">Not Bestsellers</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-600" />
                  Status
                </label>
                <select 
                  value={filterActive} 
                  onChange={e => setFilterActive(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Clear All Button */}
            <div className="flex justify-center">
              <button 
                className="px-6 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-2 shadow transition-all duration-200 hover:shadow-md" 
                onClick={() => { 
                  setSearchQuery("");
                  setFilterType([]); 
                  setFilterShape([]); 
                  setFilterStyle([]); 
                  setFilterSpecialCategories([]); 
                  setFilterQuantity(""); 
                  setFilterActive(""); 
                  setFilterLatestTrend(""); 
                  setFilterBestseller(""); 
                  setTypeDropdownOpen(false);
                  setShapeDropdownOpen(false);
                  setStyleDropdownOpen(false);
                  setSpecialCategoriesDropdownOpen(false);
                }}
              >
                <X className="w-4 h-4" /> 
                Clear All Filters
              </button>
            </div>
          </div>
        )}
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

        {/* 2. PRODUCT CARD MINIMALISM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter(product => product.gender_category && product.gender_category.includes(activeGender))
            .filter(product => !searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(product => filterType.length === 0 || (product.type_category && hasIntersection(filterType, product.type_category)))
            .filter(product => filterShape.length === 0 || (product.shape_category && filterShape.includes(product.shape_category)))
            .filter(product => filterStyle.length === 0 || (product.style_category && filterStyle.includes(product.style_category)))
            .filter(product => filterSpecialCategories.length === 0 || (productSpecialCategories[product.id] && hasIntersection(filterSpecialCategories, productSpecialCategories[product.id].map(id => id.toString()))))
            .filter(product => !filterQuantity || (product.quantity !== undefined && product.quantity !== null && product.quantity.toString() === filterQuantity))
            .filter(product => !filterLatestTrend || (filterLatestTrend === 'true' && product.latest_trend === true) || (filterLatestTrend === 'false' && product.latest_trend === false))
            .filter(product => !filterBestseller || (filterBestseller === 'true' && product.bestseller === true) || (filterBestseller === 'false' && product.bestseller === false))
            .filter(product => !filterActive || (filterActive === 'active' && product.is_active !== false) || (filterActive === 'inactive' && product.is_active === false))
            .map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[380px] max-h-[380px] min-w-[240px] max-w-[260px] mx-auto">
                {/* Product Image */}
                <div className="relative mb-4 w-32 h-32 flex items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {product.banner_image_1 ? (
                    <Image height={128} width={128} src={product.banner_image_1} alt={product.title} className="w-32 h-32 object-cover rounded-xl shadow" />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </div>
                {/* Product Info */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <h3 className="font-bold text-base text-slate-800 text-center line-clamp-2 mb-1">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-semibold text-blue-600 line-through">₹{product.original_price.toLocaleString()}</span>
                    {product.discounted_price && <span className="text-lg font-bold text-emerald-600">₹{product.discounted_price.toLocaleString()}</span>}
                  </div>
                  <div className="flex gap-2 mt-1">
                    {product.latest_trend && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Trend</span>}
                    {product.bestseller && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Bestseller</span>}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {/* Quantity Display */}
                  <div className="mt-2 text-xs text-slate-600 font-medium">Quantity: {product.quantity ?? 0}</div>
                  <div className="mt-2 text-xs text-slate-600 font-medium">Product Serial Number: {product.product_serial_number ?? 'N/A'}</div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100 w-full">
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 hover:shadow-lg" onClick={() => startEdit(product)} disabled={loading}>
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 hover:shadow-lg" onClick={() => handleDelete(product.id || "")} disabled={loading}>
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                  {/* <button 
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg ${
                      product.is_active !== false 
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    }`} 
                    onClick={() => toggleActiveStatus(product.id || "", product.is_active !== false)} 
                    disabled={loading}
                  >
                    <div className={`w-3 h-3 rounded-full ${product.is_active !== false ? 'bg-white' : 'bg-white'}`}></div>
                    {product.is_active !== false ? 'Deactivate' : 'Activate'}
                  </button> */}
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