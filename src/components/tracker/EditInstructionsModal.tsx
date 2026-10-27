"use client";

import React, { useState } from "react";
import { X, Check, Bell, ShieldCheck, AlertCircle } from "lucide-react";
import { DeliveryPreferenceType } from "@/types";
import { DELIVERY_PREFERENCES_CONFIG } from "@/data/deliveryPreferences";

interface EditInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreference: DeliveryPreferenceType;
  currentInstructions: string;
  isDelivered: boolean;
  onSave: (pref: DeliveryPreferenceType, inst: string) => Promise<void> | void;
}

export function EditInstructionsModal({
  isOpen,
  onClose,
  currentPreference,
  currentInstructions,
  isDelivered,
  onSave,
}: EditInstructionsModalProps) {
  const [preference, setPreference] = useState<DeliveryPreferenceType>(currentPreference);
  const [instructions, setInstructions] = useState(currentInstructions);
  const [isSaving, setIsSaving] = useState(false);
  const maxChars = 200;

  if (!isOpen) return null;

  const handleSave = async () => {
    if (isDelivered) return;
    setIsSaving(true);
    try {
      await onSave(preference, instructions.slice(0, maxChars).trim());
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EBE5DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1715]">
                Update Delivery Preferences
              </h3>
              <p className="text-xs text-[#766E65]">
                In-flight instructions update for your active order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#766E65] hover:text-[#1A1715] hover:bg-[#EBE5DF]/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {isDelivered ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <span>
                This order has already been delivered. Delivery instructions are now locked and read-only.
              </span>
            </div>
          ) : (
            <>
              {/* Select Preference */}
              <div>
                <label className="block text-xs font-bold text-[#1A1715] mb-2 uppercase tracking-wider">
                  How should we deliver your order?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DELIVERY_PREFERENCES_CONFIG.map((opt) => {
                    const isSelected = preference === opt.id;
                    const Icon = opt.icon;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPreference(opt.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-[#FFF5F2] border-[#FF4D2D] ring-2 ring-[#FF4D2D]/30"
                            : "bg-[#FAF8F5] border-[#EBE5DF] hover:border-[#1A1715]/40"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#FF4D2D] text-white"
                              : "bg-white text-[#766E65] border border-[#EBE5DF]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1A1715]">
                              {opt.title}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#FF4D2D]" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#766E65] mt-0.5 line-clamp-2">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1A1715] uppercase tracking-wider">
                    Additional Instructions (Optional)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      instructions.length >= maxChars
                        ? "text-red-500 font-bold"
                        : "text-[#766E65]"
                    }`}
                  >
                    {instructions.length}/{maxChars}
                  </span>
                </div>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value.slice(0, maxChars))}
                  placeholder="E.g., Leave the order near the main door, apartment 204."
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs text-[#1A1715] placeholder-[#9E948C] focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-2.5 text-[11px] text-[#766E65]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Updates will instantly synchronize with your delivery partner’s live telemetry.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EBE5DF] flex items-center justify-end gap-3 bg-[#FAF8F5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#EBE5DF] text-xs font-bold text-[#766E65] hover:text-[#1A1715] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {!isDelivered && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03B1D] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Saving Updates..." : "Save Delivery Instructions"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
