"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bike,
  MapPin,
  ChefHat,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Gauge,
  Thermometer,
  Radio,
  Compass,
  Navigation
} from "lucide-react";

interface DeliveryRadarMapProps {
  progressPercent: number; // 0 to 100
  onProgressChange: (newPercent: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  restaurantName: string;
  deliveryLocality: string;
}

export function DeliveryRadarMap({
  progressPercent,
  onProgressChange,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onChangeSpeed,
  restaurantName,
  deliveryLocality
}: DeliveryRadarMapProps) {
  // S-curve polyline coordinates normalized 0-1000 x 0-400
  // Simulating urban road topology through city blocks
  const routePoints = [
    { x: 80, y: 320, name: "Kitchen Hub" },
    { x: 220, y: 280, name: "Commercial High St." },
    { x: 380, y: 150, name: "Metro Flyover" },
    { x: 540, y: 220, name: "Linking Road Junction" },
    { x: 720, y: 120, name: "Coastal Promenade" },
    { x: 920, y: 90, name: "Your Residence" }
  ];

  // Calculate courier coordinates along the bezier/segmented route
  const getCoordinatesAtPercent = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const totalSegments = routePoints.length - 1;
    const segmentProgress = (clamped / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
    const subProgress = segmentProgress - segmentIndex;

    const p0 = routePoints[segmentIndex];
    const p1 = routePoints[segmentIndex + 1];

    const currentX = p0.x + (p1.x - p0.x) * subProgress;
    const currentY = p0.y + (p1.y - p0.y) * subProgress;

    // Angle of courier movement
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    return { x: currentX, y: currentY, angle: angleDeg };
  };

  const courierPos = getCoordinatesAtPercent(progressPercent);

  // Dynamic telemetry values based on route position
  const currentSpeed = isPlaying ? Math.round(26 + Math.sin(progressPercent / 5) * 6) : 0;
  const distanceRemainingKm = Math.max(0.1, ((100 - progressPercent) / 100) * 3.8).toFixed(1);
  const etaMinutes = Math.max(1, Math.round(((100 - progressPercent) / 100) * 16));

  return (
    <div className="rounded-3xl bg-[#140E0A] text-white p-5 sm:p-7 border border-[#2A1F18] relative overflow-hidden shadow-2xl space-y-5">
      {/* Top Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A1F18] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Courier GPS Radar
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#FF4D2D]/20 text-[#FF4D2D] text-[10px] font-bold">
            60 FPS TELEMETRY
          </span>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1C1511] border border-[#2A1F18]">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-white font-bold">{currentSpeed} km/h</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1C1511] border border-[#2A1F18]">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-white font-bold">68.2°C Hot-Insulated</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1C1511] border border-[#2A1F18]">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-white font-bold">84% EV</span>
          </div>
        </div>
      </div>

      {/* SVG Vector Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-[#120D0A] border border-[#2A1F18] overflow-hidden select-none">
        {/* Radar concentric circular sweeps */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[180px] h-[180px] rounded-full border border-emerald-400 animate-ping duration-1000" />
          <div className="w-[340px] h-[340px] rounded-full border border-[#FF4D2D]" />
          <div className="w-[500px] h-[500px] rounded-full border border-white/40" />
        </div>

        {/* Subtle City Road Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF4D2D_1px,transparent_1px)] [background-size:24px_24px]" />

        <svg
          viewBox="0 0 1000 400"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Street Grid Lines */}
          <line x1="0" y1="180" x2="1000" y2="180" stroke="#2A1F18" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="0" y1="280" x2="1000" y2="280" stroke="#2A1F18" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#2A1F18" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="680" y1="0" x2="680" y2="400" stroke="#2A1F18" strokeWidth="2" strokeDasharray="4 4" />

          {/* Full Planned Route Shadow */}
          <path
            d="M 80 320 Q 220 280, 380 150 T 720 120 T 920 90"
            fill="none"
            stroke="#2A1F18"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Planned Route Line */}
          <path
            d="M 80 320 Q 220 280, 380 150 T 720 120 T 920 90"
            fill="none"
            stroke="#3D2B20"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />

          {/* Traveled Route Line (Glowing Active Segment) */}
          <path
            d="M 80 320 Q 220 280, 380 150 T 720 120 T 920 90"
            fill="none"
            stroke="#16A34A"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset={1000 - (progressPercent / 100) * 1000}
            className="transition-all duration-300"
          />

          {/* Route Landmarks */}
          {routePoints.map((pt, idx) => (
            <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle r="4" fill="#9E948C" />
              <text
                y="18"
                textAnchor="middle"
                fill="#766E65"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {pt.name}
              </text>
            </g>
          ))}

          {/* Kitchen Starting Marker */}
          <g transform="translate(80, 320)">
            <circle r="20" fill="#FF4D2D" opacity="0.2" className="animate-ping" />
            <circle r="14" fill="#FF4D2D" />
          </g>

          {/* Destination Marker */}
          <g transform="translate(920, 90)">
            <circle r="22" fill="#16A34A" opacity="0.2" className="animate-ping" />
            <circle r="14" fill="#1C1511" stroke="#16A34A" strokeWidth="3" />
          </g>
        </svg>

        {/* HTML Rendered Animated Courier Node Floating on Calculated SVG Point */}
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            left: `${(courierPos.x / 1000) * 100}%`,
            top: `${(courierPos.y / 400) * 100}%`
          }}
        >
          {/* Radar Ripple Ring */}
          <div className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

          {/* Courier Badge */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-xl shadow-emerald-500/50 border-2 border-white/20">
            <Bike className="w-6 h-6 transform -scale-x-100" />
          </div>

          {/* Floating Courier Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap border border-white/10 shadow-lg">
            Vikram R. • {currentSpeed} km/h
          </div>
        </div>

        {/* Floating Start and End Label Cards */}
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <span className="text-[10px] text-[#A3988E] uppercase tracking-wider block font-bold">Origin:</span>
          <span className="font-bold text-white truncate max-w-[160px] block">{restaurantName}</span>
        </div>

        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-right">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Destination:</span>
          <span className="font-bold text-white">{deliveryLocality}</span>
        </div>
      </div>

      {/* Playback Controls & Progress Scrubber */}
      <div className="p-4 rounded-2xl bg-[#1C1511] border border-[#2A1F18] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Play/Pause & Scrubbing Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <button
            onClick={onTogglePlay}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-md cursor-pointer shrink-0 ${
              isPlaying
                ? "bg-[#FF4D2D] text-white hover:bg-[#E03A1A]"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
            title={isPlaying ? "Pause Simulation" : "Auto-advance courier journey"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-[#2A1F18] hover:bg-[#3D2C22] text-[#A3988E] hover:text-white transition-colors cursor-pointer"
            title="Reset to Kitchen Hub"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Interactive Progress Bar */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] text-[#A3988E] font-mono">
              <span>Journey: {Math.round(progressPercent)}%</span>
              <span className="text-white font-bold">{distanceRemainingKm} km remaining (~{etaMinutes}m)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => onProgressChange(Number(e.target.value))}
              className="w-full h-2 bg-[#2A1F18] rounded-lg appearance-none cursor-pointer accent-[#FF4D2D]"
            />
          </div>
        </div>

        {/* Speed multiplier selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-[#A3988E] uppercase tracking-wider mr-1">
            Speed:
          </span>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                playbackSpeed === s
                  ? "bg-[#FF4D2D] text-white"
                  : "bg-[#2A1F18] text-[#A3988E] hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
