"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShoppingBag,
  Sparkles,
  Search,
  User,
  Menu,
  X,
  Compass,
  UtensilsCrossed,
  Layers,
  ChevronDown,
  Clock,
  Users
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useCart } from "@/context/CartContext";

export function Header() {
  const pathname = usePathname();
  const { currentLocation, setLocationModalOpen, isDeliveryAvailable } = useLocation();
  const { cartCount, cartIconRef, setCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { href: "/studio", label: "Dish Studio", icon: Layers, isSpecial: true },
    { href: "/group-order", label: "Group Order", icon: Users },
    { href: "/ai-sommelier", label: "AI Sommelier", icon: Sparkles },
    { href: "/live-tracker", label: "Live Tracker", icon: Clock }
  ];

  const isActive = (path: string) => {
    if (path === "/explore" && (pathname === "/" || pathname === "/explore")) return true;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE5DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/explore" className="group flex flex-col">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1715] flex items-center gap-1.5 font-sans">
                CRAVE
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] inline-block group-hover:scale-125 transition-transform"></span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-[#9E948C] -mt-1 hidden sm:block">
                Every Bite, An Experience
              </span>
            </Link>

            {/* Location Selector Button */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFEA] hover:bg-[#EBE5DF] text-[#1A1715] text-xs font-medium transition-colors border border-[#E5DDD4] group cursor-pointer max-w-[240px] lg:max-w-[280px]"
              aria-label="Select delivery location"
            >
              <div className="p-1 rounded-full bg-white text-[#FF4D2D] shadow-2xs group-hover:scale-110 transition-transform">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-[10px] text-[#766E65] font-normal leading-tight">
                  {isDeliveryAvailable ? "Delivering to" : "Unavailable in"}
                </span>
                <span className="truncate font-semibold text-[#1A1715]">
                  {currentLocation.locality || currentLocation.city} ({currentLocation.pincode})
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9E948C] shrink-0 ml-1" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#1A1715] text-white shadow-xs"
                      : "text-[#665E57] hover:text-[#1A1715] hover:bg-[#F3EFEA]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isSpecial ? "text-[#FF4D2D]" : ""}`} />
                  {link.label}
                  {link.isSpecial && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FF4D2D] text-white rounded-md tracking-wider">
                      3D
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Cart, Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Location on Mobile */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex md:hidden p-2 text-[#665E57] hover:text-[#1A1715] hover:bg-[#F3EFEA] rounded-xl"
              aria-label="Change location"
            >
              <MapPin className="w-5 h-5 text-[#FF4D2D]" />
            </button>

            {/* Cart Button with Animated Ref */}
            <div ref={cartIconRef}>
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] transition-colors border border-[#FFD9D1] font-semibold text-sm cursor-pointer group"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline font-bold">Cart</span>
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-black bg-[#FF4D2D] text-white rounded-full">
                  {cartCount}
                </span>
              </button>
            </div>

            {/* Profile Link */}
            <Link
              href="/profile"
              className={`p-2 rounded-xl transition-colors ${
                isActive("/profile")
                  ? "bg-[#1A1715] text-white"
                  : "text-[#665E57] hover:text-[#1A1715] hover:bg-[#F3EFEA]"
              }`}
              aria-label="My Account and Orders"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden p-2 rounded-xl text-[#665E57] hover:text-[#1A1715] hover:bg-[#F3EFEA]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EBE5DF] bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-2">
          {/* Mobile Location Status */}
          <div
            onClick={() => {
              setLocationModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-[#F3EFEA] border border-[#E5DDD4] cursor-pointer mb-3"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#FF4D2D]" />
              <div className="text-xs">
                <p className="text-[#766E65]">Delivering to:</p>
                <p className="font-bold text-[#1A1715]">
                  {currentLocation.locality || currentLocation.city} ({currentLocation.pincode})
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#FF4D2D]">Change</span>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? "bg-[#1A1715] text-white"
                    : "text-[#1A1715] hover:bg-[#F3EFEA]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${link.isSpecial ? "text-[#FF4D2D]" : ""}`} />
                  <span>{link.label}</span>
                </div>
                {link.isSpecial && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#FF4D2D] text-white rounded-md">
                    3D Studio
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FF4D2D] text-white font-bold shadow-md hover:bg-[#E03A1A] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View Cart ({cartCount} items)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
