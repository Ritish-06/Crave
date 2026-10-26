"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
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
  RotateCw,
  Heart,
  MessageSquare,
  Volume2,
  VolumeX,
  KeyRound,
  Download,
  AlertCircle
} from "lucide-react";
import { OrderRecord } from "@/types";
import { DeliveryRadarMap } from "@/components/tracker/DeliveryRadarMap";
import { DeliveryOtpModal } from "@/components/tracker/DeliveryOtpModal";
import { CourierTipModal } from "@/components/tracker/CourierTipModal";
import { OrderSupportDrawer } from "@/components/tracker/OrderSupportDrawer";

export default function LiveTrackerPage() {
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [progressPercent, setProgressPercent] = useState(65);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deliveryOtp = "7842";
  const courierName = activeOrder?.riderName || "Vikram R. (CRAVE Courier Partner)";
  const courierPhone = activeOrder?.riderPhone || "+919845011234";
  const restaurantName = activeOrder?.restaurantName || "The Truffle & Brioche Co.";
  const orderNumber = activeOrder?.orderNumber || "CRV-894210";

  // Synthesizer Web Audio API for harmonic milestone chimes (Zero bundle bloat)
  const playAudioChime = (type: "confirm" | "dispatch" | "delivered") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const freqs =
        type === "delivered"
          ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Celebration chord)
          : type === "dispatch"
          ? [440.0, 554.37, 659.25] // A4, C#5, E5
          : [392.0, 523.25]; // G4, C5

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
      });
    } catch {}
  };

  // Determine timeline step based on progress
  const timelineStep =
    progressPercent < 25 ? 1 : progressPercent < 50 ? 2 : progressPercent < 95 ? 3 : 4;

  // Auto-play simulation interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          const next = prev + 0.4 * playbackSpeed;
          if (next >= 100) {
            setIsPlaying(false);
            playAudioChime("delivered");
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
            return 100;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Load active or recent order from localStorage
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

  const handleVerifySuccess = () => {
    setProgressPercent(100);
    setIsPlaying(false);
    playAudioChime("delivered");
    setToastMessage("Parcel handover verified! Thank you for choosing CRAVE.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApplyTip = (amount: number) => {
    setTipAmount(amount);
    if (amount > 0) {
      setToastMessage(`Added ₹${amount} tip for ${courierName}! ❤️`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Computed subtotal and totals
  const subtotal = activeOrder?.subtotal || (activeOrder?.total ? activeOrder.total - 25 - Math.round(activeOrder.total * 0.05) : 890);
  const gst = activeOrder?.tax || Math.round(subtotal * 0.05);
  const packaging = 25;
  const grandTotal = Math.round(subtotal + gst + packaging + tipAmount);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 pb-24 text-[#1A1715] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#140E0A] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#FF4D2D]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-[#FF4D2D]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <DeliveryOtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        otpCode={deliveryOtp}
        onVerifySuccess={handleVerifySuccess}
      />

      <CourierTipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        courierName={courierName}
        currentTip={tipAmount}
        onApplyTip={handleApplyTip}
      />

      <OrderSupportDrawer
        isOpen={isSupportDrawerOpen}
        onClose={() => setIsSupportDrawerOpen(false)}
        orderNumber={orderNumber}
        restaurantName={restaurantName}
        courierName={courierName}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Title Bar & Order Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Live Courier Radar
              </span>
              <span className="text-[11px] text-[#9E948C] font-mono">
                Order #{orderNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1A1715] font-sans mt-0.5">
              Live Delivery Telemetry & Radar
            </h1>
            <p className="text-xs text-[#766E65] mt-0.5">
              Dispatched from <strong>{restaurantName}</strong> • Bandra West, Mumbai
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white border border-[#EBE5DF] hover:border-[#1A1715] text-[#766E65] hover:text-[#1A1715] transition-colors cursor-pointer"
              title={soundEnabled ? "Mute audio chimes" : "Enable milestone chimes"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF4D2D]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Delivery OTP Badge */}
            <button
              onClick={() => setIsOtpModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] border border-[#FF4D2D]/30 text-[#FF4D2D] font-mono font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Handover OTP: {deliveryOtp}</span>
            </button>

            {/* Support Concierge */}
            <button
              onClick={() => setIsSupportDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>Live Concierge</span>
            </button>
          </div>
        </div>

        {/* Real-Time GPS Delivery Radar Map */}
        <DeliveryRadarMap
          progressPercent={progressPercent}
          onProgressChange={(pct) => setProgressPercent(pct)}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onReset={() => setProgressPercent(10)}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={(s) => setPlaybackSpeed(s)}
          restaurantName={restaurantName}
          deliveryLocality="Bandra West, Mumbai"
        />

        {/* Courier Info & Live Communication Deck */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Rider Profile Card */}
          <div className="md:col-span-8 p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                  VR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#1A1715]">
                      {courierName}
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified Courier Partner
                    </span>
                  </div>
                  <p className="text-xs text-[#766E65] mt-0.5">
                    Electric Scooter Fleet • 1,420+ 5-Star Deliveries • Thermal Bag Sealed
                  </p>
                </div>
              </div>

              {/* Courier Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${courierPhone}`}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>

                <button
                  onClick={() => setIsTipModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#FF4D2D]/20"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#FF4D2D]" />
                  <span>{tipAmount > 0 ? `Tip: ₹${tipAmount}` : "Tip Courier"}</span>
                </button>
              </div>
            </div>

            {/* Food Safety & Bag Telemetry Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#F3EFEA] text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[#554C43] font-medium">Holographic Tamper Seal Intact</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span className="text-[#554C43] font-medium">Under 25-Min Freshness Guarantee</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[#554C43] font-medium">FSSAI Certified Thermal Carrier</span>
              </div>
            </div>
          </div>

          {/* Handover PIN Action Card */}
          <div className="md:col-span-4 p-5 sm:p-6 rounded-3xl bg-[#140E0A] text-white border border-[#2A1F18] shadow-md flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4D2D] block">
                Security Verification
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                Parcel Handover PIN
              </h4>
              <p className="text-xs text-[#A3988E] mt-1 leading-relaxed">
                Provide this OTP to your delivery courier upon parcel arrival to verify delivery handover.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1C1511] border border-white/10 text-center">
              <span className="font-mono text-2xl font-black tracking-widest text-white">
                {deliveryOtp}
              </span>
            </div>

            <button
              onClick={() => setIsOtpModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#2A1F18] hover:bg-[#3D2C22] text-xs font-bold text-[#E5DDD4] hover:text-white transition-colors cursor-pointer text-center"
            >
              Simulate Rider Code Entry
            </button>
          </div>
        </div>

        {/* Order Lifecycle Progression Steps */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#1A1715]">
              Order Lifecycle Milestones
            </h3>
            <span className="text-xs text-[#766E65]">
              Stage {timelineStep} of 4 Completed
            </span>
          </div>

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
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-2 ring-[#FF4D2D]/30 shadow-md"
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
                          ? "bg-emerald-600 text-white"
                          : "bg-[#E5DDD4] text-[#766E65]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-black text-[#FF4D2D] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF1EE]">
                        Live Now
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1715]">{st.title}</h4>
                  <p className="text-xs text-[#766E65] mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Dev State Step Switcher */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#766E65] border-t border-[#F3EFEA]">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Simulate Milestones:</span>
              {[
                { step: 1, pct: 15, label: "Step 1: Confirmed" },
                { step: 2, pct: 40, label: "Step 2: Cooking" },
                { step: 3, pct: 75, label: "Step 3: Dispatched" },
                { step: 4, pct: 100, label: "Step 4: Delivered" }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    setProgressPercent(s.pct);
                    setIsPlaying(false);
                    playAudioChime(s.step === 4 ? "delivered" : s.step === 3 ? "dispatch" : "confirm");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timelineStep === s.step
                      ? "bg-[#1A1715] text-white shadow-xs"
                      : "bg-[#F3EFEA] text-[#766E65] hover:bg-[#EBE5DF]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setProgressPercent(10);
                setIsPlaying(true);
              }}
              className="text-xs font-bold text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Replay Journey</span>
            </button>
          </div>
        </div>

        {/* Detailed Order Breakdown & Bill Receipt */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F3EFEA] pb-4">
            <div>
              <h3 className="text-base font-black text-[#1A1715]">
                Order Invoice & Receipt
              </h3>
              <p className="text-xs text-[#766E65]">
                Billed to your default address • FSSAI Lic #11522000000456
              </p>
            </div>

            <button
              onClick={() => {
                setToastMessage("Tax invoice generated and downloaded!");
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E5DDD4] text-xs font-bold text-[#1A1715] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>Tax Invoice</span>
            </button>
          </div>

          {/* Ordered Dishes List */}
          <div className="space-y-3">
            {activeOrder && activeOrder.items && activeOrder.items.length > 0 ? (
              activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 border-b border-[#F3EFEA] last:border-none"
                >
                  <div>
                    <span className="font-bold text-sm text-[#1A1715]">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    {item.customizationSummary && item.customizationSummary.length > 0 && (
                      <p className="text-[11px] text-[#FF4D2D] mt-0.5">
                        {item.customizationSummary.join(" • ")}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-sm text-[#1A1715]">
                    ₹{item.totalPrice}
                  </span>
                </div>
              ))
            ) : (
              /* Fallback Signature Truffle Smash sample receipt */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#F3EFEA]">
                  <div>
                    <span className="font-bold text-sm text-[#1A1715]">
                      2x The Crave Signature Truffle Smash
                    </span>
                    <p className="text-[11px] text-[#FF4D2D] mt-0.5">
                      Golden Brioche • Double Wagyu • Aged Cheddar • Truffle Mayo
                    </p>
                  </div>
                  <span className="font-black text-sm text-[#1A1715]">₹778</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#F3EFEA]">
                  <div>
                    <span className="font-bold text-sm text-[#1A1715]">
                      1x Valrhona Dark Chocolate Ganache Tart
                    </span>
                    <p className="text-[11px] text-[#766E65] mt-0.5">
                      Single-origin 70% dark chocolate • Almond crust
                    </p>
                  </div>
                  <span className="font-black text-sm text-[#1A1715]">₹320</span>
                </div>
              </div>
            )}
          </div>

          {/* Bill Calculation Itemization */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-2 text-xs">
            <div className="flex justify-between text-[#766E65]">
              <span>Items Subtotal</span>
              <span className="font-mono font-bold text-[#1A1715]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#766E65]">
              <span>Government GST (5% Food Services)</span>
              <span className="font-mono font-bold text-[#1A1715]">₹{gst}</span>
            </div>
            <div className="flex justify-between text-[#766E65]">
              <span>Tamper-Evident Packaging & Delivery Sanitization</span>
              <span className="font-mono font-bold text-[#1A1715]">₹{packaging}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Rider Appreciation Tip (100% to Vikram R.)</span>
                <span className="font-mono font-bold">₹{tipAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-[#1A1715] pt-2 border-t border-[#EBE5DF]">
              <span>Total Paid via Razorpay / UPI</span>
              <span className="text-[#FF4D2D] font-mono text-base">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
