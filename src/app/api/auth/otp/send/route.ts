import { NextRequest, NextResponse } from "next/server";
import { sendPhoneOtp } from "@/data/usersStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    const res = sendPhoneOtp(phone);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error || "Failed to send OTP." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "6-digit verification code sent via SMS.",
      testOtp: res.otp // Included in response for seamless development & automated testing
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error sending OTP." },
      { status: 500 }
    );
  }
}
