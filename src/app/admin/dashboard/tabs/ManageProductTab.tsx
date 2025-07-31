import React, { useEffect, useState } from "react";
import { Edit3, Trash2, Package, X, Tag, Plus, Shapes } from "lucide-react";
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
  colors: { colors: string[]; images: string[] }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
  quantity?: number;
  style_category?: string;
  lens_category_id?: string;
  is_lens_used?: boolean;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
};

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
  const [filterType, setFilterType] = useState("");
  const [filterShape, setFilterShape] = useState("");
  const [filterStyle, setFilterStyle] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [specialCategories, setSpecialCategories] = useState([]);
  const [filterSpecialCategories, setFilterSpecialCategories] = useState([]);
  const [productSpecialCategories, setProductSpecialCategories] = useState({}); // { productId: [catId, ...] }

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      // Removed unused variables genderRes, typeRes, shapeRes, styleRes
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
          <div className="mb-8 flex flex-nowrap gap-4 overflow-x-auto justify-center items-center bg-white/90 p-4 rounded-2xl shadow-lg border border-blue-100">
            <div className="min-w-[160px]">
              <label className=" text-xs font-semibold mb-1 flex items-center gap-1"><Tag className="w-3 h-3" />Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-4 py-2 rounded-full border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All</option>
                {/* typeOptions.map(type => ( // Removed unused state */}
                {/*   <option key={type} value={type}>{type}</option> */}
                {/* ))} */}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className=" text-xs font-semibold mb-1 flex items-center gap-1"><Shapes className="w-3 h-3" />Shape</label>
              <select value={filterShape} onChange={e => setFilterShape(e.target.value)} className="px-4 py-2 rounded-full border border-green-200 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200">
                <option value="">All</option>
                {/* shapeOptions.map(shape => ( // Removed unused state */}
                {/*   <option key={shape} value={shape}>{shape}</option> */}
                {/* ))} */}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className=" text-xs font-semibold mb-1 flex items-center gap-1"><Tag className="w-3 h-3" />Style</label>
              <select value={filterStyle} onChange={e => setFilterStyle(e.target.value)} className="px-4 py-2 rounded-full border border-purple-200 bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-200">
                <option value="">All</option>
                {/* styleOptions.map(style => ( // Removed unused state */}
                {/*   <option key={style} value={style}>{style}</option> */}
                {/* ))} */}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className=" text-xs font-semibold mb-1 flex items-center gap-1"><Tag className="w-3 h-3" />Special</label>
              <select  value={filterSpecialCategories} onChange={e => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                if(e.target.value == ""){
                  setFilterSpecialCategories([])
                }else{
                  setFilterSpecialCategories(options);
                }
              }} className="px-4 py-2 rounded-full border border-yellow-200 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-200 h-[38px]">
                <option value="">All</option>
                {specialCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className=" text-xs font-semibold mb-1 flex items-center gap-1"><Tag className="w-3 h-3" />Quantity</label>
              <input
                type="number"
                value={filterQuantity}
                onChange={e => setFilterQuantity(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Quantity..."
                min="0"
              />
            </div>
            <button className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-2 shadow" onClick={() => { setFilterType(""); setFilterShape(""); setFilterStyle(""); setFilterSpecialCategories([]); setFilterQuantity(""); }}>
              <X className="w-4 h-4" /> Clear All
            </button>
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
            .filter(product => !filterType || product.type_category.includes(filterType))
            .filter(product => !filterShape || product.shape_category === filterShape)
            .filter(product => !filterStyle || product.style_category === filterStyle)
            .filter(product => filterSpecialCategories.length === 0 || (productSpecialCategories[product.id] && productSpecialCategories[product.id].some(catId => filterSpecialCategories.includes(catId.toString()))))
            .filter(product => !filterQuantity || (product.quantity !== undefined && product.quantity !== null && product.quantity.toString() === filterQuantity))
            .map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[340px] max-h-[340px] min-w-[240px] max-w-[260px] mx-auto">
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
                  </div>
                  {/* Quantity Display */}
                  <div className="mt-2 text-xs text-slate-600 font-medium">Quantity: {product.quantity ?? 0}</div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 w-full">
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