import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../../lib/supabaseClient";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

type Slide = { 
  id: string; 
  image_url: string; 
  created_at: string; 
  redirect_url?: string;
  is_active?: boolean;
  display_order?: number;
};

type SlidesTabProps = {
  slides?: Slide[];
  slideLoading?: boolean;
  handleSlideUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSlideDelete?: (id: string, imageUrl: string) => void;
};

const SlidesTab = (props: SlidesTabProps) => {
  // If props are not provided, manage state internally
  const [slides, setSlides] = useState<Slide[]>(props.slides || []);
  const [slideLoading, setSlideLoading] = useState<boolean>(props.slideLoading || false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingOrder, setEditingOrder] = useState<{ [key: string]: number }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!props.slides) fetchSlides();
    // eslint-disable-next-line
  }, []);

  async function fetchSlides() {
    setSlideLoading(true);
    const { data, error } = await supabase
      .from("slide")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) setSlides(data);
    setSlideLoading(false);
  }

  async function handleAddSlide() {
    if (!selectedFile) return;
    
    setSlideLoading(true);

    // Aspect ratio validation (16:9)
    const isValidAspectRatio = await new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.onload = function () {
        const aspect = img.width / img.height;
        // Allow a small tolerance for floating point errors
        resolve(Math.abs(aspect - 16 / 9) < 0.02);
      };
      img.onerror = function () {
        resolve(false);
      };
      img.src = URL.createObjectURL(selectedFile);
    });
    if (!isValidAspectRatio) {
      toast.error("Image must have a 16:9 aspect ratio (e.g., 1600x900, 1920x1080). Upload canceled.");
      setSlideLoading(false);
      return;
    }

    // Resize and compress the image before upload
    const options = {
      maxWidthOrHeight: 1600, // 16:9 aspect ratio, so width 1600, height 900
      maxWidth: 1600,
      maxHeight: 900,
      useWebWorker: true,
      initialQuality: 0.7,
      fileType: "image/jpeg",
    };
    let compressedFile: File;
    try {
      compressedFile = await imageCompression(selectedFile, options);
    } catch {
      toast.error("Image compression failed");
      setSlideLoading(false);
      return;
    }

    const filePath = `${Date.now()}_${selectedFile.name}`;
    const { error: storageError } = await supabase.storage
      .from("slides")
      .upload(filePath, compressedFile);
    if (storageError) {
      toast.error("Upload failed");
      setSlideLoading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("slides")
      .getPublicUrl(filePath);
    
    // Get the next display order number
    const { data: maxOrderData } = await supabase
      .from("slide")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);
    
    const nextOrder = maxOrderData && maxOrderData.length > 0 ? (maxOrderData[0].display_order || 0) + 1 : 0;
    
    await supabase.from("slide").insert({ 
      image_url: urlData.publicUrl, 
      redirect_url: redirectUrl,
      is_active: true,
      display_order: nextOrder
    });
    toast.success("Slide uploaded successfully!");
    setSlideLoading(false);
    setRedirectUrl("");
    setSelectedFile(null);
    fetchSlides();
  }

  async function handleSlideDelete(id: string, imageUrl: string) {
    if (props.handleSlideDelete) return props.handleSlideDelete(id, imageUrl);
    
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this slide? This action cannot be undone.");
    if (!isConfirmed) return;
    
    setSlideLoading(true);
    try {
      // Parse the path after the bucket name
      const url = new URL(imageUrl);
      // The path is everything after '/storage/v1/object/public/slides/'
      const pathPrefix = "/storage/v1/object/public/slides/";
      const idx = url.pathname.indexOf(pathPrefix);
      if (idx === -1) throw new Error("Invalid image URL format");
      const path = url.pathname.substring(idx + pathPrefix.length);
      console.log("Deleting from bucket, path:", path); // Debug log
      const { error: removeError } = await supabase.storage.from("slides").remove([path]);
      if (removeError) {
        console.error("Supabase remove error:", removeError); // Debug log
        toast.error("Failed to delete image from storage");
        setSlideLoading(false);
        return;
      }
      await supabase.from("slide").delete().eq("id", id);
      await supabase.from("slides").delete().eq("id", id);
      toast.success("Slide deleted successfully!");
    } catch (err) {
      console.error("Delete slide/image error:", err); // Debug log
      toast.error("Failed to delete slide or image");
    }
    setSlideLoading(false);
    fetchSlides();
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    setSlideLoading(true);
    try {
      const { error } = await supabase
        .from("slide")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to update slide status");
      } else {
        toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchSlides();
      }
    } catch {
      toast.error("Failed to update slide status");
    }
    setSlideLoading(false);
  }

  async function handleUpdateDisplayOrder(id: string, newOrder: number) {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to change the display order to ${newOrder}?`);
    if (!isConfirmed) return;
    
    setSlideLoading(true);
    try {
      const { error } = await supabase
        .from("slide")
        .update({ display_order: newOrder })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to update display order");
      } else {
        toast.success("Display order updated successfully!");
        // Clear the editing state for this slide
        setEditingOrder(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        setInputValues(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        fetchSlides();
      }
    } catch {
      toast.error("Failed to update display order");
    }
    setSlideLoading(false);
  }

  function handleOrderInputChange(id: string, value: string) {
    // Store the raw input value for display
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Allow empty string for better UX when user is typing
    if (value === '') {
      setEditingOrder(prev => ({
        ...prev,
        [id]: 0
      }));
      return;
    }
    
    // Only allow digits
    if (/^\d*$/.test(value)) {
      const numValue = parseInt(value) || 0;
      setEditingOrder(prev => ({
        ...prev,
        [id]: numValue
      }));
    }
  }

  return (
  <div className="p-6 lg:p-8">
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span>🖼️</span>
        Slide Management
      </h3>
      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Upload New Slide
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              // Store the file for later upload
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            disabled={slideLoading}
            className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors"
          />
          <input
            type="text"
            placeholder="Redirect URL (optional)"
            value={redirectUrl}
            onChange={e => setRedirectUrl(e.target.value)}
            disabled={slideLoading}
            className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleAddSlide}
            disabled={slideLoading || !selectedFile}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {slideLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Slide
              </>
            )}
          </button>
        </div>
      </div>

    </div>
    {/* Slides Grid */}
    {slideLoading && slides.length === 0 ? (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-slate-600">Loading slides...</p>
      </div>
    ) : slides.length === 0 ? (
      <div className="text-center py-16 text-slate-500">
        <div className="text-6xl mb-4">🖼️</div>
        <p className="text-lg">No slides uploaded yet</p>
        <p className="text-sm">Upload your first slide using the form above</p>
      </div>
    ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className={`group relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-200 ${
            slide.is_active ? 'border-slate-200' : 'border-red-200 bg-red-50'
          }`}>
            {/* Status Badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                slide.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {slide.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* Display Order Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                editingOrder[slide.id] !== undefined 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                #{editingOrder[slide.id] !== undefined ? (inputValues[slide.id] || editingOrder[slide.id]) : (slide.display_order || 0)}
                {editingOrder[slide.id] !== undefined && ' (editing)'}
              </span>
            </div>

            <div className="aspect-video bg-slate-100">
              {slide.redirect_url ? (
                <a href={slide.redirect_url} target="_blank" rel="noopener noreferrer">
                  <Image 
                    src={slide.image_url} 
                    alt="slide" 
                    width={800} 
                    height={450} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                  />
                </a>
              ) : (
                <Image 
                  src={slide.image_url} 
                  alt="slide" 
                  width={800} 
                  height={450} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-500">
                {new Date(slide.created_at).toLocaleDateString()}
              </div>
              
              {/* Display Order Input */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-slate-700">Order:</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputValues[slide.id] !== undefined ? inputValues[slide.id] : (slide.display_order || 0).toString()}
                    onChange={(e) => handleOrderInputChange(slide.id, e.target.value)}
                    disabled={slideLoading}
                    className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-200 text-center"
                  />
                </div>
                {editingOrder[slide.id] !== undefined && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleUpdateDisplayOrder(slide.id, editingOrder[slide.id] || slide.display_order || 0)}
                      disabled={slideLoading}
                      className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                                              setEditingOrder(prev => {
                        const newState = { ...prev };
                        delete newState[slide.id];
                        return newState;
                      });
                      setInputValues(prev => {
                        const newState = { ...prev };
                        delete newState[slide.id];
                        return newState;
                      });
                      }}
                      disabled={slideLoading}
                      className="flex-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleActive(slide.id, slide.is_active || false)}
                  disabled={slideLoading}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    slide.is_active
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {slideLoading ? "Updating..." : (slide.is_active ? "Deactivate" : "Activate")}
                </button>
                
                <button
                  onClick={() => handleSlideDelete(slide.id, slide.image_url)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={slideLoading}
                >
                  {slideLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default SlidesTab; 