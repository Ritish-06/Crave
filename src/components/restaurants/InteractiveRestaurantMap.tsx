"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  ChevronRight,
  Crosshair,
  Layers,
  Compass,
  ArrowRight,
  X
} from "lucide-react";
import { Restaurant } from "@/types";

interface InteractiveRestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewMenu: (restaurant: Restaurant) => void;
}

export function InteractiveRestaurantMap({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  onViewMenu,
}: InteractiveRestaurantMapProps) {
  const [activeCity, setActiveCity] = useState<string>("All");
  const [hoveredPin, setHoveredPin] = useState<Restaurant | null>(null);

  const cities = ["All", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "New Delhi", "Gurugram"];

  const filteredPins = activeCity === "All"
    ? restaurants
    : restaurants.filter((r) => r.city === activeCity);

  // SVG coordinate projection mapping India bounds roughly
  // Min Lat: 12.0, Max Lat: 29.0
  // Min Lng: 72.0, Max Lng: 79.0
  const projectCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    const minLat = 11.5;
    const maxLat = 29.5;
    const minLng = 71.5;
    const maxLng = 79.5;

    // Y is inverted because SVG Y starts at top
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;
    return { x, y };
  };

  const activeRestaurant = restaurants.find((r) => r.id === selectedRestaurantId) || hoveredPin;

  return (
    <div className="rounded-3xl bg-[#140E0A] text-white border border-[#2A1F18] overflow-hidden shadow-2xl relative">
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-[#2A1F18] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1C1511]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF4D2D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D2D]/30">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Interactive CRAVE Logistics Map</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[11px] text-[#A3988E]">
              Pinpoint verified artisanal kitchens with live delivery coverage & coordinates
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCity === city
                  ? "bg-[#FF4D2D] text-white shadow-md"
                  : "bg-[#2A1F18] text-[#A3988E] hover:text-white"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] relative">
        {/* Left Map Canvas */}
        <div className="lg:col-span-8 relative h-[360px] sm:h-[460px] bg-[#120D0A] overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid / Radar Texture */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF4D2D_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#120D0A]/40 to-[#120D0A]" />

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-30">
            <Compass className="w-16 h-16 text-[#FF4D2D]" />
          </div>

          {/* Map Vector Graphic */}
          <svg className="w-full h-full max-w-2xl max-h-96" viewBox="0 0 100 100">
            {/* National Logistics Mesh Outline */}
            <path
              d="M 25 15 L 75 18 L 85 45 L 70 82 L 40 88 L 15 55 Z"
              fill="none"
              stroke="#2A1F18"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />

            {/* Connecting Delivery Corridors */}
            {filteredPins.map((r, i) => {
              const pos = projectCoordinates(r.lat, r.lng);
              const nextR = filteredPins[(i + 1) % filteredPins.length];
              const nextPos = projectCoordinates(nextR.lat, nextR.lng);
              return (
                <line
                  key={`line-${r.id}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={nextPos.x}
                  y2={nextPos.y}
                  stroke="#FF4D2D"
                  strokeWidth="0.3"
                  strokeOpacity="0.4"
                  strokeDasharray="1,1.5"
                />
              );
            })}

            {/* Interactive Pins */}
            {filteredPins.map((r) => {
              const pos = projectCoordinates(r.lat, r.lng);
              const isSelected = r.id === selectedRestaurantId || r.id === activeRestaurant?.id;

              return (
                <g
                  key={r.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => onSelectRestaurant(r)}
                  onMouseEnter={() => setHoveredPin(r)}
                >
                  {/* Outer Pulsing Ring */}
                  {isSelected && (
                    <circle
                      r="4.5"
                      fill="none"
                      stroke="#FF4D2D"
                      strokeWidth="0.6"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Pin Background Ring */}
                  <circle
                    r={isSelected ? "3.2" : "2.4"}
                    fill={isSelected ? "#FF4D2D" : "#1C1511"}
                    stroke={isSelected ? "#FFFFFF" : "#FF4D2D"}
                    strokeWidth="0.6"
                    className="transition-all duration-300"
                  />

                  {/* Center Dot */}
                  <circle
                    r="1"
                    fill={isSelected ? "#FFFFFF" : "#FF4D2D"}
                  />

                  {/* Label */}
                  <text
                    y="-4"
                    textAnchor="middle"
                    fill={isSelected ? "#FFFFFF" : "#A3988E"}
                    fontSize="2.4"
                    fontWeight="bold"
                    className="select-none pointer-events-none drop-shadow-sm font-sans"
                  >
                    {r.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Status Bar */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-[#1C1511]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2A1F18] text-xs text-[#A3988E]">
            <Crosshair className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>Click any pin to inspect kitchen</span>
          </div>
        </div>

        {/* Right Active Kitchen Preview Panel */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#2A1F18] p-5 sm:p-6 bg-[#16100C] flex flex-col justify-between">
          {activeRestaurant ? (
            <div className="space-y-4">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#1C1511]">
                <Image
                  src={activeRestaurant.coverImage}
                  alt={activeRestaurant.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#FF4D2D] text-white text-[10px] font-bold">
                  {activeRestaurant.city} • {activeRestaurant.distanceKm || 2.4} km away
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-bold truncate max-w-[180px]">{activeRestaurant.name}</span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[#FFD700] font-bold">
                    <Star className="w-3 h-3 fill-[#FFD700]" />
                    <span>{activeRestaurant.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-black text-white">{activeRestaurant.name}</h4>
                <p className="text-xs text-[#A3988E] line-clamp-1">{activeRestaurant.tagline}</p>
                <p className="text-[11px] text-[#766E65]">{activeRestaurant.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#2A1F18]">
                <div className="p-2 rounded-xl bg-[#1C1511] border border-[#2A1F18]">
                  <span className="text-[10px] text-[#A3988E] block">Cost for Two</span>
                  <strong className="text-white">₹{activeRestaurant.priceForTwo}</strong>
                </div>
                <div className="p-2 rounded-xl bg-[#1C1511] border border-[#2A1F18]">
                  <span className="text-[10px] text-[#A3988E] block">Delivery SLA</span>
                  <strong className="text-emerald-400">~{activeRestaurant.prepTimeMinutes} mins</strong>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-[#FF4D2D] tracking-wider block">
                  Active Offers:
                </span>
                <p className="text-xs text-[#E5DDD4] bg-[#2A1F18] p-2 rounded-xl border border-[#3D2C22]">
                  {activeRestaurant.offers[0] || "20% OFF with CRAVEFIRST"}
                </p>
              </div>

              <button
                onClick={() => onViewMenu(activeRestaurant)}
                className="w-full py-3 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                <span>View Full Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-[#A3988E]">
              <MapPin className="w-10 h-10 text-[#FF4D2D]/60 animate-bounce" />
              <h4 className="text-sm font-bold text-white">Select a Restaurant Pin</h4>
              <p className="text-xs">
                Hover or click any marker on the map to inspect culinary details and distance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
