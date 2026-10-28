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
  ShieldCheck,
  Smartphone,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function LoginModal() {
  const {
    isLoginModalOpen,
    setLoginModalOpen,
    pendingActionDescription,
    login,
    signup,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithOAuth,
    cancelPendingAction
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Password Login / Signup form fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Phone OTP state
  const [otpPhone, setOtpPhone] = useState("+91 98201 44521");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"enter_phone" | "enter_code">("enter_phone");
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Clear errors when toggling modes
  useEffect(() => {
    setErrorMessage(null);
    setDemoOtpHint(null);
  }, [mode]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

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
    setDemoOtpHint(null);
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

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await loginWithOAuth(provider);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessToast(`Signed in with ${provider === "google" ? "Google" : "Apple"}! Resuming order...`);
      setTimeout(() => setSuccessToast(null), 2500);
    } else {
      setErrorMessage(res.error || `${provider} sign-in failed.`);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpPhone.trim()) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await sendPhoneOtp(otpPhone);
    setIsSubmitting(false);

    if (res.success) {
      setOtpStep("enter_code");
      setDemoOtpHint(res.testOtp || "123456");
      setResendCountdown(30);
    } else {
      setErrorMessage(res.error || "Could not send verification SMS.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await verifyPhoneOtp(otpPhone, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessToast("Mobile verified! Continuing your CRAVE order...");
      setTimeout(() => setSuccessToast(null), 2500);
    } else {
      setErrorMessage(res.error || "Invalid verification code.");
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
        setSuccessToast("Welcome back! Resuming your order...");
        setTimeout(() => setSuccessToast(null), 2500);
      } else {
        setErrorMessage(res.error || "Invalid login credentials.");
      }
    } else if (mode === "signup") {
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
        setSuccessToast(`Welcome to CRAVE, ${name}! Resuming order...`);
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
          <div className="mb-5">
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
                ? `Sign in or register to ${pendingActionDescription}.`
                : "Sign in or register to continue your order without losing your cart selections."}
            </p>
          </div>

          {/* Quick Demo Login One-Click Shortcut */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#FFF1EE] to-[#FFF8F5] border border-[#FFD9D1] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D2D] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1A1715] truncate">Demo Foodie Account</p>
                <p className="text-[10px] text-[#766E65] truncate">ritish@example.com (Password: password123)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl bg-[#1A1715] hover:bg-black text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              Instant Login
            </button>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#F3EFEA] border border-[#E5DDD4] text-[#1A1715] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("apple")}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#F3EFEA] border border-[#E5DDD4] text-[#1A1715] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.62-.75 1.04-1.8 0.93-2.86-.9.04-1.98.6-2.62 1.35-.57.65-1.07 1.72-.94 2.76 1 .08 2.02-.51 2.63-1.25" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center mb-3">
            <div className="flex-grow border-t border-[#EBE5DF]"></div>
            <span className="shrink-0 mx-3 text-[10px] font-bold text-[#9E948C] uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-[#EBE5DF]"></div>
          </div>

          {/* Mode Switcher: Password Sign In vs Phone OTP vs Create Account */}
          <div className="flex rounded-2xl bg-[#EBE5DF]/60 p-1 mb-4">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode("otp")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "otp"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#766E65] hover:text-[#1A1715]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* MODE 1: PHONE OTP FLOW */}
          {mode === "otp" && (
            <div className="space-y-3.5">
              {otpStep === "enter_phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        placeholder="+91 98201 44521"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending SMS OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  {demoOtpHint && (
                    <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>SMS Sent! Code is: <strong className="font-mono text-sm tracking-widest">{demoOtpHint}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(demoOtpHint)}
                        className="text-[10px] font-bold text-[#D97706] hover:underline"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider">
                        Enter 6-Digit Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpStep("enter_phone")}
                        className="text-[10px] text-[#766E65] hover:text-[#1A1715]"
                      >
                        Change {otpPhone}
                      </button>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.4em] py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-base font-mono font-bold text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#766E65] px-1">
                    <span>Didn&apos;t receive code?</span>
                    {resendCountdown > 0 ? (
                      <span className="text-[11px] font-semibold text-[#9E948C]">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-[11px] font-bold text-[#FF4D2D] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend Code</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length < 6}
                    className="w-full py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Continue Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2 & 3: PASSWORD LOGIN & SIGNUP */}
          {mode !== "otp" && (
            <form onSubmit={handleSubmit} className="space-y-3">
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
                      placeholder="Ritish Sharma"
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
                      placeholder="ritish@example.com or mobile"
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
                className="w-full mt-2 py-2.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In & Continue Order" : "Create Account & Order"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

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
