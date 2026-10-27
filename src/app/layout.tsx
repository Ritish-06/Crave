import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { IndiaLocationModal } from "@/components/location/IndiaLocationModal";
import { CartConflictModal } from "@/components/cart/CartConflictModal";
import { LoginModal } from "@/components/common/LoginModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRAVE — Every Bite, An Experience | Luxury Food Discovery & 3D Studio",
  description: "India's luxury AI-powered culinary discovery platform. Realistic 3D food customization, artisanal Neapolitan pizza, royal Awadhi dum biryanis, and transparent location delivery coverage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1A1715]">
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <IndiaLocationModal />
              <CartConflictModal />
              <LoginModal />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
