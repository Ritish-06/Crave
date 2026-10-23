"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Clock,
  Heart,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useCart } from "@/context/CartContext";
import { OrderRecord, MenuItem } from "@/types";
import { MENU_ITEMS } from "@/data/menuData";

export default function ProfilePage() {
  const { savedAddresses, deleteAddress, setLocationModalOpen } = useLocation();
  const { addItem, setCartDrawerOpen } = useCart();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "preferences" | "security">("orders");
  const [spicePreference, setSpicePreference] = useState("Medium");
  const [dietaryPref, setDietaryPref] = useState("None (All-Inclusive)");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("crave_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addItem(item.menuItem, item.customization, item.customizationSummary, item.unitPrice);
    });
    setCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hub Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF4D2D]/30">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1A1715]">Ritish Sharma</h1>
                <span className="text-[10px] font-bold bg-[#FFF1EE] text-[#FF4D2D] px-2 py-0.5 rounded-md">
                  CRAVE Connoisseur
                </span>
              </div>
              <p className="text-xs text-[#766E65] mt-0.5">ritish@example.com • +91 98201 44521</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#766E65]">
            <div className="text-center">
              <span className="block text-xl font-black text-[#1A1715]">
                {orders.length}
              </span>
              <span>Past Orders</span>
            </div>
            <div className="h-8 w-px bg-[#EBE5DF]" />
            <div className="text-center">
              <span className="block text-xl font-black text-[#FF4D2D]">
                {savedAddresses.length}
              </span>
              <span>Saved Places</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#EBE5DF] gap-4 overflow-x-auto pb-1">
          {[
            { id: "orders", label: `Order History (${orders.length})` },
            { id: "addresses", label: `Saved Addresses (${savedAddresses.length})` },
            { id: "preferences", label: "Palate & Dietary" },
            { id: "security", label: "Security & Account" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#FF4D2D] text-[#FF4D2D]"
                  : "border-transparent text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Order History with One-Click Reorder */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE5DF] space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#9E948C] mx-auto" />
                <h3 className="text-lg font-bold text-[#1A1715]">No past orders yet</h3>
                <p className="text-xs text-[#766E65]">
                  Your culinary journey begins with your first artisanal discovery.
                </p>
                <Link
                  href="/explore"
                  className="inline-block mt-2 px-6 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs"
                >
                  Explore Dishes
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#F3EFEA] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#1A1715]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A] uppercase">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#766E65] mt-0.5">
                        {order.restaurantName} • {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-[#1A1715]">₹{order.total}</span>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[#766E65]">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="font-semibold text-[#1A1715]">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#F3EFEA] flex justify-between items-center text-xs text-[#766E65]">
                    <span>Delivered to: {order.deliveryAddress.locality}</span>
                    <Link href="/live-tracker" className="text-[#FF4D2D] font-bold hover:underline">
                      View Tracking Timeline →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-[#1A1715]">{addr.tag}</span>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-[#9E948C] hover:text-[#DC2626] p-1"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#1A1715] font-semibold">{addr.addressLine}</p>
                    <p className="text-xs text-[#766E65]">
                      {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-[11px] text-[#9E948C] pt-1">Phone: {addr.phone}</p>
                  </div>

                  <div className="pt-2 border-t border-[#F3EFEA] flex items-center justify-between">
                    <span className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Coverage Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setLocationModalOpen(true)}
              className="w-full py-4 rounded-3xl border border-dashed border-[#D5CDC4] text-[#766E65] hover:text-[#1A1715] hover:border-[#1A1715] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Indian Delivery Address</span>
            </button>
          </div>
        )}

        {/* TAB 3: Preferences */}
        {activeTab === "preferences" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
            <h3 className="text-base font-black text-[#1A1715]">Palate & Dietary Profile</h3>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-[#1A1715] mb-2">
                  Dietary Lifestyle
                </label>
                <div className="flex flex-wrap gap-2">
                  {["None (All-Inclusive)", "Pure Vegetarian", "Vegan Only", "Gluten-Free"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDietaryPref(d)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        dietaryPref === d
                          ? "bg-[#1A1715] text-white"
                          : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1715] mb-2">
                  Preferred Spice Tolerance
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Mild & Subtle", "Medium", "Authentic Indian Hot", "Ghost Pepper Daredevil"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpicePreference(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        spicePreference === s
                          ? "bg-[#FF4D2D] text-white"
                          : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Security */}
        {activeTab === "security" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1A1715]">Account Security</h3>
            <p className="text-xs text-[#766E65]">
              Your payment credentials and saved addresses are secured with 256-bit encryption. CRAVE never stores plain text payment tokens.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-[#ECFDF5] text-[#16A34A] text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Two-Factor Authentication Active</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
