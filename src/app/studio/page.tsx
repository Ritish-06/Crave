"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Layers,
  RotateCcw,
  Sparkles,
  Flame,
  Check,
  ShoppingBag,
  Info,
  Smartphone,
  Eye,
  Sliders,
  Camera,
  Maximize2,
  Compass,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { BurgerCanvas3D, CameraPreset } from "@/components/studio/BurgerCanvas3D";
import { ARPreviewModal } from "@/components/studio/ARPreviewModal";
import { useCart } from "@/context/CartContext";
import { BurgerCustomizationState, MenuItem } from "@/types";
import { MENU_ITEMS } from "@/data/menuData";

const INITIAL_BURGER_STATE: BurgerCustomizationState = {
  bun: "brioche",
  bunToastLevel: 2,
  pattyCount: 2,
  pattyType: "wagyu",
  pattyDoneness: "crispy-smash",
  cheese: "cheddar",
  veggies: {
    lettuce: true,
    tomato: true,
    onion: true,
    pickles: true,
    jalapenos: false
  },
  sauces: {
    truffleMayo: true,
    chipotleBbq: false,
    craveSpecial: false,
    ghostPepper: false
  },
  sauceDrizzleIntensity: "generous",
  extras: {
    caramelizedOnions: true,
    friedEgg: false,
    crispyShallots: false
  }
};

