"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Bike,
  ChefHat,
  ShoppingBag,
  Phone,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCw
} from "lucide-react";
import { OrderRecord } from "@/types";

export default function LiveTrackerPage() {
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [timelineStep, setTimelineStep] = useState<number>(3); // 1: Confirmed, 2: Preparing, 3: Out for delivery, 4: Delivered
  const [progressPercent, setProgressPercent] = useState(65);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("crave_active_order");
      if (stored) {
        setActiveOrder(JSON.parse(stored));
      } else {
        const history = localStorage.getItem("crave_orders");
        if (history) {
          const list = JSON.parse(history);
          if (list.length > 0) setActiveOrder(list[0]);
        }
      }
    } catch {}
  }, []);

  const steps = [
    { id: 1, title: "Order Confirmed", desc: "Kitchen received your ticket", icon: CheckCircle2 },
    { id: 2, title: "Chef Preparing", desc: "Smash patties & artisanal assembly", icon: ChefHat },
    { id: 3, title: "Out for Delivery", desc: "Courier on electric scooter", icon: Bike },
    { id: 4, title: "Delivered", desc: "Enjoy every bite!", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                Live Courier Radar
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#1A1715] font-sans mt-0.5">
              Order Tracking & ETA
            </h1>
            <p className="text-xs text-[#766E65] mt-0.5">
              Tracking #{activeOrder?.orderNumber || "CRV-894210"} • From{" "}
              <strong>{activeOrder?.restaurantName || "The Truffle & Brioche Co."}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#FFF1EE] text-[#FF4D2D] font-bold text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Arriving in ~18 mins</span>
            </span>
          </div>
        </div>

        {/* Courier Map Simulation Card */}
        <div className="rounded-3xl bg-[#140E0A] text-white p-6 sm:p-8 border border-[#2A1F18] relative overflow-hidden shadow-2xl space-y-6">
          {/* Top Simulation Disclaimer Badge */}
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-[11px] font-bold bg-[#1C1511] text-[#A3988E] px-3 py-1 rounded-full border border-[#2A1F18]">
              Simulated Dispatch Track (Dev Demonstration)
            </span>
            <span className="text-xs text-[#16A34A] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Courier Temperature 36.4°C Verified
            </span>
          </div>

          {/* Graphical Route Simulation View */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl bg-[#1C1511] border border-[#2A1F18] overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FF4D2D_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Route Path Line */}
            <div className="relative w-full max-w-xl flex items-center justify-between">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#2A1F18]">
                <div
                  className="h-full bg-gradient-to-r from-[#FF4D2D] to-[#FFA384] transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Kitchen Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FF4D2D] flex items-center justify-center text-white shadow-lg shadow-[#FF4D2D]/40">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1.5">Kitchen</span>
                <span className="text-[9px] text-[#A3988E]">Dispatched</span>
              </div>

              {/* Courier Moving Node */}
              <div
                className="relative z-10 flex flex-col items-center transition-all duration-700"
                style={{ position: "relative", transform: `translateX(${(progressPercent - 50) * 2}px)` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white shadow-xl shadow-[#16A34A]/50 animate-bounce">
                  <Bike className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black text-[#16A34A] mt-1.5">Vikram R.</span>
                <span className="text-[9px] text-white/70">On EV Scooter</span>
              </div>

              {/* Delivery Destination Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#2A1D16] border border-[#FF4D2D]/40 flex items-center justify-center text-[#FF4D2D]">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1.5">You</span>
                <span className="text-[9px] text-[#A3988E]">Bandra West</span>
              </div>
            </div>
          </div>

          {/* Courier Details Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#1C1511] border border-[#2A1F18] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF4D2D]/20 border border-[#FF4D2D]/40 flex items-center justify-center text-[#FF4D2D] font-black text-lg">
                VR
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {activeOrder?.riderName || "Vikram R. (CRAVE Courier Partner)"}
                </h4>
                <p className="text-xs text-[#A3988E]">
                  Delivered 1,420+ 5-Star Cravings • Thermal insulated bag
                </p>
              </div>
            </div>

            <a
              href={`tel:${activeOrder?.riderPhone || "+919845011234"}`}
              className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Courier</span>
            </a>
          </div>
        </div>

        {/* Status Lifecycle Steps */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
          <h3 className="text-base font-black text-[#1A1715]">Order Lifecycle Progression</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st) => {
              const Icon = st.icon;
              const isPast = timelineStep >= st.id;
              const isCurrent = timelineStep === st.id;

              return (
                <div
                  key={st.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : isPast
                      ? "bg-[#FAF8F5] border-[#EBE5DF]"
                      : "bg-[#F9F7F5] border-[#EBE5DF] opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isCurrent
                          ? "bg-[#FF4D2D] text-white"
                          : isPast
                          ? "bg-[#16A34A] text-white"
                          : "bg-[#E5DDD4] text-[#766E65]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#FF4D2D] uppercase tracking-wider">
                        Active Step
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1715]">{st.title}</h4>
                  <p className="text-xs text-[#766E65] mt-0.5">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Dev Step Switcher */}
          <div className="pt-2 flex items-center gap-2 text-xs text-[#766E65]">
            <span className="font-semibold">Simulate state:</span>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setTimelineStep(num);
                  setProgressPercent(num === 1 ? 15 : num === 2 ? 40 : num === 3 ? 75 : 100);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  timelineStep === num ? "bg-[#1A1715] text-white" : "bg-[#F3EFEA]"
                }`}
              >
                Step {num}
              </button>
            ))}
          </div>
        </div>

        {/* Order Details Accordion */}
        {activeOrder && activeOrder.items && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1A1715]">Dishes in this Order</h3>
            <div className="space-y-3">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs py-2 border-b border-[#F3EFEA] last:border-none">
                  <div>
                    <span className="font-bold text-[#1A1715]">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    {item.customizationSummary && (
                      <p className="text-[11px] text-[#FF4D2D] mt-0.5">
                        {item.customizationSummary.join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-[#1A1715]">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
