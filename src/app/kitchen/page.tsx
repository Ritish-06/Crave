"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  Package,
  Layers,
  ChefHat
} from "lucide-react";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";

interface KitchenTicket {
  id: string;
  orderNumber: string;
  placedAt: string;
  stage: "incoming" | "preparing" | "ready" | "dispatched";
  prepTimeRemaining: number; // minutes
  items: {
    name: string;
    quantity: number;
    notes?: string[];
  }[];
  totalAmount: number;
  customerName: string;
  deliveryType: "Express Courier" | "Standard Delivery";
  riderName?: string;
  pickupOtp?: string;
}

export default function KitchenDashboardPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"pipeline" | "stock">("pipeline");

  const [tickets, setTickets] = useState<KitchenTicket[]>([
    {
      id: "t-1",
      orderNumber: "CRV-894211",
      placedAt: "4 mins ago",
      stage: "incoming",
      prepTimeRemaining: 18,
      items: [
        {
          name: "Truffle Wagyu Double Smash Burger",
          quantity: 2,
          notes: ["Brioche Bun", "Double Patty", "Truffle Mayo", "Swiss Cheese"]
        },
        {
          name: "Belgian Dark Chocolate Soufflé",
          quantity: 1,
          notes: ["Serve Warm"]
        }
      ],
      totalAmount: 1840,
      customerName: "Aarav Sharma",
      deliveryType: "Express Courier"
    },
    {
      id: "t-2",
      orderNumber: "CRV-894208",
      placedAt: "12 mins ago",
      stage: "preparing",
      prepTimeRemaining: 8,
      items: [
        {
          name: "Smoked Burrata Margherita",
          quantity: 1,
          notes: ["Extra Fresh Basil", "Woodfired Crisp Crust"]
        },
        {
          name: "Wild Forest Mushroom Risotto",
          quantity: 1,
          notes: ["Truffle Oil Drizzle"]
        }
      ],
      totalAmount: 1530,
      customerName: "Priya Nair",
      deliveryType: "Express Courier",
      riderName: "Vikram R.",
      pickupOtp: "4821"
    },
    {
      id: "t-3",
      orderNumber: "CRV-894195",
      placedAt: "22 mins ago",
      stage: "ready",
      prepTimeRemaining: 0,
      items: [
        {
          name: "Signature Butter Chicken Bao",
          quantity: 2,
          notes: ["Makhani Glaze"]
        }
      ],
      totalAmount: 980,
      customerName: "Rohan Desai",
      deliveryType: "Standard Delivery",
      riderName: "Sanjay Kumar",
      pickupOtp: "7719"
    }
  ]);

  // Out of Stock (86'd) tracking state
  const [outOfStockIds, setOutOfStockIds] = useState<string[]>([
    "dish-risotto-1" // initial out-of-stock item
  ]);

  const toggleStockStatus = (id: string) => {
    setOutOfStockIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const advanceTicketStage = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        if (t.stage === "incoming") {
          return { ...t, stage: "preparing", riderName: "Vikram R.", pickupOtp: "8312" };
        }
        if (t.stage === "preparing") {
          return { ...t, stage: "ready", prepTimeRemaining: 0 };
        }
        if (t.stage === "ready") {
          return { ...t, stage: "dispatched" };
        }
        return t;
      })
    );
  };

  const simulateNewOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newTicket: KitchenTicket = {
      id: `t-${Date.now()}`,
      orderNumber: `CRV-${randomNum}`,
      placedAt: "Just now",
      stage: "incoming",
      prepTimeRemaining: 20,
      items: [
        {
          name: "Truffle Wagyu Double Smash Burger",
          quantity: 1,
          notes: ["Brioche Bun", "Customized in 3D Studio", "Caramelized Onions"]
        }
      ],
      totalAmount: 649,
      customerName: "Kavya Menon",
      deliveryType: "Express Courier"
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Simple audio chime simulation via Web Audio API
    if (audioEnabled && typeof window !== "undefined") {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch {}
    }
  };

  const incomingCount = tickets.filter((t) => t.stage === "incoming").length;
  const preparingCount = tickets.filter((t) => t.stage === "preparing").length;
  const readyCount = tickets.filter((t) => t.stage === "ready").length;

  return (
    <div className="min-h-screen bg-[#140E0A] text-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="bg-[#1C1511] rounded-3xl p-6 border border-[#2A1F18] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Kitchen Online & Accepting Orders
              </span>
              <span className="text-xs text-[#9E948C]">• Kitchen Load: 68%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-[#FF4D2D]" />
              The Truffle & Brioche Co. — KDS
            </h1>
            <p className="text-xs text-[#9E948C]">
              Live Kitchen Display System (KDS), Dispatch Pipeline & 86-Item Inventory Control
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                audioEnabled
                  ? "bg-[#2A1F18] text-[#FAF8F5] border-[#3D2C22]"
                  : "bg-[#140E0A] text-[#766E65] border-[#2A1F18]"
              }`}
              title="Toggle audio order chimes"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-[#FF4D2D]" /> : <VolumeX className="w-4 h-4" />}
              <span>{audioEnabled ? "Chime On" : "Chime Muted"}</span>
            </button>

            <button
              onClick={simulateNewOrder}
              className="px-4 py-2 rounded-xl bg-[#FF4D2D] hover:bg-[#E03B1D] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Simulate Incoming Ticket
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1C1511] p-5 rounded-2xl border border-[#2A1F18] space-y-1">
            <span className="text-[11px] text-[#9E948C] uppercase font-bold tracking-wider">
              Tickets In Queue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">{incomingCount + preparingCount}</div>
            <span className="text-[10px] text-amber-400 font-medium">⚡ Optimal kitchen pacing</span>
          </div>

          <div className="bg-[#1C1511] p-5 rounded-2xl border border-[#2A1F18] space-y-1">
            <span className="text-[11px] text-[#9E948C] uppercase font-bold tracking-wider">
              Avg Prep Time
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">14.8 <span className="text-sm font-normal text-[#9E948C]">mins</span></div>
            <span className="text-[10px] text-emerald-400 font-medium">✓ 2.2m faster than SLA</span>
          </div>

          <div className="bg-[#1C1511] p-5 rounded-2xl border border-[#2A1F18] space-y-1">
            <span className="text-[11px] text-[#9E948C] uppercase font-bold tracking-wider">
              Today&apos;s Gross Sales
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#FF4D2D]">₹24,850</div>
            <span className="text-[10px] text-[#9E948C] font-medium">42 fulfilled orders</span>
          </div>

          <div className="bg-[#1C1511] p-5 rounded-2xl border border-[#2A1F18] space-y-1">
            <span className="text-[11px] text-[#9E948C] uppercase font-bold tracking-wider">
              Hygiene & FSSAI
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</div>
            <span className="text-[10px] text-[#9E948C] font-medium">Audited & Certified</span>
          </div>
        </div>

        {/* Tab Switcher: Orders Pipeline vs 86'd Stock Manager */}
        <div className="flex border-b border-[#2A1F18] gap-4">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "pipeline"
                ? "border-[#FF4D2D] text-white"
                : "border-transparent text-[#766E65] hover:text-[#FAF8F5]"
            }`}
          >
            <Flame className="w-4 h-4 text-[#FF4D2D]" />
            Live Cooking Pipeline ({tickets.filter((t) => t.stage !== "dispatched").length})
          </button>

          <button
            onClick={() => setActiveTab("stock")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "stock"
                ? "border-[#FF4D2D] text-white"
                : "border-transparent text-[#766E65] hover:text-[#FAF8F5]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF4D2D]" />
            86-Item (Out of Stock) Manager ({outOfStockIds.length} unavailable)
          </button>
        </div>

        {/* VIEW 1: Live Kanban Pipeline */}
        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Incoming */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A1F18]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    1. Incoming Orders
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                  {incomingCount}
                </span>
              </div>

              <div className="space-y-4">
                {tickets
                  .filter((t) => t.stage === "incoming")
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-[#1C1511] rounded-2xl p-5 border-2 border-amber-500/40 shadow-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#9E948C] font-mono block">
                            {ticket.placedAt}
                          </span>
                          <span className="text-sm font-bold text-white">{ticket.orderNumber}</span>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                          {ticket.deliveryType}
                        </span>
                      </div>

                      <div className="space-y-2 py-2 border-y border-[#2A1F18]">
                        {ticket.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-white">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.notes && item.notes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.notes.map((n, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded text-[9px] bg-[#2A1F18] text-[#C4B7AC]"
                                  >
                                    {n}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#9E948C]">
                        <span>Customer: {ticket.customerName}</span>
                        <span className="font-bold text-white">₹{ticket.totalAmount}</span>
                      </div>

                      <button
                        onClick={() => advanceTicketStage(ticket.id)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Flame className="w-4 h-4" />
                        Accept & Start Cooking
                      </button>
                    </div>
                  ))}

                {incomingCount === 0 && (
                  <div className="p-8 text-center bg-[#1C1511]/40 rounded-2xl border border-dashed border-[#2A1F18] text-[#766E65] text-xs">
                    No new orders pending acceptance.
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: In Preparation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A1F18]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D]"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    2. In Preparation (KDS)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] text-xs font-bold">
                  {preparingCount}
                </span>
              </div>

              <div className="space-y-4">
                {tickets
                  .filter((t) => t.stage === "preparing")
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-[#1C1511] rounded-2xl p-5 border border-[#2A1F18] shadow-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#9E948C] font-mono block">
                            Target Prep Time:
                          </span>
                          <span className="text-sm font-black text-[#FF4D2D] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {ticket.prepTimeRemaining} mins remaining
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          {ticket.orderNumber}
                        </span>
                      </div>

                      <div className="space-y-2 py-2 border-y border-[#2A1F18]">
                        {ticket.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-white">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            {item.notes && item.notes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.notes.map((n, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded text-[9px] bg-[#2A1F18] text-[#C4B7AC]"
                                  >
                                    {n}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#9E948C]">
                        <span>Assigned Courier: {ticket.riderName || "Matching..."}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          OTP: {ticket.pickupOtp}
                        </span>
                      </div>

                      <button
                        onClick={() => advanceTicketStage(ticket.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Ready for Courier Pickup
                      </button>
                    </div>
                  ))}

                {preparingCount === 0 && (
                  <div className="p-8 text-center bg-[#1C1511]/40 rounded-2xl border border-dashed border-[#2A1F18] text-[#766E65] text-xs">
                    All accepted orders have been plated.
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Ready for Pickup */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A1F18]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    3. Ready For Pickup
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {readyCount}
                </span>
              </div>

              <div className="space-y-4">
                {tickets
                  .filter((t) => t.stage === "ready")
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-[#1C1511] rounded-2xl p-5 border border-emerald-500/30 shadow-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                            Packed & Sealed
                          </span>
                          <span className="text-sm font-bold text-white">{ticket.orderNumber}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs">
                          OTP {ticket.pickupOtp}
                        </div>
                      </div>

                      <div className="text-xs text-[#C4B7AC] space-y-1">
                        <p>Courier: <strong className="text-white">{ticket.riderName}</strong></p>
                        <p>Customer: <strong className="text-white">{ticket.customerName}</strong></p>
                      </div>

                      <button
                        onClick={() => advanceTicketStage(ticket.id)}
                        className="w-full py-2.5 rounded-xl bg-[#2A1F18] hover:bg-[#3D2C22] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-emerald-400" />
                        Verify OTP & Handover to Courier
                      </button>
                    </div>
                  ))}

                {readyCount === 0 && (
                  <div className="p-8 text-center bg-[#1C1511]/40 rounded-2xl border border-dashed border-[#2A1F18] text-[#766E65] text-xs">
                    No orders waiting on courier handoff.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: 86-Item (Out of Stock) Manager */}
        {activeTab === "stock" && (
          <div className="bg-[#1C1511] rounded-3xl p-6 sm:p-8 border border-[#2A1F18] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#FF4D2D]" />
                  Instant Ingredient & Menu Item Stock Manager
                </h3>
                <p className="text-xs text-[#9E948C]">
                  Toggle items unavailable in real-time to prevent customer order cancellations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_MENU_ITEMS.map((item) => {
                const isOutOfStock = outOfStockIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isOutOfStock
                        ? "bg-[#251711] border-red-500/40"
                        : "bg-[#140E0A] border-[#2A1F18]"
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOutOfStock ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        />
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      </div>
                      <p className="text-[11px] text-[#9E948C]">
                        ₹{item.price} • {item.category}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleStockStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isOutOfStock
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-[#2A1F18] text-[#C4B7AC] hover:text-white"
                      }`}
                    >
                      {isOutOfStock ? "86'd (Unavailable)" : "In Stock"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
