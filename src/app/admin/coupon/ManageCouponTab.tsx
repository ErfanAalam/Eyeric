import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { Edit3, Trash2 } from "lucide-react";

const initialCouponState = {
  code: "",
  discount_type: "flat",
  discount_value: "",
  min_cart_value: "",
  start_date: "",
  end_date: "",
  user_type: "all",
  max_discount: "",
  usage_limit_per_user: "",
  payment_type: "all",
  is_active: true,
  description: "",
};

const ManageCouponTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editForm, setEditForm] = useState(initialCouponState);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("coupons").select("*");
    if (!error && data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (editingCoupon) {
      setEditForm({
        code: editingCoupon.code || "",
        discount_type: editingCoupon.discount_type || "flat",
        discount_value: editingCoupon.discount_value || "",
        min_cart_value: editingCoupon.min_cart_value || "",
        start_date: editingCoupon.start_date ? new Date(editingCoupon.start_date).toISOString().slice(0, 10) : "",
        end_date: editingCoupon.end_date ? new Date(editingCoupon.end_date).toISOString().slice(0, 10) : "",
        user_type: editingCoupon.user_type || "all",
        max_discount: editingCoupon.max_discount || "",
        usage_limit_per_user: editingCoupon.usage_limit_per_user || "",
        payment_type: editingCoupon.payment_type || "all",
        is_active: editingCoupon.is_active,
        description: editingCoupon.description || "",
      });
      setEditMessage("");
    }
  }, [editingCoupon]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    
    try {
      // First, check if the coupon is being used in product_coupons
      const { data: productCoupons, error: pcError } = await supabase
        .from("product_coupons")
        .select("product_id")
        .eq("coupon_id", id);
      
      if (pcError) {
        setMessage("Failed to check coupon dependencies: " + pcError.message);
        setLoading(false);
        return;
      }
      
      // Check for any other potential foreign key references
      // This is a generic approach to catch any other tables that might reference coupons
      let dependenciesFound = false;
      let dependencyMessage = "";
      
      if (productCoupons && productCoupons.length > 0) {
        dependenciesFound = true;
        dependencyMessage += `- Associated with ${productCoupons.length} product(s)\n`;
      }
      
      // If dependencies found, show warning
      if (dependenciesFound) {
        const shouldDelete = window.confirm(
          `This coupon has the following dependencies:\n${dependencyMessage}\nDeleting it will remove these associations. Do you want to continue?`
        );
        
        if (!shouldDelete) {
          setLoading(false);
          return;
        }
        
        // Delete product_coupons associations first
        if (productCoupons && productCoupons.length > 0) {
          const { error: deletePcError } = await supabase
            .from("product_coupons")
            .delete()
            .eq("coupon_id", id);
          
          if (deletePcError) {
            setMessage("Failed to remove product associations: " + deletePcError.message);
            setLoading(false);
            return;
          }
        }
      }
      
      // Now delete the coupon
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) {
        // If we still get a foreign key error, provide a more helpful message
        if (error.code === '23503' || error.message.includes('foreign key')) {
          setMessage("Cannot delete coupon: It is being used by other parts of the system. Consider deactivating it instead.");
        } else {
          setMessage("Failed to delete coupon: " + error.message);
        }
      } else {
        setMessage("Coupon deleted successfully");
        setCoupons(coupons.filter((c) => c.id !== id));
      }
    } catch (error) {
      setMessage("An unexpected error occurred: " + error.message);
    }
    
    setLoading(false);
  };

  const handleDeactivate = async (id, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this coupon?`)) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    
    if (error) {
      setMessage(`Failed to ${action} coupon: ` + error.message);
    } else {
      setMessage(`Coupon ${action}d successfully`);
      setCoupons(coupons.map((c) => 
        c.id === id ? { ...c, is_active: !currentStatus } : c
      ));
    }
    setLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditMessage("");
    const { code, discount_type, discount_value, min_cart_value, start_date, end_date, user_type, max_discount, usage_limit_per_user, payment_type, is_active, description } = editForm;
    const { error } = await supabase.from("coupons").update({
      code,
      discount_type,
      discount_value: discount_value ? Number(discount_value) : null,
      min_cart_value: min_cart_value ? Number(min_cart_value) : null,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      user_type,
      max_discount: max_discount ? Number(max_discount) : null,
      usage_limit_per_user: usage_limit_per_user ? Number(usage_limit_per_user) : null,
      payment_type,
      is_active,
      description,
    }).eq("id", editingCoupon.id);
    if (error) {
      setEditMessage("Failed to update coupon: " + error.message);
    } else {
      setEditMessage("Coupon updated successfully!");
      setEditingCoupon(null);
      fetchCoupons();
    }
    setEditLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-2">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Coupons</h2>
          <p className="text-gray-600">View, edit, or delete discount coupons</p>
        </div>
        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium transition-all duration-500 mt-2 ${message.includes("successfully") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <span className="animate-spin text-3xl mr-2">⏳</span> Loading...
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <span className="text-3xl text-slate-400">🏷️</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No coupons found</h3>
            <p className="text-slate-500 mb-6">Get started by adding your first coupon.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Min Cart</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Start</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">End</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-blue-50 transition-all">
                    <td className="px-4 py-3 font-semibold text-blue-700">{coupon.code}</td>
                    <td className="px-4 py-3">{coupon.discount_type}</td>
                    <td className="px-4 py-3">{coupon.discount_value}</td>
                    <td className="px-4 py-3">{coupon.min_cart_value}</td>
                    <td className="px-4 py-3">{coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : ""}</td>
                    <td className="px-4 py-3">{coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : ""}</td>
                    <td className="px-4 py-3">{coupon.is_active ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Yes</span> : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">No</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1 hover:shadow-lg"
                          onClick={() => setEditingCoupon(coupon)}
                          title="Edit Coupon"
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1 hover:shadow-lg ${
                            coupon.is_active 
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          }`}
                          onClick={() => handleDeactivate(coupon.id, coupon.is_active)}
                          title={coupon.is_active ? "Deactivate Coupon" : "Activate Coupon"}
                        >
                          {coupon.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1 hover:shadow-lg"
                          onClick={() => handleDelete(coupon.id)}
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Edit Modal */}
        {editingCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-slate-200 relative">
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setEditingCoupon(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Edit Coupon</h3>
                <p className="text-gray-600">Update coupon details below</p>
              </div>
              <form className="space-y-6" onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Code</label>
                    <input name="code" value={editForm.code} onChange={handleEditChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. SAVE10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Type</label>
                    <select name="discount_type" value={editForm.discount_type} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                      <option value="flat">Flat</option>
                      <option value="percentage">Percentage</option>
                      <option value="bogo">BOGO</option>
                      <option value="combo">Combo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Value</label>
                    <input name="discount_value" type="number" value={editForm.discount_value} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 10 or 200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Minimum Cart Value</label>
                    <input name="min_cart_value" type="number" value={editForm.min_cart_value} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 999" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                    <input name="start_date" type="date" value={editForm.start_date} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                    <input name="end_date" type="date" value={editForm.end_date} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">User Type</label>
                    <select name="user_type" value={editForm.user_type} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                      <option value="all">All</option>
                      <option value="new">New</option>
                      <option value="existing">Existing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Max Discount (for %)</label>
                    <input name="max_discount" type="number" value={editForm.max_discount} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Usage Limit Per User</label>
                    <input name="usage_limit_per_user" type="number" value={editForm.usage_limit_per_user} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Type</label>
                    <select name="payment_type" value={editForm.payment_type} onChange={handleEditChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                      <option value="all">All</option>
                      <option value="prepaid">Prepaid</option>
                      <option value="cod">COD</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input name="is_active" type="checkbox" checked={editForm.is_active} onChange={handleEditChange} className="accent-blue-600 w-5 h-5 rounded" id="isActiveEdit" />
                    <label htmlFor="isActiveEdit" className="text-sm font-semibold text-slate-700">Is Active</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none" placeholder="For admin reference" />
                </div>
                {editMessage && (
                  <div className={`p-3 rounded-xl text-sm font-medium transition-all duration-500 mt-2 ${editMessage.includes("successfully") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {editMessage}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={editLoading} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                    {editLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setEditingCoupon(null)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCouponTab; 