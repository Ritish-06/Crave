"use client";

import React from "react";
import {
  Bell,
  DoorOpen,
  UserCheck,
  PhoneCall,
  MessageSquare,
  VolumeX,
  CheckCircle2,
  ShieldCheck,
  Info
} from "lucide-react";
import { DeliveryPreferenceType } from "@/types";

export interface DeliveryPreferenceItem {
  id: DeliveryPreferenceType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

export const DELIVERY_PREFERENCES_LIST: DeliveryPreferenceItem[] = [
  {
    id: "RING_BELL",
    title: "Ring the Bell",
    desc: "Ring the doorbell when arriving.",
    icon: Bell,
    tag: "Standard",
  },
  {
    id: "LEAVE_AT_DOORSTEP",
    title: "Leave at Doorstep",
    desc: "Leave the order at doorstep and notify me.",
    icon: DoorOpen,
    tag: "Contactless",
  },
  {
    id: "HAND_TO_ME",
    title: "Hand It to Me",
    desc: "Hand the order directly to me in person.",
    icon: UserCheck,
  },
  {
    id: "CALL_ON_ARRIVAL",
    title: "Call When Arrived",
    desc: "Call my phone upon reaching the gate/door.",
    icon: PhoneCall,
  },
  {
    id: "TEXT_ON_ARRIVAL",
    title: "Text Me on Arrival",
    desc: "Send an SMS / WhatsApp message upon arrival.",
    icon: MessageSquare,
  },
  {
    id: "NO_RING_OR_KNOCK",
    title: "Don’t Ring or Knock",
    desc: "Leave order quietly at doorstep without noise.",
    icon: VolumeX,
    tag: "Quiet",
  },
];

interface DeliveryPreferencesSelectorProps {
  selectedPreference: DeliveryPreferenceType;
  onSelectPreference: (pref: DeliveryPreferenceType) => void;
  instructions: string;
  onChangeInstructions: (text: string) => void;
}

export function DeliveryPreferencesSelector({
  selectedPreference,
  onSelectPreference,
  instructions,
  onChangeInstructions,
}: DeliveryPreferencesSelectorProps) {
  const maxChars = 200;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#1A1715] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF4D2D]" />
          <span>2. Delivery Preferences & Courier Instructions</span>
        </h3>
        <span className="text-[11px] font-semibold text-[#766E65]">
          Passed directly to delivery partner
        </span>
      </div>

      {/* Radio-card Grid for 6 Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {DELIVERY_PREFERENCES_LIST.map((pref) => {
          const isSelected = selectedPreference === pref.id;
          const Icon = pref.icon;

          return (
            <div
              key={pref.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectPreference(pref.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onSelectPreference(pref.id);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative outline-none select-none ${
                isSelected
                  ? "bg-[#FFF5F2] border-[#FF4D2D] ring-2 ring-[#FF4D2D]/30 shadow-xs"
                  : "bg-[#FAF8F5] border-[#EBE5DF] hover:border-[#D5CDC4] hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#FF4D2D] text-white"
                      : "bg-white text-[#766E65] shadow-2xs"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D2D]" />
                ) : pref.tag ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F3EFEA] text-[#766E65]">
                    {pref.tag}
                  </span>
                ) : null}
              </div>

              <div>
                <p className="font-bold text-xs text-[#1A1715] leading-snug">
                  {pref.title}
                </p>
                <p className="text-[10px] text-[#766E65] line-clamp-1 mt-0.5">
                  {pref.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contactless Delivery Explanatory Banner if LEAVE_AT_DOORSTEP or NO_RING_OR_KNOCK */}
      {(selectedPreference === "LEAVE_AT_DOORSTEP" ||
        selectedPreference === "NO_RING_OR_KNOCK") && (
        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#16A34A]/20 flex items-start gap-2.5 text-xs text-[#166534] animate-in fade-in duration-200">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Contactless Delivery Active:</strong> Your courier partner will place your tamper-sealed parcel at your doorstep and verify delivery handover without physical contact.
          </p>
        </div>
      )}

      {/* Custom Delivery Instructions Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="delivery-instructions"
            className="font-bold text-[#1A1715]"
          >
            Additional delivery instructions (optional)
          </label>
          <span
            className={`font-mono text-[11px] ${
              instructions.length > 180 ? "text-[#FF4D2D] font-bold" : "text-[#9E948C]"
            }`}
          >
            {instructions.length}/{maxChars}
          </span>
        </div>

        <textarea
          id="delivery-instructions"
          value={instructions}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onChangeInstructions(e.target.value);
            }
          }}
          placeholder="E.g., Leave the order near the main door, apartment 204. Call society intercom if main gate is closed."
          rows={2}
          className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs text-[#1A1715] placeholder-[#9E948C] focus:outline-none focus:border-[#FF4D2D] focus:bg-white transition-all resize-none font-medium leading-relaxed"
        />
        <p className="text-[10px] text-[#9E948C]">
          Instructions are shared in real-time with the courier upon dispatch and displayed on the live radar tracking screen.
        </p>
      </div>
    </div>
  );
}
