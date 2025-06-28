import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

const ManageLensTab = () => {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLenses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("lenses").select("*").order("created_at", { ascending: false });
    if (!error && data) setLenses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLenses();
  }, []);

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this lens?")) return;
    setLoading(true);
    setMessage("");
    // Remove image from storage
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

  return (
    <div className="p-6 lg:p-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span role="img" aria-label="lens">👓</span>
        Manage Lenses
      </h3>
      {message && <div className="mb-4 text-center text-sm font-medium text-blue-700">{message}</div>}
      {loading && <div className="mb-4 text-center">Loading...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lenses.map((lens) => (
          <div key={lens.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow hover:shadow-lg transition-all duration-200">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              {lens.image_url && <Image src={lens.image_url} alt={lens.title} width={300} height={300} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="font-bold text-lg mb-1">{lens.title}</div>
              <div className="text-xs text-slate-500 mb-2">{lens.category}</div>
              <div className="text-sm text-slate-700 mb-2">{lens.description}</div>
              <div className="text-xs text-slate-500 mb-2">Features: {lens.features && lens.features.join(", ")}</div>
              <button
                onClick={() => handleDelete(lens.id, lens.image_url)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Lens"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {lenses.length === 0 && !loading && <div className="text-center py-16 text-slate-500">No lenses found.</div>}
    </div>
  );
};

export default ManageLensTab; 