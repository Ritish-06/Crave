"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  ArrowUp,
  X,
  Layers,
  Leaf,
  UtensilsCrossed,
  CheckCircle2,
  ChevronDown,
  Compass,
  Zap,
  Check,
  Scale
} from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData";
import { RESTAURANTS_DATA } from "@/data/restaurantsData";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { DishQuickViewModal } from "@/components/explore/DishQuickViewModal";
import { HorizontalFoodGallery } from "@/components/explore/HorizontalFoodGallery";
import { ScrollBurger3D } from "@/components/explore/ScrollBurger3D";
import { MoodToMeal, MoodId } from "@/components/explore/MoodToMeal";
import { FoodPassport } from "@/components/explore/FoodPassport";
import { SurpriseMeExploreModal } from "@/components/explore/SurpriseMeExploreModal";
import { DishComparisonModal } from "@/components/explore/DishComparisonModal";
import { FoodRadar } from "@/components/explore/FoodRadar";
import { FoodStories } from "@/components/explore/FoodStories";

export default function ExplorePage() {
  const { addItem, cartIconRef } = useCart();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodId>("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg" | "vegan">("all");
  const [priceTier, setPriceTier] = useState<"all" | "under200" | "mid" | "premium">("all");
  const [sortBy, setSortBy] = useState<"rating" | "time" | "price_asc" | "price_desc">("rating");

  // Interaction States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewDish, setQuickViewDish] = useState<MenuItem | null>(null);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved favorites from local storage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("crave_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch {}
  }, []);

  // Save favorites to local storage
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem("crave_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Scroll Progress & Back to Top Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(currentScroll > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cuisines list
  const availableCuisines = useMemo(() => {
    const set = new Set<string>();
    MENU_ITEMS.forEach((m) => set.add(m.cuisine));
    return Array.from(set);
  }, []);

  // Filtered Dishes with Transparent Rule-Based Logic
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Search matching (Dish, Restaurant, Cuisine, Description)
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

      // Mood filtering (7 distinct moods)
      if (selectedMood !== "all") {
        if (selectedMood === "comfort") {
          if (!dish.category.includes("Burgers") && !dish.category.includes("Pizza") && !dish.category.includes("Biryani")) return false;
        } else if (selectedMood === "spicy") {
          if ((dish.spiceLevel || 1) < 2 && !dish.name.toLowerCase().includes("ghost") && !dish.name.toLowerCase().includes("pepper")) return false;
        } else if (selectedMood === "fresh") {
          if (dish.cuisine !== "Healthy & Bowls" && !dish.category.includes("Salad")) return false;
        } else if (selectedMood === "sweet") {
          if (dish.cuisine !== "Desserts & Patisserie" && !dish.category.includes("Dessert")) return false;
        } else if (selectedMood === "midnight") {
          if (dish.price > 450 || dish.prepTimeMinutes > 20) return false;
        } else if (selectedMood === "treat") {
          if (!dish.isChefSpecial && !dish.studioEnabled && dish.price < 400) return false;
        } else if (selectedMood === "local") {
          if (dish.cuisine !== "Indian Gourmet" && !dish.name.toLowerCase().includes("biryani") && !dish.name.toLowerCase().includes("nizami")) return false;
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

  // Food-to-Cart Flight Animation with Toast
  const handleAddToCartWithFlight = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();

    const success = addItem(dish);
    if (!success) return;

    const btn = e.currentTarget as HTMLElement;
    const btnRect = btn.getBoundingClientRect();
    const cartIconEl = cartIconRef?.current;
    const cartRect = cartIconEl?.getBoundingClientRect();

    const startX = btnRect.left + btnRect.width / 2 - 25;
    const startY = btnRect.top + btnRect.height / 2 - 25;

    const endX = cartRect ? cartRect.left + cartRect.width / 2 - 15 : window.innerWidth - 60;
    const endY = cartRect ? cartRect.top + cartRect.height / 2 - 15 : 30;

    const projectile = document.createElement("div");
    projectile.className = "flying-projectile";
    projectile.style.left = `${startX}px`;
    projectile.style.top = `${startY}px`;
    projectile.style.width = "50px";
    projectile.style.height = "50px";
    projectile.style.backgroundImage = `url('${dish.image}')`;
    projectile.style.backgroundSize = "cover";
    projectile.style.backgroundPosition = "center";
    projectile.style.border = "2.5px solid #FF4D2D";
    projectile.style.borderRadius = "9999px";
    document.body.appendChild(projectile);

    // Trigger reflow
    projectile.getBoundingClientRect();

    projectile.style.left = `${endX}px`;
    projectile.style.top = `${endY}px`;
    projectile.style.transform = "scale(0.25) rotate(360deg)";
    projectile.style.opacity = "0.7";

    setTimeout(() => {
      if (projectile.parentNode) {
        projectile.parentNode.removeChild(projectile);
      }

      if (cartIconEl) {
        cartIconEl.classList.remove("animate-cart-bounce");
        void cartIconEl.offsetWidth;
        cartIconEl.classList.add("animate-cart-bounce");
      }

      setToastMessage(`Added "${dish.name}" to your cart!`);
      setTimeout(() => setToastMessage(null), 2500);
    }, 750);
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
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-[#1A1715] font-sans selection:bg-[#FF4D2D] selection:text-white relative">
      {/* 1. Page Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#FF4D2D] to-[#FFA384] z-[100] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* 2. Floating Add-to-Cart Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1715] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 3. Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#1A1715] hover:bg-[#FF4D2D] text-white shadow-xl border border-white/10 transition-all duration-300 hover:scale-110 cursor-pointer group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 4. Quick View Modal */}
      <DishQuickViewModal
        dish={quickViewDish}
        onClose={() => setQuickViewDish(null)}
      />

      {/* 5. Surprise Me Interactive Modal */}
      <SurpriseMeExploreModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        onAddToCart={handleAddToCartWithFlight}
        onQuickView={(dish) => setQuickViewDish(dish)}
      />

      {/* 6. Cross-Kitchen Dish Comparison Modal */}
      <DishComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        onAddToCart={handleAddToCartWithFlight}
      />

      {/* SECTION 1: EDITORIAL CINEMATIC HERO */}
      <section className="relative overflow-hidden bg-[#140E0A] text-white pt-14 pb-16 sm:pb-20 border-b border-[#2A1F18]">
        {/* Warm Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#FF4D2D]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline, Subtitle, Search & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs text-[#E5DDD4]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                <span className="font-semibold text-white">Live Discovery Engine</span>
                <span className="text-[#A3988E]">| 6 Metro Hubs Mapped</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white font-sans">
                  Your Next Craving <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] via-[#FFA384] to-[#FF6B4E]">
                    Starts Here.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#A3988E] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Discover dishes, explore hidden culinary gems, and find your next favourite from verified Michelin-grade kitchens across India.
                </p>
              </div>

              {/* Instant Search Bar within Hero */}
              <div className="bg-[#1C1511] rounded-2xl p-2.5 border border-[#2A1F18] shadow-xl flex items-center gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="p-2.5 rounded-xl bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes, artisanal kitchens, or cuisines..."
                  className="flex-1 bg-transparent text-white placeholder-[#766E65] text-xs sm:text-sm outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-[#9E948C] hover:text-white cursor-pointer"
                    aria-label="Clear query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#food-grid"
                  className="px-6 py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-xs tracking-wide shadow-lg shadow-[#FF4D2D]/30 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Today’s Picks</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => setIsSurpriseModalOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-[#FAF8F5] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D] group-hover:rotate-12 transition-transform" />
                  <span>🎲 Surprise My Cravings</span>
                </button>

                <button
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-[#A3988E] hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Compare Dishes</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Feature (Layered Food Photography with Badges) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#2A1F18] bg-[#1C1511] shadow-2xl p-4">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#140E0A] group">
                  <Image
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                    alt="Featured Truffle Wagyu Creation"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#FF4D2D] text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      TRENDING #1
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFD700] text-[10px] font-bold border border-white/10 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#FFD700]" />
                      4.9 (420+ reviews)
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FF4D2D]" />
                    20 mins
                  </div>

                  {/* Bottom Dish Card Summary */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] font-bold text-[#FF4D2D] uppercase tracking-wider block">
                      The Truffle & Brioche Co. • Bandra West, Mumbai
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      The Crave Signature Truffle Smash
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-sm font-black text-white">₹389</span>
                      <Link
                        href="/studio"
                        className="text-[11px] font-bold text-[#FFA384] hover:text-white flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-[#FF4D2D]" />
                        <span>Customize in 3D Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MULTI-FACET FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBE5DF] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#1A1715] font-bold text-xs sm:text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#FF4D2D]" />
              <span>Filter by Dietary, Cuisine & Budget</span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Dietary Filter */}
            <div>
              <label className="block text-[10px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Dietary Preference
              </label>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value as "all" | "veg" | "non-veg" | "vegan")}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
              >
                <option value="all">All Diets</option>
                <option value="veg">Pure Vegetarian 🟢</option>
                <option value="vegan">Vegan Only 🌱</option>
                <option value="non-veg">Non-Vegetarian 🔴</option>
              </select>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-[10px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Cuisine Heritage
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
              >
                <option value="all">All Cuisines</option>
                {availableCuisines.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Tier Filter */}
            <div>
              <label className="block text-[10px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Price Budget
              </label>
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value as "all" | "under200" | "mid" | "premium")}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
              >
                <option value="all">Any Price</option>
                <option value="under200">Under ₹200 (Quick Bites)</option>
                <option value="mid">₹200 - ₹450 (Artisanal Mains)</option>
                <option value="premium">₹450+ (Flagship Cuts)</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-[10px] font-bold text-[#766E65] uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "time" | "price_asc" | "price_desc")}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
              >
                <option value="rating">Highest Rated (★4.8+)</option>
                <option value="time">Fastest Preparation Speed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONCEPT 1 — MOOD-TO-MEAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <MoodToMeal
          selectedMood={selectedMood}
          onSelectMood={(m) => {
            setSelectedMood(m);
            const gridEl = document.getElementById("food-grid");
            if (gridEl) gridEl.scrollIntoView({ behavior: "smooth" });
          }}
          matchingCount={filteredDishes.length}
        />
      </section>

      {/* SECTION 4: CONCEPT 2 — DISH-FIRST DISCOVERY GRID */}
      <section id="food-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        {/* Section Heading & Comparison Button */}
        <div className="border-b border-[#EBE5DF] pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
                  Dish-First Discovery
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2D]" />
                <span className="text-xs text-[#766E65]">Verified Kitchen Creations</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1A1715] mt-1 font-sans">
                Find the Dish. Discover the Place.
              </h2>
              <div className="w-20 h-1 bg-[#FF4D2D] rounded-full mt-2" />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-bold text-[#1A1715] transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:border-[#FF4D2D]"
              >
                <Scale className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>Compare Dishes</span>
              </button>

              <div className="text-xs font-bold text-[#766E65] bg-white px-3 py-2 rounded-xl border border-[#EBE5DF]">
                Showing <span className="text-[#FF4D2D] font-black">{filteredDishes.length}</span> curated recipes
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#EBE5DF] max-w-md mx-auto space-y-3 shadow-xs">
            <UtensilsCrossed className="w-12 h-12 text-[#9E948C] mx-auto" />
            <h3 className="text-lg font-bold text-[#1A1715]">No dishes matched your filters</h3>
            <p className="text-xs text-[#766E65]">
              Try relaxing your dietary, cuisine, or mood filters to explore more of our culinary library.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-3 px-5 py-2.5 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1A] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Staggered Food Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDishes.map((dish) => {
              const isFav = favorites.includes(dish.id);

              return (
                <div
                  key={dish.id}
                  className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Food Image Stage with Hover Zoom */}
                    <div className="relative h-60 w-full overflow-hidden bg-[#F3EFEA]">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-90" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        {dish.dietary === "veg" ? (
                          <span className="w-6 h-6 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center border border-[#16A34A] shadow-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                          </span>
                        ) : dish.dietary === "vegan" ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white text-[10px] font-bold shadow-xs">
                            VEGAN
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center border border-[#DC2626] shadow-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                          </span>
                        )}

                        {dish.studioEnabled && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#FF4D2D] text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                            <Layers className="w-3 h-3" />
                            3D STUDIO
                          </span>
                        )}
                      </div>

                      {/* Favorite & Quick View Action Buttons */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleFavorite(dish.id, e)}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#1A1715] hover:text-[#FF4D2D] transition-colors shadow-xs cursor-pointer active:scale-90"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? "fill-[#FF4D2D] text-[#FF4D2D]" : ""
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => setQuickViewDish(dish)}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#1A1715] hover:text-[#FF4D2D] transition-colors shadow-xs cursor-pointer active:scale-90"
                          aria-label="Quick view dish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Kitchen & Rating Bar on Image */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="truncate max-w-[200px] text-[#FAF8F5] drop-shadow-xs">
                          {dish.restaurantName}
                        </span>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[#FFD700]">
                          <Star className="w-3 h-3 fill-[#FFD700]" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dish Info Details */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-base text-[#1A1715] group-hover:text-[#FF4D2D] transition-colors line-clamp-1">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-[#766E65] line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#9E948C] pt-1">
                        <span className="flex items-center gap-1 text-[#554C43]">
                          <Clock className="w-3 h-3 text-[#FF4D2D]" />
                          {dish.prepTimeMinutes} mins
                        </span>
                        <span>•</span>
                        <span className="text-[#554C43]">{dish.calories || 520} kcal</span>
                        {dish.spiceLevel && dish.spiceLevel > 1 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-[#DC2626] font-semibold">
                              <Flame className="w-3 h-3" />
                              Spicy
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#F3EFEA] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#1A1715]">₹{dish.price}</span>
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
                          className="px-3 py-2 rounded-xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                          title="Open in 3D Studio"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#FF4D2D]" />
                          <span>3D</span>
                        </Link>
                      ) : null}

                      <button
                        onClick={(e) => handleAddToCartWithFlight(dish, e)}
                        className="px-4 py-2 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
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

      {/* SECTION 5: CONCEPT 3 — FOOD PASSPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <FoodPassport
          selectedCuisine={selectedCuisine}
          onSelectCuisine={(cuisine) => setSelectedCuisine(cuisine)}
        />
      </section>

      {/* SECTION 6: CONCEPT 4 — INTERACTIVE 3D DISH STUDIO & HORIZONTAL GALLERY */}
      <section className="mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Immersive 3D Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] mt-1">
                Meet Your Next Favourite
              </h2>
              <p className="text-xs sm:text-sm text-[#766E65] mt-0.5">
                Inspect ingredients, rotate 3D smash stacks, or enter our full WebGL Customization Studio.
              </p>
            </div>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-all shadow-md"
            >
              <Layers className="w-4 h-4 text-[#FF4D2D]" />
              <span>Launch 3D Customizer Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scroll-Driven 3D Burger Assembly Reveal */}
        <ScrollBurger3D />

        {/* Pinned Horizontal Food Gallery */}
        <HorizontalFoodGallery
          onQuickView={(dish) => setQuickViewDish(dish)}
          onAddToCart={handleAddToCartWithFlight}
        />
      </section>

      {/* SECTION 7: CONCEPT 5 — FOOD RADAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <FoodRadar />
      </section>

      {/* SECTION 8: CONCEPT 7 — FOOD STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <FoodStories
          onTasteDish={(dishId) => {
            const targetDish = MENU_ITEMS.find((d) => d.id === dishId);
            if (targetDish) {
              setQuickViewDish(targetDish);
            }
          }}
        />
      </section>
    </div>
  );
}
