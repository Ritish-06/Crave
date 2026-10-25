"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Globe2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award
} from "lucide-react";

export interface PassportCuisine {
  id: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  signatureDish: string;
  image: string;
  description: string;
  dishesCount: number;
}

export const PASSPORT_CUISINES: PassportCuisine[] = [
  {
    id: "Indian Gourmet",
    name: "Awadhi & Royal Dum",
    region: "Lucknow & Hyderabad",
    country: "India",
    flag: "🇮🇳",
    signatureDish: "Nizami Gosht Dum Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    description: "Centuries-old slow cooking in sealed earthen handis infused with saffron and aged basmati.",
    dishesCount: 4,
  },
  {
    id: "Woodfired Pizza",
    name: "Italian & Neapolitan",
    region: "Naples & Tuscany",
    country: "Italy",
    flag: "🇮🇹",
    signatureDish: "Burrata Margherita D.O.P.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    description: "72-hour cold fermented sourdough blistered at 480°C in volcanic stone ovens.",
    dishesCount: 3,
  },
  {
    id: "Artisanal Burgers",
    name: "American Smash Craft",
    region: "New York & California",
    country: "USA",
    flag: "🇺🇸",
    signatureDish: "Truffle Wagyu Double Smash",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    description: "Freshly ground wagyu patties seared on smoking cast-iron with melted aged cheddar and brioche.",
    dishesCount: 3,
  },
  {
    id: "Pan-Asian",
    name: "Pan-Asian & Dim Sum",
    region: "East Asia & Fusion",
    country: "Pan-Asia",
    flag: "🥢",
    signatureDish: "Signature Butter Chicken Bao",
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80",
    description: "Pillow-soft steamed lotus buns, fragrant jasmine broths, and crispy aromatics.",
    dishesCount: 3,
  },
  {
    id: "Desserts & Patisserie",
    name: "French Haute Patisserie",
    region: "Paris & Lyon",
    country: "France",
    flag: "🇫🇷",
    signatureDish: "Valrhona Dark Ganache Tart",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    description: "Single-origin Valrhona chocolate tempered to glossy perfection with crisp almond shortcrust.",
    dishesCount: 3,
  },
  {
    id: "Healthy & Bowls",
    name: "California Clean Bowls",
    region: "Pacific Coast",
    country: "Global",
    flag: "🥗",
    signatureDish: "Avocado Burrata Green Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    description: "Organic microgreens, Hass avocado, heirloom tomatoes, and cold-pressed basil vinaigrette.",
    dishesCount: 2,
  },
  {
    id: "Chettinad Regional",
    name: "South Indian Coastal",
    region: "Tamil Nadu & Kerala",
    country: "India",
    flag: "🥥",
    signatureDish: "Chettinad Pepper Roast Handi",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    description: "Stone-ground black tellicherry pepper, star anise, curry leaves, and toasted coconut oil.",
    dishesCount: 3,
  },
  {
    id: "Japanese Gourmet",
    name: "Tokyo Umami & Ramen",
    region: "Tokyo & Kyoto",
    country: "Japan",
    flag: "🇯🇵",
    signatureDish: "Rich Tonkotsu Umami Broth",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    description: "Slow-simmered 18-hour bone broth with springy noodles, ajitsuke tamago, and nori crisps.",
    dishesCount: 2,
  },
];

interface FoodPassportProps {
  selectedCuisine: string;
  onSelectCuisine: (cuisineName: string) => void;
}

export function FoodPassport({
  selectedCuisine,
  onSelectCuisine,
}: FoodPassportProps) {
  const [exploredCuisines, setExploredCuisines] = useState<string[]>([]);

  // Load explored cuisines from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("crave_passport_cuisines");
      if (saved) {
        setExploredCuisines(JSON.parse(saved));
      } else {
        // Default seed with initial explore
        const initial = ["Indian Gourmet", "Artisanal Burgers"];
        setExploredCuisines(initial);
        localStorage.setItem("crave_passport_cuisines", JSON.stringify(initial));
      }
    } catch {}
  }, []);

  const handleCuisineClick = (cuisineId: string) => {
    onSelectCuisine(cuisineId);

    // Add to explored passport
    if (!exploredCuisines.includes(cuisineId)) {
      const updated = [...exploredCuisines, cuisineId];
      setExploredCuisines(updated);
      try {
        localStorage.setItem("crave_passport_cuisines", JSON.stringify(updated));
      } catch {}
    }

    // Smooth scroll to food grid
    const gridEl = document.getElementById("food-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stampProgress = Math.round((exploredCuisines.length / PASSPORT_CUISINES.length) * 100);

  return (
    <section className="space-y-6">
      {/* Header with Passport Progress */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Culinary Passport</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] mt-1">
            Your Passport to Flavour
          </h2>
          <p className="text-xs sm:text-sm text-[#766E65] mt-0.5">
            Collect stamps as you taste world cuisines and India’s regional culinary dynasties.
          </p>
        </div>

        {/* Passport Progress Pill */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#EBE5DF] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#1A1715] text-[#FF4D2D] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-[#1A1715]">
                {exploredCuisines.length}/{PASSPORT_CUISINES.length} Cuisines Stamped
              </span>
              <span className="font-black text-[#FF4D2D]">{stampProgress}%</span>
            </div>
            <div className="w-36 h-1.5 bg-[#F3EFEA] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4D2D] to-[#FFA384] rounded-full transition-all duration-500"
                style={{ width: `${stampProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cuisines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PASSPORT_CUISINES.map((c) => {
          const isSelected = selectedCuisine === c.id;
          const isStamped = exploredCuisines.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => handleCuisineClick(c.id)}
              className={`group rounded-3xl bg-white border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[#FF4D2D] ring-2 ring-[#FF4D2D] shadow-lg"
                  : "border-[#EBE5DF] hover:border-[#D5CDC4]"
              }`}
            >
              <div>
                {/* Visual Cover */}
                <div className="relative h-40 w-full overflow-hidden bg-[#F3EFEA]">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Flag & Region */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold border border-white/10">
                    <span>{c.flag}</span>
                    <span className="text-[11px]">{c.country}</span>
                  </div>

                  {/* Stamped Badge */}
                  {isStamped && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Passport Stamped!">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}

                  {/* Bottom Cuisine Name */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-semibold text-[#FFA384] uppercase tracking-wider block">
                      {c.region}
                    </span>
                    <h3 className="text-base font-black leading-tight drop-shadow-sm">
                      {c.name}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[#766E65] line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs">
                    <span className="text-[10px] font-bold text-[#9E948C] block uppercase tracking-wider">
                      Signature Creation:
                    </span>
                    <span className="font-bold text-[#1A1715] truncate block mt-0.5">
                      {c.signatureDish}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 flex items-center justify-between text-xs font-bold text-[#FF4D2D]">
                <span>{c.dishesCount} Signature Dishes</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
