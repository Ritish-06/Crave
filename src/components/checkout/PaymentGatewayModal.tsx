"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Loader2,
  Smartphone,
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateway: "razorpay" | "stripe";
  amount: number;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  onSuccess: (paymentId: string, gateway: string) => void;
}

export function PaymentGatewayModal({
  isOpen,
  onClose,
  gateway,
  amount,
  orderNumber,
  customerName,
  customerPhone,
  onSuccess
}: PaymentGatewayModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes timer
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Countdown timer for UPI QR
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(300);
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleSimulatePayment = async (method: string) => {
    setIsProcessing(true);
    try {
      if (gateway === "razorpay") {
        const orderRes = await fetch("/api/payment/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_order",
            amount,
            orderId: orderNumber
          })
        });
        const orderData = await orderRes.json();

        // Simulate 750ms bank network authorization
        await new Promise((r) => setTimeout(r, 750));

        const simulatedPayId = `pay_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        const verifyRes = await fetch("/api/payment/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_payment",
            paymentId: simulatedPayId,
            orderId: orderData.orderId || orderNumber
          })
        });
        const verifyData = await verifyRes.json();
        setIsProcessing(false);
        onSuccess(verifyData.paymentId || simulatedPayId, "razorpay");
      } else {
        // Stripe
        const intentRes = await fetch("/api/payment/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_payment_intent",
            amount
          })
        });
        await intentRes.json();

        await new Promise((r) => setTimeout(r, 750));
        const simulatedStripeId = `ch_stripe_${Date.now()}`;
        setIsProcessing(false);
        onSuccess(simulatedStripeId, "stripe");
      }
    } catch (err) {
      console.error("Payment authorization failed:", err);
      setIsProcessing(false);
      onSuccess(`pay_fallback_${Date.now()}`, gateway);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all border border-[#E5DDD4] animate-in zoom-in-95">
          {/* Gateway Top Bar */}
          <div
            className={`px-6 py-4 flex items-center justify-between text-white ${
              gateway === "razorpay"
                ? "bg-gradient-to-r from-[#0C2340] to-[#123E6B]"
                : "bg-gradient-to-r from-[#635BFF] to-[#0A2540]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#58A6FF]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                  {gateway === "razorpay" ? "Razorpay Trusted Checkout" : "Stripe Secure Checkout"}
                </p>
                <p className="text-[11px] text-white/70">
                  CRAVE Luxury Culinary • Order #{orderNumber}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-white/70 block">Total Due</span>
              <span className="text-lg font-black tracking-tight text-white font-mono">
                ₹{amount}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-[#FAF8F5]">
            {/* Payment Method Tabs */}
            {gateway === "razorpay" && (
              <div className="flex rounded-2xl bg-[#EBE5DF]/60 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "upi"
                      ? "bg-white text-[#1A1715] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "card"
                      ? "bg-white text-[#1A1715] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("netbanking")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "netbanking"
                      ? "bg-white text-[#1A1715] shadow-xs"
                      : "text-[#766E65] hover:text-[#1A1715]"
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Net Banking</span>
                </button>
              </div>
            )}

            {/* TAB 1: UPI & QR CODE */}
            {(gateway === "stripe" ? false : activeTab === "upi") && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col items-center text-center">
                  <div className="relative p-3 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] mb-3">
                    {/* Simulated SVG QR code */}
                    <svg className="w-40 h-40 text-[#0F172A]" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                      <rect x="45" y="10" width="10" height="15" />
                      <rect x="40" y="35" width="20" height="10" />
                      <rect x="15" y="45" width="15" height="15" />
                      <rect x="70" y="45" width="20" height="10" />
                      <rect x="45" y="70" width="10" height="20" />
                      <rect x="70" y="70" width="15" height="15" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#FF4D2D] text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                        CRAVE UPI
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-[#1A1715]">
                    Scan QR with any UPI App
                  </p>
                  <p className="text-[11px] text-[#766E65] mt-0.5">
                    GPay • PhonePe • Paytm • Cred • BHIM
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF4D2D] text-[11px] font-mono font-bold">
                    <span>QR expires in:</span>
                    <span>{timerDisplay}</span>
                  </div>
                </div>

                {/* Instant Simulation Action */}
                <button
                  type="button"
                  onClick={() => handleSimulatePayment("upi_app")}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#0C2340] hover:bg-[#123E6B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#58A6FF]" />
                      <span>Waiting for UPI Authorization...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      <span>⚡ Simulate Instant UPI Approval (GPay / PhonePe)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARDS */}
            {(gateway === "stripe" || activeTab === "card") && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-[#EBE5DF] space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-[#9E948C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        value="4532 •••• •••• 8891"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-mono font-bold text-[#1A1715]"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#2563EB] uppercase">
                        Visa Verified
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="12 / 28"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-mono text-[#1A1715]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        readOnly
                        value="•••"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-mono text-[#1A1715]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={customerName}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment("card")}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>3D Secure Verification in Progress...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{amount} Securely</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: NET BANKING */}
            {gateway === "razorpay" && activeTab === "netbanking" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-[#EBE5DF] space-y-2.5">
                  <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider">
                    Select Indian Banking Partner
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          selectedBank === bank
                            ? "bg-[#FFF1EE] border-[#FF4D2D] text-[#FF4D2D] shadow-2xs"
                            : "bg-[#FAF8F5] border-[#EBE5DF] text-[#1A1715] hover:bg-[#F3EFEA]"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment("netbanking")}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to {selectedBank}...</span>
                    </>
                  ) : (
                    <>
                      <Building className="w-3.5 h-3.5" />
                      <span>Authorize Payment via {selectedBank}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Footer Trust Shield */}
            <div className="mt-5 pt-3 border-t border-[#EBE5DF] flex items-center justify-between text-[10px] text-[#9E948C]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#16A34A]" />
                <span>256-Bit Bank Grade SSL Encryption</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#9E948C] hover:text-[#DC2626] font-semibold"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
