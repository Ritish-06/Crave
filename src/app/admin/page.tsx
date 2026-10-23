"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  Building,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Server,
  Database,
  Radio,
  Search,
  Power,
  Sliders,
  DollarSign
} from "lucide-react";
import { CRAVE_DELIVERY_HUBS, INDIA_STATES_AND_UTS } from "@/data/indiaLocations";
import { ALL_RESTAURANTS } from "@/data/restaurantsData";

export default function SuperAdminPage() {
  const [hubStatuses, setHubStatuses] = useState<Record<string, boolean>>({
    Mumbai: true,
    Bengaluru: true,
    "Delhi NCR": true,
    Gurugram: true,
    Hyderabad: true,
    Pune: true
  });

  const [activeTab, setActiveTab] = useState<"logistics" | "partners" | "infra">("logistics");

  const toggleHub = (cityName: string) => {
    setHubStatuses((prev) => ({
      ...prev,
      [cityName]: !prev[cityName]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#1A1715] text-white text-[11px] font-bold uppercase tracking-wider">
                SuperAdmin Console
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                National Network Live
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#1A1715]">
              CRAVE Platform & Logistics Operations
            </h1>
            <p className="text-xs text-[#766E65]">
              Real-time monitoring across 28 Indian States, 8 UTs, artisanal partner compliance, and edge microservices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/kitchen"
              className="px-4 py-2.5 rounded-2xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[#FF4D2D] text-xs font-bold transition-all border border-[#FFD9D1]"
            >
              Open Kitchen KDS
            </Link>
            <Link
              href="/explore"
              className="px-4 py-2.5 rounded-2xl bg-[#1A1715] hover:bg-[#2A2420] text-white text-xs font-bold transition-all shadow-xs"
            >
              Go to Storefront
            </Link>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] shadow-xs space-y-1">
            <span className="text-[11px] text-[#9E948C] font-bold uppercase tracking-wider">
              Platform GMV (MTD)
            </span>
            <div className="text-2xl font-black text-[#1A1715]">₹1.48 Cr</div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +24.6% MoM
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] shadow-xs space-y-1">
            <span className="text-[11px] text-[#9E948C] font-bold uppercase tracking-wider">
              Active Orders Today
            </span>
            <div className="text-2xl font-black text-[#1A1715]">2,420</div>
            <span className="text-[10px] text-emerald-600 font-bold">99.4% SLA adherence</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] shadow-xs space-y-1">
            <span className="text-[11px] text-[#9E948C] font-bold uppercase tracking-wider">
              Fleet Couriers
            </span>
            <div className="text-2xl font-black text-[#1A1715]">485 <span className="text-xs font-normal text-[#9E948C]">online</span></div>
            <span className="text-[10px] text-[#766E65]">Avg courier radius 4.2 km</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] shadow-xs space-y-1">
            <span className="text-[11px] text-[#9E948C] font-bold uppercase tracking-wider">
              Avg Delivery Speed
            </span>
            <div className="text-2xl font-black text-[#FF4D2D]">24.3 <span className="text-xs font-normal text-[#9E948C]">mins</span></div>
            <span className="text-[10px] text-emerald-600 font-bold">✓ High throughput</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DF] shadow-xs space-y-1">
            <span className="text-[11px] text-[#9E948C] font-bold uppercase tracking-wider">
              FSSAI Audit Pass
            </span>
            <div className="text-2xl font-black text-emerald-600">99.4%</div>
            <span className="text-[10px] text-[#766E65]">100% verified partners</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EBE5DF] gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab("logistics")}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "logistics"
                ? "border-[#FF4D2D] text-[#1A1715]"
                : "border-transparent text-[#9E948C] hover:text-[#1A1715]"
            }`}
          >
            <MapPin className="w-4 h-4 text-[#FF4D2D]" />
            National Hubs & Delivery Logistics ({CRAVE_DELIVERY_HUBS.length} Metro Hubs)
          </button>

          <button
            onClick={() => setActiveTab("partners")}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "partners"
                ? "border-[#FF4D2D] text-[#1A1715]"
                : "border-transparent text-[#9E948C] hover:text-[#1A1715]"
            }`}
          >
            <Building className="w-4 h-4 text-[#FF4D2D]" />
            Kitchen Partners & Compliance ({ALL_RESTAURANTS.length} Kitchens)
          </button>

          <button
            onClick={() => setActiveTab("infra")}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "infra"
                ? "border-[#FF4D2D] text-[#1A1715]"
                : "border-transparent text-[#9E948C] hover:text-[#1A1715]"
            }`}
          >
            <Activity className="w-4 h-4 text-[#FF4D2D]" />
            Infrastructure & Cloud Health
          </button>
        </div>

        {/* TAB 1: Hubs & Delivery Logistics */}
        {activeTab === "logistics" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#1A1715]">
                  Live Metro Delivery Hubs (India)
                </h3>
                <p className="text-xs text-[#766E65]">
                  Operational status, emergency weather surge toggles, and coverage PIN clusters.
                </p>
              </div>
              <span className="text-xs text-[#766E65] bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EBE5DF]">
                Coverage: 36 States & UTs with Express Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CRAVE_DELIVERY_HUBS.map((hub) => {
                const isOnline = hubStatuses[hub.city] !== false;
                return (
                  <div
                    key={hub.city}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-4 hover:border-[#FF4D2D]/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1715]">{hub.city}</h4>
                          <span className="text-[11px] text-[#766E65]">{hub.state}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHub(hub.city)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isOnline
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {isOnline ? "Hub Active" : "Hub Paused"}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#554C43] pt-2 border-t border-[#EBE5DF]">
                      <div className="flex justify-between">
                        <span>Delivery SLA:</span>
                        <strong className="text-[#1A1715]">20 - 30 mins</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fleet Assigned:</span>
                        <span className="font-semibold">{isOnline ? "64 Riders" : "0 (Standby)"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weather Condition:</span>
                        <span className="text-emerald-600 font-medium">Clear / Normal</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-[#9E948C] uppercase font-bold tracking-wider block mb-1">
                        PIN Coverage Cluster:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {hub.localities.map((loc) => (
                          <span
                            key={loc.pincode}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-[#E5DDD4] text-[#1A1715]"
                          >
                            {loc.pincode} ({loc.name})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Kitchen Partners & Compliance */}
        {activeTab === "partners" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#1A1715]">
                  Verified Partner Kitchens Directory
                </h3>
                <p className="text-xs text-[#766E65]">
                  FSSAI license certifications, safety audits, ratings, and commission terms.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EBE5DF] text-[#9E948C] uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Kitchen Name</th>
                    <th className="py-3 px-4 font-bold">City / Location</th>
                    <th className="py-3 px-4 font-bold">Rating</th>
                    <th className="py-3 px-4 font-bold">FSSAI Status</th>
                    <th className="py-3 px-4 font-bold">Price for Two</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5DF]">
                  {ALL_RESTAURANTS.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1715]">{restaurant.name}</div>
                        <div className="text-[11px] text-[#766E65]">{restaurant.cuisine.join(", ")}</div>
                      </td>
                      <td className="py-3 px-4 text-[#554C43]">
                        {restaurant.city}, {restaurant.state}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1A1715]">★ {restaurant.rating}</span>
                        <span className="text-[#9E948C] text-[10px] block">({restaurant.ratingCount} reviews)</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>FSSAI Certified</span>
                        </div>
                        <span className="text-[10px] text-[#9E948C] font-mono">Lic #10020042001928</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1A1715]">
                        ₹{restaurant.priceForTwo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Active & Live
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Infrastructure & Cloud Health */}
        {activeTab === "infra" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DF] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#1A1715]">
                System Architecture & Microservice Health
              </h3>
              <p className="text-xs text-[#766E65]">
                Telemetry, database connection pooling, cache hit ratios, and webhook delivery status.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE5DF] text-[#FF4D2D]">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1715]">Next.js Edge App Router</h4>
                    <span className="text-[11px] text-[#766E65]">Latency: 18ms • Turbopack Optimized</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  99.99% Healthy
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE5DF] text-blue-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1715]">PostgreSQL Prisma Cluster</h4>
                    <span className="text-[11px] text-[#766E65]">Connection Pool: 94% Available • Query 4ms</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Healthy
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE5DF] text-amber-600">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1715]">Razorpay Webhook Engine</h4>
                    <span className="text-[11px] text-[#766E65]">Real-time UPI / Card Settlement Sync</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  100% Synced
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE5DF] text-purple-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1715]">Three.js 3D Mesh Engine</h4>
                    <span className="text-[11px] text-[#766E65]">Client WebGL 60 FPS • PBR procedural shaders</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
