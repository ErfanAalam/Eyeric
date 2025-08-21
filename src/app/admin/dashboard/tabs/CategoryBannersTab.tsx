import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

interface Banner {
  id: string;
  gender: string;
  type_category: string;
  image_url: string;
  created_at: string;
}

const CategoryBannersTab = () => {
  const [genders, setGenders] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [activeGender, setActiveGender] = useState<string>("");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState<{[key:string]:boolean}>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const genderRes = await supabase.from("categories").select("name").eq("category_type", "gender").order("id");
      const typeRes = await supabase.from("categories").select("name").eq("category_type", "type").order("id");
      setGenders(genderRes.data ? genderRes.data.map((c: { name: string }) => c.name) : []);
      
      // Set the first gender as active first
      if (genderRes.data && genderRes.data.length > 0) {
        const firstGender = genderRes.data[0].name;
        setActiveGender(firstGender);
        
        // Now filter types based on the first gender
        let filteredTypes = typeRes.data ? typeRes.data.map((c: { name: string }) => c.name) : [];
        if (firstGender === "kids") {
          filteredTypes = filteredTypes.filter(type => 
            ["eyeglasses", "computer glasses"].includes(type.toLowerCase())
          );
        }
        setTypes(filteredTypes);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeGender) {
      // Refetch and filter types based on selected gender
      const filterTypesByGender = async () => {
        const typeRes = await supabase.from("categories").select("name").eq("category_type", "type").order("id");
        let filteredTypes = typeRes.data ? typeRes.data.map((c: { name: string }) => c.name) : [];
        if (activeGender === "kids") {
          filteredTypes = filteredTypes.filter(type => 
            ["eyeglasses", "sunglasses"].includes(type.toLowerCase())
          );
        }
        setTypes(filteredTypes);
      };
      filterTypesByGender();
      fetchBanners();
    }
    // eslint-disable-next-line
  }, [activeGender]);

  async function fetchBanners() {
    const { data } = await supabase
      .from("category_banners")
      .select("*")
      .eq("gender", activeGender);
    setBanners(data || []);
  }

  function getBanner(type: string) {
    return banners.find(b => b.type_category === type);
  }

  async function handleUpload(type: string, file: File) {
    setUploading(u => ({...u, [type]: true}));
    setMsg("");
    const filePath = `${activeGender}_${type}_${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from("category-banners").upload(filePath, file);
    if (storageError) {
      setMsg("Upload failed");
      setUploading(u => ({...u, [type]: false}));
      return;
    }
    const { data: urlData } = supabase.storage.from("category-banners").getPublicUrl(filePath);
    const { error: dbError } = await supabase.from("category_banners").insert({
      gender: activeGender,
      type_category: type,
      image_url: urlData.publicUrl
    });
    if (dbError) setMsg("DB insert failed");
    else setMsg("Banner uploaded!");
    setUploading(u => ({...u, [type]: false}));
    fetchBanners();
  }

  async function handleUpdate(type: string, file: File, bannerId: string) {
    setUploading(u => ({...u, [type]: true}));
    setMsg("");
    const filePath = `${activeGender}_${type}_${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from("category-banners").upload(filePath, file, { upsert: true });
    if (storageError) {
      setMsg("Upload failed");
      setUploading(u => ({...u, [type]: false}));
      return;
    }
    const { data: urlData } = supabase.storage.from("category-banners").getPublicUrl(filePath);
    const { error: dbError } = await supabase.from("category_banners").update({
      image_url: urlData.publicUrl
    }).eq("id", bannerId);
    if (dbError) setMsg("DB update failed");
    else setMsg("Banner updated!");
    setUploading(u => ({...u, [type]: false}));
    fetchBanners();
  }

  async function handleDelete(type: string, bannerId: string, imageUrl: string) {
    setUploading(u => ({...u, [type]: true}));
    setMsg("");
    const path = imageUrl.split("/category_banners/")[1];
    await supabase.storage.from("category-banners").remove([path]);
    await supabase.from("category_banners").delete().eq("id", bannerId);
    setMsg("Banner deleted!");
    setUploading(u => ({...u, [type]: false}));
    fetchBanners();
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {genders.map((gender) => (
          <button
            key={gender}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeGender === gender ? "bg-pink-600 text-white" : "bg-white text-pink-700 border border-pink-200 hover:bg-pink-50"}`}
            onClick={() => setActiveGender(gender)}
          >
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>
      {msg && <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded">{msg}</div>}
      <div>
        {types.map((type) => {
          const banner = getBanner(type);
          return (
            <div key={type} className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg capitalize">{activeGender} - {type}</div>
                {banner && <Image height={500} width={500} src={banner.image_url} alt="banner" className="size-48 mt-2 rounded shadow" />}
              </div>
              <div className="flex items-center gap-2">
                {!banner && (
                  <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                    Upload
                    <input type="file" accept="image/*" className="hidden" disabled={uploading[type]} onChange={e => e.target.files && handleUpload(type, e.target.files[0])} />
                  </label>
                )}
                {banner && (
                  <>
                    <label className="px-4 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer">
                      Update
                      <input type="file" accept="image/*" className="hidden" disabled={uploading[type]} onChange={e => e.target.files && handleUpdate(type, e.target.files[0], banner.id)} />
                    </label>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg" disabled={uploading[type]} onClick={() => handleDelete(type, banner.id, banner.image_url)}>Delete</button>
                  </>
                )}
                {uploading[type] && <span className="ml-2 text-xs text-gray-500">Processing...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBannersTab; 