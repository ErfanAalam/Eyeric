import React, { useState, useEffect } from "react";
import { X, Filter, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { getCategoriesByType } from "../src/services/categoryService";
import "./FilterSidebar.css";

export default function FilterSidebar({
  currentGender,
  onGenderChange,
  selectedStyles,
  selectedShapes,
  currentPrice,
  onPriceChange,
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
  
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    gender: true,
    style: true,
    faceShape: true,
    price: true
  });

  // State for categories from database
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [styleOptions, setStyleOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocalStyles(selectedStyles);
  }, [selectedStyles, show]);
  
  useEffect(() => {
    setLocalShapes(selectedShapes);
  }, [selectedShapes, show]);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch all category types in parallel
        const [genderData, styleData, shapeData] = await Promise.all([
          getCategoriesByType('gender'),
          getCategoriesByType('style'),
          getCategoriesByType('shape')
        ]);

        setGenderOptions(genderData.map(cat => cat.name));
        setStyleOptions(styleData.map(cat => cat.name));
        setShapeOptions(shapeData.map(cat => cat.name));
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default options if database fails
        setGenderOptions(['Men', 'Women', 'Kids']);
        setStyleOptions(['Classic', 'Modern', 'Vintage', 'Sporty']);
        setShapeOptions(['Round', 'Square', 'Oval', 'Heart', 'Cat-Eye', 'Aviator', 'Wayfarer', 'Rectangle']);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const sidebarContent = (
    <div className="filter-sidebar p-4 space-y-4">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Filter className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Smart Filters</h2>
          <p className="text-sm text-gray-500">Find your perfect match</p>
        </div>
      </div>

      {/* Gender Filter */}
      <div className="filter-section">
        <div 
          className="filter-header cursor-pointer"
          onClick={() => toggleSection('gender')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              GENDER
            </div>
            {collapsedSections.gender ? (
              <ChevronRight className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
            )}
          </div>
        </div>
        <div className={`filter-content ${collapsedSections.gender ? 'collapsed' : ''}`}>
          <div className="space-y-2">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : (
              genderOptions.map((gender) => (
                <button
                  key={gender}
                  className={`gender-button w-full text-left ${
                    currentGender === gender.toLowerCase() ? "active" : ""
                  }`}
                  onClick={() => onGenderChange(gender)}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Style Filter */}
      <div className="filter-section">
        <div 
          className="filter-header cursor-pointer"
          onClick={() => toggleSection('style')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              STYLE
            </div>
            {collapsedSections.style ? (
              <ChevronRight className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
            )}
          </div>
        </div>
        <div className={`filter-content ${collapsedSections.style ? 'collapsed' : ''}`}>
          <div className="space-y-2">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : (
              styleOptions.map((style) => (
                <div
                  key={style}
                  className="checkbox-container"
                  onClick={() => handleStyleToggle(style)}
                >
                  <input
                    type="checkbox"
                    checked={localStyles.includes(style)}
                    onChange={() => handleStyleToggle(style)}
                    className="mr-3"
                  />
                  <label>{style.charAt(0).toUpperCase() + style.slice(1).toLowerCase()}</label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Face Shape Filter */}
      <div className="filter-section">
        <div 
          className="filter-header cursor-pointer"
          onClick={() => toggleSection('faceShape')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              FACE SHAPE
            </div>
            {collapsedSections.faceShape ? (
              <ChevronRight className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
            )}
          </div>
        </div>
        <div className={`filter-content ${collapsedSections.faceShape ? 'collapsed' : ''}`}>
          <div className="space-y-2">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : (
              shapeOptions.map((shape) => (
                <div
                  key={shape}
                  className="checkbox-container"
                  onClick={() => handleShapeToggle(shape)}
                >
                  <input
                    type="checkbox"
                    checked={localShapes.includes(shape)}
                    onChange={() => handleShapeToggle(shape)}
                    className="mr-3"
                  />
                  <label>{shape.charAt(0).toUpperCase() + shape.slice(1).toLowerCase()}</label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <div 
          className="filter-header cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              PRICE RANGE
            </div>
            {collapsedSections.price ? (
              <ChevronRight className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
            )}
          </div>
        </div>
        <div className={`filter-content ${collapsedSections.price ? 'collapsed' : ''}`}>
          <div className="price-container">
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
            <div className="price-labels">
              <span className="price-label">₹{currentPrice.min}</span>
              <span className="price-label">₹{currentPrice.max}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          className="action-button w-full"
          onClick={handleApply}
        >
          Apply Filters
        </button>
        <button
          className="action-button clear w-full"
          onClick={handleClear}
        >
          Clear All
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return show ? (
      <div className="mobile-filter-overlay fixed inset-0 z-50 flex justify-end lg:hidden">
        <div className="mobile-filter-panel w-80 max-w-full h-full overflow-y-auto relative animate-slideInRight">
          <button
            className="close-button absolute top-4 right-4"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          {sidebarContent}
        </div>
      </div>
    ) : null;
  }

  return <aside className="w-72 hidden lg:block">{sidebarContent}</aside>;
}
