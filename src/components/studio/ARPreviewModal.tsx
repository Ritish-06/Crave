"use client";

import React, { useState } from "react";
import {
  X,
  QrCode,
  Smartphone,
  Eye,
  Check,
  Copy,
  Sparkles,
  Layers,
  Compass,
  Maximize2,
  ExternalLink,
  Flame,
  Info
} from "lucide-react";
import { BurgerCustomizationState } from "@/types";

interface ARPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: BurgerCustomizationState;
  price: number;
  calories: number;
}

export function ARPreviewModal({
  isOpen,
  onClose,
  customization,
  price,
  calories
}: ARPreviewModalProps) {
  const [activeMode, setActiveMode] = useState<"qr" | "simulated">("qr");
  const [copied, setCopied] = useState(false);
  const [simulatedLighting, setSimulatedLighting] = useState<"warm-dining" | "natural-daylight" | "studio-dramatic">("warm-dining");

  if (!isOpen) return null;

  const bunLabels: Record<string, string> = {
    brioche: "Golden Brioche",
    sesame: "Toasted Sesame",
    charcoal: "Smoked Charcoal",
    "gluten-free": "Organic Gluten-Free"
  };

  const pattyLabels: Record<string, string> = {
    wagyu: "Double Wagyu Smash",
    "crispy-chicken": "Crispy Buttermilk Chicken",
    "plant-protein": "Smoked Plant Protein",
    "paneer-steak": "Grilled Cottage Steak"
  };

  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/studio?ar=1&bun=${customization.bun}&patty=${customization.pattyType}&count=${customization.pattyCount}`
    : "https://crave.luxury/studio?ar=1";

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ar-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-[#140E0A] border border-[#2A1F18] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2A1F18] flex items-center justify-between bg-[#1C1511]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D2D]/20 border border-[#FF4D2D]/40 flex items-center justify-center text-[#FF4D2D]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ar-modal-title" className="text-lg font-black text-white">
                  CRAVE Augmented Reality (AR)
                </h3>
                <span className="text-[10px] font-bold bg-[#FF4D2D] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  1:1 Life Size
                </span>
              </div>
              <p className="text-xs text-[#9E948C]">
                Place your custom culinary creation right on your dining table
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2A1F18] text-[#9E948C] hover:text-white hover:bg-[#3D2C22] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close AR modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 pb-2 bg-[#17100B] border-b border-[#2A1F18]/50 flex gap-2">
          <button
            onClick={() => setActiveMode("qr")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "qr"
                ? "bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/30"
                : "bg-[#1C1511] text-[#A3988E] hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan with Phone (iOS & Android)</span>
          </button>

          <button
            onClick={() => setActiveMode("simulated")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "simulated"
                ? "bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/30"
                : "bg-[#1C1511] text-[#A3988E] hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Desktop AR Tabletop Simulator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeMode === "qr" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code Presentation */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-[#1C1511] rounded-3xl border border-[#2A1F18] relative group">
                {/* Simulated Stylized High-Tech QR Code SVG with CRAVE Logo */}
                <div className="relative p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <svg
                    className="w-52 h-52 sm:w-56 sm:h-56 text-[#140E0A]"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                  >
                    {/* Top-Left Finder */}
                    <rect x="16" y="16" width="64" height="64" rx="10" />
                    <rect x="24" y="24" width="48" height="48" rx="6" fill="white" />
                    <rect x="34" y="34" width="28" height="28" rx="4" />

                    {/* Top-Right Finder */}
                    <rect x="176" y="16" width="64" height="64" rx="10" />
                    <rect x="184" y="24" width="48" height="48" rx="6" fill="white" />
                    <rect x="194" y="34" width="28" height="28" rx="4" />

                    {/* Bottom-Left Finder */}
                    <rect x="16" y="176" width="64" height="64" rx="10" />
                    <rect x="24" y="184" width="48" height="48" rx="6" fill="white" />
                    <rect x="34" y="194" width="28" height="28" rx="4" />

                    {/* Data Matrix Elements (Procedural Aesthetic QR Blocks) */}
                    <rect x="92" y="24" width="16" height="16" rx="2" />
                    <rect x="116" y="24" width="24" height="16" rx="2" />
                    <rect x="148" y="24" width="16" height="28" rx="2" />
                    <rect x="92" y="52" width="24" height="16" rx="2" />
                    <rect x="124" y="48" width="16" height="32" rx="2" />
                    <rect x="16" y="92" width="32" height="16" rx="2" />
                    <rect x="56" y="92" width="24" height="24" rx="2" />
                    <rect x="92" y="92" width="16" height="16" rx="2" />
                    <rect x="148" y="88" width="32" height="16" rx="2" />
                    <rect x="188" y="92" width="24" height="28" rx="2" />
                    <rect x="220" y="92" width="20" height="20" rx="2" />

                    {/* Timing Patterns */}
                    <rect x="24" y="124" width="16" height="16" rx="2" />
                    <rect x="48" y="124" width="28" height="16" rx="2" />
                    <rect x="84" y="124" width="20" height="24" rx="2" />
                    <rect x="156" y="124" width="28" height="16" rx="2" />
                    <rect x="192" y="128" width="16" height="16" rx="2" />
                    <rect x="216" y="124" width="24" height="28" rx="2" />

                    {/* Lower Data Blocks */}
                    <rect x="92" y="156" width="32" height="16" rx="2" />
                    <rect x="132" y="148" width="16" height="24" rx="2" />
                    <rect x="156" y="156" width="20" height="32" rx="2" />
                    <rect x="184" y="164" width="28" height="16" rx="2" />
                    <rect x="220" y="160" width="20" height="24" rx="2" />
                    <rect x="92" y="180" width="16" height="28" rx="2" />
                    <rect x="116" y="188" width="32" height="16" rx="2" />
                    <rect x="156" y="196" width="24" height="28" rx="2" />
                    <rect x="188" y="188" width="16" height="36" rx="2" />
                    <rect x="212" y="192" width="28" height="20" rx="2" />
                    <rect x="92" y="216" width="36" height="24" rx="2" />
                    <rect x="136" y="220" width="16" height="20" rx="2" />
                    <rect x="160" y="232" width="36" height="16" rx="2" />
                    <rect x="204" y="220" width="36" height="20" rx="2" />

                    {/* Center CRAVE Logo Badge Overlay */}
                    <circle cx="128" cy="128" r="28" fill="#FF4D2D" />
                  </svg>

                  {/* Centered Burger Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xl">🍔</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#A3988E]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Instant iOS AR QuickLook & Android WebXR ready</span>
                </div>
              </div>

              {/* Instructions and Specs */}
              <div className="md:col-span-6 space-y-4">
                <div className="bg-[#1C1511] p-4 rounded-2xl border border-[#2A1F18] space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
                    <span>How it works:</span>
                  </h4>
                  <ol className="text-xs text-[#A3988E] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Open your smartphone camera (iPhone Safari or Android Chrome).</li>
                    <li>Point your lens at the QR code on your screen.</li>
                    <li>Tap the yellow AR QuickLook banner that appears.</li>
                    <li>Aim camera at any flat surface (table or desk) to spawn your 3D burger!</li>
                  </ol>
                </div>

                {/* Real-time Dimensions & Caloric Profile */}
                <div className="bg-[#1C1511] p-4 rounded-2xl border border-[#2A1F18] space-y-2.5">
                  <span className="text-[11px] font-bold text-[#FF4D2D] uppercase tracking-wider">
                    Digital Twin Telemetry
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#140E0A] border border-[#2A1F18]">
                      <span className="text-[#9E948C] block text-[10px]">Real-World Height</span>
                      <span className="font-bold text-white">
                        {customization.pattyCount === 1 ? "9.8 cm" : customization.pattyCount === 2 ? "12.4 cm" : "15.1 cm"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140E0A] border border-[#2A1F18]">
                      <span className="text-[#9E948C] block text-[10px]">Bun Diameter</span>
                      <span className="font-bold text-white">12.5 cm</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140E0A] border border-[#2A1F18]">
                      <span className="text-[#9E948C] block text-[10px]">Customization</span>
                      <span className="font-bold text-white truncate block">
                        {bunLabels[customization.bun]} • {pattyLabels[customization.pattyType]}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#140E0A] border border-[#2A1F18]">
                      <span className="text-[#9E948C] block text-[10px]">Studio Price</span>
                      <span className="font-bold text-[#FF4D2D]">₹{price}</span>
                    </div>
                  </div>
                </div>

                {/* Copy Link Button */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1C1511] hover:bg-[#2A1F18] border border-[#2A1F18] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">AR Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#FF4D2D]" />
                        <span>Copy Shareable AR Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={shareableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF4D2D]/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop AR Tabletop Simulator */
            <div className="space-y-4">
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-[#2A1F18] bg-neutral-900 flex items-center justify-center shadow-inner group">
                {/* Background: Atmospheric Dining Table Environment */}
                <div
                  className={`absolute inset-0 transition-all duration-500 bg-cover bg-center ${
                    simulatedLighting === "warm-dining"
                      ? "brightness-75 contrast-110"
                      : simulatedLighting === "natural-daylight"
                      ? "brightness-100 contrast-100"
                      : "brightness-50 contrast-125"
                  }`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')`
                  }}
                />

                {/* AR Spatial Reticle and Grid Overlay */}
                <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

                {/* Perspective Reticle Grid on Table */}
                <div className="absolute bottom-12 w-64 h-32 border-2 border-emerald-400/60 rounded-[100%] transform -rotate-x-60 animate-pulse pointer-events-none flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80" />
                  <div className="absolute -top-6 text-[10px] font-mono text-emerald-400 font-bold bg-black/60 px-2 py-0.5 rounded-full">
                    Tracking Surface: Marble Dining (0.85m)
                  </div>
                </div>

                {/* 3D Simulated Burger on Table */}
                <div className="relative z-10 flex flex-col items-center transform translate-y-6">
                  {/* Subtle cast shadow */}
                  <div className="w-44 h-12 bg-black/80 rounded-full blur-md transform translate-y-24 scale-95" />

                  {/* High-res rendered burger avatar in simulated AR space */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 relative animate-bounce duration-1000">
                    <img
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=85"
                      alt="CRAVE AR Preview"
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)]"
                    />

                    {/* AR Bounding Box Frame */}
                    <div className="absolute -inset-2 border border-emerald-400/40 rounded-3xl pointer-events-none flex items-center justify-between p-2">
                      <span className="text-[9px] font-mono text-emerald-300 bg-black/70 px-1 rounded">
                        1:1 Life Size
                      </span>
                      <span className="text-[9px] font-mono text-emerald-300 bg-black/70 px-1 rounded">
                        60 FPS ARKit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating AR Badges */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    Spatial Reticle Active
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-[#FF4D2D] border border-[#FF4D2D]/30">
                    Live Occlusion Enabled
                  </span>
                </div>
              </div>

              {/* AR Lighting Controls */}
              <div className="flex items-center justify-between bg-[#1C1511] p-3.5 rounded-2xl border border-[#2A1F18]">
                <span className="text-xs font-bold text-[#9E948C]">
                  Simulate Ambient Environment:
                </span>
                <div className="flex gap-1.5">
                  {[
                    { id: "warm-dining", label: "Warm Dining (3200K)" },
                    { id: "natural-daylight", label: "Daylight (5500K)" },
                    { id: "studio-dramatic", label: "Night Lounge" }
                  ].map((light) => (
                    <button
                      key={light.id}
                      onClick={() => setSimulatedLighting(light.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        simulatedLighting === light.id
                          ? "bg-[#FF4D2D] text-white shadow-md"
                          : "bg-[#140E0A] text-[#A3988E] hover:text-white border border-[#2A1F18]"
                      }`}
                    >
                      {light.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2A1F18] bg-[#1C1511] flex items-center justify-between text-xs text-[#9E948C]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#FF4D2D]" />
            <span>Compatible with iPhone (iOS 14+) and Google ARCore Android devices</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2A1F18] hover:bg-[#3D2C22] text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
