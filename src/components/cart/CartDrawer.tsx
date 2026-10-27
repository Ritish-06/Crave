"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function CartDrawer() {
  const router = useRouter();
  const { requireAuth } = useAuth();
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
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ msg: res.message, isError: !res.success });
    if (res.success) setCouponInput("");
  };

  const freeDeliveryThreshold = 499;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#EBE5DF] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-[#EBE5DF] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1A1715]">Your Cravings</h2>
                <p className="text-xs text-[#766E65]">
                  {items.length === 0
                    ? "Cart is empty"
                    : `${cartCount} items from ${cartRestaurantName}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-2 rounded-xl text-[#9E948C] hover:text-[#1A1715] hover:bg-[#F3EFEA] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Bar */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-[#FFF5F2] border-b border-[#FFD9D1] flex items-center justify-between text-xs">
              {amountToFreeDelivery === 0 ? (
                <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Congratulations! You unlocked FREE Delivery!</span>
                </div>
              ) : (
                <div className="w-full space-y-1">
                  <div className="flex justify-between font-medium text-[#766E65]">
                    <span>Add <strong>₹{amountToFreeDelivery}</strong> more for FREE Delivery</span>
                    <span>{freeDeliveryProgress}%</span>
                  </div>
                  <div className="w-full bg-[#FFE5E0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF4D2D] h-full rounded-full transition-all duration-300"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body: Items or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-[#FFF1EE] flex items-center justify-center text-[#FF4D2D]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1715]">Your cart is hungry!</h3>
                  <p className="text-xs text-[#766E65] mt-1 max-w-xs">
                    Explore our Michelin-grade burgers, woodfired pizzas, and artisanal culinary creations.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
                  <Link
                    href="/explore"
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-full py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-sm hover:bg-[#E03A1A] transition-colors text-center"
                  >
                    Explore Menu
                  </Link>
                  <Link
                    href="/studio"
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-full py-3 rounded-2xl bg-[#1A1715] text-white font-bold text-sm hover:bg-black transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
                    Design in 3D Studio
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl bg-white border border-[#EBE5DF] flex gap-3 shadow-2xs transition-all hover:border-[#D5CDC4]"
                >
                  <div className="relative w-18 h-18 rounded-xl overflow-hidden shrink-0 bg-[#F3EFEA]">
                    <Image
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-[#1A1715] truncate">
                        {item.menuItem.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-[#9E948C] hover:text-[#DC2626] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customization Badges */}
                    {item.customizationSummary && item.customizationSummary.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customizationSummary.map((c, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#FFF5F2] text-[#FF4D2D] font-medium px-1.5 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-1 border-t border-[#F3EFEA]">
                      <span className="text-sm font-black text-[#1A1715]">
                        ₹{item.totalPrice}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-[#F4EFEA] rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-0.5 text-[#1A1715] hover:text-[#FF4D2D]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#1A1715] min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-0.5 text-[#1A1715] hover:text-[#FF4D2D]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Coupons & Authoritative Bill */}
          {items.length > 0 && (
            <div className="bg-white border-t border-[#EBE5DF] p-6 space-y-4">
              {/* Coupon Section */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#16A34A]" />
                      <span className="font-bold text-[#065F46]">{appliedCoupon}</span>
                      <span className="text-[#047857]">(-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-[#DC2626] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. CRAVEFIRST)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] text-xs text-[#1A1715] uppercase tracking-wider font-semibold placeholder:normal-case placeholder:font-normal"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1A1715] text-white text-xs font-bold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] flex items-center gap-1 ${
                      couponFeedback.isError ? "text-[#DC2626]" : "text-[#16A34A]"
                    }`}
                  >
                    {couponFeedback.isError ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {couponFeedback.msg}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-[#766E65] pt-2 border-t border-[#F3EFEA]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-[#1A1715] font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Safety</span>
                  <span className="text-[#1A1715]">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
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
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Discount Coupon</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#1A1715] pt-2 border-t border-[#EBE5DF]">
                  <span>To Pay</span>
                  <span className="text-[#FF4D2D]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    requireAuth(() => {
                      setCartDrawerOpen(false);
                      router.push("/checkout");
                    }, "proceed to checkout");
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="font-medium text-[#766E65] hover:text-[#1A1715]"
                  >
                    View detailed cart
                  </Link>

                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#DC2626]">Clear all?</span>
                      <button
                        onClick={() => {
                          clearCart();
                          setShowClearConfirm(false);
                        }}
                        className="text-[11px] font-bold text-[#DC2626] hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-[11px] text-[#766E65]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[#9E948C] hover:text-[#DC2626] transition-colors"
                    >
                      Clear cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
