"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { OrderRecord } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    packagingFee,
    taxAmount,
    discountAmount,
    appliedCoupon,
    grandTotal,
    cartRestaurantId,
    cartRestaurantName,
    clearCart
  } = useCart();

  const { currentLocation, savedAddresses } = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<OrderRecord | null>(null);

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-[#9E948C] mb-4" />
        <h2 className="text-2xl font-bold text-[#1A1715]">No items to checkout</h2>
        <p className="text-xs text-[#766E65] mt-1">Please add dishes to your cart before proceeding.</p>
        <Link
          href="/explore"
          className="mt-4 px-6 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-xs"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = "CRV-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder: OrderRecord = {
        id: orderId,
        orderNumber: orderId,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        items: [...items],
        subtotal,
        deliveryFee,
        tax: taxAmount,
        discount: discountAmount,
        total: grandTotal,
        restaurantId: cartRestaurantId || "rst-1",
        restaurantName: cartRestaurantName || "The Truffle & Brioche Co.",
        deliveryAddress: {
          id: "addr-order",
          tag: "Home",
          recipientName: "Customer",
          phone: "+91 98201 44521",
          state: currentLocation.state,
          district: currentLocation.district,
          city: currentLocation.city,
          locality: currentLocation.locality,
          pincode: currentLocation.pincode,
          addressLine: currentLocation.addressLine || `${currentLocation.locality}, ${currentLocation.city}`
        },
        paymentMethod,
        paymentStatus: "paid",
        estimatedDeliveryTime: "25 - 30 mins",
        riderName: "Vikram R. (CRAVE Courier)",
        riderPhone: "+91 98450 11234"
      };

      // Save to order history
      try {
        const existingOrders = JSON.parse(localStorage.getItem("crave_orders") || "[]");
        localStorage.setItem("crave_orders", JSON.stringify([newOrder, ...existingOrders]));
        localStorage.setItem("crave_active_order", JSON.stringify(newOrder));
      } catch {}

      clearCart();
      setIsProcessing(false);
      setOrderConfirmed(newOrder);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF4D2D", "#16A34A", "#FFD700", "#140E0A"]
      });
    }, 1200);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[#EBE5DF] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#ECFDF5] text-[#16A34A] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
              Order Confirmed & Verified
            </span>
            <h1 className="text-3xl font-black text-[#1A1715] mt-1 font-sans">
              Every Bite, An Experience!
            </h1>
            <p className="text-xs text-[#766E65] mt-1">
              Order ID: <strong className="text-[#1A1715]">{orderConfirmed.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs space-y-2 text-left">
            <div className="flex justify-between font-semibold text-[#1A1715]">
              <span>Kitchen Partner</span>
              <span>{orderConfirmed.restaurantName}</span>
            </div>
            <div className="flex justify-between text-[#766E65]">
              <span>Delivery To</span>
              <span>{orderConfirmed.deliveryAddress.locality} ({orderConfirmed.deliveryAddress.pincode})</span>
            </div>
            <div className="flex justify-between text-[#766E65]">
              <span>Estimated Arrival</span>
              <span className="text-[#FF4D2D] font-bold">{orderConfirmed.estimatedDeliveryTime}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-[#1A1715] pt-2 border-t border-[#EBE5DF]">
              <span>Amount Paid</span>
              <span className="text-[#FF4D2D]">₹{orderConfirmed.total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/live-tracker"
              className="flex-1 py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Track Live Order</span>
            </Link>
            <Link
              href="/explore"
              className="flex-1 py-3.5 rounded-2xl bg-[#1A1715] hover:bg-black text-white font-bold text-sm transition-all"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1A1715] font-sans pb-6 border-b border-[#EBE5DF]">
          Checkout & Secure Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left Form: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Location Section */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1715] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF4D2D]" />
                  <span>1. Delivery Address</span>
                </h3>
                <span className="text-xs font-semibold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md">
                  Coverage Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs space-y-1">
                <p className="font-bold text-[#1A1715]">
                  {currentLocation.locality || currentLocation.city}
                </p>
                <p className="text-[#766E65]">
                  {currentLocation.addressLine || `${currentLocation.locality}, ${currentLocation.district}, ${currentLocation.state}`}
                </p>
                <p className="text-[#9E948C]">PIN Code: {currentLocation.pincode}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1A1715] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF4D2D]" />
                <span>2. Select Payment Method (India Focused)</span>
              </h3>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-[#FF4D2D]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">
                          Instant UPI (GPay, PhonePe, Paytm, BHIM)
                        </p>
                        <p className="text-xs text-[#766E65]">Zero transaction fee • Instant confirmation</p>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="mt-3 pt-3 border-t border-[#FFD9D1]">
                      <input
                        type="text"
                        placeholder="Enter your VPA / UPI ID (e.g. mobile@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5DDD4] text-xs font-semibold text-[#1A1715]"
                      />
                    </div>
                  )}
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-[#1A1715]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">
                          Credit or Debit Card (Visa, Mastercard, RuPay)
                        </p>
                        <p className="text-xs text-[#766E65]">256-Bit SSL Encrypted & Razorpay Ready</p>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>
                </div>

                {/* Netbanking Option */}
                <div
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "netbanking"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-[#1A1715]">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">Netbanking</p>
                        <p className="text-xs text-[#766E65]">All major Indian banks supported</p>
                      </div>
                    </div>
                    {paymentMethod === "netbanking" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-[#1A1715]">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">Cash on Delivery (COD)</p>
                        <p className="text-xs text-[#766E65]">Pay at your doorstep via cash or UPI QR</p>
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-md space-y-4">
              <h3 className="text-base font-black text-[#1A1715]">Order Summary</h3>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1A1715]">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.customizationSummary && (
                        <p className="text-[10px] text-[#FF4D2D]">
                          {item.customizationSummary.join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="font-black text-[#1A1715]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-[#766E65] border-t border-[#F3EFEA] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1A1715] font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Fee</span>
                  <span className="text-[#1A1715]">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner</span>
                  <span className="text-[#16A34A] font-bold">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="text-[#1A1715]">₹{taxAmount}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-bold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-black text-[#1A1715] pt-2 border-t border-[#EBE5DF]">
                <span>Total Due</span>
                <span className="text-[#FF4D2D]">₹{grandTotal}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-sm shadow-xl shadow-[#FF4D2D]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <span>Securing & Authorizing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm & Pay ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
