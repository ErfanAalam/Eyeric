import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X, Users, Glasses, Shapes } from "lucide-react";
import { supabase } from "../../../../../lib/supabaseClient";


const DEFAULTS = {
  gender: ["men", "women", "kids", "unisex"],
  type: ["sunglasses", "eyeglasses", "computerglasses", "powered sunglasses"],
  shape: ["round", "cat-eye", "aviator", "wayfarer", "oval", "rectangle", "square"]
};

const CATEGORY_TYPES = [
  { 
    label: "Gender", 
    value: "gender", 
    icon: Users,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    activeColor: "border-pink-500 bg-pink-500"
  },
  { 
    label: "Type", 
    value: "type", 
    icon: Glasses,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    activeColor: "border-blue-500 bg-blue-500"
  },
  { 
    label: "Shape", 
    value: "shape", 
    icon: Shapes,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    activeColor: "border-emerald-500 bg-emerald-500"
  }
];

const ManageCategoryTab = () => {
  const [categoryType, setCategoryType] = useState("gender");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [categoryType,]);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("category_type", categoryType)
      .order("id", { ascending: true });
    if (!error) setCategories(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    if (exists) {
      setMessage("Category already exists.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("categories").insert({
      name: newCategory.trim(),
      category_type: categoryType
    });
    if (!error) {
      setNewCategory("");
      setMessage("Category added successfully!");
      fetchCategories();
    } else {
      setMessage("Failed to add category.");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = async (id) => {
    if (!editingName.trim()) return;
    setLoading(true);
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === editingName.trim().toLowerCase() && cat.id !== id
    );
    if (exists) {
      setMessage("Category already exists.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("categories").update({ name: editingName.trim() }).eq("id", id);
    if (!error) {
      setEditingId(null);
      setEditingName("");
      setMessage("Category updated successfully!");
      fetchCategories();
    } else {
      setMessage("Failed to update category.");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id, name) => {
    if (DEFAULTS[categoryType].includes(name.toLowerCase())) return;
    setLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setMessage("Category deleted successfully!");
      fetchCategories();
    } else {
      setMessage("Failed to delete category.");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const activeTab = CATEGORY_TYPES.find(tab => tab.value === categoryType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-3">
            Category Management
          </h1>
          <p className="text-slate-600 text-sm md:text-lg">Organize your eyewear categories with ease</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORY_TYPES.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = categoryType === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setCategoryType(tab.value)}
                className={`
                  group relative px-2 md:px-6 py-4 rounded-2xl font-semibold transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg
                  ${isActive 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-xl shadow-${tab.value === 'gender' ? 'pink' : tab.value === 'type' ? 'blue' : 'emerald'}-200` 
                    : 'bg-white/70 text-slate-700 hover:bg-white hover:shadow-md border border-slate-200'
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center gap-3 text-sm md:text-base">
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                  <span className="capitalize">{tab.label}</span>
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className={`${activeTab.bgColor} rounded-3xl shadow-2xl border border-white/20 p-8 backdrop-blur-sm transition-all duration-500`}>
          {/* Active Category Header */}
          <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${activeTab.color} text-white shadow-lg`}>
              <activeTab.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {activeTab.label} Categories
              </h2>
              <p className="text-slate-600">Manage your {activeTab.label.toLowerCase()} categories</p>
            </div>
          </div>

          {/* Add New Category */}
          <div className="bg-white/60 rounded-2xl p-6 mb-6 backdrop-blur-sm border border-white/40">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder={`Add new ${activeTab.label.toLowerCase()} category...`}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-opacity-50 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:shadow-lg"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                onClick={handleAdd}
                disabled={loading || !newCategory.trim()}
                className={`bg-gradient-to-r ${activeTab.color} text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <Plus className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Add
              </button>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium transition-all duration-500 transform animate-slide-down
              ${message.includes('success') || message.includes('added') || message.includes('updated') || message.includes('deleted')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-200 shadow-red-100'
              } shadow-lg`}>
              {message}
            </div>
          )}

          {/* Categories List */}
          <div className="bg-white/60 rounded-2xl backdrop-blur-sm border border-white/40 overflow-hidden">
            {loading && categories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <activeTab.icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No {activeTab.label.toLowerCase()} categories found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {categories.map((cat, index) => (
                  <div 
                    key={cat.id} 
                    className="flex items-center justify-between p-4 hover:bg-white/50 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-3 flex-1 animate-fade-in">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          onKeyPress={(e) => e.key === 'Enter' && handleEdit(cat.id)}
                          autoFocus
                        />
                        <button 
                          onClick={() => handleEdit(cat.id)} 
                          className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                          disabled={loading}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setEditingName(""); }} 
                          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTab.color}`} />
                          <span className="font-medium text-slate-800 capitalize group-hover:text-slate-900 transition-colors">
                            {cat.name}
                          </span>
                          {DEFAULTS[categoryType].includes(cat.name.toLowerCase()) && (
                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                            className="text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            disabled={false}
                            title={"Edit category"}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                disabled={false}
                                title={"Delete category"}
                            >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ManageCategoryTab;