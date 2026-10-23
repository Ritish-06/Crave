"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, MapPin } from "lucide-react";
import { INDIA_STATES_AND_UTS, CRAVE_DELIVERY_HUBS } from "@/data/indiaLocations";

export function Footer() {
  return (
    <footer className="bg-[#120D0A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A1F18] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2A1F18]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                CRAVE
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] inline-block"></span>
              </span>
              <p className="text-xs tracking-widest uppercase text-[#A3988E] mt-0.5">
                Every Bite, An Experience
              </p>
            </Link>
            <p className="text-sm text-[#A3988E] leading-relaxed max-w-sm">
              India&apos;s luxury AI-powered culinary discovery platform. Experience hyper-realistic 3D ingredient customization, transparent delivery coverage, and the country&apos;s finest artisanal kitchens.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs text-[#E5DDD4]">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>100% Verified Kitchens</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1511] border border-[#2A1F18] text-xs text-[#E5DDD4]">
                <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
                <span>Interactive 3D Studio</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF4D2D]">Discovery & Ops</h4>
            <ul className="space-y-2 text-sm text-[#A3988E]">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore Menu</Link></li>
              <li><Link href="/restaurants" className="hover:text-white transition-colors">Curated Restaurants</Link></li>
              <li><Link href="/studio" className="hover:text-white transition-colors">3D Dish Studio</Link></li>
              <li><Link href="/group-order" className="hover:text-white transition-colors text-[#FAF8F5] font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2D]"></span>Group Order Room</Link></li>
              <li><Link href="/ai-sommelier" className="hover:text-white transition-colors">CRAVE AI Sommelier</Link></li>
              <li><Link href="/live-tracker" className="hover:text-white transition-colors">Live Order Tracker</Link></li>
              <li><Link href="/kitchen" className="hover:text-white transition-colors text-amber-400 font-medium">Kitchen Display (KDS)</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors text-emerald-400 font-medium">SuperAdmin Operations</Link></li>
            </ul>
          </div>

          {/* Major Indian Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF4D2D]">Active Cities</h4>
            <ul className="space-y-2 text-sm text-[#A3988E]">
              {CRAVE_DELIVERY_HUBS.map(hub => (
                <li key={hub.city} className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D2D]/80" />
                  <span>{hub.city} ({hub.state})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Administrative Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF4D2D]">India Coverage</h4>
            <p className="text-xs text-[#A3988E] leading-relaxed">
              Full administrative lookup mapping all 28 States and 8 Union Territories across 780+ official districts.
            </p>
            <div className="p-3 rounded-xl bg-[#1C1511] border border-[#2A1F18] text-[11px] text-[#A3988E]">
              <span className="text-[#FAF8F5] font-semibold">28 States & 8 UTs</span> indexed with PIN code geocoding and real-time coverage verification.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#766E65] gap-4">
          <p>© 2026 CRAVE Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FAF8F5] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#FAF8F5] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#FAF8F5] cursor-pointer">FSSAI License #10023022001452</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
