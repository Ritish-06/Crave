"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  Clock,
  Flame,
  Check,
  ShoppingBag,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { MenuItem } from "@/types";
import { MENU_ITEMS } from "@/data/menuData";

interface DishComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, e: React.MouseEvent) => void;
}

export function DishComparisonModal({
  isOpen,
  onClose,
  onAddToCart,
}: DishComparisonModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<"burgers" | "biryani" | "pizza" | "dessert">("burgers");

  if (!isOpen) return null;

  // Filter comparison sets
  const comparisonSets: Record<string, MenuItem[]> = {
    burgers: MENU_ITEMS.filter((m) => m.category.includes("Burger") || m.name.toLowerCase().includes("burger")).slice(0, 3),
    biryani: MENU_ITEMS.filter((m) => m.category.includes("Biryani") || m.name.toLowerCase().includes("biryani")).slice(0, 3),
    pizza: MENU_ITEMS.filter((m) => m.category.includes("Pizza") || m.name.toLowerCase().includes("margherita") || m.cuisine === "Woodfired Pizza").slice(0, 3),
    dessert: MENU_ITEMS.filter((m) => m.cuisine.includes("Dessert") || m.category.includes("Dessert")).slice(0, 3),
  };

  const dishes = comparisonSets[selectedCategory] || comparisonSets.burgers;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#EBE5DF] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EBE5DF] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFF1EE] text-[#FF4D2D] px-2 py-0.5 rounded-md">
                Dish-First Discovery
              </span>
              <h3 className="text-lg font-black text-[#1A1715]">
                Cross-Kitchen Dish Comparison
              </h3>
            </div>
            <p className="text-xs text-[#766E65] mt-0.5">
              Compare prices, prep times, calorie counts, and chef specs side-by-side
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#766E65] hover:text-[#1A1715] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#EBE5DF] flex gap-2 overflow-x-auto">
          {[
            { id: "burgers", label: "🍔 Smash Burgers" },
            { id: "biryani", label: "🥘 Royal Dum Biryanis" },
            { id: "pizza", label: "🍕 Woodfired Pizzas" },
            { id: "dessert", label: "🍫 Haute Patisserie" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xs"
                  : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-[#1A1715]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Comparison Matrix Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="rounded-3xl bg-white border border-[#EBE5DF] shadow-xs p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Photo & Badges */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#F3EFEA]">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {dish.dietary === "veg" ? (
                        <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center border border-emerald-600 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center border border-red-600 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-red-600" />
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-xs font-bold">
                      ₹{dish.price}
                    </div>
                  </div>

                  {/* Title & Kitchen */}
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1715] line-clamp-1">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-[#766E65] font-medium truncate mt-0.5">
                      {dish.restaurantName}
                    </p>
                  </div>

                  {/* Comparison Spec Matrix */}
                  <div className="space-y-2 text-xs border-t border-[#F3EFEA] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9E948C]">Customer Rating:</span>
                      <span className="font-bold text-[#1A1715] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                        {dish.rating} ({dish.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9E948C]">Prep Time:</span>
                      <span className="font-bold text-[#1A1715] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        {dish.prepTimeMinutes} mins
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9E948C]">Calories:</span>
                      <span className="font-bold text-[#1A1715]">
                        {dish.calories || 480} kcal
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9E948C]">3D Customization:</span>
                      <span className={`font-bold ${dish.studioEnabled ? "text-emerald-600" : "text-[#9E948C]"}`}>
                        {dish.studioEnabled ? "Supported 3D" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={(e) => {
                    onAddToCart(dish, e);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose This • ₹{dish.price}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
