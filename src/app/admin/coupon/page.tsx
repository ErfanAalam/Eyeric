import React, { useState } from "react";
import AddCouponTab from "./AddCouponTab";
import ManageCouponTab from "./ManageCouponTab";

const CouponTabs = [
  { label: "Add Coupon", value: "add" },
  { label: "Manage Coupons", value: "manage" },
];

const CouponPage = ({ initialTab = "add" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <h1>Coupon Management</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {CouponTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              fontWeight: activeTab === tab.value ? "bold" : "normal",
              borderBottom: activeTab === tab.value ? "2px solid #333" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem 1rem",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "add" && <AddCouponTab />}
        {activeTab === "manage" && <ManageCouponTab />}
      </div>
    </div>
  );
};

export default CouponPage; 