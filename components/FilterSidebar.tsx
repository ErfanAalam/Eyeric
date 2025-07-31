import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./FilterSidebar.css";

const GENDERS = ["Men", "Women", "Kids"];

export default function FilterSidebar({
  currentGender,
  onGenderChange,
  selectedStyles,
  selectedShapes,
  currentPrice,
  onPriceChange,
  styleOptions,
  show,
  onClose,
  isMobile,
  onClearFilters,
  onApplyFilters,
  maxPrice = 1000,
}: {
  currentGender: string;
  onGenderChange: (gender: string) => void;
  selectedStyles: string[];
  selectedShapes: string[];
  currentPrice: { min: number; max: number };
  onPriceChange: (price: { min: number; max: number }) => void;
  styleOptions: string[];
  show: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onClearFilters: () => void;
  onApplyFilters: (styles: string[], shapes: string[]) => void;
  maxPrice?: number;
}) {
  // Local state for multi-select
  const [localStyles, setLocalStyles] = useState<string[]>(selectedStyles);
  const [localShapes, setLocalShapes] = useState<string[]>(selectedShapes);

  useEffect(() => {
    setLocalStyles(selectedStyles);
  }, [selectedStyles, show]);
  useEffect(() => {
    setLocalShapes(selectedShapes);
  }, [selectedShapes, show]);

  const handleStyleToggle = (style: string) => {
    setLocalStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };
  const handleShapeToggle = (shape: string) => {
    setLocalShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };
  const handleApply = () => {
    onApplyFilters(localStyles, localShapes);
    if (isMobile) onClose();
  };
  const handleClear = () => {
    setLocalStyles([]);
    setLocalShapes([]);
    onClearFilters();
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Gender Filter */}
      <details className="group border-b pb-2">
        <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 text-base select-none">
          GENDER
          <span className="ml-2 text-2xl transition-transform group-open:rotate-0">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="mt-2 space-y-2 pl-2">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              className={`block w-full text-left px-2 py-1 rounded-lg text-gray-600 text-sm cursor-pointer hover:bg-blue-50 ${
                currentGender === gender.toLowerCase()
                  ? "bg-blue-100 font-bold text-blue-700"
                  : ""
              }`}
              onClick={() => onGenderChange(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </details>
      {/* Style Filter */}
      <details className="group border-b pb-2">
        <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 text-base select-none">
          STYLE
          <span className="ml-2 text-2xl transition-transform group-open:rotate-0">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="mt-2 space-y-2 pl-2">
          {styleOptions.map((style) => (
            <label
              key={style}
              className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localStyles.includes(style)}
                onChange={() => handleStyleToggle(style)}
                className="accent-blue-600"
              />
              {style}
            </label>
          ))}
        </div>
      </details>
      {/* Face Shape Filter */}
      <details className="group border-b pb-2">
        <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 text-base select-none">
          FACE SHAPE
          <span className="ml-2 text-2xl transition-transform group-open:rotate-0">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="mt-2 space-y-2 pl-2">
          {[
            "Round",
            "Square",
            "Oval",
            "Heart",
            "Cat-Eye",
            "Aviator",
            "Wayfarer",
            "Rectangle",
          ].map((shape) => (
            <label
              key={shape}
              className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localShapes.includes(shape.toLowerCase())}
                onChange={() => handleShapeToggle(shape.toLowerCase())}
                className="accent-blue-60"
              />
              {shape}
            </label>
          ))}
        </div>
      </details>
      {/* Price Filter */}
      <details className="group border-b pb-2">
        <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 text-base select-none">
          PRICE
          <span className="ml-2 text-2xl transition-transform group-open:rotate-0">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="mt-2 pl-2">
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={currentPrice.max}
            onChange={(e) =>
              onPriceChange({ ...currentPrice, max: Number(e.target.value) })
            }
            className="w-full price-slider"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{currentPrice.min}</span>
            <span>₹{currentPrice.max}</span>
          </div>
        </div>
      </details>
      <div className="flex flex-col gap-2 pt-2">
        <button
          className="w-full bg-button text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          onClick={handleApply}
        >
          Apply Filters
        </button>
        <button
          className="w-full bg-button text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return show ? (
      <div className="fixed inset-0 z-50 bg-black/40 flex justify-end lg:hidden">
        <div className="bg-white w-80 max-w-full h-full p-6 shadow-xl overflow-y-auto relative animate-slideInRight">
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          {sidebarContent}
        </div>
      </div>
    ) : null;
  }

  return <aside className="w-64 hidden lg:block">{sidebarContent}</aside>;
}
