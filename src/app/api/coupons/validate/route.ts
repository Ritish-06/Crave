import { NextRequest, NextResponse } from "next/server";

interface CouponPayload {
  code: string;
  subtotal: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CouponPayload = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Please provide a coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === "CRAVEFIRST") {
      if (subtotal < 399) {
        return NextResponse.json({
          success: false,
          message: "CRAVEFIRST requires a minimum order value of ₹399.",
        });
      }
      const discount = Math.min(Math.round(subtotal * 0.2), 150);
      return NextResponse.json({
        success: true,
        code: cleanCode,
        discount,
        message: `CRAVEFIRST applied! You saved ₹${discount} (20% off).`,
      });
    }

    if (cleanCode === "SUPER100") {
      if (subtotal < 499) {
        return NextResponse.json({
          success: false,
          message: "SUPER100 requires a minimum order value of ₹499.",
        });
      }
      return NextResponse.json({
        success: true,
        code: cleanCode,
        discount: 100,
        message: "SUPER100 applied! Flat ₹100 discount added.",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid coupon code. Try CRAVEFIRST or SUPER100.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error processing coupon validation." },
      { status: 500 }
    );
  }
}
