"use client";

import React, { useState } from "react";
import { useAdminAuth } from "../../../contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import toast from "react-hot-toast";
import OverviewTab from "./tabs/OverviewTab";
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import UsersTab from "./tabs/UsersTab";
import MediaTab from "./tabs/MediaTab";
import InviteTab from "./tabs/InviteTab";
import AddProductTab from "./tabs/AddProductTab";
import ManageProductTab from "./tabs/ManageProductTab";
import ManageCategoryTab from "./tabs/ManageCategoryTab";
import AddLensTab, { Lens } from "./tabs/AddLensTab";
import ManageLensTab from "./tabs/ManageLensTab";
import ManageLensCategoriesTab from "./tabs/ManageLensCategoriesTab";
import ManageSpecialProductCategoriesTab from "./tabs/ManageSpecialProductCategoriesTab";
import CouponPage from "../coupon/page";
import type { Product } from "./tabs/ManageProductTab";

// Add Admin type
interface AdminType {
  id: string;
  email: string;
  created_at: string;
}

const Sidebar = ({
  currentTab,
  setTab,
  isOpen,
  setIsOpen,
}: {
  currentTab: string;
  setTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [lensesDropdown, setLensesDropdown] = useState(false);
  const [couponsDropdown, setCouponsDropdown] = useState(false);
  const tabs = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "categories", label: "Categories", icon: "🎨" },
    { id: "products", label: "Products", icon: "🛍️", dropdown: true },
    { id: "lenses", label: "Lenses", icon: "👓", dropdown: true },
    { id: "coupons", label: "Coupons", icon: "🏷️", dropdown: true },
    { id: "special-categories", label: "Special Product Categories", icon: "⭐" },
    { id: "users", label: "Customers", icon: "👥" },
    { id: "media", label: "Media", icon: "🖼️" },
    { id: "invite", label: "Team", icon: "👨‍💼" },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "products") {
      setProductsDropdown((prev) => !prev);
      return;
    }
    if (tabId === "lenses") {
      setLensesDropdown((prev) => !prev);
      return;
    }
    if (tabId === "coupons") {
      setCouponsDropdown((prev) => !prev);
      return;
    }
    setTab(tabId);
    setIsOpen(false);
    setProductsDropdown(false);
    setLensesDropdown(false);
    setCouponsDropdown(false);
  };

  const handleProductSubTab = (subTab: string) => {
    setTab(subTab);
    setIsOpen(false);
    setProductsDropdown(false);
    setLensesDropdown(false);
  };

  const handleLensesSubTab = (subTab: string) => {
    setTab(subTab);
    setIsOpen(false);
    setLensesDropdown(false);
    setProductsDropdown(false);
  };

  const handleCouponSubTab = (subTab: string) => {
    setTab(subTab);
    setIsOpen(false);
    setCouponsDropdown(false);
    setProductsDropdown(false);
    setLensesDropdown(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-72 bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl
        text-gray-900 min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Admin Portal
                </h2>
                <p className="text-xs text-gray-500">Management Console</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {tabs.map((tab) =>
            tab.dropdown ? (
              <div key={tab.id} className="space-y-1">
                <button
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left font-medium transition-all duration-200 group ${
                    (tab.id === "products" && currentTab.startsWith("products")) || (tab.id === "lenses" && currentTab.startsWith("lenses")) || (tab.id === "coupons" && currentTab.startsWith("coupons"))
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      (tab.id === "products" && productsDropdown) || (tab.id === "lenses" && lensesDropdown) || (tab.id === "coupons" && couponsDropdown) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {tab.id === "products" && productsDropdown && (
                  <div className="ml-6 space-y-1 border-l border-gray-200 pl-4">
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "products-add"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleProductSubTab("products-add")}
                    >
                      <span className="text-xs">➕</span>
                      <span>Add Product</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "products-manage"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleProductSubTab("products-manage")}
                    >
                      <span className="text-xs">🛠️</span>
                      <span>Manage Products</span>
                    </button>
                  </div>
                )}
                {tab.id === "lenses" && lensesDropdown && (
                  <div className="ml-6 space-y-1 border-l border-gray-200 pl-4">
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "lenses-add"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleLensesSubTab("lenses-add")}
                    >
                      <span className="text-xs">➕</span>
                      <span>Add Lens</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "lenses-manage"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleLensesSubTab("lenses-manage")}
                    >
                      <span className="text-xs">🛠️</span>
                      <span>Manage Lenses</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "lenses-categories"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleLensesSubTab("lenses-categories")}
                    >
                      <span className="text-xs">📂</span>
                      <span>Manage Lens Categories</span>
                    </button>
                  </div>
                )}
                {tab.id === "coupons" && couponsDropdown && (
                  <div className="ml-6 space-y-1 border-l border-gray-200 pl-4">
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "coupons-add"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleCouponSubTab("coupons-add")}
                    >
                      <span className="text-xs">➕</span>
                      <span>Add Coupon</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left text-sm transition-all ${
                        currentTab === "coupons-manage"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => handleCouponSubTab("coupons-manage")}
                    >
                      <span className="text-xs">🛠️</span>
                      <span>Manage Coupons</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={tab.id}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left font-medium transition-all duration-200 ${
                  currentTab === tab.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const { admin, loading, setLoading } = useAdminAuth();
  const router = useRouter();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add Admin state
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [users, setUsers] = useState<
    { id: string; email: string; created_at: string }[]
  >([]);

  // Add editingProduct state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingLens, setEditingLens] = useState<Lens | null>(null);

  React.useEffect(() => {
    if (tab === "invite") fetchAdmins();
    if (tab === "users") fetchUsers();
  }, [tab]);

  async function fetchAdmins() {
    const { data, error } = await supabase
      .from("admin")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setAdmins(data);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setUsers(data);
  }

  const handleInviteAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Generate a unique token for password setup
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert pending admin invitation
      const { error } = await supabase.from("admin_invitations").insert({
        email: newAdminEmail,
        token: token,
        expires_at: expiresAt.toISOString(),
        invited_by: admin?.id,
      });

      if (error) {
        setMessage("Failed to send invitation. Please try again.");
        setLoading(false);
        return;
      }

      // Send invitation email (you'll need to implement this)
      // For now, we'll just show a success message with the setup link
      const setupLink = `${window.location.origin}/admin/setup/${token}`;
      setMessage(
        `Invitation sent to ${newAdminEmail}! Setup link: ${setupLink}`
      );
      setNewAdminEmail("");
    } catch {
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const getTabTitle = (currentTab: string) => {
    const titles = {
      overview: "Dashboard Overview",
      orders: "Order Management",
      products: "Product Catalog",
      "products-add": "Add New Product",
      "products-manage": "Manage Products",
      users: "Customer Management",
      slides: "Media Library",
      invite: "Team Management",
    };
    return titles[currentTab as keyof typeof titles] || "Dashboard";
  };

  const getTabDescription = (currentTab: string) => {
    const descriptions = {
      overview: "Monitor your business performance and key metrics",
      orders: "View and manage customer orders",
      products: "Manage your product inventory and catalog",
      "products-add": "Create new products for your store",
      "products-manage": "Edit and organize existing products",
      users: "View and manage customer accounts",
      slides: "Upload and manage promotional images",
      invite: "Invite new team members to admin panel",
    };
    return (
      descriptions[currentTab as keyof typeof descriptions] ||
      "Manage your business"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Loading Dashboard
          </h3>
          <p className="text-gray-600">
            Please wait while we prepare your admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100/80 via-blue-100/60 to-indigo-100/80">
      <Sidebar
        currentTab={tab}
        setTab={setTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {getTabTitle(tab)}
              </h1>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {admin.email.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-red-100/80 via-green-100/60 to-red-100/80">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {admin.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                          {getTabTitle(tab)}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          {getTabDescription(tab)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>System Online</span>
                      </div>
                      <span>•</span>
                      <span>Logged in as: {admin.email}</span>
                      <span>•</span>
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl overflow-hidden min-h-96">
              {tab === "overview" && <OverviewTab />}

              {tab === "orders" && <OrdersTab />}

              {tab === "categories" && <ManageCategoryTab />}

              {tab === "products" && <ProductsTab />}

              {tab === "users" && <UsersTab users={users} />}

              {tab === "media" && (
                <MediaTab />
              )}

              {tab === "invite" && (
                <InviteTab
                  newAdminEmail={newAdminEmail}
                  setNewAdminEmail={setNewAdminEmail}
                  message={message}
                  loading={loading}
                  handleInviteAdmin={handleInviteAdmin}
                  admins={admins}
                  onDeleteAdmin={async (id: string) => {
                    if (!window.confirm("Are you sure you want to delete this admin?")) return;
                    const { error } = await supabase.from("admin").delete().eq("id", id);
                    if (!error) {
                      setAdmins((prev) => prev.filter((a) => a.id !== id));
                    } else {
                      toast.error("Failed to delete admin.");
                    }
                  }}
                />
              )}

              {tab === "products-add" && (
                <AddProductTab
                  editProduct={editingProduct}
                  onFinishEdit={() => {
                    setEditingProduct(null);
                    setTab("products-manage");
                  }}
                />
              )}

              {tab === "products-manage" && (
                <ManageProductTab
                  onEditProduct={product => {
                    setEditingProduct(product);
                    setTab("products-add");
                  }}
                />
              )}

              {tab === "lenses-add" && (
                <AddLensTab
                  editLens={editingLens}
                  onFinishEdit={() => {
                    setEditingLens(null);
                    setTab("lenses-manage");
                  }}
                />
              )}

              {tab === "lenses-manage" && (
                <ManageLensTab
                  onEditLens={lens => {
                    setEditingLens(lens);
                    setTab("lenses-add");
                  }}
                />
              )}

              {tab === "lenses-categories" && <ManageLensCategoriesTab />}

              {tab === "special-categories" && <ManageSpecialProductCategoriesTab />}

              {tab === "coupons-add" && <CouponPage initialTab="add" />}
              {tab === "coupons-manage" && <CouponPage initialTab="manage" />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
