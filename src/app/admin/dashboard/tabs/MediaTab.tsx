import React, { useState } from "react";
import SlidesTab from "./SlidesTab";
import CategoryBannersTab from "./CategoryBannersTab";
import ShapeBannersTab from "./ShapeBannersTab";

const MEDIA_TABS = [
  { id: "slides", label: "Slides" },
  { id: "category-banners", label: "Category Banners" },
  { id: "shape-banners", label: "Shape Banners" },
];

const MediaTab = (props: any) => {
  const [activeTab, setActiveTab] = useState("slides");

  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-4 mb-6">
        {MEDIA_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "slides" && <SlidesTab {...props} />}
        {activeTab === "category-banners" && <CategoryBannersTab />}
        {activeTab === "shape-banners" && <ShapeBannersTab />}
      </div>
    </div>
  );
};

export default MediaTab; 