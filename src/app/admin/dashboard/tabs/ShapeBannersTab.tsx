import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import Image from "next/image";

interface Banner {
  id: string;
  shape: string;
  image_url: string;
  created_at: string;
}

interface Category {
  name: string;
}

const ShapeBannersTab = () => {
  const [shapes, setShapes] = useState<string[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState<{[key:string]:boolean}>({});

  useEffect(() => {
    const fetchShapes = async () => {
      const shapeRes = await supabase.from("categories").select("name").eq("category_type", "shape").order("id");
      setShapes(shapeRes.data ? shapeRes.data.map((c: Category) => c.name) : []);
    };
    fetchShapes();
    fetchBanners();
  }, []);

  async function fetchBanners() {
    const { data } = await supabase.from("shape-banners").select("*");
    setBanners(data || []);
  }

  function getBanner(shape: string) {
    return banners.find(b => b.shape === shape);
  }

  async function handleUpload(shape: string, file: File) {
    setUploading(u => ({...u, [shape]: true}));
    setMsg("");
    const filePath = `${shape}_${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from("shape-banners").upload(filePath, file);
    if (storageError) {
      setMsg("Upload failed");
      setUploading(u => ({...u, [shape]: false}));
      return;
    }
    const { data: urlData } = supabase.storage.from("shape-banners").getPublicUrl(filePath);
    const { error: dbError } = await supabase.from("shape-banners").insert({
      shape,
      image_url: urlData.publicUrl
    });
    if (dbError) setMsg("DB insert failed");
    else setMsg("Banner uploaded!");
    setUploading(u => ({...u, [shape]: false}));
    fetchBanners();
  }

  async function handleUpdate(shape: string, file: File, bannerId: string) {
    setUploading(u => ({...u, [shape]: true}));
    setMsg("");
    const filePath = `${shape}_${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from("shape-banners").upload(filePath, file, { upsert: true });
    if (storageError) {
      setMsg("Upload failed");
      setUploading(u => ({...u, [shape]: false}));
      return;
    }
    const { data: urlData } = supabase.storage.from("shape-banners").getPublicUrl(filePath);
    const { error: dbError } = await supabase.from("shape-banners").update({
      image_url: urlData.publicUrl
    }).eq("id", bannerId);
    if (dbError) setMsg("DB update failed");
    else setMsg("Banner updated!");
    setUploading(u => ({...u, [shape]: false}));
    fetchBanners();
  }

  async function handleDelete(shape: string, bannerId: string, imageUrl: string) {
    setUploading(u => ({...u, [shape]: true}));
    setMsg("");
    const path = imageUrl.split("/shape-banners/")[1];
    await supabase.storage.from("shape-banners").remove([path]);
    await supabase.from("shape_banners").delete().eq("id", bannerId);
    setMsg("Banner deleted!");
    setUploading(u => ({...u, [shape]: false}));
    fetchBanners();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {shapes.map((shape) => {
        const banner = getBanner(shape);
        return (
          <div key={shape} className="p-6 bg-white rounded-xl shadow border border-gray-100 flex flex-col items-center">
            <div className="font-semibold text-lg capitalize mb-2">{shape}</div>
            {banner && <Image src={banner.image_url} alt="banner" width={96} height={96} className="h-24 mb-2 rounded shadow" />}
            <div className="flex gap-2">
              {!banner && (
                <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" disabled={uploading[shape]} onChange={e => e.target.files && handleUpload(shape, e.target.files[0])} />
                </label>
              )}
              {banner && (
                <>
                  <label className="px-4 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer">
                    Update
                    <input type="file" accept="image/*" className="hidden" disabled={uploading[shape]} onChange={e => e.target.files && handleUpdate(shape, e.target.files[0], banner.id)} />
                  </label>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg" disabled={uploading[shape]} onClick={() => handleDelete(shape, banner.id, banner.image_url)}>Delete</button>
                </>
              )}
              {uploading[shape] && <span className="ml-2 text-xs text-gray-500">Processing...</span>}
            </div>
          </div>
        );
      })}
      {msg && <div className="col-span-full mt-4 p-2 bg-blue-50 text-blue-700 rounded">{msg}</div>}
    </div>
  );
};

export default ShapeBannersTab; 