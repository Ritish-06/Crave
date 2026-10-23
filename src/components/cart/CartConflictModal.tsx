"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartConflictModal() {
  const { conflictModal, resolveConflict } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 shadow-2xl border border-[#EBE5DF] animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 text-[#FF4D2D] mb-4">
          <div className="p-2.5 rounded-2xl bg-[#FFF1EE]">
            <AlertTriangle className="w-6 h-6 text-[#FF4D2D]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1715]">Replace Cart Items?</h3>
            <p className="text-xs text-[#766E65]">One Restaurant Per Order</p>
          </div>
        </div>

        <p className="text-sm text-[#665E57] leading-relaxed mb-6">
          Your cravings cart currently contains gourmet dishes from{" "}
          <strong className="text-[#1A1715]">{conflictModal.currentRestaurantName}</strong>.
          CRAVE ensures food freshness by dispatching directly from a single kitchen.
          Would you like to discard the current items and start an order from{" "}
          <strong className="text-[#FF4D2D]">{conflictModal.newRestaurantName}</strong>?
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 py-3 rounded-2xl border border-[#E5DDD4] bg-white text-[#1A1715] font-semibold text-sm hover:bg-[#F3EFEA] transition-colors"
          >
            Keep Current Cart
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-sm hover:bg-[#E03A1A] transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Discard & Add
          </button>
        </div>
      </div>
    </div>
  );
}
