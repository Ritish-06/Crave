"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Heart,
  Eye,
  Plus,
  Sparkles,
  Flame,
  ArrowRight,
  X,
  Layers,
  Leaf,
  UtensilsCrossed,
  CheckCircle2
} from "lucide-react";
import { MENU_ITEMS, MOOD_CATEGORIES } from "@/data/menuData";
import { RESTAURANTS_DATA } from "@/data/restaurantsData";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { DishQuickViewModal } from "@/components/explore/DishQuickViewModal";

export default function ExplorePage() {
  const { addItem } = useCart();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg" | "vegan">("all");
  const [priceTier, setPriceTier] = useState<"all" | "under200" | "mid" | "premium">("all");
  const [sortBy, setSortBy] = useState<"rating" | "time" | "price_asc" | "price_desc">("rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewDish, setQuickViewDish] = useState<MenuItem | null>(null);
  const [surpriseDish, setSurpriseDish] = useState<MenuItem | null>(null);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Cuisines list
  const availableCuisines = useMemo(() => {
    const set = new Set<string>();
    MENU_ITEMS.forEach((m) => set.add(m.cuisine));
    return Array.from(set);
  }, []);

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesRestaurant = dish.restaurantName.toLowerCase().includes(q);
        const matchesCuisine = dish.cuisine.toLowerCase().includes(q);
        const matchesDescription = dish.description.toLowerCase().includes(q);
        if (!matchesName && !matchesRestaurant && !matchesCuisine && !matchesDescription) {
          return false;
        }
      }

      // Mood filtering
      if (selectedMood !== "all") {
        if (selectedMood === "comfort") {
          if (!dish.category.includes("Burgers") && !dish.category.includes("Pizza") && !dish.category.includes("Biryani")) return false;
        } else if (selectedMood === "spicy") {
          if ((dish.spiceLevel || 1) < 2 && !dish.name.toLowerCase().includes("ghost")) return false;
        } else if (selectedMood === "fresh") {
          if (dish.cuisine !== "Healthy & Bowls") return false;
        } else if (selectedMood === "cheesy") {
          if (!dish.name.toLowerCase().includes("cheddar") && !dish.name.toLowerCase().includes("formaggi") && !dish.name.toLowerCase().includes("cheese")) return false;
        } else if (selectedMood === "sweet") {
          if (dish.cuisine !== "Desserts & Patisserie") return false;
        } else if (selectedMood === "asian") {
          if (dish.cuisine !== "Pan-Asian") return false;
        } else if (selectedMood === "quick") {
          if (dish.prepTimeMinutes > 15) return false;
        }
      }

      // Cuisine filter
      if (selectedCuisine !== "all" && dish.cuisine !== selectedCuisine) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter === "veg") {
        if (dish.dietary !== "veg" && dish.dietary !== "vegan") return false;
      } else if (dietaryFilter === "vegan") {
        if (dish.dietary !== "vegan") return false;
      } else if (dietaryFilter === "non-veg") {
        if (dish.dietary !== "non-veg") return false;
      }

      // Price Tier filter
      if (priceTier === "under200" && dish.price > 200) return false;
      if (priceTier === "mid" && (dish.price < 200 || dish.price > 450)) return false;
      if (priceTier === "premium" && dish.price <= 450) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "time") return a.prepTimeMinutes - b.prepTimeMinutes;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedMood, selectedCuisine, dietaryFilter, priceTier, sortBy]);

  // Handle Surprise Me action
  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * MENU_ITEMS.length);
    setSurpriseDish(MENU_ITEMS[randomIndex]);
  };

  const hasActiveFilters =
    selectedMood !== "all" ||
    selectedCuisine !== "all" ||
    dietaryFilter !== "all" ||
    priceTier !== "all" ||
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedMood("all");
    setSelectedCuisine("all");
    setDietaryFilter("all");
    setPriceTier("all");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Quick View Modal */}
      <DishQuickViewModal
        dish={quickViewDish}
        onClose={() => setQuickViewDish(null)}
      />

      {/* Surprise Me Modal */}
      {surpriseDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 shadow-2xl border border-[#EBE5DF] text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF1EE] text-[#FF4D2D] mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
                Chef&apos;s Recommendation For You
              </span>
              <h3 className="text-xl font-black text-[#1A1715] mt-1">{surpriseDish.name}</h3>
              <p className="text-xs text-[#766E65] mt-1">{surpriseDish.tagline}</p>
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden border border-[#EBE5DF]">
              <Image src={surpriseDish.image} alt={surpriseDish.name} fill className="object-cover" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white font-bold text-xs">
                ₹{surpriseDish.price}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSurpriseDish(null)}
                className="flex-1 py-3 rounded-2xl border border-[#E5DDD4] font-semibold text-xs text-[#1A1715]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addItem(surpriseDish);
                  setSurpriseDish(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1A]"
              >
                Add to Cart • ₹{surpriseDish.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: CINEMATIC FOOD HERO */}
      <section className="relative overflow-hidden bg-[#140E0A] text-white pt-16 pb-20 sm:pb-28 border-b border-[#2A1F18]">
        {/* Subtle Warm Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF4D2D]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs text-[#E5DDD4]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                <span className="font-semibold text-white">Live in 6 Major Metros</span>
                <span className="text-[#A3988E]">| 28 States Mapped</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase font-sans">
                  YOUR CRAVINGS. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] via-[#FFA384] to-[#FF6B4E]">
                    YOUR RULES.
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-[#A3988E] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed pt-2">
                  Discover extraordinary food, customize every bite in interactive 3D, and experience India&apos;s finest kitchens delivered to your doorstep.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#food-grid"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-sm tracking-wide shadow-xl shadow-[#FF4D2D]/30 transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={handleSurpriseMe}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-[#FAF8F5] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
                  <span>Surprise Me</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Feature (3D Studio Teaser) */}
            <div className="lg:col-span-5 relative">
              <Link
                href="/studio"
                className="block group relative rounded-3xl overflow-hidden border border-[#2A1F18] bg-[#1C1511] shadow-2xl p-4 transition-all hover:border-[#FF4D2D]/60"
              >
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#140E0A]">
                  <Image
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                    alt="Signature Smash Wagyu 3D Studio"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* 3D Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FF4D2D] text-white text-xs font-black tracking-wider flex items-center gap-1.5 shadow-md">
                      <Layers className="w-3.5 h-3.5" />
                      3D DISH STUDIO
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <p className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
                      Interactive WebGL Customization
                    </p>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      The Crave Signature Truffle Smash
                    </h3>
                    <p className="text-xs text-[#A3988E] mt-1 flex items-center gap-1">
                      <span>Stack patties, melt cheeses, explode layers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF4D2D] group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 & 3: INSTANT SEARCH & MOOD-TO-MEAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        {/* Search Bar Input */}
        <div className="bg-white rounded-3xl p-3 shadow-xl border border-[#EBE5DF] flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, artisan kitchen, or cuisine (e.g. Wagyu Burger, Truffle Pizza, Awadhi Biryani)..."
            className="flex-1 bg-transparent text-[#1A1715] placeholder-[#9E948C] text-sm sm:text-base outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-2 text-[#9E948C] hover:text-[#1A1715]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mood-to-Meal Horizontal Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#766E65]">
              Mood-to-Meal Discovery
            </span>
            {selectedMood !== "all" && (
              <button
                onClick={() => setSelectedMood("all")}
                className="text-xs font-semibold text-[#FF4D2D] hover:underline"
              >
                Reset mood
              </button>
            )}
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {MOOD_CATEGORIES.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? "bg-[#1A1715] text-white border-[#1A1715] shadow-md scale-105"
                      : "bg-white text-[#665E57] border-[#EBE5DF] hover:border-[#D5CDC4] hover:text-[#1A1715]"
                  }`}
                >
                  <span>{mood.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: MULTI-FACET FILTER CONTROLS */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBE5DF] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#1A1715] font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#FF4D2D]" />
              <span>Filters & Dietary</span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#FF4D2D] hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Dietary Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Dietary Preference
              </label>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value="all">All Diets</option>
                <option value="veg">Pure Vegetarian</option>
                <option value="vegan">Vegan Only</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Cuisine
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value="all">All Cuisines</option>
                {availableCuisines.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Price Budget
              </label>
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value="all">Any Price</option>
                <option value="under200">Under ₹200 (Bites & Tarts)</option>
                <option value="mid">₹200 - ₹450</option>
                <option value="premium">₹450+ (Artisanal Platters)</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
              >
                <option value="rating">Highest Rated (4.8+)</option>
                <option value="time">Fastest Preparation</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PERSONALIZED COLLECTIONS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1715]">
              Curated Collections
            </h2>
            <p className="text-xs text-[#766E65] mt-0.5">
              Verified Michelin-grade recipes and award-winning kitchens
            </p>
          </div>
          <Link
            href="/restaurants"
            className="text-xs font-bold text-[#FF4D2D] hover:underline flex items-center gap-1"
          >
            <span>View All Kitchens</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Popular Near You",
              count: "6 Dishes",
              desc: "Trending favorites in your locality",
              action: () => resetAllFilters(),
              bg: "from-[#FF4D2D] to-[#E03A1A]"
            },
            {
              title: "Hidden Gems",
              count: "4 Kitchens",
              desc: "Independent culinary artisans",
              action: () => setSelectedCuisine("Pan-Asian"),
              bg: "from-[#1A1715] to-[#2D2622]"
            },
            {
              title: "Under ₹200",
              count: "Quick Bites",
              desc: "Artisanal croissants, tarts & fries",
              action: () => setPriceTier("under200"),
              bg: "from-[#15803D] to-[#166534]"
            },
            {
              title: "Interactive 3D",
              count: "Flagship",
              desc: "Wagyu burger customizable in 3D",
              href: "/studio",
              bg: "from-[#3B2014] to-[#140E0A]"
            }
          ].map((col, idx) => (
            col.href ? (
              <Link
                key={idx}
                href={col.href}
                className={`p-5 rounded-3xl bg-gradient-to-br ${col.bg} text-white shadow-md hover:scale-[1.02] transition-transform flex flex-col justify-between h-36`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                    {col.count}
                  </span>
                  <h3 className="text-base font-black mt-2">{col.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{col.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ) : (
              <div
                key={idx}
                onClick={col.action}
                className={`p-5 rounded-3xl bg-gradient-to-br ${col.bg} text-white shadow-md hover:scale-[1.02] transition-transform flex flex-col justify-between h-36 cursor-pointer`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                    {col.count}
                  </span>
                  <h3 className="text-base font-black mt-2">{col.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{col.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* SECTION 6 & 9: MAIN FOOD GRID */}
      <section id="food-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <div className="flex items-center justify-between border-b border-[#EBE5DF] pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#1A1715]">
              Dishes for You
            </h2>
            <p className="text-xs text-[#766E65] mt-0.5">
              Showing {filteredDishes.length} curated recipes matching your preferences
            </p>
          </div>

          <div className="text-xs text-[#766E65] font-semibold">
            {filteredDishes.length} Results
          </div>
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE5DF] max-w-md mx-auto space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-[#9E948C] mx-auto" />
            <h3 className="text-lg font-bold text-[#1A1715]">No dishes matched your filters</h3>
            <p className="text-xs text-[#766E65]">
              Try adjusting your dietary, cuisine, or price range options to discover more flavors.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-3 px-5 py-2.5 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => {
              const isFav = favorites.includes(dish.id);
              return (
                <div
                  key={dish.id}
                  className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#F3EFEA]">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {dish.dietary === "veg" ? (
                          <span className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center border border-[#16A34A]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                          </span>
                        ) : dish.dietary === "vegan" ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white text-[10px] font-bold">
                            VEGAN
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center border border-[#DC2626]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                          </span>
                        )}

                        {dish.studioEnabled && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FF4D2D] text-white text-[10px] font-bold flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            3D Studio
                          </span>
                        )}
                      </div>

                      {/* Favorite & Quick View Buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleFavorite(dish.id, e)}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1715] hover:text-[#FF4D2D] transition-colors"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-4 h-4 ${isFav ? "fill-[#FF4D2D] text-[#FF4D2D]" : ""}`}
                          />
                        </button>

                        <button
                          onClick={() => setQuickViewDish(dish)}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#1A1715] hover:text-[#FF4D2D] transition-colors"
                          aria-label="Quick view dish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="truncate max-w-[200px]">{dish.restaurantName}</span>
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dish Info Details */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-[#1A1715] group-hover:text-[#FF4D2D] transition-colors line-clamp-1">
                          {dish.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#766E65] line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#9E948C] pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dish.prepTimeMinutes} mins
                        </span>
                        <span>•</span>
                        <span>{dish.calories || 520} kcal</span>
                        {dish.spiceLevel && dish.spiceLevel > 1 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-[#DC2626]">
                              <Flame className="w-3 h-3" />
                              Spicy
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Add Action Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#F3EFEA] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#1A1715]">₹{dish.price}</span>
                        {dish.originalPrice && (
                          <span className="text-xs text-[#9E948C] line-through">
                            ₹{dish.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#766E65]">Freshly prepared</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {dish.studioEnabled ? (
                        <Link
                          href="/studio"
                          className="px-3 py-2 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#FF4D2D]" />
                          <span>3D</span>
                        </Link>
                      ) : null}

                      <button
                        onClick={() => addItem(dish)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 8: RESTAURANTS SHOWCASE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl bg-[#1C1511] text-white p-8 sm:p-12 border border-[#2A1F18] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
              Curated Kitchen Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-sans leading-tight">
              Explore India&apos;s Finest Artisanal Restaurants
            </h2>
            <p className="text-xs sm:text-sm text-[#A3988E] leading-relaxed">
              From 72-hour fermented Neapolitan pizza in Bengaluru to royal Awadhi dum biryani in Hyderabad and wagyu smash kitchens in Mumbai. Compare ratings, delivery fees, and safety audits.
            </p>
            <div className="pt-2">
              <Link
                href="/restaurants"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
              >
                <span>View All 6 Kitchens</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            {RESTAURANTS_DATA.slice(0, 4).map((rst) => (
              <div
                key={rst.id}
                className="p-3.5 rounded-2xl bg-[#140E0A] border border-[#2A1F18] text-xs space-y-1"
              >
                <p className="font-bold text-white truncate max-w-[140px]">{rst.name}</p>
                <p className="text-[11px] text-[#A3988E]">{rst.city}</p>
                <div className="flex items-center gap-1 text-[#FFD700] text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-[#FFD700]" />
                  <span>{rst.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
