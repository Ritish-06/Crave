"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Check,
  Star,
  Clock,
  Flame,
  Leaf,
  Layers,
  ArrowRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  ShoppingBag,
  Zap,
  CheckCircle2
} from "lucide-react";
import { MENU_ITEMS, ALL_MENU_ITEMS } from "@/data/menuData";
import { MenuItem, DietaryType } from "@/types";
import { useCart } from "@/context/CartContext";

export default function RecommendationsPage() {
  const { addItem, setCartDrawerOpen } = useCart();

  // Active filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | "all">("all");
  const [maxBudget, setMaxBudget] = useState<number>(600);
  const [activePreset, setActivePreset] = useState<string>("personalized");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "liked" | "disliked">>({});
  const [dismissedDishIds, setDismissedDishIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [timeOfDayGreeting, setTimeOfDayGreeting] = useState<string>("Evening Palate Discovery");

  // Determine time-of-day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDayGreeting("Morning & Brunch Palate Selection");
    else if (hour >= 12 && hour < 17) setTimeOfDayGreeting("Artisanal Lunch Recommendations");
    else if (hour >= 17 && hour < 22) setTimeOfDayGreeting("Evening Gourmet Discovery");
    else setTimeOfDayGreeting("Late Night Midnight Cravings");
  }, []);

  // Filter presets
  const presets = [
    { id: "personalized", label: "Personalized Picks", icon: Sparkles },
    { id: "under-300", label: "Under ₹300 Budget", icon: Zap },
    { id: "pure-veg", label: "Pure Veg Feasts", icon: Leaf },
    { id: "chef-special", label: "Chef's Signature", icon: Star },
    { id: "studio-3d", label: "3D Studio Customizable", icon: Layers }
  ];

  const categories = ["All", "Burgers", "Pizza", "Asian & Bao", "Healthy Bowls", "Desserts & Patisserie"];

  // Handle Preset Switching
  const applyPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId === "under-300") {
      setMaxBudget(300);
      setDietaryFilter("all");
    } else if (presetId === "pure-veg") {
      setDietaryFilter("veg");
      setMaxBudget(600);
    } else if (presetId === "studio-3d") {
      setSelectedCategory("Burgers");
      setMaxBudget(600);
    } else {
      setMaxBudget(600);
      setDietaryFilter("all");
      setSelectedCategory("All");
    }
  };

  // Provide transparent "Why This Dish?" reasoning based on real properties
  const getDishReasons = (item: MenuItem): string[] => {
    const reasons: string[] = [];

    if (item.studioEnabled) {
      reasons.push("Interactive 3D Studio: Customize bun, patty, cheese & sauce layers");
    } else if (item.isChefSpecial) {
      reasons.push("Executive Chef Special: Artisanal small-batch daily preparation");
    }

    if (item.price <= 250) {
      reasons.push(`Budget Friendly: Exceptional gourmet bite under ₹250 (₹${item.price})`);
    } else if (item.price <= maxBudget) {
      reasons.push(`Fits within your active ₹${maxBudget} budget limit`);
    }

    if (item.rating >= 4.8) {
      reasons.push(`Exceptional ${item.rating}★ rating from ${item.reviewCount}+ verified diners`);
    }

    if (item.dietary === "veg" || item.dietary === "vegan") {
      reasons.push("100% Green Certified Vegetarian & Plant-Forward ingredients");
    }

    if (item.prepTimeMinutes <= 15) {
      reasons.push(`Rapid Prep: Kitchen dispatch ready in under ${item.prepTimeMinutes} minutes`);
    }

    if (reasons.length < 2) {
      reasons.push(`Popular in ${item.cuisine} category across Bandra West`);
    }

    return reasons.slice(0, 3);
  };

  // Feedback handling
  const handleFeedback = (dishId: string, type: "liked" | "disliked") => {
    setFeedbackMap((prev) => ({ ...prev, [dishId]: type }));
    if (type === "disliked") {
      setDismissedDishIds((prev) => [...prev, dishId]);
      setToastMessage("Dish removed. Calibrating recommendations against this flavor profile.");
    } else {
      setToastMessage("Preferences updated! We will surface more dishes with matching ingredients.");
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter and rank dishes
  const filteredDishes = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      if (dismissedDishIds.includes(item.id)) return false;
      if (selectedCategory !== "All" && item.category !== selectedCategory && item.cuisine !== selectedCategory) {
        return false;
      }
      if (dietaryFilter !== "all" && item.dietary !== dietaryFilter) {
        return false;
      }
      if (item.price > maxBudget) {
        return false;
      }
      if (activePreset === "studio-3d" && !item.studioEnabled) {
        return false;
      }
      if (activePreset === "chef-special" && !item.isChefSpecial) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      // Prioritize liked items or higher rating
      const aLiked = feedbackMap[a.id] === "liked" ? 1 : 0;
      const bLiked = feedbackMap[b.id] === "liked" ? 1 : 0;
      if (bLiked !== aLiked) return bLiked - aLiked;
      return b.rating - a.rating;
    });
  }, [selectedCategory, dietaryFilter, maxBudget, activePreset, dismissedDishIds, feedbackMap]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-28 text-[#1A1715] font-sans">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#140E0A] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#FF4D2D]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-[#FF4D2D]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF4D2D]">
                CRAVE Match & Palate Intelligence
              </span>
              <span className="text-xs text-[#9E948C]">• {timeOfDayGreeting}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1A1715]">
              Personalized Recommendations
            </h1>
            <p className="text-xs text-[#766E65] max-w-2xl leading-relaxed">
              Transparent, data-backed suggestions tailored to your flavor profile, dietary constraints, and budget limits — zero sponsored placements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-sommelier"
              className="px-4 py-2.5 rounded-2xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] text-xs font-bold transition-all border border-[#FFD9D1] flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Sommelier</span>
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2.5 rounded-2xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Layers className="w-4 h-4 text-[#FF4D2D]" />
              <span>3D Dish Studio</span>
            </Link>
          </div>
        </div>

        {/* Preset Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/25"
                    : "bg-white text-[#766E65] border border-[#EBE5DF] hover:border-[#1A1715] hover:text-[#1A1715]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF4D2D]"}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Filter Matrix Controls */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category / Cuisine Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#9E948C] uppercase tracking-wider mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#1A1715] text-white"
                      : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dietary Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9E948C] uppercase tracking-wider mr-1">
                Dietary:
              </span>
              {[
                { id: "all", label: "All" },
                { id: "veg", label: "Pure Veg" },
                { id: "non-veg", label: "Non-Veg" }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDietaryFilter(d.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    dietaryFilter === d.id
                      ? "bg-[#16A34A] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#766E65] border border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Budget Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#9E948C] uppercase tracking-wider">
                Max Budget:
              </span>
              <span className="text-xs font-black text-[#FF4D2D] font-mono">
                ₹{maxBudget}
              </span>
              <input
                type="range"
                min="180"
                max="800"
                step="20"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-28 sm:w-36 accent-[#FF4D2D] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Recommendations Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A1715]">
              Recommended Culinary Dishes ({filteredDishes.length})
            </h2>
            <span className="text-xs text-[#766E65]">
              Sorted by Match Score & Verified Critic Ratings
            </span>
          </div>

          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => {
                const reasons = getDishReasons(dish);
                const feedback = feedbackMap[dish.id];

                return (
                  <div
                    key={dish.id}
                    className="rounded-3xl bg-white border border-[#EBE5DF] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Dish Image Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#FAF8F5]">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-white shadow-xs ${
                              dish.dietary === "veg"
                                ? "bg-emerald-600"
                                : dish.dietary === "vegan"
                                ? "bg-green-700"
                                : "bg-red-600"
                            }`}
                          >
                            {dish.dietary}
                          </span>

                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{dish.rating}</span>
                            <span className="text-[10px] text-white/70">({dish.reviewCount})</span>
                          </div>
                        </div>

                        {/* Bottom Image Overlay Meta */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs font-bold drop-shadow-md">
                            {dish.restaurantName}
                          </span>
                          <span className="text-xs font-mono font-black drop-shadow-md flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#FF4D2D]" />
                            {dish.prepTimeMinutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Dish Content Body */}
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-[#1A1715] leading-snug group-hover:text-[#FF4D2D] transition-colors">
                              {dish.name}
                            </h3>
                            <span className="text-base font-black text-[#1A1715] shrink-0 font-mono">
                              ₹{dish.price}
                            </span>
                          </div>
                          <p className="text-xs text-[#766E65] line-clamp-2 mt-1 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>

                        {/* SIGNATURE "Why This Dish?" Callout Box */}
                        <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#FF4D2D]/20 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#FF4D2D]">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-wider">
                              Why This Dish for You:
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {reasons.map((r, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-[#554C43] flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-[#FF4D2D] font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions & Feedback Loop */}
                    <div className="p-5 pt-0 space-y-3">
                      {/* Feedback Loop Action: More like this / Not for me */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F3EFEA] text-[11px]">
                        <span className="text-[#9E948C]">Calibrate match:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(dish.id, "liked")}
                            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              feedback === "liked"
                                ? "bg-emerald-100 text-emerald-800"
                                : "text-[#766E65] hover:text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title="Recommend more dishes like this"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>More like this</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(dish.id, "disliked")}
                            className="px-2.5 py-1 rounded-lg font-bold text-[#766E65] hover:text-red-700 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Dismiss this dish and refine"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Not for me</span>
                          </button>
                        </div>
                      </div>

                      {/* Primary Order / Studio Buttons */}
                      <div className="flex items-center gap-2">
                        {dish.studioEnabled ? (
                          <Link
                            href="/studio"
                            className="flex-1 py-2.5 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#FFD9D1]"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Customize in 3D</span>
                          </Link>
                        ) : null}

                        <button
                          onClick={() => {
                            addItem(dish);
                            setCartDrawerOpen(true);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03B1D] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EBE5DF] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] mx-auto flex items-center justify-center">
                <Filter className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1715]">
                  No dishes match the selected criteria
                </h3>
                <p className="text-xs text-[#766E65] max-w-md mx-auto mt-1">
                  Try adjusting your budget slider or clearing the dietary constraints to discover more gourmet dishes.
                </p>
              </div>
              <button
                onClick={() => applyPreset("personalized")}
                className="px-5 py-2.5 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
