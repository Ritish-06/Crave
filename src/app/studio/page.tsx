"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Layers,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Flame,
  Check,
  ShoppingBag,
  Info,
  ChevronRight,
  Eye,
  Sliders,
  AlertCircle
} from "lucide-react";
import { BurgerCanvas3D } from "@/components/studio/BurgerCanvas3D";
import { useCart } from "@/context/CartContext";
import { BurgerCustomizationState, MenuItem } from "@/types";
import { MENU_ITEMS } from "@/data/menuData";

const INITIAL_BURGER_STATE: BurgerCustomizationState = {
  bun: "brioche",
  pattyCount: 2,
  pattyType: "wagyu",
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

    // Premium cheeses
    if (customization.cheese === "swiss-gouda") price += 40;
    if (customization.cheese === "smoked-provolone") price += 45;

    // Extras
    if (customization.extras.friedEgg) price += 40;
    if (customization.extras.crispyShallots) price += 30;

    return price;
  }, [customization]);

  // Calories calculation
  const totalCalories = useMemo(() => {
    let cal = 450;
    if (customization.pattyCount === 1) cal += 280;
    if (customization.pattyCount === 2) cal += 520;
    if (customization.pattyCount === 3) cal += 760;
    if (customization.cheese !== "none") cal += 110;
    if (customization.extras.friedEgg) cal += 90;
    return cal;
  }, [customization]);

  // Human-readable customization summary for cart
  const customizationSummary = useMemo(() => {
    const list: string[] = [];
    const bunNames = {
      brioche: "Golden Brioche",
      sesame: "Sesame Bun",
      charcoal: "Charcoal Bun",
      "gluten-free": "Gluten-Free Bun"
    };
    list.push(bunNames[customization.bun]);
    list.push(`${customization.pattyCount}x Wagyu Patty`);
    if (customization.cheese !== "none") {
      const cheeseNames = {
        cheddar: "Aged Cheddar",
        "swiss-gouda": "Swiss Gouda",
        "smoked-provolone": "Smoked Provolone"
      };
      list.push(cheeseNames[customization.cheese]);
    }
    if (customization.sauces.truffleMayo) list.push("Truffle Mayo");
    if (customization.sauces.ghostPepper) list.push("Ghost Pepper Sauce");
    return list;
  }, [customization]);

  // Phase 8: Food-To-Cart Cinematic Animation
  const handleAddToCartWithCinematic = () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    // Step 3: If exploded, assemble first
    if (isExploded) {
      setIsExploded(false);
    }

    // Step 4: After a brief assembly moment, calculate coordinates for projectile
    setTimeout(() => {
      // Find starting position (center of studio canvas)
      const studioRect = studioContainerRef.current?.getBoundingClientRect();
      const cartIconEl = cartIconRef.current;
      const cartRect = cartIconEl?.getBoundingClientRect();

      const startX = studioRect ? studioRect.left + studioRect.width / 2 - 40 : window.innerWidth / 2 - 40;
      const startY = studioRect ? studioRect.top + studioRect.height / 2 - 40 : window.innerHeight / 2 - 40;

      const endX = cartRect ? cartRect.left + cartRect.width / 2 - 20 : window.innerWidth - 60;
      const endY = cartRect ? cartRect.top + cartRect.height / 2 - 20 : 30;

      // Step 5: Create a temporary visual representation of the burger
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

      // Force layout reflow
      projectile.getBoundingClientRect();

      // Step 6 & 7: Animate along curved path and shrink scale
      projectile.style.left = `${endX}px`;
      projectile.style.top = `${endY}px`;
      projectile.style.transform = "scale(0.3) rotate(360deg)";
      projectile.style.opacity = "0.7";

      // Step 8: Complete arrival
      setTimeout(() => {
        if (projectile.parentNode) {
          projectile.parentNode.removeChild(projectile);
        }

        // Animate cart bounce
        if (cartIconEl) {
          cartIconEl.classList.add("animate-cart-bounce");
          setTimeout(() => {
            cartIconEl.classList.remove("animate-cart-bounce");
          }, 450);
        }

        // Step 9: Authoritatively update cart state
        addItem(baseBurgerItem, customization, customizationSummary, calculatedPrice);

        // Step 10: Confetti & Toast
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: endX / window.innerWidth,
            y: endY / window.innerHeight
          },
          colors: ["#FF4D2D", "#FFA384", "#16A34A", "#FFD700"]
        });

        setToastMessage(`Added to your cravings! ${baseBurgerItem.name} (₹${calculatedPrice})`);
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
            <p className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">Added to your cravings!</p>
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
                WebGL
              </span>
            </div>
            <p className="text-xs text-[#9E948C] hidden sm:block">
              Interactive procedural smash burger configurator
            </p>
          </div>
        </div>

        {/* Top Controls: Explode View Toggle & Reset */}
        <div className="flex items-center gap-2.5">
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
            className="p-2 rounded-xl bg-[#1C1511] text-[#9E948C] hover:text-white hover:bg-[#2A1F18] border border-[#2A1F18] transition-colors"
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
          className="lg:col-span-7 h-[420px] sm:h-[540px] rounded-3xl bg-radial from-[#1E1611] to-[#120D0A] border border-[#2A1F18] relative overflow-hidden shadow-2xl flex flex-col justify-between p-4"
        >
          {/* Top Canvas Badges */}
          <div className="flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-[#A3988E] border border-white/10">
                Drag mouse/touch to orbit
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-[#FF4D2D] border border-[#FF4D2D]/20">
                {customization.pattyCount}x Smash Stack
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
              {totalCalories} kcal
            </div>
          </div>

          {/* Actual Three.js WebGL Canvas Component */}
          <div className="absolute inset-0 z-0">
            <BurgerCanvas3D customization={customization} isExploded={isExploded} />
          </div>

          {/* Floating Ingredient Layer Chips (Exploded View Indicators) */}
          <div className="z-10 pointer-events-none flex flex-wrap gap-1.5 justify-center">
            {isExploded && (
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] text-[#A3988E] border border-white/10 flex items-center gap-2">
                <span>Top Bun</span>
                <span>•</span>
                <span>Crisp Veggies</span>
                <span>•</span>
                <span>Melted Cheese</span>
                <span>•</span>
                <span>{customization.pattyCount}x Patty</span>
                <span>•</span>
                <span>Bottom Bun</span>
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

          {/* Tab 1: Bun Selection */}
          {activeTab === "bun" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider">
                Choose Your Artisanal Bun
              </p>
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
          )}

          {/* Tab 2: Patty Selection */}
          {activeTab === "patties" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider">
                Select Patty Quantity & Stack
              </p>
              {[
                { count: 1, label: "Single Smash Patty (150g)", price: 0, cal: "280 kcal" },
                { count: 2, label: "Double Smash Stack (300g)", price: 120, cal: "520 kcal", popular: true },
                { count: 3, label: "Triple Beast Smash (450g)", price: 220, cal: "760 kcal" }
              ].map((tier) => (
                <div
                  key={tier.count}
                  onClick={() => setCustomization({ ...customization, pattyCount: tier.count as any })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    customization.pattyCount === tier.count
                      ? "bg-[#2A1D16] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#140E0A] border-[#2A1F18] hover:border-[#3D2C22]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{tier.label}</span>
                      {tier.popular && (
                        <span className="text-[10px] bg-[#FF4D2D]/20 text-[#FF4D2D] font-bold px-1.5 py-0.5 rounded-sm">
                          CHEF RECOMMENDATION
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

          {/* Tab 5: Secret Sauces */}
          {activeTab === "sauces" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#A3988E] uppercase tracking-wider">
                Emulsions & Glazes
              </p>
              {[
                { key: "truffleMayo", label: "Crave Black Truffle Aioli", desc: "Italian summer truffle emulsion (Signature)" },
                { key: "chipotleBbq", label: "Smoked Chipotle BBQ Glaze", desc: "Hickory-smoked sweet and savory glaze" },
                { key: "ghostPepper", label: "Fiery Bhut Jolokia Glaze", desc: "Assamese ghost pepper heat infusion" }
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
                      <p className="font-bold text-sm text-white">{s.label}</p>
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
          )}

          {/* Verified Allergen Warning */}
          <div className="p-3 rounded-2xl bg-[#140E0A] border border-[#2A1F18] flex items-start gap-2.5 text-xs text-[#A3988E]">
            <Info className="w-4 h-4 text-[#FF4D2D] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Verified Allergens:</span> Contains Dairy, Wheat Gluten, Eggs, and Mustard. Prepared in a facility handling sesame and nuts.
            </div>
          </div>

          {/* Add to Cart Primary Action with Phase 8 Parabolic Animation */}
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
