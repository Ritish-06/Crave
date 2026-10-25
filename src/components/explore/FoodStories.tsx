"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame,
  Award,
  Clock
} from "lucide-react";
import { MenuItem } from "@/types";

export interface FoodStory {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  chef: string;
  kitchen: string;
  city: string;
  readTime: string;
  image: string;
  dishId: string;
  dishName: string;
  price: number;
}

export const FOOD_STORIES: FoodStory[] = [
  {
    id: "story-1",
    title: "The 72-Hour Sourdough Fermentation Secret",
    subtitle: "Why cold-fermenting organic Italian flour creates that legendary airy, leopard-spotted crust without gluten bloat.",
    category: "CHEF'S CRAFT",
    chef: "Chef Lorenzo V.",
    kitchen: "Crust & Co. Woodfired",
    city: "Indiranagar, Bengaluru",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    dishId: "dish-pizza-1",
    dishName: "Burrata Margherita D.O.P.",
    price: 549,
  },
  {
    id: "story-2",
    title: "The Royal Dum Safar: Sealed Earthen Handis",
    subtitle: "A 400-year-old Nizami technique where aged basmati and marinated gosht cook in their own botanical steam.",
    category: "ROYAL HERITAGE",
    chef: "Ustad Karimuddin",
    kitchen: "Dum Safar Awadhi Kitchen",
    city: "Banjara Hills, Hyderabad",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    dishId: "dish-biryani-1",
    dishName: "Royal Awadhi Gosht Dum Biryani",
    price: 589,
  },
  {
    id: "story-3",
    title: "The Physics of the Crispy Wagyu Smash Lip",
    subtitle: "Hitting a 350°C cast-iron plancha with 10kg of pressure to crystallize the savory Maillard crust edges.",
    category: "SCIENCE OF FLAVOR",
    chef: "Chef Aarav Singhania",
    kitchen: "The Truffle & Brioche Co.",
    city: "Bandra West, Mumbai",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    dishId: "dish-burger-1",
    dishName: "The Truffle Wagyu Smash",
    price: 389,
  },
  {
    id: "story-4",
    title: "Single-Origin Valrhona: Tempered at 31°C",
    subtitle: "Behind the mirror-gloss ganache tarts crafted from Madagascar cacao beans and French Isigny butter.",
    category: "PATISSERIE ART",
    chef: "Chef Chloé Dubois",
    kitchen: "Le Cacao & Vanille",
    city: "Koregaon Park, Pune",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    dishId: "dish-dessert-1",
    dishName: "Valrhona Dark Chocolate Ganache Tart",
    price: 320,
  },
];

interface FoodStoriesProps {
  onTasteDish: (dishId: string) => void;
}

export function FoodStories({ onTasteDish }: FoodStoriesProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] mt-1">
            A Little Inspiration for Your Next Bite
          </h2>
          <p className="text-xs sm:text-sm text-[#766E65] mt-0.5">
            Step behind the kitchen doors into the heritage, sourcing, and science of our flagship creations.
          </p>
        </div>

        <Link
          href="/restaurants"
          className="text-xs font-bold text-[#FF4D2D] hover:underline flex items-center gap-1"
        >
          <span>Meet the 6 Partner Kitchens</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FOOD_STORIES.map((story) => (
          <div
            key={story.id}
            className="group rounded-3xl bg-white border border-[#EBE5DF] hover:border-[#D5CDC4] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Photo Stage */}
              <div className="relative h-64 w-full overflow-hidden bg-[#1C1511]">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Category & Read Time */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#FF4D2D] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                    {story.category}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFA384]" />
                    {story.readTime}
                  </span>
                </div>

                {/* Bottom Story Header */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-semibold text-[#FFA384] block">
                    {story.chef} • {story.kitchen} ({story.city})
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-1 leading-snug drop-shadow-sm">
                    {story.title}
                  </h3>
                </div>
              </div>

              {/* Story Excerpt */}
              <div className="p-5 space-y-3">
                <p className="text-xs sm:text-sm text-[#766E65] leading-relaxed">
                  {story.subtitle}
                </p>

                {/* Associated Dish Badge */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#9E948C] uppercase tracking-wider block">
                      Featured Creation
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#1A1715]">
                      {story.dishName}
                    </span>
                  </div>
                  <span className="font-black text-sm text-[#FF4D2D]">
                    ₹{story.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="px-5 pb-5 pt-0 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E948C]">
                Verified Recipe
              </span>
              <button
                onClick={() => onTasteDish(story.dishId)}
                className="px-4 py-2 rounded-xl bg-[#1A1715] hover:bg-[#FF4D2D] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Taste This Dish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
