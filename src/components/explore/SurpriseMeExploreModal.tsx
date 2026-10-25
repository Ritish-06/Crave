"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  X,
  RotateCw,
  ShoppingBag,
  Star,
  Clock,
  Flame,
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { MenuItem } from "@/types";
import { MENU_ITEMS } from "@/data/menuData";

interface SurpriseMeExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, e: React.MouseEvent) => void;
  onQuickView: (dish: MenuItem) => void;
}

export function SurpriseMeExploreModal({
  isOpen,
  onClose,
  onAddToCart,
  onQuickView,
}: SurpriseMeExploreModalProps) {
  const [budgetTier, setBudgetTier] = useState<"any" | "budget" | "mid" | "luxury">("any");
  const [dietary, setDietary] = useState<"all" | "veg" | "non-veg">("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedIndex, setPickedIndex] = useState(0);

  // Available candidate dishes based on active filters
  const candidateDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Budget
      if (budgetTier === "budget" && dish.price > 250) return false;
      if (budgetTier === "mid" && (dish.price < 250 || dish.price > 500)) return false;
      if (budgetTier === "luxury" && dish.price < 500) return false;

      // Dietary
      if (dietary === "veg" && dish.dietary !== "veg" && dish.dietary !== "vegan") return false;
      if (dietary === "non-veg" && dish.dietary !== "non-veg") return false;

      // Cuisine
      if (selectedCuisine !== "all" && dish.cuisine !== selectedCuisine) return false;

      return true;
    });
  }, [budgetTier, dietary, selectedCuisine]);

  const activeDish: MenuItem | undefined = candidateDishes[pickedIndex % Math.max(1, candidateDishes.length)];

  const handleSpinAgain = () => {
    if (candidateDishes.length <= 1) return;
    setIsSpinning(true);
    setTimeout(() => {
      setPickedIndex((prev) => (prev + 1) % candidateDishes.length);
      setIsSpinning(false);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EBE5DF] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EBE5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1715]">
                Surprise My Cravings
              </h3>
              <p className="text-xs text-[#766E65]">
                Deterministic recommendation matching your exact mood & budget
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#766E65] hover:text-[#1A1715] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Filter Pills */}
          <div className="space-y-3">
            {/* Dietary Preference */}
            <div>
              <span className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1.5">
                Dietary Preference
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "Anything Goes" },
                  { id: "veg", label: "Pure Veg 🟢" },
                  { id: "non-veg", label: "Non-Veg 🔴" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setDietary(opt.id as any);
                      setPickedIndex(0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      dietary === opt.id
                        ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xs"
                        : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-[#1A1715]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <span className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-1.5">
                Budget Range
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "any", label: "Any" },
                  { id: "budget", label: "Under ₹250" },
                  { id: "mid", label: "₹250 - ₹500" },
                  { id: "luxury", label: "₹500+" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setBudgetTier(tier.id as any);
                      setPickedIndex(0);
                    }}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      budgetTier === tier.id
                        ? "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-xs"
                        : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-[#FF4D2D]"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dish Reveal Card */}
          {activeDish ? (
            <div
              className={`rounded-3xl bg-white border border-[#EBE5DF] shadow-md overflow-hidden transition-all duration-300 ${
                isSpinning ? "opacity-50 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {/* Dish Image */}
              <div className="relative h-48 w-full bg-[#F3EFEA]">
                <Image
                  src={activeDish.image}
                  alt={activeDish.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 bg-[#FF4D2D] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  CHEF’S SURPRISE PICK
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[200px]">
                    {activeDish.restaurantName}
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[#FFD700] text-xs font-bold">
                    <Star className="w-3 h-3 fill-[#FFD700]" />
                    <span>{activeDish.rating}</span>
                  </div>
                </div>
              </div>

              {/* Dish Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-bold text-[#1A1715]">
                    {activeDish.name}
                  </h4>
                  <span className="text-base font-black text-[#FF4D2D]">
                    ₹{activeDish.price}
                  </span>
                </div>

                <p className="text-xs text-[#766E65] leading-relaxed line-clamp-2">
                  {activeDish.description}
                </p>

                {/* Why this pick explanation */}
                <div className="p-3 rounded-2xl bg-[#FFF1EE] border border-[#FF4D2D]/20 text-xs text-[#FF4D2D] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1A1715] block">Why we chose this:</strong>
                    <span>
                      Rated {activeDish.rating}★ with {activeDish.prepTimeMinutes} mins prep. Fits your{" "}
                      {dietary === "all" ? "flavor" : dietary} preference within {budgetTier === "any" ? "our menu" : budgetTier} pricing.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EBE5DF] space-y-2">
              <p className="text-sm font-bold text-[#1A1715]">No items matched these exact filters</p>
              <p className="text-xs text-[#766E65]">Try switching to Any Budget or All Diets to reveal more options.</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSpinAgain}
              disabled={candidateDishes.length <= 1}
              className="flex-1 py-3 px-4 rounded-2xl border border-[#E5DDD4] hover:bg-[#F3EFEA] text-[#1A1715] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 text-[#FF4D2D] ${isSpinning ? "animate-spin" : ""}`} />
              <span>Try Another Pick ({candidateDishes.length} options)</span>
            </button>

            {activeDish && (
              <button
                onClick={(e) => {
                  onAddToCart(activeDish, e);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ₹{activeDish.price}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
