"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  RotateCw,
  ArrowRight,
  X,
  Layers,
  MapPin
} from "lucide-react";
import { Restaurant } from "@/types";

interface SurpriseMeModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onViewMenu: (restaurant: Restaurant) => void;
}

export function SurpriseMeModal({
  restaurants,
  isOpen,
  onClose,
  onViewMenu,
}: SurpriseMeModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen || restaurants.length === 0) return null;

  const currentRestaurant = restaurants[selectedIndex % restaurants.length];

  const handlePickRandom = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % restaurants.length);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * restaurants.length);
        setSelectedIndex(finalIdx);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto text-center space-y-5 p-6 sm:p-8 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white border border-[#EBE5DF] text-[#766E65] hover:text-[#1A1715] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="space-y-2 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF1EE] text-[#FF4D2D] mx-auto flex items-center justify-center shadow-md">
            <Sparkles className={`w-8 h-8 ${isSpinning ? "animate-spin" : ""}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#FF4D2D] uppercase tracking-wider block">
              Curated Surprise Selection
            </span>
            <h2 className="text-2xl font-black text-[#1A1715]">
              Chef&apos;s Pick for Your Palate
            </h2>
          </div>
        </div>

        {/* Restaurant Card Preview */}
        <div className="rounded-2xl overflow-hidden bg-white border border-[#EBE5DF] shadow-md text-left transition-all">
          <div className="relative h-44 w-full bg-[#1C1511]">
            <Image
              src={currentRestaurant.coverImage}
              alt={currentRestaurant.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#FF4D2D] text-white text-[10px] font-bold">
              {currentRestaurant.city}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="font-bold truncate max-w-[200px]">{currentRestaurant.name}</span>
              <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[#FFD700] font-bold">
                <Star className="w-3 h-3 fill-[#FFD700]" />
                <span>{currentRestaurant.rating}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <p className="text-xs text-[#766E65]">{currentRestaurant.tagline}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#9E948C]">
              <span>~{currentRestaurant.prepTimeMinutes} mins delivery</span>
              <span>•</span>
              <span>₹{currentRestaurant.priceForTwo} for two</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">
                {currentRestaurant.deliveryFee === 0 ? "Free Delivery" : `₹${currentRestaurant.deliveryFee} fee`}
              </span>
            </div>

            {currentRestaurant.offers[0] && (
              <p className="text-[11px] text-[#FF4D2D] font-bold bg-[#FFF1EE] px-2.5 py-1 rounded-lg">
                Offer: {currentRestaurant.offers[0]}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePickRandom}
            disabled={isSpinning}
            className="flex-1 py-3 rounded-2xl bg-white border border-[#E5DDD4] font-bold text-xs text-[#1A1715] hover:bg-[#F3EFEA] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
            <span>Spin Again</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewMenu(currentRestaurant);
            }}
            className="flex-1 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs hover:bg-[#E03A1A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
