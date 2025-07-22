import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { CartProvider } from '../contexts/CartContext';

// ✅ Load Poppins font with CSS variable
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EYERIC",
  description: "Eyewear for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <CartProvider>
          <AdminAuthProvider>
            <AuthProvider>
              <FavoritesProvider>{children}</FavoritesProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
