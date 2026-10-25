"use client";

import React from "react";
import {
  Heart,
  Flame,
  Leaf,
  Sparkles,
  Zap,
  Crown,
  MapPin,
  X,
  Compass
} from "lucide-react";

export type MoodId =
  | "all"
  | "comfort"
  | "spicy"
  | "fresh"
  | "sweet"
  | "midnight"
  | "treat"
  | "local";

export interface MoodOption {
  id: MoodId;
  title: string;
  tagline: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  accentBorder: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "comfort",
    title: "Comfort Mode",
    tagline: "Burgers, fries & artisanal pizza",
    badge: "Warm Hug",
    icon: Heart,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 hover:bg-amber-500/20",
    accentBorder: "border-amber-400/40",
  },
  {
    id: "spicy",
    title: "Need Something Spicy",
    tagline: "Ghost pepper, fiery curries & wings",
    badge: "Assamese Heat",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
    accentBorder: "border-red-400/40",
  },
  {
    id: "fresh",
    title: "Light & Fresh",
    tagline: "Organic bowls, burrata & clean greens",
    badge: "Farm Clean",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
    accentBorder: "border-emerald-400/40",
  },
  {
    id: "sweet",
    title: "Sweet Escape",
    tagline: "Valrhona chocolate, tarts & gelato",
    badge: "Pure Bliss",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
    accentBorder: "border-purple-400/40",
  },
  {
    id: "midnight",
    title: "Midnight Cravings",
    tagline: "Crispy bites, loaded fries & late snacks",
    badge: "Late Night",
    icon: Zap,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10 hover:bg-sky-500/20",
    accentBorder: "border-sky-400/40",
  },
  {
    id: "treat",
    title: "Treat Yourself",
    tagline: "Double wagyu, summer truffle & caviar",
    badge: "Michelin Spec",
    icon: Crown,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
    accentBorder: "border-yellow-400/40",
  },
  {
    id: "local",
    title: "Local Favourites",
    tagline: "Royal Awadhi dum biryani & kebabs",
    badge: "Authentic Desi",
    icon: MapPin,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
    accentBorder: "border-orange-400/40",
  },
];

interface MoodToMealProps {
  selectedMood: MoodId;
  onSelectMood: (moodId: MoodId) => void;
  matchingCount: number;
}

export function MoodToMeal({
  selectedMood,
  onSelectMood,
  matchingCount,
}: MoodToMealProps) {
  const activeMoodObj = MOOD_OPTIONS.find((m) => m.id === selectedMood);

  return (
    <section className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Emotional Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] mt-1">
            What’s your vibe today?
          </h2>
          <p className="text-xs sm:text-sm text-[#766E65] mt-0.5">
            Discover food based on how you feel. Tap any mood to instantly tailor your dish recommendations.
          </p>
        </div>

        {selectedMood !== "all" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#766E65]">
              {matchingCount} dishes match:
            </span>
            <button
              onClick={() => onSelectMood("all")}
              className="px-3 py-1.5 rounded-full bg-[#1A1715] text-white hover:bg-[#FF4D2D] transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{activeMoodObj?.title}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontally Scrollable Mood Cards */}
      <div className="overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 min-w-max sm:min-w-0">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            const Icon = mood.icon;

            return (
              <button
                key={mood.id}
                onClick={() => onSelectMood(isSelected ? "all" : mood.id)}
                className={`w-44 sm:w-auto p-4 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between h-38 cursor-pointer group relative overflow-hidden shrink-0 ${
                  isSelected
                    ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xl scale-[1.02] ring-2 ring-[#FF4D2D]"
                    : `${mood.bgColor} ${mood.accentBorder} text-[#1A1715] hover:scale-102 hover:shadow-md`
                }`}
              >
                {/* Header Icon & Tag */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-2 rounded-2xl ${
                      isSelected ? "bg-white/20 text-white" : "bg-white shadow-xs"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : mood.color}`} />
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#FF4D2D] text-white"
                        : "bg-white/90 text-[#766E65] shadow-2xs"
                    }`}
                  >
                    {mood.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-2">
                  <h4 className="text-xs sm:text-sm font-black line-clamp-1">{mood.title}</h4>
                  <p
                    className={`text-[10px] mt-0.5 line-clamp-2 leading-tight ${
                      isSelected ? "text-white/70" : "text-[#766E65]"
                    }`}
                  >
                    {mood.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
