"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Clock, Flame, ShieldAlert, ShoppingBag, Sparkles } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

interface DishQuickViewModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export function DishQuickViewModal({ dish, onClose }: DishQuickViewModalProps) {
  const { addItem } = useCart();

  if (!dish) return null;

  const handleAdd = () => {
    addItem(dish);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Banner Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#1C1511]">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4D2D] bg-[#140E0A]/80 px-2.5 py-1 rounded-md backdrop-blur-xs">
              {dish.cuisine}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-tight">
              {dish.name}
            </h2>
            <p className="text-xs text-[#E5DDD4] mt-0.5">
              by <strong className="text-white">{dish.restaurantName}</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Tagline & Description */}
          <div>
            <p className="text-sm font-semibold text-[#1A1715]">{dish.tagline}</p>
            <p className="text-xs text-[#665E57] leading-relaxed mt-1">{dish.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#EBE5DF] text-center">
            <div className="p-2 rounded-xl bg-white border border-[#EBE5DF]">
              <div className="flex items-center justify-center gap-1 text-[#FF4D2D] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#FF4D2D]" />
                <span>{dish.rating}</span>
              </div>
              <p className="text-[10px] text-[#766E65] mt-0.5">{dish.reviewCount} reviews</p>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#EBE5DF]">
              <div className="flex items-center justify-center gap-1 text-[#1A1715] text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-[#766E65]" />
                <span>{dish.prepTimeMinutes} mins</span>
              </div>
              <p className="text-[10px] text-[#766E65] mt-0.5">Preparation time</p>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#EBE5DF]">
              <div className="flex items-center justify-center gap-1 text-[#1A1715] text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>{dish.calories || 520} kcal</span>
              </div>
              <p className="text-[10px] text-[#766E65] mt-0.5">Calories</p>
            </div>
          </div>

          {/* Allergens */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#FFF5F2] border border-[#FFD9D1] flex items-start gap-2.5 text-xs text-[#9E3152]">
              <ShieldAlert className="w-4 h-4 text-[#FF4D2D] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#FF4D2D]">Verified Allergens:</span> Contains {dish.allergens.join(", ")}.
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            {dish.studioEnabled ? (
              <Link
                href="/studio"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-[#140E0A] hover:bg-black text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
                <span>Open in 3D Studio</span>
              </Link>
            ) : null}

            <button
              onClick={handleAdd}
              className="flex-1 py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{dish.price}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
