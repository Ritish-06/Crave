import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const user = getServerUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required for payment initiation." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, amount, paymentMethodId } = body;

    if (action === "create_payment_intent") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid payment amount." },
          { status: 400 }
        );
      }

      const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`;
      return NextResponse.json({
        success: true,
        gateway: "stripe",
        clientSecret,
        amount: Math.round(amount * 100),
        currency: "inr",
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_crave_live_demo"
      });
    }

    if (action === "confirm_payment") {
      return NextResponse.json({
        success: true,
        gateway: "stripe",
        paymentIntentId: `pi_${Date.now()}`,
        status: "succeeded",
        paymentMethodId: paymentMethodId || "pm_card_visa"
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Stripe API error:", error);
    return NextResponse.json(
      { success: false, message: "Stripe payment error occurred." },
      { status: 500 }
    );
  }
}
