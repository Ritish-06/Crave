import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/data/usersStore";
import { createSessionToken, getSessionCookieHeader } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const result = createUser({ name, email, phone, password });
    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create account." },
        { status: 400 }
      );
    }

    const token = createSessionToken(result.user);
    const response = NextResponse.json({ success: true, user: result.user }, { status: 201 });
    response.headers.set("Set-Cookie", getSessionCookieHeader(token));
    return response;
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during signup." },
      { status: 500 }
    );
  }
}
