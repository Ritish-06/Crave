"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Vote,
  CheckCircle2,
  ThumbsUp,
  DollarSign,
  Leaf,
  Flame,
  ArrowRight,
  TrendingUp,
  Users
} from "lucide-react";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";

interface GroupCravingMatchProps {
  onApplyRecommendedCombo: (items: { menuItem: MenuItem; targetParticipantIndex: number }[]) => void;
  participantCount: number;
}

export default function GroupCravingMatch({
  onApplyRecommendedCombo,
  participantCount
}: GroupCravingMatchProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Voting tallies
  const [votes, setVotes] = useState({
    cuisine: "Burgers & Artisanal Bites",
    budget: 400,
    vegCount: 1,
    spiceLevel: "Medium"
  });

  const [hasVoted, setHasVoted] = useState(false);

  // Suggested group combo based on 1 veg + 2 non-veg within ₹400 budget
  const recommendedDishes = [
    {
      role: "Non-Veg Pick (Host)",
      menuItem: ALL_MENU_ITEMS[0], // Truffle Wagyu Double Smash Burger (₹480)
      targetParticipantIndex: 0
    },
    {
      role: "Pure Veg Pick (Priya)",
      menuItem: ALL_MENU_ITEMS[1], // Smoked Burrata Margherita (₹520)
      targetParticipantIndex: 1
    },
    {
      role: "Quick Craving Pick (Rohan)",
      menuItem: ALL_MENU_ITEMS[4], // Signature Butter Chicken Bao (₹380)
      targetParticipantIndex: 2
    }
  ];

  const handleApplyCombo = () => {
    onApplyRecommendedCombo(recommendedDishes);
    setHasVoted(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE5DF] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFEA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#1A1715]">Group Craving Match</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] uppercase">
                Consensus Engine
              </span>
            </div>
            <p className="text-xs text-[#766E65]">
              Stop sharing screenshots. Vote on preferences to find the best restaurant & dish mix for everyone.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-[#FF4D2D] hover:underline self-start sm:self-auto cursor-pointer"
        >
          {isOpen ? "Collapse Matcher" : "Open Matcher"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Voting Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Cuisine Poll */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-[#FF4D2D]" />
                1. Group Cuisine Vote
              </span>
              <div className="space-y-1.5">
                {[
                  { name: "Burgers & Artisanal Bites", votes: 2, pct: 67 },
                  { name: "Wood-Fired Pizza & Pasta", votes: 1, pct: 33 },
                  { name: "Pan-Asian & Dim Sum", votes: 0, pct: 0 }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setVotes({ ...votes, cuisine: c.name })}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      votes.cuisine === c.name
                        ? "bg-[#1A1715] text-white border-[#1A1715]"
                        : "bg-white text-[#766E65] border-[#EBE5DF] hover:border-[#1A1715]"
                    }`}
                  >
                    <div className="flex justify-between font-bold mb-1">
                      <span className="line-clamp-1">{c.name}</span>
                      <span>{c.pct}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FF4D2D] h-full rounded-full transition-all duration-300"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Budget Cap per Person */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#FF4D2D]" />
                2. Target Budget / Person
              </span>
              <div className="space-y-2">
                {[
                  { val: 250, label: "Budget: Under ₹250" },
                  { val: 400, label: "Comfort: Under ₹400" },
                  { val: 650, label: "Celebration: ₹650+" }
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => setVotes({ ...votes, budget: b.val })}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer border ${
                      votes.budget === b.val
                        ? "bg-[#FF4D2D] text-white border-[#FF4D2D]"
                        : "bg-white text-[#766E65] border-[#EBE5DF] hover:border-[#766E65]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Dietary Split */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1715] flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                3. Dietary Requirements
              </span>
              <div className="p-3 bg-white rounded-xl border border-[#EBE5DF] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#766E65]">Pure Veg Diners</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVotes({ ...votes, vegCount: Math.max(0, votes.vegCount - 1) })}
                      className="w-6 h-6 rounded-md bg-[#FAF8F5] border border-[#EBE5DF] font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#16A34A]">{votes.vegCount}</span>
                    <button
                      onClick={() => setVotes({ ...votes, vegCount: Math.min(participantCount, votes.vegCount + 1) })}
                      className="w-6 h-6 rounded-md bg-[#FAF8F5] border border-[#EBE5DF] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#F3EFEA]">
                  <span className="text-[#766E65]">Non-Veg / Flexitarian</span>
                  <span className="font-bold text-[#1A1715]">
                    {Math.max(0, participantCount - votes.vegCount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Match Verdict Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F2] to-[#FAF8F5] border border-[#FFD9D1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF4D2D]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#FF4D2D]">
                  CRAVE Match Consensus: 85% Agreement
                </span>
              </div>
              <p className="text-sm font-bold text-[#1A1715]">
                Truffle Nation Artisanal Kitchen & Bakery
              </p>
              <p className="text-xs text-[#766E65]">
                Satisfies {votes.vegCount} vegetarian diner, 2 meat lovers, and keeps average item cost under ₹{votes.budget}.
              </p>
            </div>

            <button
              onClick={handleApplyCombo}
              className="px-5 py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{hasVoted ? "Combo Applied to Trays ✓" : "Apply Matched Combo to Trays"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
