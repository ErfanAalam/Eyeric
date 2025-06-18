"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

interface Admin {
  id: string;
  email: string;
  created_at: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for admin session in localStorage
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin")
        .select("id, email, password_hash, created_at")
        .eq("email", email)
        .single();
      if (error || !data) {
        setLoading(false);
        return { error: new Error("Invalid email or password") };
      }
      const passwordMatch = await bcrypt.compare(password, data.password_hash);
      if (!passwordMatch) {
        setLoading(false);
        return { error: new Error("Invalid email or password") };
      }
      const adminData = { id: data.id, email: data.email, created_at: data.created_at };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
      setLoading(false);
      return { error: null };
    } catch {
      setLoading(false);
      return { error: new Error("Login failed") };
    }
  };

  const signOut = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 