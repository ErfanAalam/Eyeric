import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../../lib/supabaseClient";
import imageCompression from "browser-image-compression";

type Slide = { id: string; image_url: string; created_at: string; redirect_url?: string };

type SlidesTabProps = {
  slides?: Slide[];
  slideLoading?: boolean;
  slideMsg?: string;
  handleSlideUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSlideDelete?: (id: string, imageUrl: string) => void;
};

const SlidesTab = (props: SlidesTabProps) => {
  // If props are not provided, manage state internally
  const [slides, setSlides] = useState<Slide[]>(props.slides || []);
  const [slideLoading, setSlideLoading] = useState<boolean>(props.slideLoading || false);
  const [slideMsg, setSlideMsg] = useState<string>(props.slideMsg || "");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!props.slides) fetchSlides();
    // eslint-disable-next-line
  }, []);

  async function fetchSlides() {
    setSlideLoading(true);
    const { data, error } = await supabase
      .from("slide")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSlides(data);
    setSlideLoading(false);
  }

  async function handleAddSlide() {
    if (!selectedFile) return;
    
    setSlideLoading(true);
    setSlideMsg("");

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
      setSlideMsg("Image must have a 16:9 aspect ratio (e.g., 1600x900, 1920x1080). Upload canceled.");
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
      setSlideMsg("Image compression failed");
      setSlideLoading(false);
      return;
    }

    const filePath = `${Date.now()}_${selectedFile.name}`;
    const { error: storageError } = await supabase.storage
      .from("slides")
      .upload(filePath, compressedFile);
    if (storageError) {
      setSlideMsg("Upload failed");
      setSlideLoading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("slides")
      .getPublicUrl(filePath);
    await supabase.from("slide").insert({ image_url: urlData.publicUrl, redirect_url: redirectUrl });
    setSlideMsg("Slide uploaded!");
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
    setSlideMsg("");
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
        setSlideMsg("Failed to delete image from storage");
        setSlideLoading(false);
        return;
      }
      await supabase.from("slide").delete().eq("id", id);
      await supabase.from("slides").delete().eq("id", id);
      setSlideMsg("Slide deleted!");
    } catch (err) {
      console.error("Delete slide/image error:", err); // Debug log
      setSlideMsg("Failed to delete slide or image");
    }
    setSlideLoading(false);
    fetchSlides();
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
      {/* Messages */}
      {slideMsg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          slideMsg.includes("uploaded") || slideMsg.includes("deleted")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {slideMsg}
        </div>
      )}
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
          <div key={slide.id} className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
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
            <div className="p-4">
              <div className="text-xs text-slate-500 mb-3">
                {new Date(slide.created_at).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleSlideDelete(slide.id, slide.image_url)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={slideLoading}
              >
                {slideLoading ? "Deleting..." : "Delete Slide"}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default SlidesTab; 