"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Percent,
  X
} from "lucide-react";
import { Restaurant } from "@/types";

interface SmartMatchPanelProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onApplyMatches: (rankedRestaurants: Restaurant[]) => void;
}

export function SmartMatchPanel({
  restaurants,
  isOpen,
  onClose,
  onApplyMatches,
}: SmartMatchPanelProps) {
  const [preferredCuisine, setPreferredCuisine] = useState<string>("Gourmet Burgers");
  const [budgetTier, setBudgetTier] = useState<"budget" | "mid" | "any">("any");
  const [speedPreference, setSpeedPreference] = useState<"fast" | "standard" | "any">("any");
  const [dietaryPreference, setDietaryPreference] = useState<"all" | "veg" | "non-veg">("all");
  const [minRating, setMinRating] = useState<number>(4.7);

  if (!isOpen) return null;

  // Transparent, data-driven Craving Match Score calculation
  const scoredRestaurants = restaurants.map((r) => {
    let score = 50; // base score
    const matchReasons: string[] = [];

    // 1. Cuisine match (up to 30 points)
    if (r.cuisine.some((c) => c.toLowerCase().includes(preferredCuisine.toLowerCase()))) {
      score += 30;
      matchReasons.push(`Matches your ${preferredCuisine} craving`);
    }

    // 2. Budget match (up to 20 points)
    if (budgetTier === "budget") {
      if (r.priceForTwo <= 700) {
        score += 20;
        matchReasons.push(`Budget-friendly: ₹${r.priceForTwo} for two`);
      } else {
        score -= 10;
      }
    } else if (budgetTier === "mid") {
      if (r.priceForTwo <= 1000) {
        score += 15;
        matchReasons.push(`Fits your target budget under ₹1000`);
      }
    }

    // 3. Prep time speed (up to 15 points)
    if (speedPreference === "fast") {
      if (r.prepTimeMinutes <= 20) {
        score += 15;
        matchReasons.push(`Express preparation: ~${r.prepTimeMinutes} mins`);
      } else if (r.prepTimeMinutes <= 25) {
        score += 8;
      }
    }

    // 4. Rating bonus
    if (r.rating >= minRating) {
      score += 10;
      matchReasons.push(`High verified rating: ★${r.rating}`);
    }

    // Cap at 99%
    const finalScore = Math.min(99, Math.max(35, score));

    return {
      restaurant: r,
      score: finalScore,
      reasons: matchReasons,
    };
  });

  // Sort descending by score
  scoredRestaurants.sort((a, b) => b.score - a.score);

  const topMatch = scoredRestaurants[0];

  const handleApply = () => {
    onApplyMatches(scoredRestaurants.map((s) => s.restaurant));
    onClose();
  };

  const handleReset = () => {
    setPreferredCuisine("Gourmet Burgers");
    setBudgetTier("any");
    setSpeedPreference("any");
    setDietaryPreference("all");
    setMinRating(4.7);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-[#140E0A] text-white flex items-center justify-between border-b border-[#2A1F18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D2D]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4D2D] bg-[#1C1511] px-2 py-0.5 rounded border border-[#2A1F18]">
                  CRAVE Match Engine
                </span>
                <span className="text-xs text-[#A3988E]">Transparent Rule-Based Scoring</span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Smart Restaurant Match Finder
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1C1511] hover:bg-[#2A1F18] text-[#A3988E] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preference Selection Controls */}
          <div className="p-5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#766E65]">
                Tune Your Cravings & Priorities
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Priorities</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Cuisine */}
              <div>
                <label className="block text-[11px] font-bold text-[#766E65] uppercase mb-1">
                  Primary Craving
                </label>
                <select
                  value={preferredCuisine}
                  onChange={(e) => setPreferredCuisine(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-[#1A1715]"
                >
                  <option value="Gourmet Burgers">Gourmet Smash Burgers</option>
                  <option value="Italian & Artisanal Pizza">Artisanal Neapolitan Pizza</option>
                  <option value="North Indian">Royal Awadhi Dum Biryani</option>
                  <option value="Pan-Asian">Dim Sum & Steamed Baos</option>
                  <option value="Healthy & Bowls">Clean Organic Bowls</option>
                  <option value="Desserts & Patisserie">French Patisserie & Gateaux</option>
                </select>
              </div>

              {/* Target Budget */}
              <div>
                <label className="block text-[11px] font-bold text-[#766E65] uppercase mb-1">
                  Cost for Two
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5DDD4]">
                  <button
                    onClick={() => setBudgetTier("budget")}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                      budgetTier === "budget" ? "bg-white text-[#1A1715] shadow-xs" : "text-[#766E65]"
                    }`}
                  >
                    &lt; ₹700
                  </button>
                  <button
                    onClick={() => setBudgetTier("mid")}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                      budgetTier === "mid" ? "bg-white text-[#1A1715] shadow-xs" : "text-[#766E65]"
                    }`}
                  >
                    &lt; ₹1000
                  </button>
                  <button
                    onClick={() => setBudgetTier("any")}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                      budgetTier === "any" ? "bg-white text-[#1A1715] shadow-xs" : "text-[#766E65]"
                    }`}
                  >
                    Any
                  </button>
                </div>
              </div>

              {/* Delivery Speed */}
              <div>
                <label className="block text-[11px] font-bold text-[#766E65] uppercase mb-1">
                  Prep & Delivery Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSpeedPreference("fast")}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      speedPreference === "fast"
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-[#FAF8F5] text-[#554C43] border-[#E5DDD4]"
                    }`}
                  >
                    ⚡ Fast (&lt;20m)
                  </button>
                  <button
                    onClick={() => setSpeedPreference("any")}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      speedPreference === "any"
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-[#FAF8F5] text-[#554C43] border-[#E5DDD4]"
                    }`}
                  >
                    Standard
                  </button>
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-[11px] font-bold text-[#766E65] uppercase mb-1">
                  Verified Safety & Rating
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMinRating(4.8)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      minRating === 4.8
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-[#FAF8F5] text-[#554C43] border-[#E5DDD4]"
                    }`}
                  >
                    ★ 4.8+ Stars
                  </button>
                  <button
                    onClick={() => setMinRating(4.6)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      minRating === 4.6
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-[#FAF8F5] text-[#554C43] border-[#E5DDD4]"
                    }`}
                  >
                    ★ 4.6+ Stars
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Scored Match Preview Card */}
          {topMatch && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1511] to-[#120D0A] text-white border border-[#2A1F18] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4D2D] bg-[#2A1F18] px-2.5 py-1 rounded-md">
                  Top Recommended Kitchen Match
                </span>
                <div className="flex items-center gap-1.5 bg-[#FF4D2D] text-white px-3 py-1 rounded-full text-xs font-black">
                  <Percent className="w-3.5 h-3.5" />
                  <span>{topMatch.score}% Match</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#1C1511] shrink-0 border border-[#2A1F18]">
                  <Image
                    src={topMatch.restaurant.logoImage}
                    alt={topMatch.restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{topMatch.restaurant.name}</h3>
                  <p className="text-xs text-[#A3988E]">{topMatch.restaurant.tagline}</p>
                  <div className="flex items-center gap-2 text-xs text-[#C4B7AC] pt-1">
                    <span>★ {topMatch.restaurant.rating}</span>
                    <span>•</span>
                    <span>₹{topMatch.restaurant.priceForTwo} for two</span>
                    <span>•</span>
                    <span>~{topMatch.restaurant.prepTimeMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Match Explanation Badges */}
              <div className="space-y-1.5 pt-2 border-t border-[#2A1F18]">
                <span className="text-[10px] text-[#A3988E] uppercase font-bold tracking-wider block">
                  Why it matches your criteria:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topMatch.reasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#2A1F18] text-emerald-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{reason}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ranked List of All Matches */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#766E65] block">
              All Ranked Kitchens ({scoredRestaurants.length})
            </span>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {scoredRestaurants.slice(1).map(({ restaurant, score, reasons }) => (
                <div
                  key={restaurant.id}
                  className="p-3.5 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-between text-xs hover:border-[#FF4D2D]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#FF4D2D] w-10 text-right">{score}%</span>
                    <div>
                      <h4 className="font-bold text-[#1A1715]">{restaurant.name}</h4>
                      <p className="text-[11px] text-[#766E65] line-clamp-1">{reasons[0] || restaurant.city}</p>
                    </div>
                  </div>
                  <span className="text-[#766E65]">₹{restaurant.priceForTwo} for 2</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EBE5DF] flex items-center justify-between">
          <span className="text-xs text-[#766E65] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict data-driven matching logic</span>
          </span>

          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Apply Ranked Order to Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
