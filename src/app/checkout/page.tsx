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
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Bell,
  DoorOpen,
  UserCheck,
  PhoneCall,
  MessageSquare,
  VolumeX,
  AlertCircle,
  Plus,
  Home,
  Briefcase,
  Navigation,
  Check,
  Smartphone
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { OrderRecord, DeliveryPreferenceType, SavedAddress } from "@/types";
import { DeliveryPreferencesSelector } from "@/components/checkout/DeliveryPreferencesSelector";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { PaymentGatewayModal } from "@/components/checkout/PaymentGatewayModal";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, requireAuth, setLoginModalOpen } = useAuth();
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

  const { currentLocation, savedAddresses, saveNewAddress, selectSavedAddress } = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "stripe" | "upi" | "card" | "cod" | "netbanking">("razorpay");
  const [upiId, setUpiId] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState<DeliveryPreferenceType>("RING_BELL");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<OrderRecord | null>(null);

  // Address and Payment Modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

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

  const handlePlaceOrder = async () => {
    requireAuth(async () => {
      const orderId = "CRV-" + Math.floor(100000 + Math.random() * 900000);
      setPendingOrderId(orderId);

      if (paymentMethod === "razorpay" || paymentMethod === "stripe") {
        setIsPaymentModalOpen(true);
        return;
      }

      await finalizeOrder(orderId, paymentMethod, paymentMethod === "cod" ? "pending" : "paid");
    }, "complete and place your order");
  };

  const finalizeOrder = async (
    orderId: string,
    method: "razorpay" | "stripe" | "upi" | "card" | "cod" | "netbanking",
    status: "paid" | "pending"
  ) => {
    setIsProcessing(true);

    const orderAddress: SavedAddress = {
      id: "addr-order",
      tag: "Home",
      recipientName: user?.name || "Customer",
      phone: user?.phone || "+91 98201 44521",
      state: currentLocation.state,
      district: currentLocation.district,
      city: currentLocation.city,
      locality: currentLocation.locality,
      pincode: currentLocation.pincode,
      addressLine: currentLocation.addressLine || `${currentLocation.locality}, ${currentLocation.city}`
    };

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
      deliveryAddress: orderAddress,
      deliveryPreference,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      paymentMethod: method,
      paymentStatus: status,
      estimatedDeliveryTime: "25 - 30 mins",
      riderName: "Vikram R. (CRAVE Courier)",
      riderPhone: "+91 98450 11234"
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryAddress: orderAddress,
          paymentMethod: method,
          deliveryPreference,
          deliveryInstructions: deliveryInstructions.trim() || undefined,
        }),
      });

      if (response.status === 401) {
        setIsProcessing(false);
        setIsPaymentModalOpen(false);
        setLoginModalOpen(true);
        return;
      }
    } catch (err) {
      console.error("Order submission error:", err);
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem("crave_orders") || "[]");
      localStorage.setItem("crave_orders", JSON.stringify([newOrder, ...existingOrders]));
      localStorage.setItem("crave_active_order", JSON.stringify(newOrder));
    } catch {}

    clearCart();
    setIsProcessing(false);
    setIsPaymentModalOpen(false);
    setOrderConfirmed(newOrder);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FF4D2D", "#16A34A", "#FFD700", "#140E0A"]
    });
  };

  const preferenceTitles: Record<DeliveryPreferenceType, string> = {
    RING_BELL: "🔔 Ring the Bell",
    LEAVE_AT_DOORSTEP: "🚪 Leave at Doorstep (Contactless)",
    HAND_TO_ME: "🙋 Hand It to Me",
    CALL_ON_ARRIVAL: "📞 Call When Arrived",
    TEXT_ON_ARRIVAL: "📱 Text Me on Arrival",
    NO_RING_OR_KNOCK: "🤫 Don’t Ring or Knock (Quiet)"
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[#EBE5DF] shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-[#ECFDF5] text-[#16A34A] mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
              Order Confirmed & Sent to Kitchen
            </span>
            <h1 className="text-3xl font-black text-[#1A1715] mt-1 font-sans">
              Every Bite, An Experience!
            </h1>
            <p className="text-xs text-[#766E65] mt-1">
              Order ID: <strong className="text-[#1A1715]">{orderConfirmed.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs space-y-2.5 text-left">
            <div className="flex justify-between font-semibold text-[#1A1715]">
              <span>Kitchen Partner</span>
              <span>{orderConfirmed.restaurantName}</span>
            </div>
            <div className="flex justify-between text-[#766E65]">
              <span>Delivery Destination</span>
              <span>{orderConfirmed.deliveryAddress.locality} ({orderConfirmed.deliveryAddress.pincode})</span>
            </div>

            {/* Delivery Preference Tag */}
            <div className="flex items-center justify-between pt-1 border-t border-[#EBE5DF]">
              <span className="text-[#766E65]">Delivery Preference</span>
              <span className="font-bold text-[#1A1715]">
                {preferenceTitles[orderConfirmed.deliveryPreference || "RING_BELL"]}
              </span>
            </div>

            {/* Additional Delivery Instructions */}
            {orderConfirmed.deliveryInstructions && (
              <div className="p-2.5 rounded-xl bg-white border border-[#E5DDD4] text-[#1A1715]">
                <span className="text-[10px] font-bold text-[#9E948C] block uppercase tracking-wider">
                  Courier Instructions:
                </span>
                <p className="font-medium text-xs mt-0.5 italic">
                  &ldquo;{orderConfirmed.deliveryInstructions}&rdquo;
                </p>
              </div>
            )}

            <div className="flex justify-between text-[#766E65] pt-1">
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
              className="flex-1 py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </Link>
            <Link
              href="/explore"
              className="flex-1 py-3.5 rounded-2xl bg-[#1A1715] hover:bg-black text-white font-bold text-sm transition-all flex items-center justify-center cursor-pointer"
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

        {/* Authentication Notice Banner */}
        {!user ? (
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF1EE] border border-[#FFD9D1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF4D2D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1715]">
                  Ordering as a guest
                </p>
                <p className="text-[11px] text-[#766E65]">
                  Sign in or create an account to auto-fill details and access live GPS tracking.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1A1715] hover:bg-black text-white font-bold text-xs shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              Sign In / Register
            </button>
          </div>
        ) : (
          <div className="mt-6 p-3.5 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D2D] text-white flex items-center justify-center text-xs font-black uppercase">
                {user.name.slice(0, 2)}
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A1715]">Authenticated as {user.name}</span>
                <span className="text-[11px] text-[#766E65] ml-2">({user.email})</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
              Verified Account
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
          {/* Left Form: Delivery Address, Delivery Preferences, and Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Location & Multi-Address Section */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1715] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF4D2D]" />
                  <span>1. Delivery Destination</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddressPickerOpen(!isAddressPickerOpen)}
                    className="text-xs font-bold text-[#FF4D2D] hover:underline cursor-pointer"
                  >
                    {isAddressPickerOpen ? "Close List" : "Switch Address"}
                  </button>
                  <span className="text-xs font-semibold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md">
                    Coverage Verified
                  </span>
                </div>
              </div>

              {/* Selected Active Address Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#1A1715] text-xs space-y-1 relative shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#1A1715] text-white text-[10px] font-bold uppercase tracking-wider">
                    Active Delivery Destination
                  </span>
                  <span className="text-[11px] font-bold text-[#1A1715]">
                    PIN: {currentLocation.pincode}
                  </span>
                </div>
                <p className="font-bold text-sm text-[#1A1715]">
                  {currentLocation.locality || currentLocation.city}
                </p>
                <p className="text-[#766E65]">
                  {currentLocation.addressLine || `${currentLocation.locality}, ${currentLocation.district}, ${currentLocation.state}`}
                </p>
              </div>

              {/* Multi-Address Selector & Add New Address */}
              {isAddressPickerOpen && (
                <div className="space-y-3 pt-2 border-t border-[#EBE5DF] animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1715]">Your Saved Addresses ({savedAddresses.length})</span>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-xs font-bold text-[#FF4D2D] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {savedAddresses.map((addr) => {
                      const isSelected =
                        currentLocation.pincode === addr.pincode &&
                        (currentLocation.locality === addr.locality || currentLocation.addressLine === addr.addressLine);
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            selectSavedAddress(addr);
                            setIsAddressPickerOpen(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-1 ${
                            isSelected
                              ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                              : "bg-white border-[#E5DDD4] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1A1715] flex items-center gap-1.5">
                              {addr.tag === "Home" && <Home className="w-3.5 h-3.5 text-[#FF4D2D]" />}
                              {addr.tag === "Work" && <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />}
                              {addr.tag === "Other" && <Navigation className="w-3.5 h-3.5 text-[#16A34A]" />}
                              <span>{addr.tag}</span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#FF4D2D]" />}
                          </div>
                          <p className="font-semibold text-[#1A1715] truncate">{addr.locality}</p>
                          <p className="text-[11px] text-[#766E65] truncate">{addr.addressLine}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isAddressPickerOpen && (
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#FF4D2D] hover:bg-[#FFF5F2] text-[#766E65] hover:text-[#FF4D2D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deliver to a New Address / Location</span>
                </button>
              )}
            </div>

            {/* 2. Delivery Preferences Section */}
            <DeliveryPreferencesSelector
              selectedPreference={deliveryPreference}
              onSelectPreference={(pref) => setDeliveryPreference(pref)}
              instructions={deliveryInstructions}
              onChangeInstructions={(text) => setDeliveryInstructions(text)}
            />

            {/* 3. Payment Gateway Selector */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A1715] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FF4D2D]" />
                  <span>3. Payment Gateway & Method</span>
                </h3>
                <span className="text-[10px] font-bold text-[#16A34A] uppercase bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  PCI-DSS Level 1
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Razorpay Option (Recommended) */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0C2340] text-white">
                        <QrCode className="w-5 h-5 text-[#58A6FF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-[#1A1715]">
                            Razorpay Smart Gateway (India Recommended)
                          </p>
                          <span className="px-1.5 py-0.5 rounded-md bg-[#0C2340] text-white text-[9px] font-bold">
                            FASTEST
                          </span>
                        </div>
                        <p className="text-xs text-[#766E65]">
                          Instant UPI QR • GPay • PhonePe • RuPay • Cards • Net Banking
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>
                </div>

                {/* 2. Stripe Global Gateway */}
                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "stripe"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#635BFF] text-white">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-[#1A1715]">
                            Stripe Global Gateway
                          </p>
                          <span className="px-1.5 py-0.5 rounded-md bg-[#635BFF] text-white text-[9px] font-bold">
                            INTERNATIONAL
                          </span>
                        </div>
                        <p className="text-xs text-[#766E65]">
                          Visa, Mastercard, Amex, Apple Pay, Global Cards
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "stripe" && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D]" />
                    )}
                  </div>
                </div>

                {/* 3. Direct UPI VPA */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-[#FF4D2D] border border-[#E5DDD4]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">
                          Direct UPI VPA ID
                        </p>
                        <p className="text-xs text-[#766E65]">Enter UPI Virtual Payment Address (e.g. mobile@upi)</p>
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

                {/* 4. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                      : "bg-[#FAF8F5] border-[#EBE5DF] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#16A34A] text-white">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1A1715]">
                          Cash on Delivery (Pay at Doorstep)
                        </p>
                        <p className="text-xs text-[#766E65]">Pay via Cash or courier QR upon parcel handover</p>
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

              {/* Delivery Preference Preview in Summary */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#9E948C] uppercase tracking-wider block">
                  Delivery Preference:
                </span>
                <p className="font-bold text-[#1A1715]">
                  {preferenceTitles[deliveryPreference]}
                </p>
                {deliveryInstructions && (
                  <p className="text-[11px] text-[#766E65] italic truncate">
                    &ldquo;{deliveryInstructions}&rdquo;
                  </p>
                )}
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
                    <span>
                      {paymentMethod === "razorpay"
                        ? `Pay ₹${grandTotal} with Razorpay`
                        : paymentMethod === "stripe"
                        ? `Pay ₹${grandTotal} with Stripe`
                        : `Confirm & Place Order ₹${grandTotal}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
        <AddAddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={(newAddr) => {
            saveNewAddress(newAddr);
            setIsAddressPickerOpen(false);
          }}
          defaultName={user?.name || "Ritish Sharma"}
          defaultPhone={user?.phone || "+91 98201 44521"}
        />

        {/* Payment Gateway Modal */}
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          gateway={paymentMethod === "stripe" ? "stripe" : "razorpay"}
          amount={grandTotal}
          orderNumber={pendingOrderId}
          customerName={user?.name || "Customer"}
          customerPhone={user?.phone}
          onSuccess={(paymentId, gateway) => {
            finalizeOrder(pendingOrderId, gateway as any, "paid");
          }}
        />
      </div>
    </div>
  );
}
