"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Star,
  Plus,
  Flame,
  Leaf,
  Layers,
  ArrowRight
} from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

interface ChatMessage {
  id: string;
  sender: "sommelier" | "user";
  text: string;
  recommendedDishes?: MenuItem[];
  chips?: string[];
}

export default function AiSommelierPage() {
  const { addItem } = useCart();
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "sommelier",
      text: "Namaste! I am your CRAVE Culinary Sommelier. Tell me your mood, dietary preferences, or budget, and I will recommend dishes from our Michelin-grade kitchens.",
      chips: [
        "Spicy under ₹250",
        "Pure Vegetarian feast",
        "Cheesy indulgence",
        "Quick bite under 15 mins",
        "Best dessert recommendation"
      ]
    }
  ]);

  // Match menu items based on natural query
  const queryMatcher = (q: string): { responseText: string; dishes: MenuItem[] } => {
    const lower = q.toLowerCase();

    if (lower.includes("spicy") || lower.includes("hot") || lower.includes("chili")) {
      const dishes = MENU_ITEMS.filter((m) => (m.spiceLevel || 1) >= 2 || m.name.toLowerCase().includes("ghost"));
      return {
        responseText: "Here are our boldest, high-heat artisanal creations infused with bhut jolokia, szechuan peppers, and spicy glazes:",
        dishes: dishes.slice(0, 3)
      };
    }

    if (lower.includes("veg") || lower.includes("vegetarian") || lower.includes("plant")) {
      const dishes = MENU_ITEMS.filter((m) => m.dietary === "veg" || m.dietary === "vegan");
      return {
        responseText: "Here are our highest-rated pure vegetarian specialties, including our Margherita D.O.P. and Truffle Quinoa Power Bowl:",
        dishes: dishes.slice(0, 3)
      };
    }

    if (lower.includes("dessert") || lower.includes("sweet") || lower.includes("chocolate")) {
      const dishes = MENU_ITEMS.filter((m) => m.cuisine === "Desserts & Patisserie");
      return {
        responseText: "Here are exceptional French patisseries and molten chocolate gateaux from Maison De Cocoa:",
        dishes: dishes.slice(0, 3)
      };
    }

    if (lower.includes("quick") || lower.includes("fast") || lower.includes("15")) {
      const dishes = MENU_ITEMS.filter((m) => m.prepTimeMinutes <= 15);
      return {
        responseText: "In a hurry? These dishes are prepared fresh and dispatched in 15 minutes or less:",
        dishes: dishes.slice(0, 3)
      };
    }

    if (lower.includes("under 200") || lower.includes("cheap") || lower.includes("200")) {
      const dishes = MENU_ITEMS.filter((m) => m.price <= 200);
      return {
        responseText: "Artisanal culinary bites under ₹200:",
        dishes: dishes.slice(0, 3)
      };
    }

    if (lower.includes("burger") || lower.includes("smash") || lower.includes("wagyu")) {
      const dishes = MENU_ITEMS.filter((m) => m.category === "Burgers");
      return {
        responseText: "Here are our signature smash wagyu burgers! You can also customize them layer-by-layer in our 3D Dish Studio:",
        dishes: dishes.slice(0, 3)
      };
    }

    // Default top rated
    const top = MENU_ITEMS.filter((m) => m.rating >= 4.8);
    return {
      responseText: `I've tailored these top-rated culinary highlights matching "${q}":`,
      dishes: top.slice(0, 3)
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    // Simulate smart sommelier analysis
    setTimeout(() => {
      const result = queryMatcher(text);
      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "sommelier",
        text: result.responseText,
        recommendedDishes: result.dishes,
        chips: [
          "Suggest dessert next",
          "Under ₹200 options",
          "Explore 3D Studio"
        ]
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Sommelier Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EBE5DF]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D2D]/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1A1715] font-sans">
                  CRAVE AI Sommelier
                </h1>
                <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A] px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#766E65]">
                Curated palate advisor querying real menu data & verified allergen charts
              </p>
            </div>
          </div>

          <Link
            href="/studio"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#140E0A] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            <Layers className="w-4 h-4 text-[#FF4D2D]" />
            <span>3D Studio</span>
          </Link>
        </div>

        {/* Chat Stream Window */}
        <div className="bg-white rounded-3xl border border-[#EBE5DF] shadow-xs p-6 min-h-[500px] flex flex-col justify-between space-y-6">
          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === "sommelier"
                      ? "bg-[#FFF1EE] text-[#FF4D2D]"
                      : "bg-[#1A1715] text-white"
                  }`}
                >
                  {m.sender === "sommelier" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Body */}
                <div
                  className={`max-w-xl space-y-3 ${
                    m.sender === "user"
                      ? "bg-[#1A1715] text-white p-4 rounded-3xl rounded-tr-xs"
                      : "bg-[#FAF8F5] text-[#1A1715] p-5 rounded-3xl rounded-tl-xs border border-[#EBE5DF]"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{m.text}</p>

                  {/* Recommended Dish Cards inside Chat */}
                  {m.recommendedDishes && m.recommendedDishes.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      {m.recommendedDishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="p-3 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-between gap-3 shadow-2xs hover:border-[#FFD9D1] transition-all"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F3EFEA] shrink-0">
                            <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#1A1715] truncate">
                              {dish.name}
                            </h4>
                            <p className="text-[11px] text-[#766E65]">{dish.restaurantName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-[#FF4D2D]">₹{dish.price}</span>
                              <span className="text-[10px] text-[#766E65]">★ {dish.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {dish.studioEnabled ? (
                              <Link
                                href="/studio"
                                className="px-2.5 py-1.5 rounded-lg bg-[#140E0A] text-white text-[10px] font-bold"
                              >
                                3D
                              </Link>
                            ) : null}
                            <button
                              onClick={() => addItem(dish)}
                              className="px-3 py-1.5 rounded-lg bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {m.chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(chip)}
                          className="text-[11px] font-bold px-3 py-1 rounded-full bg-white hover:bg-[#FFF5F2] border border-[#E5DDD4] hover:border-[#FFD9D1] text-[#766E65] hover:text-[#FF4D2D] transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-3 border-t border-[#EBE5DF]"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask the Sommelier: 'Recommend a spicy dinner under ₹300' or 'Suggest sweet indulgence'..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs sm:text-sm text-[#1A1715] font-medium outline-none focus:border-[#FF4D2D]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
