"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CartItem, MenuItem, BurgerCustomizationState } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface CartConflictModalState {
  isOpen: boolean;
  pendingItem?: {
    item: MenuItem;
    customization?: BurgerCustomizationState;
    customizationSummary?: string[];
    price: number;
  };
  currentRestaurantName: string;
  newRestaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  appliedCoupon: string | null;
  grandTotal: number;
  cartRestaurantId: string | null;
  cartRestaurantName: string | null;
  isCartDrawerOpen: boolean;
  cartIconRef: React.RefObject<HTMLDivElement | null>;
  conflictModal: CartConflictModalState;
  setCartDrawerOpen: (open: boolean) => void;
  addItem: (
    item: MenuItem,
    customization?: BurgerCustomizationState,
    customizationSummary?: string[],
    validatedPrice?: number
  ) => boolean;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  resolveConflict: (confirmReplace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { requireAuth } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("CRAVEFIRST");
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const cartIconRef = useRef<HTMLDivElement | null>(null);

  const [conflictModal, setConflictModal] = useState<CartConflictModalState>({
    isOpen: false,
    currentRestaurantName: "",
    newRestaurantName: ""
  });

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("crave_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("crave_coupon");
      if (savedCoupon !== null) {
        setAppliedCoupon(savedCoupon || null);
      }
    } catch {}
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("crave_cart", JSON.stringify(items));
      localStorage.setItem("crave_coupon", appliedCoupon || "");
    } catch {}
  }, [items, appliedCoupon]);

  const cartRestaurantId = items.length > 0 ? items[0].menuItem.restaurantId : null;
  const cartRestaurantName = items.length > 0 ? items[0].menuItem.restaurantName : null;

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Authoritative fees
  const packagingFee = items.length > 0 ? 25 : 0;
  // Free delivery threshold: ₹499
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 499 ? 0 : 49;
  // 5% GST in India
  const taxAmount = Math.round(subtotal * 0.05);

  // Calculate discount based on coupons
  let discountAmount = 0;
  if (appliedCoupon === "CRAVEFIRST" && subtotal >= 299) {
    discountAmount = Math.min(Math.round(subtotal * 0.2), 150);
  } else if (appliedCoupon === "SUPER100" && subtotal >= 499) {
    discountAmount = 100;
  }

  const grandTotal = Math.max(0, subtotal + packagingFee + deliveryFee + taxAmount - discountAmount);

  const doAddItem = (
    item: MenuItem,
    customization?: BurgerCustomizationState,
    customizationSummary?: string[],
    validatedPrice?: number
  ): boolean => {
    const finalUnitPrice = validatedPrice ?? item.price;

    // Check multi-restaurant conflict
    if (items.length > 0 && items[0].menuItem.restaurantId !== item.restaurantId) {
      setConflictModal({
        isOpen: true,
        pendingItem: {
          item,
          customization,
          customizationSummary,
          price: finalUnitPrice
        },
        currentRestaurantName: items[0].menuItem.restaurantName,
        newRestaurantName: item.restaurantName
      });
      return false;
    }

    // Generate unique ID based on customization or item ID
    const customKey = customization ? JSON.stringify(customization) : "";
    const cartItemId = `${item.id}-${Buffer.from(customKey).toString("base64").slice(0, 10)}`;

    setItems(prev => {
      // Re-verify single restaurant constraint on active state
      if (prev.length > 0 && prev[0].menuItem.restaurantId !== item.restaurantId) {
        return prev;
      }
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      const newItem: CartItem = {
        cartItemId,
        menuItem: item,
        quantity: 1,
        customization,
        customizationSummary,
        unitPrice: finalUnitPrice,
        totalPrice: finalUnitPrice
      };
      return [...prev, newItem];
    });

    return true;
  };

  const addItem = (
    item: MenuItem,
    customization?: BurgerCustomizationState,
    customizationSummary?: string[],
    validatedPrice?: number
  ): boolean => {
    return requireAuth(() => {
      doAddItem(item, customization, customizationSummary, validatedPrice);
    }, `add "${item.name}" to your cart`);
  };

  const resolveConflict = (confirmReplace: boolean) => {
    if (confirmReplace && conflictModal.pendingItem) {
      const { item, customization, customizationSummary, price } = conflictModal.pendingItem;
      const customKey = customization ? JSON.stringify(customization) : "";
      const cartItemId = `${item.id}-${Buffer.from(customKey).toString("base64").slice(0, 10)}`;
      const newItem: CartItem = {
        cartItemId,
        menuItem: item,
        quantity: 1,
        customization,
        customizationSummary,
        unitPrice: price,
        totalPrice: price
      };
      setItems([newItem]);
    }
    setConflictModal({
      isOpen: false,
      currentRestaurantName: "",
      newRestaurantName: ""
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.cartItemId === cartItemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0
              ? { ...i, quantity: nextQty, totalPrice: nextQty * i.unitPrice }
              : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === "CRAVEFIRST") {
      if (subtotal < 299) {
        return { success: false, message: "CRAVEFIRST requires a minimum order of ₹299." };
      }
      setAppliedCoupon("CRAVEFIRST");
      return { success: true, message: "20% discount applied successfully!" };
    }
    if (formatted === "SUPER100") {
      if (subtotal < 499) {
        return { success: false, message: "SUPER100 requires a minimum order of ₹499." };
      }
      setAppliedCoupon("SUPER100");
      return { success: true, message: "Flat ₹100 discount applied!" };
    }
    return { success: false, message: "Invalid or expired promo code." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        packagingFee,
        deliveryFee,
        taxAmount,
        discountAmount,
        appliedCoupon,
        grandTotal,
        cartRestaurantId,
        cartRestaurantName,
        isCartDrawerOpen,
        cartIconRef,
        conflictModal,
        setCartDrawerOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        resolveConflict
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
