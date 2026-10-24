"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Plus,
  Eye,
  Layers,
  Flame,
  ChevronRight
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuItem } from "@/types";
import { ALL_MENU_ITEMS } from "@/data/menuData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalFoodGalleryProps {
  onQuickView: (dish: MenuItem) => void;
  onAddToCart: (dish: MenuItem, e: React.MouseEvent) => void;
}

export function HorizontalFoodGallery({
  onQuickView,
  onAddToCart,
}: HorizontalFoodGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Curate 6 signature showstopper dishes across different culinary genres
  const featuredDishes: { dish: MenuItem; tag: string; bgGradient: string }[] = [
    {
      dish: ALL_MENU_ITEMS[0], // Truffle Wagyu Double Smash Burger
      tag: "FLAGSHIP 3D SMASH",
      bgGradient: "from-[#FF4D2D]/20 via-[#1C1511] to-[#140E0A]",
    },
    {
      dish: ALL_MENU_ITEMS[1], // Margherita D.O.P. Woodfired Pizza
      tag: "WOODFIRED D.O.P.",
      bgGradient: "from-amber-600/20 via-[#1C1511] to-[#140E0A]",
    },
    {
      dish: ALL_MENU_ITEMS[4], // Signature Butter Chicken Bao
      tag: "ASIAN PAN-FUSION",
      bgGradient: "from-orange-600/20 via-[#1C1511] to-[#140E0A]",
    },
    {
      dish: ALL_MENU_ITEMS[2], // Nizami Subz & Paneer Dum Biryani
      tag: "ROYAL DUM SAFAR",
      bgGradient: "from-emerald-600/20 via-[#1C1511] to-[#140E0A]",
    },
    {
      dish: ALL_MENU_ITEMS[5], // Organic Quinoa Avocado Bowl
      tag: "CLEAN BOTANICA",
      bgGradient: "from-teal-600/20 via-[#1C1511] to-[#140E0A]",
    },
    {
      dish: ALL_MENU_ITEMS[3], // Belgian Dark Chocolate Soufflé
      tag: "FRENCH PATISSERIE",
      bgGradient: "from-rose-600/20 via-[#1C1511] to-[#140E0A]",
    },
  ];

  useEffect(() => {
    // Only enable GSAP horizontal scrub on desktop screens (min-width: 1024px)
    // to preserve smooth native touch scrolling on mobile devices
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion || !sectionRef.current || !trackRef.current) {
      return;
    }

    const track = trackRef.current;
    const section = sectionRef.current;

    // Calculate total horizontal travel distance
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(trackWidth - viewportWidth + 80);
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#140E0A] text-white py-20 lg:py-28 overflow-hidden border-y border-[#2A1F18]"
    >
      {/* Background Ambience Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF4D2D]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 lg:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs font-bold text-[#FF4D2D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SCROLL-DRIVEN SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-white uppercase">
              YOUR NEXT CRAVING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] via-[#FFA384] to-[#FF6B4E]">
                IS WAITING.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#A3988E] max-w-xl font-normal">
              Scroll through hand-selected master creations from India&apos;s most celebrated artisanal culinary kitchens.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-[#A3988E] bg-[#1C1511] px-4 py-2 rounded-2xl border border-[#2A1F18]">
            <span>Scroll vertically to glide horizontal</span>
            <ChevronRight className="w-4 h-4 text-[#FF4D2D] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Horizontal Track Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-none snap-x snap-mandatory lg:snap-none px-4 sm:px-6 lg:px-8"
      >
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 items-stretch w-max"
        >
          {featuredDishes.map(({ dish, tag, bgGradient }, index) => (
            <div
              key={dish.id}
              className="w-[310px] sm:w-[390px] lg:w-[440px] shrink-0 rounded-3xl bg-gradient-to-b from-[#1C1511] to-[#120D0A] border border-[#2A1F18] p-5 sm:p-6 flex flex-col justify-between hover:border-[#FF4D2D]/50 transition-all duration-300 shadow-2xl group snap-center"
            >
              {/* Top Image Showcase */}
              <div className="space-y-4">
                <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-[#140E0A]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Tag & Dietary Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-black uppercase text-[#FF4D2D] tracking-wider border border-white/10">
                      {tag}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase text-white ${
                        dish.dietary === "veg" ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    >
                      {dish.dietary}
                    </span>
                  </div>

                  {/* 3D Studio Indicator */}
                  {dish.studioEnabled && (
                    <div className="absolute top-3.5 right-3.5">
                      <Link
                        href="/studio"
                        className="px-2.5 py-1 rounded-lg bg-[#FF4D2D] text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md hover:bg-[#E03A1A] transition-colors"
                      >
                        <Layers className="w-3 h-3" />
                        <span>3D STUDIO</span>
                      </Link>
                    </div>
                  )}

                  {/* Kitchen & Rating Pill */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold text-[#E5DDD4] truncate max-w-[200px]">
                      {dish.restaurantName}
                    </span>
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[#FFD700] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#FFD700]" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#FF4D2D] transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3988E] line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#766E65] pt-1">
                    <span className="flex items-center gap-1 text-[#C4B7AC]">
                      <Clock className="w-3 h-3 text-[#FF4D2D]" />
                      {dish.prepTimeMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="text-[#C4B7AC]">{dish.calories || 550} kcal</span>
                    <span>•</span>
                    <span className="text-[#C4B7AC]">{dish.cuisine}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-5 mt-4 border-t border-[#2A1F18] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-white">₹{dish.price}</span>
                    {dish.originalPrice && (
                      <span className="text-xs text-[#766E65] line-through">
                        ₹{dish.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#A3988E]">Artisanal portion</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(dish)}
                    className="p-2.5 rounded-xl bg-[#2A1F18] hover:bg-[#3D2C22] text-[#E5DDD4] transition-colors cursor-pointer"
                    title="Quick view dish details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => onAddToCart(dish, e)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
