"use client";

import React from "react";
import {
  MapPin,
  Edit3,
  Lock,
  DoorOpen,
  Info,
  CheckCircle2,
  ShieldCheck,
  Building
} from "lucide-react";
import { DeliveryPreferenceType, SavedAddress } from "@/types";
import { getDeliveryPreferenceMeta } from "@/data/deliveryPreferences";

interface DeliveryInstructionsTrackerCardProps {
  preference?: DeliveryPreferenceType;
  instructions?: string;
  deliveryAddress?: SavedAddress | null;
  isDelivered?: boolean;
  onOpenEdit?: () => void;
}

export function DeliveryInstructionsTrackerCard({
  preference = "RING_BELL",
  instructions,
  deliveryAddress,
  isDelivered = false,
  onOpenEdit,
}: DeliveryInstructionsTrackerCardProps) {
  const meta = getDeliveryPreferenceMeta(preference);
  const Icon = meta.icon;

  const addressSummary = deliveryAddress
    ? `${deliveryAddress.addressLine ? deliveryAddress.addressLine + ", " : ""}${deliveryAddress.locality}, ${deliveryAddress.city} - ${deliveryAddress.pincode}`
    : "Flat 402, Sea Green Apartments, Perry Cross Road, Bandra West, Mumbai - 400050";

  const recipient = deliveryAddress?.recipientName || "Ritish (Customer)";
  const phone = deliveryAddress?.phone || "+91 98200 12345";
  const tag = deliveryAddress?.tag || "Home";

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F3EFEA] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">{meta.emoji}</span>
            <h3 className="text-base font-black text-[#1A1715]">
              Your Delivery Instructions
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1EE] text-[#FF4D2D] border border-[#FF4D2D]/20">
              Live Partner View
            </span>
          </div>
          <p className="text-xs text-[#766E65] mt-0.5">
            Your courier partner sees these instructions on their navigation terminal.
          </p>
        </div>

        {onOpenEdit && (
          <div>
            {isDelivered ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs font-bold text-[#766E65]">
                <Lock className="w-3.5 h-3.5" />
                <span>Instructions Locked (Delivered)</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E5DDD4] text-xs font-bold text-[#1A1715] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>Edit Instructions</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Preference Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Preference Badge Box */}
        <div className="md:col-span-6 p-4 rounded-2xl bg-[#FFF8F6] border border-[#FF4D2D]/25 flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#1A1715]">
                {meta.title}
              </span>
              {meta.tag && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#FF4D2D] border border-[#FF4D2D]/30">
                  {meta.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-[#766E65] mt-1 leading-relaxed">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Custom Instructions Box */}
        <div className="md:col-span-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E948C] block mb-1">
              Additional Instructions
            </span>
            {instructions && instructions.trim().length > 0 ? (
              <p className="text-xs font-medium text-[#1A1715] italic leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#EBE5DF]">
                &ldquo;{instructions.trim()}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-[#9E948C] italic">
                No custom instructions added. The delivery partner will follow standard arrival procedure.
              </p>
            )}
          </div>

          <div className="pt-2 text-[10px] text-[#766E65] flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Transmitted to courier partner</span>
          </div>
        </div>
      </div>

      {/* Contactless Notice Banner (if applicable) */}
      {meta.isContactless && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <DoorOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Contactless Delivery Active: </span>
            <span>
              {meta.contactlessNote ||
                "Your delivery partner will leave the order at the specified doorstep and notify you."}
            </span>
          </div>
        </div>
      )}

      {/* Delivery Destination Address Summary */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#FF4D2D] shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1715]">{recipient}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-[#766E65] border border-[#EBE5DF]">
                {tag}
              </span>
              <span className="text-[#9E948C] font-mono text-[11px]">{phone}</span>
            </div>
            <p className="text-[#766E65] text-xs mt-0.5 leading-relaxed">
              {addressSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified GPS Dropzone</span>
        </div>
      </div>
    </div>
  );
}
