"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { supabase } from "../../../../lib/supabaseClient";
import { supabase } from "../../../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

interface AdminInvitation {
  email: string;
  token: string;
  expires_at: string;
}

interface AdminSetupProps {
  params: {
    token: string;
  };
}

export default function AdminSetup(props: AdminSetupProps) {
  const { params } = props;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [invitation, setInvitation] = useState<AdminInvitation | null>(null);
  const [validating, setValidating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validateToken() {
      try {
        const { data, error } = await supabase
          .from("admin_invitations")
          .select("*")
          .eq("token", params.token)
          .single();

        if (error || !data) {
          setMessage("Invalid or expired invitation link.");
          setValidating(false);
          return;
        }

        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        
        if (now > expiresAt) {
          setMessage("This invitation has expired. Please request a new one.");
          setValidating(false);
          return;
        }

        setInvitation(data);
        setValidating(false);
      } catch {
        setMessage("Error validating invitation. Please try again.");
        setValidating(false);
      }
    }
    validateToken();
  }, [params.token]);

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create the admin account
      const { error: adminError } = await supabase
        .from("admin")
        .insert({
          email: invitation!.email,
          password_hash: passwordHash
        });

      if (adminError) {
        setMessage("Failed to create admin account. Please try again.");
        setLoading(false);
        return;
      }

      // Delete the invitation
      await supabase
        .from("admin_invitations")
        .delete()
        .eq("token", params.token);

      setMessage("Admin account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch {
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Validating Invitation...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Invalid Invitation</h1>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Admin Account</h1>
            <p className="text-gray-600">Create your password for {invitation.email}</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-2xl text-sm ${
                message.includes("successfully")
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
              {loading ? "Setting Up..." : "Set Up Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 