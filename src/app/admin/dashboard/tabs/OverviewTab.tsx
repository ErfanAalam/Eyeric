import React from "react";

const OverviewTab = () => (
  <div className="p-6 lg:p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats Cards */}
      {[
        { title: "Total Orders", value: "1,234", icon: "📦", color: "blue" },
        { title: "Active Users", value: "856", icon: "👥", color: "green" },
        { title: "Products", value: "142", icon: "🛍️", color: "purple" },
        { title: "Revenue", value: "$12.4k", icon: "💰", color: "orange" }
      ].map((stat, index) => (
        <div key={index} className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{stat.icon}</div>
            <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`}></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
          <div className="text-sm text-slate-600">{stat.title}</div>
        </div>
      ))}
    </div>
    <div className="text-center py-12 text-slate-500">
      <div className="text-4xl mb-4">📊</div>
      <p className="text-lg">Analytics and detailed reports coming soon...</p>
    </div>
  </div>
);

export default OverviewTab; 