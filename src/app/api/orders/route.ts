import { NextRequest, NextResponse } from "next/server";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import { ALL_RESTAURANTS } from "@/data/restaurantsData";
import { CartItem, OrderRecord, SavedAddress, DeliveryPreferenceType } from "@/types";

const ALLOWED_PREFERENCES: DeliveryPreferenceType[] = [
  "RING_BELL",
  "LEAVE_AT_DOORSTEP",
  "HAND_TO_ME",
  "CALL_ON_ARRIVAL",
  "TEXT_ON_ARRIVAL",
  "NO_RING_OR_KNOCK"
];

interface CreateOrderPayload {
  items: CartItem[];
  deliveryAddress: SavedAddress;
  paymentMethod: "upi" | "card" | "cod" | "netbanking";
  couponCode?: string;
  notes?: string;
  deliveryPreference?: DeliveryPreferenceType;
  deliveryInstructions?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderPayload = await request.json();
    const {
      items,
      deliveryAddress,
      paymentMethod,
      couponCode,
      deliveryPreference,
      deliveryInstructions
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.pincode) {
      return NextResponse.json(
        { success: false, message: "Valid delivery address and PIN code are required." },
        { status: 400 }
      );
    }

    // 1. Enforce single-restaurant per order constraint
    const firstRestaurantId = items[0].menuItem.restaurantId;
    const isMultiRestaurant = items.some(
      (item) => item.menuItem.restaurantId !== firstRestaurantId
    );
    if (isMultiRestaurant) {
      return NextResponse.json(
        {
          success: false,
          message: "All items in an order must be from the same restaurant.",
        },
        { status: 400 }
      );
    }

    const restaurant = ALL_RESTAURANTS.find((r) => r.id === firstRestaurantId);
    const restaurantName = restaurant ? restaurant.name : items[0].menuItem.restaurantName;

    // 2. Authoritative re-calculation of each item against server menu data
    let subtotal = 0;
    const validatedItems: CartItem[] = items.map((cartItem) => {
      const serverItem = ALL_MENU_ITEMS.find((m) => m.id === cartItem.menuItem.id);
      const basePrice = serverItem ? serverItem.price : cartItem.menuItem.price;

      let customizationAddons = 0;
      if (cartItem.customization) {
        if (cartItem.customization.pattyCount === 2) customizationAddons += 120;
        if (cartItem.customization.pattyCount === 3) customizationAddons += 220;
        if (cartItem.customization.cheese !== "none") customizationAddons += 40;
        if (cartItem.customization.sauces.truffleMayo) customizationAddons += 0;
        if (cartItem.customization.extras.friedEgg) customizationAddons += 40;
        if (cartItem.customization.extras.crispyShallots) customizationAddons += 30;
      }

      const unitPrice = basePrice + customizationAddons;
      const itemTotal = unitPrice * cartItem.quantity;
      subtotal += itemTotal;

      return {
        ...cartItem,
        unitPrice,
        totalPrice: itemTotal,
      };
    });

    // 3. Packaging & Delivery Fee Calculation
    const packagingFee = 25;
    const freeDeliveryThreshold = restaurant ? restaurant.freeDeliveryThreshold : 499;
    const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 40;

    // 4. Coupon Calculation
    let discount = 0;
    if (couponCode) {
      const clean = couponCode.trim().toUpperCase();
      if (clean === "CRAVEFIRST" && subtotal >= 399) {
        discount = Math.min(Math.round(subtotal * 0.2), 150);
      } else if (clean === "SUPER100" && subtotal >= 499) {
        discount = 100;
      }
    }

    // 5. Taxes (5% GST under Indian restaurant food delivery norms)
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableSubtotal * 0.05);

    // 6. Grand Total
    const total = subtotal + packagingFee + deliveryFee + tax - discount;

    // 7. Validate Delivery Preference (Server-side allowlist)
    const validPreference: DeliveryPreferenceType =
      deliveryPreference && ALLOWED_PREFERENCES.includes(deliveryPreference)
        ? deliveryPreference
        : "RING_BELL";

    // 8. Sanitize Delivery Instructions (Max 200 chars, plain text)
    const sanitizedInstructions = deliveryInstructions
      ? deliveryInstructions.trim().slice(0, 200)
      : undefined;

    const orderId = "CRV-" + Math.floor(100000 + Math.random() * 900000);
    const orderRecord: OrderRecord = {
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      items: validatedItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      restaurantId: firstRestaurantId,
      restaurantName,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      estimatedDeliveryTime: "25 - 35 mins",
      deliveryPreference: validPreference,
      deliveryInstructions: sanitizedInstructions,
      riderName: "Vikram R. (CRAVE Courier)",
      riderPhone: "+91 98450 11234",
    };

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: orderRecord,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error creating order." },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update delivery instructions safely while order is in transit
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, deliveryPreference, deliveryInstructions } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    // Server-side validation
    let validPreference: DeliveryPreferenceType | undefined;
    if (deliveryPreference) {
      if (!ALLOWED_PREFERENCES.includes(deliveryPreference)) {
        return NextResponse.json(
          { success: false, message: "Invalid delivery preference selected." },
          { status: 400 }
        );
      }
      validPreference = deliveryPreference;
    }

    let sanitizedInstructions: string | undefined;
    if (deliveryInstructions !== undefined) {
      sanitizedInstructions = deliveryInstructions.trim().slice(0, 200);
    }

    return NextResponse.json({
      success: true,
      message: "Delivery instructions updated successfully!",
      updated: {
        orderId,
        deliveryPreference: validPreference,
        deliveryInstructions: sanitizedInstructions,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update delivery instructions." },
      { status: 500 }
    );
  }
}
