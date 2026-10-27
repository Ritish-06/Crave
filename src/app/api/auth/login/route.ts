import { NextRequest, NextResponse } from "next/server";
import { verifyUserCredentials } from "@/data/usersStore";
import { createSessionToken, getSessionCookieHeader } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email/phone and password." },
        { status: 400 }
      );
    }

    const user = verifyUserCredentials(identifier, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your email/phone and password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({ success: true, user });
    response.headers.set("Set-Cookie", getSessionCookieHeader(token));
    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during login." },
      { status: 500 }
    );
  }
}
