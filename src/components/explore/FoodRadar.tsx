"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  Compass,
  Layers,
  ChevronRight
} from "lucide-react";
import { RESTAURANTS_DATA } from "@/data/restaurantsData";
import { Restaurant } from "@/types";

interface FoodRadarProps {
  onSelectKitchen?: (restaurantId: string) => void;
}

export function FoodRadar({ onSelectKitchen }: FoodRadarProps) {
  const [activeRadarFilter, setActiveRadarFilter] = useState<"all" | "fast" | "highRated" | "freeDelivery">("all");
  const [selectedKitchen, setSelectedKitchen] = useState<Restaurant>(RESTAURANTS_DATA[0]);

  const filteredKitchens = RESTAURANTS_DATA.filter((k) => {
    if (activeRadarFilter === "fast") return k.prepTimeMinutes <= 25;
    if (activeRadarFilter === "highRated") return k.rating >= 4.8;
    if (activeRadarFilter === "freeDelivery") return k.deliveryFee === 0 || k.priceForTwo > k.freeDeliveryThreshold;
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Hyperlocal Logistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] mt-1">
            Good Food Is Closer Than You Think
          </h2>
          <p className="text-xs sm:text-sm text-[#766E65] mt-0.5">
            Verified kitchens across 6 major Indian metro hubs with real delivery estimates and FSSAI audits.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Kitchens" },
            { id: "fast", label: "⚡ Under 25 Mins" },
            { id: "highRated", label: "★ 4.8+ Rated" },
            { id: "freeDelivery", label: "🛵 Free Delivery" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveRadarFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                activeRadarFilter === f.id
                  ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xs"
                  : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-[#1A1715]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Vector Radar Map (Left) */}
        <div className="lg:col-span-7 bg-[#140E0A] rounded-3xl border border-[#2A1F18] p-6 relative overflow-hidden shadow-xl min-h-[380px] flex flex-col justify-between">
          {/* Radar Circles Pattern */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[180px] h-[180px] rounded-full border border-[#FF4D2D]/20 animate-ping duration-1000" />
            <div className="w-[300px] h-[300px] rounded-full border border-white/5" />
            <div className="w-[440px] h-[440px] rounded-full border border-white/5" />
            <div className="w-[580px] h-[580px] rounded-full border border-white/5" />
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-white/5" />
            <div className="absolute h-full w-[1px] bg-white/5" />
          </div>

          {/* Top Radar Status */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Active Metro Fleet Live
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold">
              6 Verified Hubs Mapped
            </span>
          </div>

          {/* Interactive Kitchen Pins Scattered on Vector Radar */}
          <div className="relative z-10 my-auto py-8 flex flex-wrap gap-3 justify-center">
            {filteredKitchens.map((k, idx) => {
              const isSelected = selectedKitchen.id === k.id;
              return (
                <button
                  key={k.id}
                  onClick={() => setSelectedKitchen(k)}
                  className={`p-3 rounded-2xl border transition-all duration-300 text-left cursor-pointer flex items-center gap-3 backdrop-blur-md ${
                    isSelected
                      ? "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-lg shadow-[#FF4D2D]/40 scale-105"
                      : "bg-[#1C1511]/90 text-white/80 border-[#2A1F18] hover:border-white/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? "bg-white text-[#FF4D2D]" : "bg-[#140E0A] text-white"
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white leading-tight">
                      {k.name}
                    </h5>
                    <span className="text-[10px] opacity-80 block">
                      {k.city} • {k.prepTimeMinutes} mins
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Radar Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-[#A3988E] border-t border-white/10 pt-3">
            <span>Tap any kitchen pin to inspect delivery metrics</span>
            <span className="text-emerald-400 font-bold">● 100% On-Time Delivery SLA</span>
          </div>
        </div>

        {/* Selected Kitchen Deep Dive Card (Right) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EBE5DF] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFF1EE] text-[#FF4D2D] px-2 py-0.5 rounded-md">
                  Active Radar Target
                </span>
                <h3 className="text-xl font-black text-[#1A1715] mt-1">
                  {selectedKitchen.name}
                </h3>
                <p className="text-xs text-[#766E65]">
                  {selectedKitchen.address}, {selectedKitchen.city}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#1A1715] text-[#FFD700] px-2.5 py-1 rounded-xl text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#FFD700]" />
                <span>{selectedKitchen.rating}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
                <span className="text-[#9E948C] block text-[10px] uppercase">Estimated Prep</span>
                <span className="font-bold text-[#1A1715] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  {selectedKitchen.prepTimeMinutes} mins average
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
                <span className="text-[#9E948C] block text-[10px] uppercase">Food Safety</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedKitchen.safetyRating}/5 FSSAI
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
                <span className="text-[#9E948C] block text-[10px] uppercase">Price for Two</span>
                <span className="font-bold text-[#1A1715] mt-0.5 block">
                  ₹{selectedKitchen.priceForTwo}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
                <span className="text-[#9E948C] block text-[10px] uppercase">Delivery Tier</span>
                <span className="font-bold text-[#FF4D2D] mt-0.5 block">
                  {selectedKitchen.deliveryFee === 0 ? "Free Delivery" : `₹${selectedKitchen.deliveryFee} Flat`}
                </span>
              </div>
            </div>

            {/* Featured Dish Pills */}
            <div>
              <span className="text-[11px] font-bold text-[#766E65] uppercase tracking-wider block mb-1.5">
                Kitchen Specialities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedKitchen.featuredDishes.map((dish, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] text-[#1A1715] border border-[#EBE5DF] text-xs font-semibold"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Link */}
          <Link
            href={`/restaurants`}
            className="w-full py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Explore Kitchen & Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