export default function StudioPage() {
  const [customization, setCustomization] = useState<BurgerCustomizationState>(INITIAL_BURGER_STATE);
  const [isExploded, setIsExploded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"bun" | "patties" | "cheese" | "toppings" | "sauces">("bun");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("hero");
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addItem, cartIconRef, setCartDrawerOpen } = useCart();
  const studioContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve base item from MENU_ITEMS
  const baseBurgerItem: MenuItem = useMemo(() => {
    return MENU_ITEMS.find((m) => m.id === "dish-burger-1") || MENU_ITEMS[0];
  }, []);

  // Authoritative dynamic price calculation
  const calculatedPrice = useMemo(() => {
    let price = 389; // Base with single patty

    // Bun add-ons
    if (customization.bun === "sesame") price += 15;
    if (customization.bun === "charcoal") price += 35;
    if (customization.bun === "gluten-free") price += 50;

    // Patty count add-ons
    if (customization.pattyCount === 2) price += 120;
    if (customization.pattyCount === 3) price += 220;

    // Patty Type pricing
    if (customization.pattyType === "crispy-chicken") price += 40;
    if (customization.pattyType === "plant-protein") price += 30;
    if (customization.pattyType === "paneer-steak") price -= 20;

    // Premium cheeses
    if (customization.cheese === "swiss-gouda") price += 40;
    if (customization.cheese === "smoked-provolone") price += 45;

    // Extras
    if (customization.extras.friedEgg) price += 40;
    if (customization.extras.crispyShallots) price += 30;

    return Math.max(299, price);
  }, [customization]);

  // Calories calculation
  const totalCalories = useMemo(() => {
    let cal = 420;
    if (customization.pattyCount === 1) cal += 280;
    if (customization.pattyCount === 2) cal += 520;
    if (customization.pattyCount === 3) cal += 760;

    if (customization.pattyType === "crispy-chicken") cal += 60;
    if (customization.pattyType === "paneer-steak") cal -= 40;

    if (customization.cheese !== "none") cal += 110;
    if (customization.extras.friedEgg) cal += 90;
    return cal;
  }, [customization]);

  // Human-readable customization summary for cart
  const customizationSummary = useMemo(() => {
    const list: string[] = [];
    const bunNames = {
      brioche: "Golden Brioche",
      sesame: "Toasted Sesame",
      charcoal: "Smoked Charcoal",
      "gluten-free": "Gluten-Free Brioche"
    };
    list.push(bunNames[customization.bun]);

    const toastLevelNames = {
      1: "Soft Warm",
      2: "Artisan Golden",
      3: "Caramelized Butter",
      4: "Charred Rustic"
    };
    list.push(`Toast: ${toastLevelNames[customization.bunToastLevel || 2]}`);

    const pattyTypeNames = {
      wagyu: "Wagyu Smash",
      "crispy-chicken": "Crispy Buttermilk Chicken",
      "plant-protein": "Smoked Plant Protein",
      "paneer-steak": "Grilled Paneer Steak"
    };
    list.push(`${customization.pattyCount}x ${pattyTypeNames[customization.pattyType]}`);

    if (customization.pattyType === "wagyu") {
      list.push(`Doneness: ${customization.pattyDoneness || "crispy-smash"}`);
    }

    if (customization.cheese !== "none") {
      const cheeseNames = {
        cheddar: "Aged Cheddar",
        "swiss-gouda": "Swiss Gouda",
        "smoked-provolone": "Smoked Provolone"
      };
      list.push(cheeseNames[customization.cheese]);
    }

    if (customization.sauces.truffleMayo) list.push("Truffle Mayo (3D Drizzled)");
    if (customization.sauces.chipotleBbq) list.push("Chipotle BBQ Glaze");
    if (customization.sauces.ghostPepper) list.push("Ghost Pepper Glaze");
    if (customization.sauces.craveSpecial) list.push("Crave Secret Sauce");

    return list;
  }, [customization]);

  // Food-To-Cart Cinematic Parabolic Animation
  const handleAddToCartWithCinematic = () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    if (isExploded) {
      setIsExploded(false);
    }

    setTimeout(() => {
      const studioRect = studioContainerRef.current?.getBoundingClientRect();
      const cartIconEl = cartIconRef.current;
      const cartRect = cartIconEl?.getBoundingClientRect();

      const startX = studioRect ? studioRect.left + studioRect.width / 2 - 40 : window.innerWidth / 2 - 40;
      const startY = studioRect ? studioRect.top + studioRect.height / 2 - 40 : window.innerHeight / 2 - 40;

      const endX = cartRect ? cartRect.left + cartRect.width / 2 - 20 : window.innerWidth - 60;
      const endY = cartRect ? cartRect.top + cartRect.height / 2 - 20 : 30;

      const projectile = document.createElement("div");
      projectile.className = "flying-projectile";
      projectile.style.left = `${startX}px`;
      projectile.style.top = `${startY}px`;
      projectile.style.width = "75px";
      projectile.style.height = "75px";
      projectile.style.backgroundImage = `url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80')`;
      projectile.style.backgroundSize = "cover";
      projectile.style.backgroundPosition = "center";
      projectile.style.border = "3px solid #FF4D2D";
      document.body.appendChild(projectile);

      // Trigger reflow
      projectile.getBoundingClientRect();

      projectile.style.left = `${endX}px`;
      projectile.style.top = `${endY}px`;
      projectile.style.transform = "scale(0.3) rotate(360deg)";
      projectile.style.opacity = "0.7";

      setTimeout(() => {
        if (projectile.parentNode) {
          projectile.parentNode.removeChild(projectile);
        }

        if (cartIconEl) {
          cartIconEl.classList.add("animate-cart-bounce");
          setTimeout(() => {
            cartIconEl.classList.remove("animate-cart-bounce");
          }, 450);
        }

        addItem(baseBurgerItem, customization, customizationSummary, calculatedPrice);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: endX / window.innerWidth,
            y: endY / window.innerHeight
          },
          colors: ["#FF4D2D", "#FFA384", "#16A34A", "#FFD700"]
        });

        setToastMessage(`Customization added to cravings! ${baseBurgerItem.name} (₹${calculatedPrice})`);
        setIsAddingToCart(false);

        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }, 750);
    }, isExploded ? 300 : 50);
  };

  return (
    <div className="min-h-screen bg-[#140E0A] text-[#FAF8F5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1511] text-white p-4 rounded-2xl shadow-2xl border border-[#FF4D2D]/50 flex items-center gap-4 animate-in slide-in-from-bottom duration-300 max-w-md">
          <div className="w-10 h-10 rounded-xl bg-[#FF4D2D] flex items-center justify-center shrink-0">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">Added to cravings!</p>
            <p className="text-sm font-semibold">{toastMessage}</p>
          </div>
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* AR Quick Look Modal */}
      <ARPreviewModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        customization={customization}
        price={calculatedPrice}
        calories={totalCalories}
      />

      {/* Studio Header Bar */}
      <div className="border-b border-[#2A1F18] bg-[#120D0A]/80 backdrop-blur-md sticky top-20 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#FF4D2D]/20 text-[#FF4D2D]">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                CRAVE 3D Dish Studio
              </h1>
              <span className="text-[10px] font-bold bg-[#FF4D2D] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Procedural PBR
              </span>
            </div>
            <p className="text-xs text-[#9E948C] hidden sm:block">
              Interactive 3D smash burger studio with dynamic bun toasting & sauce drizzles
            </p>
          </div>
        </div>

        {/* Top Controls: AR Quick Look, Explode View Toggle & Reset */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsARModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1C1511] text-[#E5DDD4] hover:text-[#FF4D2D] hover:bg-[#2A1F18] border border-[#2A1F18] transition-all flex items-center gap-2 cursor-pointer group"
            title="Preview in Augmented Reality"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FF4D2D] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">View in AR (1:1)</span>
            <span className="sm:hidden">AR</span>
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isExploded
                ? "bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30"
                : "bg-[#1C1511] text-[#E5DDD4] hover:bg-[#2A1F18] border border-[#2A1F18]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? "Assemble Stack" : "Explode Layers"}</span>
          </button>

          <button
            onClick={() => setCustomization(INITIAL_BURGER_STATE)}
            className="p-2 rounded-xl bg-[#1C1511] text-[#9E948C] hover:text-white hover:bg-[#2A1F18] border border-[#2A1F18] transition-colors cursor-pointer"
            title="Reset to default burger"
            aria-label="Reset burger"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Studio Layout: Left 3D Viewport, Right Controls Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 3D Viewport Canvas */}
        <div
          ref={studioContainerRef}
          className="lg:col-span-7 h-[460px] sm:h-[580px] rounded-3xl bg-radial from-[#1E1611] to-[#120D0A] border border-[#2A1F18] relative overflow-hidden shadow-2xl flex flex-col justify-between p-4"
        >
          {/* Top Canvas Badges & Camera Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-[#A3988E] border border-white/10">
                Drag to orbit 360°
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-[#FF4D2D] border border-[#FF4D2D]/20">
                {customization.pattyCount}x {customization.pattyType === "wagyu" ? "Wagyu" : "Patty"}
              </span>
            </div>

            {/* Camera Presets Selector */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <Camera className="w-3.5 h-3.5 text-[#9E948C] ml-1.5 mr-0.5" />
              {(
                [
                  { id: "hero", label: "Hero" },
                  { id: "iso", label: "Iso" },
                  { id: "top", label: "Top" },
                  { id: "macro", label: "Macro" }
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setCameraPreset(preset.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    cameraPreset === preset.id
                      ? "bg-[#FF4D2D] text-white shadow-sm"
                      : "text-[#A3988E] hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
              {totalCalories} kcal
            </div>
          </div>

          {/* Actual Three.js WebGL Canvas Component */}
          <div className="absolute inset-0 z-0">
            <BurgerCanvas3D
              customization={customization}
              isExploded={isExploded}
              cameraPreset={cameraPreset}
              onSelectIngredient={(ingredient) => {
                if (ingredient === "bun") setActiveTab("bun");
                if (ingredient === "patties") setActiveTab("patties");
                if (ingredient === "cheese") setActiveTab("cheese");
                if (ingredient === "toppings") setActiveTab("toppings");
                if (ingredient === "sauces") setActiveTab("sauces");
              }}
            />
          </div>

          {/* Floating Ingredient Layer Chips (Exploded View Interactive Layer Jumpers) */}
          <div className="z-10 flex flex-wrap gap-1.5 justify-center">
            {isExploded ? (
              <div className="bg-black/70 backdrop-blur-md p-1.5 rounded-2xl text-[11px] text-[#A3988E] border border-white/10 flex flex-wrap items-center gap-1.5 shadow-xl">
                <button
                  onClick={() => setActiveTab("bun")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "bun" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  Top Bun
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("toppings")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "toppings" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  Crisp Garden
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("sauces")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "sauces" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  Sauce Drizzle
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("cheese")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "cheese" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  Melted Cheese
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("patties")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "patties" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  {customization.pattyCount}x Patty
                </button>
                <span>•</span>
                <button
                  onClick={() => setActiveTab("bun")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeTab === "bun" ? "bg-[#FF4D2D] text-white" : "hover:text-white"
                  }`}
                >
                  Bottom Bun
                </button>
              </div>
            ) : (
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#A3988E] border border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>PBR Shading Active • Ambient Sizzle Smoke Simulation</span>
              </div>
            )}
          </div>
        </div>

        {/* Customization Control Deck */}
        <div className="lg:col-span-5 bg-[#1C1511] rounded-3xl border border-[#2A1F18] p-6 space-y-6 shadow-2xl">
          {/* Dish Header & Real-time Authoritative Price */}
          <div className="flex items-start justify-between pb-4 border-b border-[#2A1F18]">
            <div>
              <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
                Artisanal Customization
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {baseBurgerItem.name}
              </h2>
              <p className="text-xs text-[#9E948C] mt-1">
                From The Truffle & Brioche Co. • Bandra West, Mumbai
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#FF4D2D]">₹{calculatedPrice}</span>
              <p className="text-[10px] text-[#9E948C]">All taxes included</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-5 gap-1 bg-[#140E0A] p-1 rounded-2xl border border-[#2A1F18]">
            {(
              [
                { id: "bun", label: "Bun" },
                { id: "patties", label: "Patty" },
                { id: "cheese", label: "Cheese" },
                { id: "toppings", label: "Veggies" },
                { id: "sauces", label: "Sauce" }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#FF4D2D] text-white shadow-md"
                    : "text-[#A3988E] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Bun Selection & Dynamic Toasting */}
          {activeTab === "bun" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider mb-2.5">
                  1. Choose Your Artisanal Bun
                </p>
                <div className="space-y-2">
                  {[
                    { id: "brioche", name: "Artisanal Golden Brioche", price: 0, desc: "Fluffy French butter brioche with glossy crust" },
                    { id: "sesame", name: "Toasted White Sesame Bun", price: 15, desc: "Classic toasted bun with fragrant roasted sesame" },
                    { id: "charcoal", name: "Smoked Activated Charcoal", price: 35, desc: "Striking black bun infused with Japanese bamboo charcoal" },
                    { id: "gluten-free", name: "Gluten-Free Organic Brioche", price: 50, desc: "Certified gluten-free baked with almond and tapioca flour" }
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCustomization({ ...customization, bun: opt.id as any })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        customization.bun === opt.id
                          ? "bg-[#2A1D16] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                          : "bg-[#140E0A] border-[#2A1F18] hover:border-[#3D2C22]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{opt.name}</span>
                          {opt.price > 0 && (
                            <span className="text-xs font-bold text-[#FF4D2D]">+₹{opt.price}</span>
                          )}
                        </div>
                        <p className="text-xs text-[#9E948C] mt-0.5">{opt.desc}</p>
                      </div>
                      {customization.bun === opt.id && (
                        <div className="w-5 h-5 rounded-full bg-[#FF4D2D] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Bun Toasting Controls */}
              <div className="p-4 rounded-2xl bg-[#140E0A] border border-[#2A1F18] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF4D2D]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      2. Bun Toast Level
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#FF4D2D]">
                    {customization.bunToastLevel === 1
                      ? "Level 1: Soft Warm"
                      : customization.bunToastLevel === 2
                      ? "Level 2: Artisan Golden"
                      : customization.bunToastLevel === 3
                      ? "Level 3: Caramelized Butter"
                      : "Level 4: Charred Rustic"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 1, label: "Warm", sub: "Soft" },
                    { level: 2, label: "Golden", sub: "Artisan" },
                    { level: 3, label: "Caramel", sub: "Toasted" },
                    { level: 4, label: "Charred", sub: "Woodfire" }
                  ].map((t) => (
                    <button
                      key={t.level}
                      onClick={() =>
                        setCustomization({ ...customization, bunToastLevel: t.level as any })
                      }
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        (customization.bunToastLevel || 2) === t.level
                          ? "bg-[#2A1D16] border-[#FF4D2D] text-white ring-1 ring-[#FF4D2D]"
                          : "bg-[#1C1511] border-[#2A1F18] text-[#9E948C] hover:text-white"
                      }`}
                    >
                      <span className="block text-xs font-bold">{t.label}</span>
                      <span className="block text-[9px] text-[#A3988E]">{t.sub}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#9E948C]">
                  Adjusting toast level procedurally generates realistic caramelized butter marks and charred sear lines on the bun cut in 3D.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Patty Selection, Types & Doneness */}
          {activeTab === "patties" && (
            <div className="space-y-4">
              {/* Patty Variety */}
              <div>
                <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider mb-2">
                  1. Select Patty Craft & Source
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "wagyu", label: "Japanese Wagyu", sub: "Rich & Juicy", price: 0 },
                    { id: "crispy-chicken", label: "Crispy Buttermilk", sub: "Golden Crunch", price: 40 },
                    { id: "plant-protein", label: "Plant-Protein", sub: "Smoked Grain", price: 30 },
                    { id: "paneer-steak", label: "Paneer Cottage", sub: "Char-Grilled (Veg)", price: -20 }
                  ].map((pType) => (
                    <div
                      key={pType.id}
                      onClick={() =>
                        setCustomization({ ...customization, pattyType: pType.id as any })
                      }
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        customization.pattyType === pType.id
                          ? "bg-[#2A1D16] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                          : "bg-[#140E0A] border-[#2A1F18] hover:border-[#3D2C22]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{pType.label}</span>
                        {pType.price !== 0 && (
                          <span className={`text-[10px] font-bold ${pType.price > 0 ? "text-[#FF4D2D]" : "text-emerald-400"}`}>
                            {pType.price > 0 ? `+₹${pType.price}` : `-₹${Math.abs(pType.price)}`}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#9E948C] block mt-0.5">{pType.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patty Quantity */}
              <div>
                <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider mb-2">
                  2. Select Smash Quantity
                </p>
                <div className="space-y-2">
                  {[
                    { count: 1, label: "Single Smash Patty (150g)", price: 0, cal: "280 kcal" },
                    { count: 2, label: "Double Smash Stack (300g)", price: 120, cal: "520 kcal", popular: true },
                    { count: 3, label: "Triple Beast Smash (450g)", price: 220, cal: "760 kcal" }
                  ].map((tier) => (
                    <div
                      key={tier.count}
                      onClick={() => setCustomization({ ...customization, pattyCount: tier.count as any })}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        customization.pattyCount === tier.count
                          ? "bg-[#2A1D16] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                          : "bg-[#140E0A] border-[#2A1F18] hover:border-[#3D2C22]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{tier.label}</span>
                          {tier.popular && (
                            <span className="text-[9px] bg-[#FF4D2D]/20 text-[#FF4D2D] font-bold px-1.5 py-0.5 rounded-sm">
                              CHEF CHOICE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#9E948C] mt-0.5">
                          <span>{tier.cal}</span>
                          <span>•</span>
                          <span className="text-white font-medium">
                            {tier.price === 0 ? "Included" : `+₹${tier.price}`}
                          </span>
                        </div>
                      </div>
                      {customization.pattyCount === tier.count && (
                        <div className="w-5 h-5 rounded-full bg-[#FF4D2D] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Patty Doneness (for Wagyu) */}
              {customization.pattyType === "wagyu" && (
                <div className="p-3.5 rounded-2xl bg-[#140E0A] border border-[#2A1F18] space-y-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    3. Smash Searing & Doneness
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "medium-rare", label: "Medium Rare", sub: "Glistening Juicy" },
                      { id: "medium-well", label: "Medium Well", sub: "Seared Crust" },
                      { id: "crispy-smash", label: "Crispy Smashed", sub: "Craggly Edge" }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          setCustomization({ ...customization, pattyDoneness: d.id as any })
                        }
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          (customization.pattyDoneness || "crispy-smash") === d.id
                            ? "bg-[#2A1D16] border-[#FF4D2D] text-white ring-1 ring-[#FF4D2D]"
                            : "bg-[#1C1511] border-[#2A1F18] text-[#9E948C] hover:text-white"
                        }`}
                      >
                        <span className="block text-xs font-bold">{d.label}</span>
                        <span className="block text-[9px] text-[#A3988E]">{d.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Cheese Selection */}
          {activeTab === "cheese" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider">
                Select Melted Artisan Cheese
              </p>
              {[
                { id: "cheddar", name: "Aged 18-Month Sharp Cheddar", price: 0, desc: "Bold, tangy, melted over sizzling patty edges" },
                { id: "swiss-gouda", name: "Melted Swiss Emmental & Gouda", price: 40, desc: "Nutty, creamy and exceptionally stretchy" },
                { id: "smoked-provolone", name: "Smoked Italian Provolone", price: 45, desc: "Slow wood-smoked curd cheese with rustic depth" },
                { id: "none", name: "No Cheese (Dairy-Free)", price: 0, desc: "Skip cheese for a lighter, clean wagyu profile" }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setCustomization({ ...customization, cheese: opt.id as any })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    customization.cheese === opt.id
                      ? "bg-[#2A1D16] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#140E0A] border-[#2A1F18] hover:border-[#3D2C22]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{opt.name}</span>
                      {opt.price > 0 && (
                        <span className="text-xs font-bold text-[#FF4D2D]">+₹{opt.price}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#9E948C] mt-0.5">{opt.desc}</p>
                  </div>
                  {customization.cheese === opt.id && (
                    <div className="w-5 h-5 rounded-full bg-[#FF4D2D] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Veggies & Crisp Toppings */}
          {activeTab === "toppings" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider">
                Fresh Garden Toppings
              </p>
              {[
                { key: "lettuce", label: "Crisp Iceberg Lettuce", desc: "Fresh organic crunch" },
                { key: "tomato", label: "Vine-Ripe Beefsteak Tomatoes", desc: "Juicy thick slices" },
                { key: "onion", label: "Caramelized Sweet Onions", desc: "Slow pan-roasted in butter" },
                { key: "pickles", label: "Dill Pickle Chips", desc: "Tangy barrel-aged crunch" },
                { key: "jalapenos", label: "Pickled Jalapeños", desc: "Zesty Mexican spice kick" }
              ].map((v) => {
                const isSelected = (customization.veggies as any)[v.key];
                return (
                  <div
                    key={v.key}
                    onClick={() =>
                      setCustomization({
                        ...customization,
                        veggies: {
                          ...customization.veggies,
                          [v.key]: !isSelected
                        }
                      })
                    }
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#2A1D16] border-[#FF4D2D]"
                        : "bg-[#140E0A] border-[#2A1F18]"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-white">{v.label}</p>
                      <p className="text-xs text-[#9E948C] mt-0.5">{v.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#FF4D2D] border-[#FF4D2D]"
                          : "border-[#4A3B30] bg-[#140E0A]"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 5: Secret Sauces with 3D Visual Drizzle Effects */}
          {activeTab === "sauces" && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#FF4D2D]/10 border border-[#FF4D2D]/30 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <p className="text-xs text-[#E5DDD4]">
                  <strong className="text-white">Live 3D Sauce Drizzle:</strong> Selected sauces dynamically render glossy drizzle ribbons & dripping beads in the 3D viewport.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "truffleMayo",
                    label: "Crave Black Truffle Aioli",
                    desc: "Italian summer truffle emulsion (Signature)",
                    badgeColor: "#FAF4E1",
                    textColor: "#140E0A"
                  },
                  {
                    key: "chipotleBbq",
                    label: "Smoked Chipotle BBQ Glaze",
                    desc: "Hickory-smoked sweet and savory glaze",
                    badgeColor: "#581308",
                    textColor: "#FFFFFF"
                  },
                  {
                    key: "ghostPepper",
                    label: "Fiery Bhut Jolokia Glaze",
                    desc: "Assamese ghost pepper heat infusion",
                    badgeColor: "#DF2910",
                    textColor: "#FFFFFF"
                  },
                  {
                    key: "craveSpecial",
                    label: "Crave Secret Burger Sauce",
                    desc: "Creamy Thousand Island coral emulsion",
                    badgeColor: "#EA6C38",
                    textColor: "#FFFFFF"
                  }
                ].map((s) => {
                  const isSelected = (customization.sauces as any)[s.key];
                  return (
                    <div
                      key={s.key}
                      onClick={() =>
                        setCustomization({
                          ...customization,
                          sauces: {
                            ...customization.sauces,
                            [s.key]: !isSelected
                          }
                        })
                      }
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#2A1D16] border-[#FF4D2D]"
                          : "bg-[#140E0A] border-[#2A1F18]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: s.badgeColor }}
                          />
                          <p className="font-bold text-sm text-white">{s.label}</p>
                        </div>
                        <p className="text-xs text-[#9E948C] mt-0.5">{s.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected
                            ? "bg-[#FF4D2D] border-[#FF4D2D]"
                            : "border-[#4A3B30] bg-[#140E0A]"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Allergen Warning */}
          <div className="p-3 rounded-2xl bg-[#140E0A] border border-[#2A1F18] flex items-start gap-2.5 text-xs text-[#A3988E]">
            <Info className="w-4 h-4 text-[#FF4D2D] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Verified Allergens:</span> Contains Dairy, Wheat Gluten, Eggs, and Mustard. Prepared in a facility handling sesame and nuts.
            </div>
          </div>

          {/* Add to Cart Primary Action with Parabolic Animation */}
          <div className="pt-2">
            <button
              onClick={handleAddToCartWithCinematic}
              disabled={isAddingToCart}
              className="w-full py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-base shadow-xl shadow-[#FF4D2D]/30 transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-75"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>
                {isAddingToCart ? "Assembling & Adding..." : `Add to Cart • ₹${calculatedPrice}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
