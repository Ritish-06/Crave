"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  Copy,
  Check,
  Plus,
  ThumbsUp,
  ArrowRight,
  X,
  Share2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Restaurant } from "@/types";

interface GroupDecisionModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
}

export function GroupDecisionModal({
  restaurants,
  isOpen,
  onClose,
}: GroupDecisionModalProps) {
  const router = useRouter();
  const [sessionCode] = useState("VOTE-CRAVE-412");
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({
    "rst-1": 4, // The Truffle & Brioche Co.
    "rst-2": 3, // Osteria Napoli & Woodfire
    "rst-3": 2, // Dum Safar & Dastarkhwan
  });
  const [hasVoted, setHasVoted] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Find leader
  let leaderId = "rst-1";
  let maxVotes = 0;
  Object.entries(votes).forEach(([id, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      leaderId = id;
    }
  });

  const leaderRestaurant = restaurants.find((r) => r.id === leaderId) || restaurants[0];

  const handleCastVote = (restaurantId: string) => {
    setVotes((prev) => ({
      ...prev,
      [restaurantId]: (prev[restaurantId] || 0) + 1,
    }));
    setHasVoted(restaurantId);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/restaurants?voteSession=${sessionCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartGroupOrder = () => {
    onClose();
    router.push("/group-order");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-[#140E0A] text-white flex items-center justify-between border-b border-[#2A1F18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D2D]/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4D2D] bg-[#1C1511] px-2 py-0.5 rounded border border-[#2A1F18]">
                  Group Decision Mode
                </span>
                <span className="text-xs text-[#A3988E]">Room: {sessionCode}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Vote on Today&apos;s Culinary Destination
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1C1511] hover:bg-[#2A1F18] text-[#A3988E] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Share Room Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs">
            <div className="text-xs text-[#554C43] text-center sm:text-left">
              <span className="font-bold text-[#1A1715] block">Invite Friends to Cast Their Vote</span>
              <span>Everyone can vote for their favorite kitchen before ordering</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-[#1A1715] hover:bg-[#2A2420] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Room Link"}</span>
            </button>
          </div>

          {/* Current Leader Banner */}
          {leaderRestaurant && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border border-amber-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Current Leader ({maxVotes} Votes)
                  </span>
                  <h4 className="font-black text-sm text-[#1A1715]">{leaderRestaurant.name}</h4>
                  <p className="text-[11px] text-[#766E65]">{leaderRestaurant.tagline}</p>
                </div>
              </div>
              <button
                onClick={handleStartGroupOrder}
                className="px-4 py-2 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Restaurant Voting Candidates List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#766E65] block">
              Candidate Kitchens ({restaurants.length})
            </span>

            {restaurants.map((rst) => {
              const voteCount = votes[rst.id] || 0;
              const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              const isVotedByMe = hasVoted === rst.id;

              return (
                <div
                  key={rst.id}
                  className="p-4 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs space-y-3 hover:border-[#FF4D2D]/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0">
                        <Image src={rst.logoImage} alt={rst.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1715]">{rst.name}</h4>
                        <span className="text-xs text-[#766E65]">
                          {rst.city} • {rst.cuisine.slice(0, 2).join(", ")}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCastVote(rst.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isVotedByMe
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-[#FFF1EE] text-[#FF4D2D] hover:bg-[#FFE5E0] border border-[#FFD9D1]"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isVotedByMe ? "Voted" : "+1 Vote"}</span>
                      <span className="font-black ml-1">({voteCount})</span>
                    </button>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#766E65]">
                      <span>{voteCount} of {totalVotes} votes</span>
                      <span className="font-bold">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#EBE5DF]">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF4D2D] to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EBE5DF] flex items-center justify-between">
          <span className="text-xs text-[#766E65] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>1 vote per participant enforced</span>
          </span>
          <button
            onClick={handleStartGroupOrder}
            className="px-5 py-2.5 rounded-xl bg-[#1A1715] hover:bg-[#2A2420] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed with Group Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
