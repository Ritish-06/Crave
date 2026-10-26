"use client";

import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Send,
  Phone,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Bot
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "concierge";
  text: string;
  time: string;
}

interface OrderSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  restaurantName: string;
  courierName: string;
}

export function OrderSupportDrawer({
  isOpen,
  onClose,
  orderNumber,
  restaurantName,
  courierName,
}: OrderSupportDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "concierge",
      text: `Hello! I'm your CRAVE Concierge for order #${orderNumber}. Your delivery from ${restaurantName} is currently en route with ${courierName}. How may I assist you?`,
      time: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  if (!isOpen) return null;

  const quickPrompts = [
    "Where is my courier right now?",
    "Add gate / security code directions",
    "Is my parcel tamper-proof sealed?",
    "Can the rider ring my doorbell?"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate intelligent concierge response
    setTimeout(() => {
      let reply = "Your request has been forwarded to dispatch telemetry. We'll ensure your meal arrives in peak condition!";
      const lower = text.toLowerCase();

      if (lower.includes("where") || lower.includes("location") || lower.includes("courier")) {
        reply = `${courierName} is on Carter Road Promenade moving at ~26 km/h on an EV scooter. The thermal bag is maintaining 68°C internal temperature.`;
      } else if (lower.includes("gate") || lower.includes("directions") || lower.includes("code")) {
        reply = "Gate notes updated: Our rider has been instructed to notify society intercom upon arrival and follow your entry directions.";
      } else if (lower.includes("seal") || lower.includes("tamper") || lower.includes("safe")) {
        reply = "All CRAVE partner deliveries feature double-folded holographic tamper-evident seals verified under FSSAI food safety audit norms.";
      } else if (lower.includes("doorbell") || lower.includes("ring")) {
        reply = "Rider instruction tagged: 'Ring doorbell upon arrival'. Handover PIN will be requested at the door.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "concierge",
        text: reply,
        time: "Just now",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl border-l border-[#EBE5DF] flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#EBE5DF] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#1A1715]">
                  CRAVE Live Concierge
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#766E65]">
                Order #{orderNumber} Priority Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#766E65] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#FF4D2D] text-white rounded-br-xs shadow-xs"
                    : "bg-white text-[#1A1715] border border-[#EBE5DF] rounded-bl-xs shadow-xs"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#9E948C] mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestions & Input Bar */}
        <div className="p-4 border-t border-[#EBE5DF] bg-white space-y-3">
          {/* Quick Prompts */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E5DDD4] text-[11px] font-semibold text-[#1A1715] whitespace-nowrap cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your delivery..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
