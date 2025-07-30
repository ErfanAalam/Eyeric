import React, { useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

const AddCouponTab = () => {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("flat");
  const [discountValue, setDiscountValue] = useState("");
  const [minCartValue, setMinCartValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userType, setUserType] = useState("all");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimitPerUser, setUsageLimitPerUser] = useState("");
  const [paymentType, setPaymentType] = useState("all");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.from("coupons").insert([
      {
        code,
        discount_type: discountType,
        discount_value: discountValue ? Number(discountValue) : null,
        min_cart_value: minCartValue ? Number(minCartValue) : null,
        start_date: startDate ? new Date(startDate) : null,
        end_date: endDate ? new Date(endDate) : null,
        user_type: userType,
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        usage_limit_per_user: usageLimitPerUser ? Number(usageLimitPerUser) : null,
        payment_type: paymentType,
        is_active: isActive,
        description,
      },
    ]);
    if (error) {
      setMessage("Failed to add coupon: " + error.message);
    } else {
      setMessage("Coupon added successfully!");
      setCode("");
      setDiscountType("flat");
      setDiscountValue("");
      setMinCartValue("");
      setStartDate("");
      setEndDate("");
      setUserType("all");
      setMaxDiscount("");
      setUsageLimitPerUser("");
      setPaymentType("all");
      setIsActive(true);
      setDescription("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-2">
      <div className="w-full  bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">🏷️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Coupon</h2>
          <p className="text-gray-600">Create and configure a new discount coupon</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Code</label>
              <input value={code} onChange={e => setCode(e.target.value)} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. SAVE10" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
                <option value="bogo">BOGO</option>
                <option value="combo">Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Value</label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 10 or 200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Minimum Cart Value</label>
              <input type="number" value={minCartValue} onChange={e => setMinCartValue(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 999" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">User Type</label>
              <select value={userType} onChange={e => setUserType(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="existing">Existing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Max Discount (for %)</label>
              <input type="number" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Usage Limit Per User</label>
              <input type="number" value={usageLimitPerUser} onChange={e => setUsageLimitPerUser(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g. 1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Type</label>
              <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                <option value="all">All</option>
                <option value="prepaid">Prepaid</option>
                <option value="cod">COD</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="accent-blue-600 w-5 h-5 rounded" id="isActive" />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">Is Active</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none" placeholder="For admin reference" />
          </div>
          {message && (
            <div className={`p-3 rounded-xl text-sm font-medium transition-all duration-500 mt-2 ${message.includes("successfully") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message}
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Adding Coupon...
              </>
            ) : (
              <>
                <span className="text-lg">➕</span> Add Coupon
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCouponTab; 