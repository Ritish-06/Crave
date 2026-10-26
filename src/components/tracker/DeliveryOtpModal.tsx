"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  X,
  Copy,
  Check,
  KeyRound,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";

interface DeliveryOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpCode: string;
  onVerifySuccess: () => void;
}

export function DeliveryOtpModal({
  isOpen,
  onClose,
  otpCode,
  onVerifySuccess,
}: DeliveryOtpModalProps) {
  const [copied, setCopied] = useState(false);
  const [simulatedInput, setSimulatedInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeypadPress = (num: string) => {
    if (simulatedInput.length < 4) {
      const nextInput = simulatedInput + num;
      setSimulatedInput(nextInput);
      setErrorMessage(null);

      if (nextInput.length === 4) {
        if (nextInput === otpCode) {
          setIsSuccess(true);
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#16A34A", "#FF4D2D", "#FFA384", "#FFD700"]
          });
          setTimeout(() => {
            onVerifySuccess();
            onClose();
          }, 1200);
        } else {
          setErrorMessage("Incorrect OTP. Please enter the valid 4-digit code.");
        }
      }
    }
  };

  const handleClear = () => {
    setSimulatedInput("");
    setErrorMessage(null);
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1715]">
                Delivery Handover OTP
              </h3>
              <p className="text-xs text-[#766E65]">
                FSSAI-compliant secure parcel handover verification
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
        <div className="p-6 space-y-6">
          {/* OTP Presentation Card */}
          <div className="p-5 rounded-2xl bg-[#140E0A] text-white text-center space-y-3 shadow-lg border border-[#2A1F18]">
            <span className="text-[11px] font-bold text-[#FF4D2D] uppercase tracking-wider block">
              Share with Courier Partner upon arrival
            </span>

            <div className="flex justify-center items-center gap-3 py-2">
              {otpCode.split("").map((digit, i) => (
                <div
                  key={i}
                  className="w-12 h-14 rounded-2xl bg-[#1C1511] border border-white/20 flex items-center justify-center font-mono text-2xl font-black text-white shadow-inner"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>Copy Handover PIN</span>
                </>
              )}
            </button>
          </div>

          {/* Simulated Rider Verification Pad (Dev Feature) */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBE5DF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1715] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#FF4D2D]" />
                Simulate Courier Entry:
              </span>
              <span className="text-[10px] text-[#9E948C] font-mono">
                {simulatedInput.length}/4 Digits
              </span>
            </div>

            {/* Input Display */}
            <div className="h-10 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] flex items-center justify-center font-mono text-lg font-bold tracking-widest text-[#1A1715]">
              {simulatedInput ? simulatedInput : "• • • •"}
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            )}

            {isSuccess && (
              <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 animate-bounce">
                <Unlock className="w-4 h-4" />
                Handover Confirmed! Parcel Unlocked.
              </p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] font-mono text-sm font-bold text-[#1A1715] transition-colors cursor-pointer"
                >
                  {key}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[11px] font-bold text-[#766E65] transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => handleKeypadPress("0")}
                className="py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] font-mono text-sm font-bold text-[#1A1715] transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => {
                  setSimulatedInput(otpCode);
                  setIsSuccess(true);
                  setTimeout(() => {
                    onVerifySuccess();
                    onClose();
                  }, 900);
                }}
                className="py-2.5 rounded-xl bg-[#FFF1EE] hover:bg-[#FFE5E0] text-[11px] font-bold text-[#FF4D2D] transition-colors cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
