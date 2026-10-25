"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Filter,
  MapPin,
  Share2,
  Bookmark,
  Users,
  Grid,
  List,
  Map,
  Compass,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Flame,
  Award
} from "lucide-react";
import { RESTAURANTS_DATA } from "@/data/restaurantsData";
import { MENU_ITEMS } from "@/data/menuData";
import { Restaurant, MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { InteractiveRestaurantMap } from "@/components/restaurants/InteractiveRestaurantMap";
import { GroupDecisionModal } from "@/components/restaurants/GroupDecisionModal";
import { SmartMatchPanel } from "@/components/restaurants/SmartMatchPanel";
import { SurpriseMeModal } from "@/components/restaurants/SurpriseMeModal";
import { PersonalCollectionsModal } from "@/components/restaurants/PersonalCollectionsModal";

export default function RestaurantsPage() {
  const { addItem } = useCart();
  const { currentLocation, setLocationModalOpen } = useLocation();

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<"all" | "under800" | "under1000" | "premium">("all");
  const [deliveryToUserOnly, setDeliveryToUserOnly] = useState<boolean>(false);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "time" | "price_asc" | "price_desc" | "delivery_fee">("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  // Interaction States
  const [compareList, setCompareList] = useState<Restaurant[]>([]);
  const [activeRestaurantDetail, setActiveRestaurantDetail] = useState<Restaurant | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isSurpriseOpen, setSurpriseOpen] = useState(false);
  const [isSmartMatchOpen, setSmartMatchOpen] = useState(false);
  const [isGroupVoteOpen, setGroupVoteOpen] = useState(false);
  const [isCollectionsOpen, setCollectionsOpen] = useState(false);

  // Custom ordered restaurants from Smart Match
  const [customRankedList, setCustomRankedList] = useState<Restaurant[] | null>(null);

  // Load saved favorites from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("crave_restaurant_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle favorite
  const toggleFavorite = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(restaurant.id);
      const updated = isFav ? prev.filter((id) => id !== restaurant.id) : [...prev, restaurant.id];
      try {
        localStorage.setItem("crave_restaurant_favorites", JSON.stringify(updated));
      } catch {}
      triggerToast(isFav ? `Removed ${restaurant.name} from Favorites` : `Saved ${restaurant.name} to Favorites!`);
      return updated;
    });
  };

  // Share restaurant
  const handleShare = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/restaurants?id=${restaurant.id}`);
      triggerToast(`Link to ${restaurant.name} copied!`);
    }
  };

  // Toggle restaurant comparison
  const toggleCompare = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some((r) => r.id === restaurant.id)) {
      setCompareList(compareList.filter((r) => r.id !== restaurant.id));
      triggerToast(`Removed ${restaurant.name} from comparison`);
    } else {
      if (compareList.length >= 3) {
        triggerToast("You can compare up to 3 restaurants at a time.");
        return;
      }
      setCompareList([...compareList, restaurant]);
      triggerToast(`Added ${restaurant.name} to comparison!`);
    }
  };

  // All distinct cuisines
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    RESTAURANTS_DATA.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  // Filter & Sort Pipeline
  const filteredRestaurants = useMemo(() => {
    const sourceList = customRankedList || RESTAURANTS_DATA;

    return sourceList.filter((r) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine.some((c) => c.toLowerCase().includes(q));
        const matchesCity = r.city.toLowerCase().includes(q);
        const matchesAddress = r.address.toLowerCase().includes(q);
        if (!matchesName && !matchesCuisine && !matchesCity && !matchesAddress) return false;
      }

      // 2. Cuisine Filter
      if (selectedCuisine !== "all" && !r.cuisine.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())) {
        return false;
      }

      // 3. Rating Filter
      if (minRating > 0 && r.rating < minRating) {
        return false;
      }

      // 4. Free Delivery Only
      if (freeDeliveryOnly && r.deliveryFee > 0) {
        return false;
      }

      // 5. Price Range Filter
      if (priceRange === "under800" && r.priceForTwo > 800) return false;
      if (priceRange === "under1000" && r.priceForTwo > 1000) return false;
      if (priceRange === "premium" && r.priceForTwo <= 1000) return false;

      // 6. Delivery to User Location
      if (deliveryToUserOnly && currentLocation.pincode) {
        if (!r.pincodesServed.includes(currentLocation.pincode)) {
          return false;
        }
      }

      // 7. Open Now Only
      if (openNowOnly && !r.isOpen) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // If custom ranked, preserve rank order
      if (customRankedList) return 0;

      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "time") return a.prepTimeMinutes - b.prepTimeMinutes;
      if (sortBy === "price_asc") return a.priceForTwo - b.priceForTwo;
      if (sortBy === "price_desc") return b.priceForTwo - a.priceForTwo;
      if (sortBy === "delivery_fee") return a.deliveryFee - b.deliveryFee;
      return 0; // recommended
    });
  }, [
    searchQuery,
    selectedCuisine,
    minRating,
    freeDeliveryOnly,
    priceRange,
    deliveryToUserOnly,
    openNowOnly,
    sortBy,
    customRankedList,
    currentLocation.pincode,
  ]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCuisine !== "all" ||
    minRating > 0 ||
    freeDeliveryOnly ||
    priceRange !== "all" ||
    deliveryToUserOnly ||
    openNowOnly ||
    customRankedList !== null;

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("all");
    setMinRating(0);
    setFreeDeliveryOnly(false);
    setPriceRange("all");
    setDeliveryToUserOnly(false);
    setOpenNowOnly(false);
    setSortBy("recommended");
    setCustomRankedList(null);
  };

  // Get menu for selected restaurant modal
  const restaurantMenu = useMemo(() => {
    if (!activeRestaurantDetail) return [];
    return MENU_ITEMS.filter((m) => m.restaurantId === activeRestaurantDetail.id);
  }, [activeRestaurantDetail]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-[#1A1715] font-sans selection:bg-[#FF4D2D] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1715] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Unique Modals */}
      <SurpriseMeModal
        restaurants={filteredRestaurants.length > 0 ? filteredRestaurants : RESTAURANTS_DATA}
        isOpen={isSurpriseOpen}
        onClose={() => setSurpriseOpen(false)}
        onViewMenu={(r) => setActiveRestaurantDetail(r)}
      />

      <SmartMatchPanel
        restaurants={RESTAURANTS_DATA}
        isOpen={isSmartMatchOpen}
        onClose={() => setSmartMatchOpen(false)}
        onApplyMatches={(ranked) => {
          setCustomRankedList(ranked);
          triggerToast("Smart Match ranking applied to restaurant list!");
        }}
      />

      <GroupDecisionModal
        restaurants={RESTAURANTS_DATA}
        isOpen={isGroupVoteOpen}
        onClose={() => setGroupVoteOpen(false)}
      />

      <PersonalCollectionsModal
        restaurants={RESTAURANTS_DATA}
        isOpen={isCollectionsOpen}
        onClose={() => setCollectionsOpen(false)}
        onViewMenu={(r) => setActiveRestaurantDetail(r)}
      />

      {/* Restaurant Menu Modal */}
      {activeRestaurantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
            <button
              onClick={() => setActiveRestaurantDetail(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D2D] bg-[#140E0A]/90 px-2.5 py-1 rounded-md">
                  {activeRestaurantDetail.city} • {activeRestaurantDetail.address}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
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
                    className="p-4 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-between gap-4 hover:border-[#FF4D2D]/30 transition-all shadow-xs"
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
                      {dish.studioEnabled && (
                        <Link
                          href="/studio"
                          className="px-3 py-2 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors"
                        >
                          3D
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          addItem(dish);
                          triggerToast(`Added ${dish.name} to cart!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#FF4D2D] text-white text-xs font-bold hover:bg-[#E03A1A] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
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

      {/* COMPACT DISCOVERY HERO */}
      <div className="bg-[#140E0A] text-white py-12 border-b border-[#2A1F18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#1C1511] text-[#FF4D2D] text-[11px] font-bold uppercase tracking-wider border border-[#2A1F18]">
                  Curated Artisanal Kitchens
                </span>
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-[#A3988E] hover:text-white transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>Delivering to {currentLocation.locality || currentLocation.city}</span>
                </button>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight">
                CRAVE Partner Kitchens
              </h1>
              <p className="text-xs sm:text-sm text-[#A3988E] max-w-2xl leading-relaxed">
                Discover independent masters of woodfired pizzas, wagyu smashes, Awadhi dum biryani, and French patisserie. All verified for FSSAI safety and organic ingredients.
              </p>
            </div>

            {/* Unique Action Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setSurpriseOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>Surprise Me</span>
              </button>

              <button
                onClick={() => setSmartMatchOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Smart Match</span>
              </button>

              <button
                onClick={() => setGroupVoteOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Group Vote</span>
              </button>

              <button
                onClick={() => setCollectionsOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Collections</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY COMPARISON BAR IF RESTAURANTS SELECTED */}
      {compareList.length > 0 && (
        <div className="bg-[#1C1511] border-b border-[#2A1F18] sticky top-20 z-30 px-4 py-3 text-white shadow-xl animate-in slide-in-from-top-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-[#FF4D2D]" />
              <span className="text-xs font-bold">
                Comparing {compareList.length} of 3 Kitchens:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {compareList.map((r) => (
                  <span
                    key={r.id}
                    className="text-xs bg-[#2A1D16] px-2.5 py-1 rounded-lg border border-[#FF4D2D]/30 flex items-center gap-1"
                  >
                    <span>{r.name}</span>
                    <button
                      onClick={(e) => toggleCompare(r, e)}
                      className="cursor-pointer"
                      aria-label={`Remove ${r.name} from comparison`}
                    >
                      <X className="w-3 h-3 text-[#A3988E] hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCompareList([])}
              className="text-xs text-[#A3988E] hover:text-white cursor-pointer font-bold"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON MODAL / DRAWER */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareList.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-[#1A1715]">{r.name}</h4>
                    <button
                      onClick={(e) => toggleCompare(r, e)}
                      className="p-1 rounded-full text-[#9E948C] hover:text-red-500 cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
                      <span className="text-[#766E65]">Safety & Hygiene:</span>
                      <span className="font-bold text-[#16A34A]">{r.safetyRating} / 5.0</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveRestaurantDetail(r)}
                    className="w-full py-2.5 rounded-xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Full Menu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search, Filter Bar & View Mode Switcher */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE5DF] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input with Clear Button */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E948C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant by name, cuisine, or city (e.g. Mumbai, Napoli, Biryani)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs sm:text-sm text-[#1A1715] font-medium focus:outline-none focus:border-[#FF4D2D]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E948C] hover:text-[#1A1715] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Switcher & Sort Selector */}
            <div className="flex items-center gap-2">
              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="time">Fastest Prep Time</option>
                <option value="price_asc">Cost: Low to High</option>
                <option value="price_desc">Cost: High to Low</option>
                <option value="delivery_fee">Lowest Delivery Fee</option>
              </select>

              {/* View Switcher: Grid, List, Map */}
              <div className="flex items-center p-1 bg-[#FAF8F5] rounded-2xl border border-[#E5DDD4]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#FF4D2D] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-[#FF4D2D] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewMode === "map"
                      ? "bg-white text-[#FF4D2D] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                  title="Interactive Map View"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F3EFEA]">
            {/* Cuisine Shortcuts */}
            <button
              onClick={() => setSelectedCuisine("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCuisine === "all"
                  ? "bg-[#1A1715] text-white border-[#1A1715]"
                  : "bg-[#FAF8F5] text-[#766E65] border-[#EBE5DF] hover:bg-[#F3EFEA]"
              }`}
            >
              All Cuisines
            </button>

            {allCuisines.slice(0, 5).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c === selectedCuisine ? "all" : c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCuisine === c
                    ? "bg-[#1A1715] text-white border-[#1A1715]"
                    : "bg-[#FAF8F5] text-[#766E65] border-[#EBE5DF] hover:bg-[#F3EFEA]"
                }`}
              >
                {c}
              </button>
            ))}

            {/* Quick Ratings & Price Chips */}
            <button
              onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                minRating === 4.8
                  ? "bg-[#FF4D2D] text-white border-[#FF4D2D]"
                  : "bg-[#FAF8F5] text-[#766E65] border-[#EBE5DF] hover:bg-[#F3EFEA]"
              }`}
            >
              ★ 4.8+ Top Rated
            </button>

            <button
              onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                freeDeliveryOnly
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-[#FAF8F5] text-[#766E65] border-[#EBE5DF] hover:bg-[#F3EFEA]"
              }`}
            >
              Free Delivery
            </button>

            <button
              onClick={() => setDeliveryToUserOnly(!deliveryToUserOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                deliveryToUserOnly
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-[#FAF8F5] text-[#766E65] border-[#EBE5DF] hover:bg-[#F3EFEA]"
              }`}
            >
              Delivers to My PIN
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-1.5 text-xs text-[#FF4D2D] hover:underline font-bold flex items-center gap-1 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: INTERACTIVE MAP VIEW */}
        {viewMode === "map" && (
          <div className="space-y-4">
            <InteractiveRestaurantMap
              restaurants={filteredRestaurants}
              onSelectRestaurant={(r) => setActiveRestaurantDetail(r)}
              onViewMenu={(r) => setActiveRestaurantDetail(r)}
            />
          </div>
        )}

        {/* VIEW 2 & 3: GRID OR LIST VIEW */}
        {viewMode !== "map" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#766E65]">
              <span>
                Showing <strong>{filteredRestaurants.length}</strong> verified kitchens
                {customRankedList && " (Sorted by Smart Match Score)"}
              </span>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE5DF] max-w-md mx-auto space-y-3">
                <Compass className="w-12 h-12 text-[#9E948C] mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-[#1A1715]">No restaurants matched your filters</h3>
                <p className="text-xs text-[#766E65]">
                  Try clearing specific dietary, cuisine, or rating filters to discover more kitchens.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-3 px-5 py-2.5 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1A] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((rst) => {
                  const isComparing = compareList.some((r) => r.id === rst.id);
                  const isFav = favorites.includes(rst.id);
                  const deliversToUser = rst.pincodesServed.includes(currentLocation.pincode);

                  return (
                    <div
                      key={rst.id}
                      onClick={() => setActiveRestaurantDetail(rst)}
                      className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Cover Image Stage */}
                        <div className="relative h-48 w-full bg-[#1C1511] overflow-hidden">
                          <Image
                            src={rst.coverImage}
                            alt={rst.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                          {/* Top Action Pills */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              {rst.city}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Compare Toggle */}
                              <button
                                onClick={(e) => toggleCompare(rst, e)}
                                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                                  isComparing
                                    ? "bg-[#FF4D2D] text-white"
                                    : "bg-black/50 text-white hover:bg-black/70 backdrop-blur-md"
                                }`}
                              >
                                <Scale className="w-3 h-3" />
                                <span>{isComparing ? "Comparing" : "Compare"}</span>
                              </button>

                              {/* Favorite Toggle */}
                              <button
                                onClick={(e) => toggleFavorite(rst, e)}
                                className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all"
                                aria-label="Save to favorites"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${
                                    isFav ? "fill-[#FF4D2D] text-[#FF4D2D]" : ""
                                  }`}
                                />
                              </button>

                              {/* Share Button */}
                              <button
                                onClick={(e) => handleShare(rst, e)}
                                className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all"
                                aria-label="Share restaurant"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Delivery Eligibility Pill */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                            {deliversToUser ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Delivers to Your PIN</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#E5DDD4] text-[10px] font-medium">
                                Extended Hub Delivery
                              </span>
                            )}
                          </div>
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
                          <p className="text-[11px] text-[#9E948C]">{rst.address}</p>

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

                          {rst.offers[0] && (
                            <p className="text-[11px] text-[#FF4D2D] font-bold bg-[#FFF1EE] px-2 py-0.5 rounded-md truncate mt-1">
                              {rst.offers[0]}
                            </p>
                          )}
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
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredRestaurants.map((rst) => {
                  const isComparing = compareList.some((r) => r.id === rst.id);
                  const isFav = favorites.includes(rst.id);
                  const deliversToUser = rst.pincodesServed.includes(currentLocation.pincode);

                  return (
                    <div
                      key={rst.id}
                      onClick={() => setActiveRestaurantDetail(rst)}
                      className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-xl transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-[#1C1511] shrink-0">
                          <Image
                            src={rst.coverImage}
                            alt={rst.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-lg text-[#1A1715] group-hover:text-[#FF4D2D] transition-colors truncate">
                              {rst.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-[#FFF5F2] px-2 py-0.5 rounded-md text-xs font-bold text-[#FF4D2D] shrink-0">
                              <Star className="w-3 h-3 fill-[#FF4D2D]" />
                              <span>{rst.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-[#766E65] line-clamp-1">{rst.cuisine.join(" • ")}</p>
                          <p className="text-[11px] text-[#9E948C]">{rst.address}, {rst.city}</p>

                          <div className="flex items-center gap-3 text-xs text-[#766E65] pt-1">
                            <span className="flex items-center gap-1 text-[#FF4D2D]">
                              <Clock className="w-3.5 h-3.5" />
                              {rst.prepTimeMinutes} mins
                            </span>
                            <span>•</span>
                            <span>₹{rst.priceForTwo} for 2</span>
                            <span>•</span>
                            <span className="text-[#16A34A] font-bold">
                              {rst.deliveryFee === 0 ? "Free Delivery" : `₹${rst.deliveryFee} Fee`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleCompare(rst, e)}
                            className={`p-2 rounded-xl text-xs font-bold transition-all ${
                              isComparing ? "bg-[#FF4D2D] text-white" : "bg-[#FAF8F5] text-[#766E65] hover:bg-[#F3EFEA]"
                            }`}
                            title="Compare"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(rst, e)}
                            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#766E65] transition-all"
                            title="Favorite"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-[#FF4D2D] text-[#FF4D2D]" : ""}`} />
                          </button>
                        </div>

                        <button
                          onClick={() => setActiveRestaurantDetail(rst)}
                          className="px-4 py-2 rounded-xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1A] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Menu</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
