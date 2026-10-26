"use client";

import React, { useState } from "react";
import {
  Heart,
  X,
  Check,
  Sparkles,
  Smile,
  ShieldCheck,
  Bike
} from "lucide-react";

interface CourierTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  courierName: string;
  currentTip: number;
  onApplyTip: (amount: number) => void;
}

export function CourierTipModal({
  isOpen,
  onClose,
  courierName,
  currentTip,
  onApplyTip,
}: CourierTipModalProps) {
  const [selectedTip, setSelectedTip] = useState<number>(currentTip > 0 ? currentTip : 30);
  const [selectedTag, setSelectedTag] = useState<string>("Prompt & Courteous");

  if (!isOpen) return null;

  const tipOptions = [20, 30, 50, 100];
  const appreciationTags = [
    "Prompt & Courteous ⚡",
    "Food Handled with Care 🍔",
    "Weather Hero 🌧️",
    "Polite & Friendly 😊"
  ];

  const handleConfirm = () => {
    onApplyTip(selectedTip);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-[#EBE5DF] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-[#FF4D2D]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1715]">
                Appreciate Your Courier
              </h3>
              <p className="text-xs text-[#766E65]">
                100% of your tip goes directly to {courierName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#766E65] hover:text-[#1A1715] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Rider Profile Badge */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBE5DF] flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center shrink-0 border border-emerald-300">
              VR
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A1715]">{courierName}</h4>
              <p className="text-xs text-[#766E65]">
                Electric Scooter Partner • 1,420+ 5-Star Deliveries
              </p>
            </div>
          </div>

          {/* Quick Tip Amounts */}
          <div>
            <span className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-2">
              Select Tip Amount
            </span>
            <div className="grid grid-cols-4 gap-2">
              {tipOptions.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedTip(amt)}
                  className={`py-3 rounded-2xl text-center border font-mono font-bold text-sm transition-all cursor-pointer ${
                    selectedTip === amt
                      ? "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-md shadow-[#FF4D2D]/30 scale-105"
                      : "bg-white text-[#1A1715] border-[#E5DDD4] hover:border-[#FF4D2D]"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Appreciation Compliments */}
          <div>
            <span className="block text-[11px] font-bold text-[#766E65] uppercase tracking-wider mb-2">
              Add a Compliment (Optional)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {appreciationTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                    selectedTag === tag
                      ? "bg-[#1A1715] text-white border-[#1A1715]"
                      : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-[#1A1715]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Transparent Payout Notice */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-2 text-xs text-[#766E65]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Zero platform commissions. Tips are transferred directly to the rider’s UPI wallet.
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                onApplyTip(0);
                onClose();
              }}
              className="py-3 px-4 rounded-xl border border-[#E5DDD4] hover:bg-[#F3EFEA] text-xs font-bold text-[#766E65] cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Confirm Tip of ₹{selectedTip}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
