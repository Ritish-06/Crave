"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Flame,
  UtensilsCrossed,
  Wallet,
  Bookmark,
  Check,
  Box,
  ShieldCheck,
  MapPin,
  Leaf
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { OrderRecord } from "@/types";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import {
  loadFoodIdentity,
  saveFoodIdentity,
  loadSavedDishIds,
  saveSavedDishIds,
  MENU_CUISINES,
  BUDGET_BRACKETS,
  SPICE_LEVELS,
  DIET_OPTIONS,
  FoodIdentity
} from "@/lib/foodIdentity";

const DEFAULT_IDENTITY: FoodIdentity = {
  cuisines: ["North Indian", "Italian & Artisanal Pizza", "Gourmet Burgers"],
  maxDishPrice: 500,
  diet: "any",
  spiceTolerance: 2,
  updatedAt: new Date().toISOString()
};

const DEFAULT_SAVED_DISHES = ["dish-burger-1", "dish-pizza-1", "dish-bao-1"];

export default function ProfilePage() {
  const { user, requireAuth, logout, setLoginModalOpen } = useAuth();
  const { savedAddresses, deleteAddress, setLocationModalOpen } = useLocation();
  const { addItem, setCartDrawerOpen } = useCart();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    "orders" | "identity" | "collections" | "addresses" | "settings"
  >("orders");

  // Food Identity State
  const [identity, setIdentity] = useState<FoodIdentity>(DEFAULT_IDENTITY);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Saved Dishes
  const [savedDishIds, setSavedDishIds] = useState<string[]>(DEFAULT_SAVED_DISHES);

  // Notification preferences
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyLowNoise, setNotifyLowNoise] = useState(true);
  const [notifySpecials, setNotifySpecials] = useState(false);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("crave_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const loadedIdentity = loadFoodIdentity();
      if (loadedIdentity) {
        setIdentity(loadedIdentity);
      }

      const loadedSaved = loadSavedDishIds();
      if (loadedSaved.length > 0) {
        setSavedDishIds(loadedSaved);
      }
    } catch {}
  }, []);

  const handleUpdateIdentity = (patch: Partial<FoodIdentity>) => {
    const updated = { ...identity, ...patch, updatedAt: new Date().toISOString() };
    setIdentity(updated);
    saveFoodIdentity(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const toggleCuisine = (c: string) => {
    const exists = identity.cuisines.includes(c);
    const updated = exists
      ? identity.cuisines.filter((x) => x !== c)
      : [...identity.cuisines, c];
    handleUpdateIdentity({ cuisines: updated });
  };

  const handleReorder = (order: OrderRecord) => {
    requireAuth(() => {
      order.items.forEach((item) => {
        addItem(item.menuItem, item.customization, item.customizationSummary, item.unitPrice);
      });
      setCartDrawerOpen(true);
    }, `reorder dishes from ${order.restaurantName}`);
  };

  const removeSavedDish = (id: string) => {
    const next = savedDishIds.filter((x) => x !== id);
    setSavedDishIds(next);
    saveSavedDishIds(next);
  };

  const savedMenuItems = ALL_MENU_ITEMS.filter((item) => savedDishIds.includes(item.id));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hub Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF4D2D]/30 uppercase">
              {user ? user.name.slice(0, 2) : "GF"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1A1715]">
                  {user ? user.name : "Guest Foodie"}
                </h1>
                <span className="text-[10px] font-bold bg-[#FFF1EE] text-[#FF4D2D] px-2 py-0.5 rounded-md">
                  {user ? "CRAVE Connoisseur" : "Guest Explorer"}
                </span>
              </div>
              <p className="text-xs text-[#766E65] mt-0.5">
                {user ? `${user.email} ${user.phone ? `• ${user.phone}` : ""}` : "Not logged in • Sign in to save preferences across devices"}
              </p>
              <div className="mt-2">
                {user ? (
                  <button
                    onClick={() => logout()}
                    className="text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
                  >
                    Log Out of CRAVE
                  </button>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#766E65]">
            <div className="text-center">
              <span className="block text-xl font-black text-[#1A1715]">{orders.length}</span>
              <span>Past Orders</span>
            </div>
            <div className="h-8 w-px bg-[#EBE5DF]" />
            <div className="text-center">
              <span className="block text-xl font-black text-[#FF4D2D]">{savedDishIds.length}</span>
              <span>Saved Bites</span>
            </div>
            <div className="h-8 w-px bg-[#EBE5DF]" />
            <div className="text-center">
              <span className="block text-xl font-black text-[#1A1715]">{savedAddresses.length}</span>
              <span>Addresses</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#EBE5DF] gap-4 sm:gap-6 overflow-x-auto pb-1 text-sm font-bold">
          {[
            { id: "orders", label: `Order History (${orders.length})`, icon: Clock },
            { id: "identity", label: "Your Food Identity", icon: Sparkles, badge: "Palate Match" },
            { id: "collections", label: `Saved Bites (${savedDishIds.length})`, icon: Bookmark },
            { id: "addresses", label: `Saved Addresses (${savedAddresses.length})`, icon: MapPin },
            { id: "settings", label: "Preferences & Privacy", icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-[#FF4D2D] text-[#FF4D2D]"
                    : "border-transparent text-[#766E65] hover:text-[#1A1715]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#FFF1EE] text-[#FF4D2D] rounded-full font-extrabold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Order History */}
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
                  className="inline-block mt-2 px-6 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1B] transition-colors"
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

                  <div className="pt-2 border-t border-[#F3EFEA] flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#766E65] gap-2">
                    <span>Delivered to: {order.deliveryAddress?.locality || "Mumbai"}</span>
                    <Link href="/live-tracker" className="text-[#FF4D2D] font-bold hover:underline">
                      View Tracking Timeline →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Your Food Identity */}
        {activeTab === "identity" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1A1715] to-[#2E2824] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#FF4D2D] text-white text-[10px] font-bold uppercase tracking-wider">
                    Palate Match Engine
                  </span>
                  {isSavedRecently && (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved & Active on Recommendations
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black">Your Food Identity</h2>
                <p className="text-xs text-[#C5BDB5] leading-relaxed">
                  CRAVE tailors your recommendations to your genuine taste. Choose your favorite cuisines, maximum price bracket, spice preference, and diet. The Recommendations page directly applies these settings to curate dishes with transparent &ldquo;Why This Dish?&rdquo; reasoning.
                </p>
              </div>
              <Sparkles className="absolute right-6 -bottom-6 w-36 h-36 text-white/5 pointer-events-none" />
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs space-y-8">
              {/* Cuisines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-[#FF4D2D]" />
                    Favorite Cuisines (Multi-Select)
                  </label>
                  <span className="text-[11px] text-[#766E65]">Matches active menu cuisines</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MENU_CUISINES.map((c) => {
                    const active = identity.cuisines.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCuisine(c)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? "bg-[#FF4D2D] text-white shadow-xs"
                            : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF] hover:border-[#1A1715]"
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Bracket */}
              <div className="space-y-3 pt-6 border-t border-[#F3EFEA]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#FF4D2D]" />
                    Preferred Dish Budget Cap
                  </label>
                  <span className="text-[11px] text-[#766E65]">Applies to /recommendations default view</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGET_BRACKETS.map((b) => (
                    <button
                      key={b.label}
                      onClick={() => handleUpdateIdentity({ maxDishPrice: b.maxDishPrice })}
                      className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                        identity.maxDishPrice === b.maxDishPrice
                          ? "border-[#FF4D2D] bg-[#FFF8F6] ring-2 ring-[#FF4D2D]/20"
                          : "border-[#EBE5DF] bg-[#FAF8F5] hover:border-[#766E65]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#1A1715]">{b.label}</span>
                        {identity.maxDishPrice === b.maxDishPrice && (
                          <CheckCircle2 className="w-4 h-4 text-[#FF4D2D]" />
                        )}
                      </div>
                      <span className="text-base font-black text-[#FF4D2D] block">{b.range}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Tolerance */}
              <div className="space-y-3 pt-6 border-t border-[#F3EFEA]">
                <label className="text-xs font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF4D2D]" />
                  Spice Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SPICE_LEVELS.map((s) => (
                    <button
                      key={s.level}
                      onClick={() => handleUpdateIdentity({ spiceTolerance: s.level })}
                      className={`p-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                        identity.spiceTolerance === s.level
                          ? "border-[#1A1715] bg-[#1A1715] text-white shadow-xs"
                          : "border-[#EBE5DF] bg-[#FAF8F5] text-[#766E65] hover:border-[#1A1715]"
                      }`}
                    >
                      {s.label} ({s.level === 1 ? "Mild" : s.level === 2 ? "Medium" : "Hot"})
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary */}
              <div className="space-y-3 pt-6 border-t border-[#F3EFEA]">
                <label className="text-xs font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Dietary Lifestyle
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIET_OPTIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleUpdateIdentity({ diet: d.id })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        identity.diet === d.id
                          ? "bg-[#1A1715] text-white shadow-xs"
                          : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF] hover:border-[#1A1715]"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#766E65] border-t border-[#F3EFEA]">
                <span>Last updated: {new Date(identity.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                <Link
                  href="/recommendations"
                  className="font-bold text-[#FF4D2D] hover:underline flex items-center gap-1"
                >
                  View live recommendations for this profile →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Saved Bites */}
        {activeTab === "collections" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-[#1A1715]">Your Saved Bites</h3>
                <p className="text-xs text-[#766E65]">
                  Dishes bookmarked for fast reordering or 3D inspection.
                </p>
              </div>
              <Link
                href="/explore"
                className="text-xs font-bold text-[#FF4D2D] hover:underline"
              >
                Browse More Dishes →
              </Link>
            </div>

            {savedMenuItems.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE5DF] space-y-3">
                <Bookmark className="w-12 h-12 text-[#9E948C] mx-auto" />
                <h4 className="font-bold text-sm text-[#1A1715]">No saved bites yet</h4>
                <p className="text-xs text-[#766E65]">
                  Bookmark dishes as you explore to quickly order or inspect in 3D anytime.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#FAF8F5]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeSavedDish(item.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#DC2626] hover:bg-white transition-all cursor-pointer"
                          aria-label="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D2D]">
                            {item.category}
                          </span>
                          <span className="text-sm font-black text-[#1A1715]">₹{item.price}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#1A1715] mt-0.5">{item.name}</h4>
                        <p className="text-xs text-[#766E65] line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#F3EFEA]">
                      <button
                        onClick={() => {
                          addItem(item);
                          setCartDrawerOpen(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-[#1A1715] hover:bg-[#2A2420] text-white font-bold text-xs transition-colors cursor-pointer text-center"
                      >
                        Add to Cart
                      </button>
                      <Link
                        href={`/studio?dish=${item.id}`}
                        className="p-2.5 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] transition-colors"
                        title="Inspect in 3D Studio"
                      >
                        <Box className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Saved Addresses */}
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
                        className="text-[#9E948C] hover:text-[#DC2626] p-1 cursor-pointer"
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

        {/* TAB 5: Preferences & Privacy */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-black text-[#1A1715]">Delivery Alert Preferences</h3>
                <p className="text-xs text-[#766E65]">
                  Control how couriers communicate with you during order fulfillment.
                </p>
              </div>

              <div className="space-y-4 max-w-lg text-xs">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1A1715] block">WhatsApp Status Updates</span>
                    <span className="text-[#766E65]">Live dispatch milestones sent directly to WhatsApp</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    className="w-4 h-4 accent-[#FF4D2D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1A1715] block">Low-Noise Arrival Mode</span>
                    <span className="text-[#766E65]">Prefers silent notification over calling during evening orders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyLowNoise}
                    onChange={(e) => setNotifyLowNoise(e.target.checked)}
                    className="w-4 h-4 accent-[#FF4D2D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1A1715] block">Chef&apos;s Weekly Specials</span>
                    <span className="text-[#766E65]">Curated discounts based on your Food Identity</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifySpecials}
                    onChange={(e) => setNotifySpecials(e.target.checked)}
                    className="w-4 h-4 accent-[#FF4D2D] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
              <h3 className="text-base font-black text-[#1A1715]">Account Privacy & Credentials</h3>
              <p className="text-xs text-[#766E65] leading-relaxed">
                CRAVE authenticates each order using secure session cookies. Your Food Identity and address preferences remain stored on your device and are never shared with advertising trackers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
