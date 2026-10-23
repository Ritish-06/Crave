"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  CheckCircle2,
  X,
  Layers,
  Heart,
  Plus,
  Scale,
  Sparkles,
  ArrowRight,
  Filter
} from "lucide-react";
import { RESTAURANTS_DATA } from "@/data/restaurantsData";
import { MENU_ITEMS } from "@/data/menuData";
import { Restaurant, MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

export default function RestaurantsPage() {
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Restaurant[]>([]);
  const [activeRestaurantDetail, setActiveRestaurantDetail] = useState<Restaurant | null>(null);

  // All cuisines from restaurants
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    RESTAURANTS_DATA.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  // Filtered restaurants
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS_DATA.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine.some((c) => c.toLowerCase().includes(q));
        const matchesCity = r.city.toLowerCase().includes(q);
        if (!matchesName && !matchesCuisine && !matchesCity) return false;
      }
      if (selectedCuisine !== "all" && !r.cuisine.includes(selectedCuisine)) {
        return false;
      }
      if (minRating > 0 && r.rating < minRating) {
        return false;
      }
      if (deliveryOnly && r.deliveryFee > 0) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCuisine, minRating, deliveryOnly]);

  // Toggle restaurant comparison
  const toggleCompare = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some((r) => r.id === restaurant.id)) {
      setCompareList(compareList.filter((r) => r.id !== restaurant.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 restaurants at a time.");
        return;
      }
      setCompareList([...compareList, restaurant]);
    }
  };

  // Get menu for selected restaurant detail
  const restaurantMenu = useMemo(() => {
    if (!activeRestaurantDetail) return [];
    return MENU_ITEMS.filter((m) => m.restaurantId === activeRestaurantDetail.id);
  }, [activeRestaurantDetail]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Restaurant Detail Modal */}
      {activeRestaurantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveRestaurantDetail(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner */}
            <div className="relative h-60 w-full shrink-0">
              <Image
                src={activeRestaurantDetail.coverImage}
                alt={activeRestaurantDetail.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D2D] bg-[#140E0A]/80 px-2.5 py-1 rounded-md">
                  {activeRestaurantDetail.city} • {activeRestaurantDetail.address}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {activeRestaurantDetail.name}
                </h2>
                <p className="text-xs text-[#E5DDD4] mt-0.5">{activeRestaurantDetail.tagline}</p>
              </div>
            </div>

            {/* Menu List Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBE5DF] pb-3">
                <h3 className="text-sm font-bold text-[#1A1715] uppercase tracking-wider">
                  Menu Items ({restaurantMenu.length})
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#766E65]">
                  <span className="flex items-center gap-1 text-[#FF4D2D] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#FF4D2D]" />
                    {activeRestaurantDetail.rating} ({activeRestaurantDetail.ratingCount})
                  </span>
                  <span>•</span>
                  <span>Delivery in ~{activeRestaurantDetail.prepTimeMinutes} mins</span>
                </div>
              </div>

              <div className="space-y-3">
                {restaurantMenu.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                            dish.dietary === "veg" ? "border-[#16A34A]" : "border-[#DC2626]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              dish.dietary === "veg" ? "bg-[#16A34A]" : "bg-[#DC2626]"
                            }`}
                          />
                        </span>
                        <h4 className="font-bold text-sm text-[#1A1715] truncate">{dish.name}</h4>
                      </div>
                      <p className="text-xs text-[#766E65] mt-1 line-clamp-1">{dish.description}</p>
                      <div className="flex items-center gap-3 text-xs text-[#1A1715] font-black mt-2">
                        <span>₹{dish.price}</span>
                        {dish.studioEnabled && (
                          <span className="text-[10px] font-bold text-[#FF4D2D] bg-[#FFF1EE] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            3D Customizer
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {dish.studioEnabled ? (
                        <Link
                          href="/studio"
                          className="px-3 py-2 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black"
                        >
                          3D
                        </Link>
                      ) : null}
                      <button
                        onClick={() => addItem(dish)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF4D2D] text-white text-xs font-bold hover:bg-[#E03A1A] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-[#140E0A] text-white py-12 border-b border-[#2A1F18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
            Curated Artisanal Kitchens
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
            CRAVE Restaurant Partners
          </h1>
          <p className="text-xs sm:text-sm text-[#A3988E] max-w-2xl leading-relaxed">
            Every restaurant on CRAVE passes strict food safety inspections, sources premium organic ingredients, and prepares recipes with genuine culinary craft.
          </p>
        </div>
      </div>

      {/* Sticky Comparison Bar if selected */}
      {compareList.length > 0 && (
        <div className="bg-[#1C1511] border-b border-[#2A1F18] sticky top-20 z-30 px-4 py-3 text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-[#FF4D2D]" />
              <span className="text-xs font-bold">
                Comparing {compareList.length} of 3 Kitchens:
              </span>
              <div className="flex items-center gap-2">
                {compareList.map((r) => (
                  <span
                    key={r.id}
                    className="text-xs bg-[#2A1D16] px-2.5 py-1 rounded-lg border border-[#FF4D2D]/30 flex items-center gap-1"
                  >
                    <span>{r.name}</span>
                    <button onClick={(e) => toggleCompare(r, e)}>
                      <X className="w-3 h-3 text-[#A3988E] hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCompareList([])}
              className="text-xs text-[#A3988E] hover:text-white"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}

      {/* Comparison Drawer / Side-by-Side Modal */}
      {compareList.length >= 2 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE5DF] pb-3">
              <div className="flex items-center gap-2 text-[#1A1715] font-black">
                <Scale className="w-5 h-5 text-[#FF4D2D]" />
                <h3>Side-by-Side Kitchen Comparison</h3>
              </div>
              <span className="text-xs text-[#766E65]">Comparing verified metrics</span>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${compareList.length} gap-4`}>
              {compareList.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
                  <h4 className="font-black text-sm text-[#1A1715]">{r.name}</h4>
                  <p className="text-xs text-[#766E65]">{r.city} • {r.cuisine.join(", ")}</p>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-[#EBE5DF]">
                    <div className="flex justify-between">
                      <span className="text-[#766E65]">Rating:</span>
                      <span className="font-bold text-[#FF4D2D]">★ {r.rating} ({r.ratingCount})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#766E65]">Cost for Two:</span>
                      <span className="font-bold text-[#1A1715]">₹{r.priceForTwo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#766E65]">Delivery Fee:</span>
                      <span className="font-bold text-[#16A34A]">
                        {r.deliveryFee === 0 ? "FREE" : `₹${r.deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#766E65]">Prep Time:</span>
                      <span className="font-bold text-[#1A1715]">{r.prepTimeMinutes} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#766E65]">Hygiene & Safety:</span>
                      <span className="font-bold text-[#16A34A]">{r.safetyRating} / 5.0</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveRestaurantDetail(r)}
                    className="w-full py-2.5 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    View Full Menu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE5DF] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E948C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant by name, cuisine, or city (e.g. Mumbai, Napoli, Biryani)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs sm:text-sm text-[#1A1715] font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="flex-1 sm:flex-initial px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value="all">All Cuisines</option>
                {allCuisines.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="flex-1 sm:flex-initial px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value={0}>Any Rating</option>
                <option value={4.8}>Top Rated (4.8+)</option>
                <option value={4.7}>4.7+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((rst) => {
            const isComparing = compareList.some((r) => r.id === rst.id);
            return (
              <div
                key={rst.id}
                onClick={() => setActiveRestaurantDetail(rst)}
                className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-48 w-full bg-[#1C1511] overflow-hidden">
                    <Image
                      src={rst.coverImage}
                      alt={rst.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Compare Checkbox */}
                    <button
                      onClick={(e) => toggleCompare(rst, e)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isComparing
                          ? "bg-[#FF4D2D] text-white"
                          : "bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs"
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isComparing ? "Comparing" : "Compare"}</span>
                    </button>

                    {/* Offers Tag */}
                    {rst.offers[0] && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#FF4D2D] text-white text-[10px] font-bold">
                        {rst.offers[0]}
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-[#1A1715] group-hover:text-[#FF4D2D] transition-colors">
                        {rst.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-[#FFF5F2] px-2 py-0.5 rounded-md text-xs font-bold text-[#FF4D2D] shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#FF4D2D]" />
                        <span>{rst.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#766E65] line-clamp-1">{rst.cuisine.join(" • ")}</p>
                    <p className="text-[11px] text-[#9E948C]">{rst.address}, {rst.city}</p>

                    <div className="flex items-center gap-3 text-xs text-[#766E65] pt-2 border-t border-[#F3EFEA]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        {rst.prepTimeMinutes} mins
                      </span>
                      <span>•</span>
                      <span>₹{rst.priceForTwo} for two</span>
                      <span>•</span>
                      <span className="text-[#16A34A] font-semibold">
                        {rst.deliveryFee === 0 ? "Free Delivery" : `₹${rst.deliveryFee} Fee`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <div className="w-full py-2.5 rounded-2xl bg-[#FAF8F5] group-hover:bg-[#FF4D2D] group-hover:text-white text-[#1A1715] font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5">
                    <span>View Menu & Dishes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
