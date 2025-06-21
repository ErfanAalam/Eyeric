import React from "react";
import Image from "next/image";

type Slide = { id: string; image_url: string; created_at: string };

type SlidesTabProps = {
  slides: Slide[];
  slideLoading: boolean;
  slideMsg: string;
  handleSlideUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSlideDelete: (id: string, imageUrl: string) => void;
};

const SlidesTab = ({ slides, slideLoading, slideMsg, handleSlideUpload, handleSlideDelete }: SlidesTabProps) => (
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
            onChange={handleSlideUpload}
            disabled={slideLoading}
            className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors"
          />
          {slideLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          )}
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
              <Image 
                src={slide.image_url} 
                alt="slide" 
                width={800} 
                height={450} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
              />
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

export default SlidesTab; 