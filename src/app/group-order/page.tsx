"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Share2,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Calculator,
  UserPlus,
  ShieldCheck,
  Layers
} from "lucide-react";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";
import GroupCravingMatch from "@/components/group/GroupCravingMatch";

interface GroupParticipant {
  id: string;
  name: string;
  avatarColor: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    customizationNote?: string;
  }[];
}

export default function GroupOrderPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [roomCode] = useState("CRAVE-TEAM-942");
  const [copied, setCopied] = useState(false);
  const [splitMode, setSplitMode] = useState<"equal" | "itemized">("equal");
  const [newMemberName, setNewMemberName] = useState("");
  const [activeParticipantId, setActiveParticipantId] = useState("user-1");

  const [participants, setParticipants] = useState<GroupParticipant[]>([
    {
      id: "user-1",
      name: "Ritish (Host)",
      avatarColor: "bg-[#FF4D2D]",
      items: [
        {
          menuItem: ALL_MENU_ITEMS[0], // Truffle Wagyu Double Smash Burger
          quantity: 1,
          customizationNote: "Brioche Bun, Double Patty, Swiss Cheese"
        }
      ]
    },
    {
      id: "user-2",
      name: "Priya M.",
      avatarColor: "bg-emerald-600",
      items: [
        {
          menuItem: ALL_MENU_ITEMS[1], // Smoked Burrata Margherita
          quantity: 1
        }
      ]
    },
    {
      id: "user-3",
      name: "Rohan D.",
      avatarColor: "bg-amber-600",
      items: [
        {
          menuItem: ALL_MENU_ITEMS[4], // Signature Butter Chicken Bao
          quantity: 2
        }
      ]
    }
  ]);

  const copyInviteLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/group-order?room=${roomCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddParticipant = () => {
    if (!newMemberName.trim()) return;
    const colors = ["bg-purple-600", "bg-sky-600", "bg-pink-600", "bg-indigo-600"];
    const newMember: GroupParticipant = {
      id: `user-${Date.now()}`,
      name: newMemberName.trim(),
      avatarColor: colors[participants.length % colors.length],
      items: []
    };
    setParticipants([...participants, newMember]);
    setActiveParticipantId(newMember.id);
    setNewMemberName("");
  };

  const handleAddItemToParticipant = (participantId: string, menuItem: MenuItem) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p;
        const existingIdx = p.items.findIndex((i) => i.menuItem.id === menuItem.id);
        if (existingIdx > -1) {
          const updatedItems = [...p.items];
          updatedItems[existingIdx].quantity += 1;
          return { ...p, items: updatedItems };
        }
        return {
          ...p,
          items: [...p.items, { menuItem, quantity: 1 }]
        };
      })
    );
  };

  const handleRemoveItem = (participantId: string, menuItemId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== participantId) return p;
        return {
          ...p,
          items: p.items.filter((i) => i.menuItem.id !== menuItemId)
        };
      })
    );
  };

  const handleApplyRecommendedCombo = (
    combo: { menuItem: MenuItem; targetParticipantIndex: number }[]
  ) => {
    setParticipants((prev) => {
      const updated = prev.map((p) => ({
        ...p,
        items: [...p.items]
      }));

      combo.forEach(({ menuItem, targetParticipantIndex }) => {
        const target = updated[targetParticipantIndex % updated.length];
        if (target) {
          const existingIdx = target.items.findIndex((i) => i.menuItem.id === menuItem.id);
          if (existingIdx > -1) {
            target.items[existingIdx] = {
              ...target.items[existingIdx],
              quantity: target.items[existingIdx].quantity + 1
            };
          } else {
            target.items.push({ menuItem, quantity: 1 });
          }
        }
      });
      return updated;
    });
  };

  // Authoritative bill totals
  const subtotal = participants.reduce((acc, p) => {
    const pTotal = p.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    return acc + pTotal;
  }, 0);

  const packagingFee = 25;
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + packagingFee + deliveryFee + tax;

  const totalItemCount = participants.reduce(
    (acc, p) => acc + p.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const activeParticipant = participants.find((p) => p.id === activeParticipantId) || participants[0];

  const handleProceedToCheckout = () => {
    // Add all participant items to the cart
    participants.forEach((p) => {
      p.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addItem(item.menuItem, undefined, [
            `Group Member: ${p.name}`,
            ...(item.customizationNote ? [item.customizationNote] : [])
          ]);
        }
      });
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Live Split Room
              </span>
              <span className="text-xs text-[#766E65]">Syncing with {participants.length} foodies</span>
            </div>
            <h1 className="text-3xl font-black text-[#1A1715] font-sans">
              Collaborative Group Order
            </h1>
            <p className="text-sm text-[#766E65]">
              Invite friends, order together from the same artisanal kitchen, and split the bill effortlessly.
            </p>
          </div>

          {/* Share Room Code Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#F8F5F0] p-3 rounded-2xl border border-[#E5DDD4]">
            <div className="px-3 py-2 bg-white rounded-xl border border-[#EBE5DF] text-center">
              <span className="text-[10px] text-[#9E948C] uppercase font-bold block">Room Code</span>
              <span className="font-mono font-bold text-base text-[#1A1715]">{roomCode}</span>
            </div>
            <button
              onClick={copyInviteLink}
              className="px-4 py-2.5 rounded-xl bg-[#1A1715] hover:bg-[#2A2420] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Link Copied!" : "Share Room Link"}
            </button>
          </div>
        </div>

        {/* Group Craving Match Consensus Voter */}
        <GroupCravingMatch
          onApplyRecommendedCombo={handleApplyRecommendedCombo}
          participantCount={participants.length}
        />

        {/* Participant Switcher & Quick Add Member */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBE5DF] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#1A1715] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF4D2D]" />
              Select Participant Adding Food
            </h2>

            {/* Quick Add Member Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Friend's Name..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5DDD4] rounded-xl focus:outline-none focus:border-[#FF4D2D] w-36 sm:w-48"
              />
              <button
                onClick={handleAddParticipant}
                className="px-3 py-1.5 rounded-xl bg-[#FF4D2D] text-white text-xs font-bold hover:bg-[#E03B1D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Participant Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {participants.map((p) => {
              const isSelected = p.id === activeParticipantId;
              const itemCount = p.items.reduce((s, i) => s + i.quantity, 0);
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveParticipantId(p.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xs"
                      : "bg-[#FAF8F5] text-[#554C43] border-[#EBE5DF] hover:bg-[#F3EFEA]"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${p.avatarColor} shrink-0`} />
                  <span>{p.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#EBE5DF] text-[#766E65]"
                    }`}
                  >
                    {itemCount} items
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Ordering & Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Quick Dish Adder for Active Participant */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF4D2D] uppercase tracking-wider">
                    Add Items For
                  </span>
                  <h3 className="text-xl font-black text-[#1A1715]">{activeParticipant.name}</h3>
                </div>
                <Link
                  href="/studio"
                  className="px-3 py-1.5 rounded-xl bg-[#FFF1EE] text-[#FF4D2D] text-xs font-bold hover:bg-[#FFE5E0] transition-colors flex items-center gap-1.5 border border-[#FFD9D1]"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Customize in 3D Studio
                </Link>
              </div>

              {/* Menu Carousel / Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_MENU_ITEMS.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex flex-col justify-between hover:border-[#FF4D2D]/40 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="relative h-28 w-full rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-white ${
                            item.dietary === "veg" ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        >
                          {item.dietary}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1715] line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-[#766E65] line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#EBE5DF]">
                      <span className="text-sm font-black text-[#1A1715]">₹{item.price}</span>
                      <button
                        onClick={() => handleAddItemToParticipant(activeParticipant.id, item)}
                        className="px-3 py-1 rounded-xl bg-[#1A1715] hover:bg-[#FF4D2D] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Participant */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBE5DF] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#1A1715] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF4D2D]" />
                Participant Tray Breakdown
              </h3>

              <div className="space-y-4 divide-y divide-[#EBE5DF]">
                {participants.map((p) => {
                  const pTotal = p.items.reduce(
                    (sum, i) => sum + i.menuItem.price * i.quantity,
                    0
                  );
                  return (
                    <div key={p.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${p.avatarColor}`} />
                          <h4 className="text-xs font-bold text-[#1A1715]">{p.name}</h4>
                        </div>
                        <span className="text-xs font-bold text-[#1A1715]">₹{pTotal}</span>
                      </div>

                      {p.items.length === 0 ? (
                        <p className="text-[11px] text-[#9E948C] italic pl-5">
                          No dishes chosen yet.
                        </p>
                      ) : (
                        <div className="space-y-1.5 pl-5">
                          {p.items.map((cartItem) => (
                            <div
                              key={cartItem.menuItem.id}
                              className="flex items-center justify-between text-xs text-[#554C43] bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EBE5DF]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#FF4D2D]">
                                  {cartItem.quantity}x
                                </span>
                                <span>{cartItem.menuItem.name}</span>
                                {cartItem.customizationNote && (
                                  <span className="text-[10px] text-[#9E948C] bg-white px-1.5 py-0.5 rounded border border-[#E5DDD4]">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">
                                  ₹{cartItem.menuItem.price * cartItem.quantity}
                                </span>
                                <button
                                  onClick={() => handleRemoveItem(p.id, cartItem.menuItem.id)}
                                  className="text-[#9E948C] hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Split Bill & Consolidated Checkout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE5DF] shadow-xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A1715] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#FF4D2D]" />
                  Smart Split Calculator
                </h3>
                <span className="text-xs font-bold text-[#766E65]">
                  {totalItemCount} Total Dishes
                </span>
              </div>

              {/* Split Mode Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F5F0] rounded-2xl border border-[#E5DDD4]">
                <button
                  onClick={() => setSplitMode("equal")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    splitMode === "equal"
                      ? "bg-white text-[#1A1715] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                >
                  Split Equally
                </button>
                <button
                  onClick={() => setSplitMode("itemized")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    splitMode === "itemized"
                      ? "bg-white text-[#1A1715] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                >
                  Pay by Item
                </button>
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs text-[#554C43] pt-2 border-t border-[#EBE5DF]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1A1715]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Fee</span>
                  <span>₹{packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1A1715] pt-3 border-t border-[#EBE5DF]">
                  <span>Consolidated Total</span>
                  <span className="text-[#FF4D2D]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Dynamic Split Breakdown */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EBE5DF] space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-[#766E65] tracking-wider block">
                  {splitMode === "equal" ? "Equal Division Per Foodie" : "Itemized Due Per Member"}
                </span>

                <div className="space-y-1.5">
                  {participants.map((p) => {
                    const pItemTotal = p.items.reduce(
                      (sum, i) => sum + i.menuItem.price * i.quantity,
                      0
                    );
                    const perPersonAmount =
                      splitMode === "equal"
                        ? Math.round(grandTotal / participants.length)
                        : Math.round(
                            pItemTotal + (grandTotal - subtotal) * (subtotal > 0 ? pItemTotal / subtotal : 0)
                          );

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-[#EBE5DF]"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${p.avatarColor}`} />
                          <span className="font-medium text-[#1A1715]">{p.name}</span>
                        </div>
                        <span className="font-bold text-[#FF4D2D]">₹{perPersonAmount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proceed to Checkout Action */}
              <button
                disabled={totalItemCount === 0}
                onClick={handleProceedToCheckout}
                className="w-full py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03B1D] disabled:opacity-50 text-white font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Consolidated Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#766E65]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single consolidated invoice with itemized tax invoice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
