import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneOtp } from "@/data/usersStore";
import { createSessionToken, getSessionCookieHeader } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Both phone number and OTP are required." },
        { status: 400 }
      );
    }

    const result = verifyPhoneOtp(phone, otp);
    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "OTP verification failed." },
        { status: 401 }
      );
    }

    const token = createSessionToken(result.user);
    const response = NextResponse.json({ success: true, user: result.user });
    response.headers.set("Set-Cookie", getSessionCookieHeader(token));
    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
