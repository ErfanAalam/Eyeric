"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../../../contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!admin) {
      router.replace("/admin/login");
    }
  }, [admin, router]);

  const handleInviteAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Generate a unique token for password setup
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert pending admin invitation
      const { error } = await supabase
        .from("admin_invitations")
        .insert({
          email: newAdminEmail,
          token: token,
          expires_at: expiresAt.toISOString(),
          invited_by: admin?.id
        });

      if (error) {
        setMessage("Failed to send invitation. Please try again.");
        setLoading(false);
        return;
      }

      // Send invitation email (you'll need to implement this)
      // For now, we'll just show a success message with the setup link
      const setupLink = `${window.location.origin}/admin/setup/${token}`;
      setMessage(`Invitation sent to ${newAdminEmail}! Setup link: ${setupLink}`);
      setNewAdminEmail("");
    } catch {
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
        <p className="mb-8 text-center">Welcome, {admin.email}!</p>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Invite New Admin</h2>
          <form onSubmit={handleInviteAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter email address"
              />
            </div>
            
            {message && (
              <div className={`p-4 rounded-2xl text-sm ${
                message.includes("sent")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 