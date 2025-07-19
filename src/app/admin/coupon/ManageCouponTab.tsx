import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

const ManageCouponTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (!error && data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      setMessage("Failed to delete coupon");
    } else {
      setMessage("Coupon deleted successfully");
      setCoupons(coupons.filter((c) => c.id !== id));
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Manage Coupons</h2>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Cart</th>
              <th>Start</th>
              <th>End</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>{coupon.discount_type}</td>
                <td>{coupon.discount_value}</td>
                <td>{coupon.min_cart_value}</td>
                <td>{coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : ""}</td>
                <td>{coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : ""}</td>
                <td>{coupon.is_active ? "Yes" : "No"}</td>
                <td>
                  {/* For now, only delete. Edit can be added later. */}
                  <button onClick={() => handleDelete(coupon.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCouponTab; 