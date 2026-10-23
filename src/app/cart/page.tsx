"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

export default function CartPage() {
  const {
    items,
    cartCount,
    subtotal,
    deliveryFee,
    packagingFee,
    taxAmount,
    discountAmount,
    appliedCoupon,
    grandTotal,
    cartRestaurantName,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { currentLocation, setLocationModalOpen } = useLocation();

  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponStatus({ msg: res.message, isError: !res.success });
    if (res.success) setCouponInput("");
  };

  const freeDeliveryThreshold = 499;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-3xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1715]">
          Your Crave Cart is Empty
        </h1>
        <p className="text-sm text-[#766E65] max-w-md mt-2 leading-relaxed">
          You haven&apos;t added any artisanal dishes yet. Explore our curated menu or design your own smash burger in the 3D Studio!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full max-w-sm">
          <Link
            href="/explore"
            className="flex-1 py-3.5 rounded-2xl bg-[#FF4D2D] text-white font-bold text-sm hover:bg-[#E03A1A] transition-colors text-center"
          >
            Explore Menu
          </Link>
          <Link
            href="/studio"
            className="flex-1 py-3.5 rounded-2xl bg-[#1A1715] text-white font-bold text-sm hover:bg-black transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
            3D Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1715] font-sans">
              Your Food Cart
            </h1>
            <p className="text-xs text-[#766E65] mt-1">
              Ordering {cartCount} items from{" "}
              <strong className="text-[#1A1715]">{cartRestaurantName}</strong>
            </p>
          </div>

          {showClearConfirm ? (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF5F2] border border-[#FFD9D1] text-xs">
              <span className="text-[#DC2626] font-semibold">Discard entire cart?</span>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#DC2626] text-white font-bold"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 text-[#766E65]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-semibold text-[#9E948C] hover:text-[#DC2626] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Free Delivery Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-between text-xs">
          {amountToFreeDelivery === 0 ? (
            <div className="flex items-center gap-2 text-[#16A34A] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Unlocked: FREE Gourmet Delivery on this order!</span>
            </div>
          ) : (
            <div className="w-full space-y-1.5">
              <div className="flex justify-between font-semibold text-[#1A1715]">
                <span>Add ₹{amountToFreeDelivery} more to enjoy FREE delivery</span>
                <span className="text-[#FF4D2D]">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full bg-[#F3EFEA] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF4D2D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Grid: Left Items List, Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-5 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs flex flex-col sm:flex-row gap-5"
              >
                <div className="relative w-full sm:w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-[#F3EFEA]">
                  <Image
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-[#1A1715]">
                        {item.menuItem.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-1 text-[#9E948C] hover:text-[#DC2626] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#766E65] mt-0.5 line-clamp-1">
                      {item.menuItem.description}
                    </p>

                    {item.customizationSummary && item.customizationSummary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.customizationSummary.map((c, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#FFF5F2] text-[#FF4D2D] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F3EFEA]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#1A1715]">
                        ₹{item.totalPrice}
                      </span>
                      <span className="text-xs text-[#9E948C]">
                        (₹{item.unitPrice} each)
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-3 bg-[#F4EFEA] rounded-2xl px-3 py-1.5">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="text-[#1A1715] hover:text-[#FF4D2D]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-[#1A1715] min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="text-[#1A1715] hover:text-[#FF4D2D]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Order Summary & Delivery Address */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Destination Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#766E65] uppercase tracking-wider">
                  Delivery Destination
                </span>
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="text-xs font-bold text-[#FF4D2D] hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FFF1EE] text-[#FF4D2D] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#1A1715]">
                    {currentLocation.locality || currentLocation.city}
                  </p>
                  <p className="text-[#766E65] mt-0.5">
                    {currentLocation.addressLine || `${currentLocation.district}, ${currentLocation.state}`} - PIN {currentLocation.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code Input Card */}
            <div className="p-5 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
              <span className="text-xs font-bold text-[#766E65] uppercase tracking-wider">
                Discount Coupons
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#16A34A]" />
                    <div>
                      <span className="font-bold text-[#065F46]">{appliedCoupon}</span>
                      <p className="text-[#047857] text-[11px]">Saved ₹{discountAmount} on this order</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-[#DC2626] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (CRAVEFIRST / SUPER100)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs text-[#1A1715] uppercase font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponStatus && (
                <p
                  className={`text-xs flex items-center gap-1.5 ${
                    couponStatus.isError ? "text-[#DC2626]" : "text-[#16A34A]"
                  }`}
                >
                  {couponStatus.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {couponStatus.msg}
                </p>
              )}
            </div>

            {/* Authoritative Price Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-md space-y-4">
              <h3 className="text-base font-black text-[#1A1715]">Authoritative Bill Summary</h3>

              <div className="space-y-2 text-xs text-[#766E65] border-b border-[#F3EFEA] pb-4">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-[#1A1715]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Cold Insulation</span>
                  <span className="text-[#1A1715]">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#16A34A] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 5%)</span>
                  <span className="text-[#1A1715]">₹{taxAmount}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-bold">
                    <span>Discount Coupon ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-lg font-black text-[#1A1715] pt-1">
                <span>Grand Total</span>
                <span className="text-[#FF4D2D]">₹{grandTotal}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-black text-sm shadow-xl shadow-[#FF4D2D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
