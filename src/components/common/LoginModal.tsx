"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function LoginModal() {
  const {
    isLoginModalOpen,
    setLoginModalOpen,
    pendingActionDescription,
    login,
    signup,
    cancelPendingAction
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Clear errors when toggling modes
  useEffect(() => {
    setErrorMessage(null);
  }, [mode]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoginModalOpen) {
        handleClose();
      }
    };
    if (isLoginModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    cancelPendingAction();
    setLoginModalOpen(false);
    setErrorMessage(null);
  };

  const handleQuickDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await login({
      identifier: "ritish@example.com",
      password: "password123"
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessToast("Welcome back, Ritish! Resuming your order...");
      setTimeout(() => setSuccessToast(null), 2500);
    } else {
      setErrorMessage(res.error || "Demo login failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (mode === "login") {
      if (!identifier.trim() || !password) {
        setErrorMessage("Please enter both email/phone and password.");
        setIsSubmitting(false);
        return;
      }

      const res = await login({ identifier, password });
      setIsSubmitting(false);

      if (res.success) {
        setSuccessToast("Welcome to CRAVE! Resuming your craving...");
        setTimeout(() => setSuccessToast(null), 2500);
      } else {
        setErrorMessage(res.error || "Invalid login credentials.");
      }
    } else {
      if (!name.trim()) {
        setErrorMessage("Please enter your name.");
        setIsSubmitting(false);
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please provide a valid email address.");
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        setIsSubmitting(false);
        return;
      }

      const res = await signup({ name, email, phone, password });
      setIsSubmitting(false);

      if (res.success) {
        setSuccessToast(`Welcome to CRAVE, ${name}! Resuming your craving...`);
        setTimeout(() => setSuccessToast(null), 2500);
      } else {
        setErrorMessage(res.error || "Could not complete registration.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-[#FAF8F5] p-6 sm:p-8 text-left shadow-2xl transition-all border border-[#EBE5DF] animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-5 top-5 p-2 rounded-xl text-[#9E948C] hover:text-[#1A1715] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-black tracking-tight text-[#1A1715] flex items-center gap-1.5 font-sans">
                CRAVE
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] inline-block"></span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFF1EE] text-[#FF4D2D] rounded-full border border-[#FFD9D1]">
                Guest Order Gate
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#1A1715] font-sans">
              Your next craving is waiting.
            </h2>
            <p className="text-xs text-[#766E65] mt-1 leading-relaxed">
              {pendingActionDescription
                ? `Log in or create your CRAVE account to ${pendingActionDescription}.`
                : "Log in or create your CRAVE account to continue your order without losing your cart."}
            </p>
          </div>

          {/* Quick Demo Login One-Click Shortcut */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF1EE] to-[#FFF8F5] border border-[#FFD9D1] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#FF4D2D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1A1715] truncate">Demo Foodie Account</p>
                <p className="text-[11px] text-[#766E65] truncate">ritish@example.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl bg-[#1A1715] hover:bg-black text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              Instant Login
            </button>
          </div>

          {/* Tabs: Sign In vs Create Account */}
          <div className="flex rounded-2xl bg-[#EBE5DF]/60 p-1 mb-5">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ritish Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                  />
                </div>
              </div>
            )}

            {mode === "signup" ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ritish@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                    Phone Number <span className="text-[#9E948C] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98201 44521"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  Email or Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ritish@example.com or phone"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("ritish@example.com");
                      setPassword("password123");
                    }}
                    className="text-[10px] text-[#FF4D2D] hover:underline font-semibold"
                  >
                    Fill Demo Password
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E948C] hover:text-[#1A1715]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In & Continue Order" : "Create Account & Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-[#EBE5DF] flex items-center justify-center gap-1.5 text-[10px] text-[#9E948C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Secure session cookie with encrypted credentials.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
