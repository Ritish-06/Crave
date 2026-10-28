import { NextRequest, NextResponse } from "next/server";
import { findOrCreateOAuthUser } from "@/data/usersStore";
import { createSessionToken, getSessionCookieHeader } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, email, name, avatarUrl } = body;

    if (!provider || (provider !== "google" && provider !== "apple")) {
      return NextResponse.json(
        { success: false, error: "Supported providers are 'google' or 'apple'." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required for OAuth login." },
        { status: 400 }
      );
    }

    const user = findOrCreateOAuthUser(provider, {
      email,
      name: name || `${provider === "google" ? "Google" : "Apple"} User`,
      avatarUrl
    });

    const token = createSessionToken(user);
    const response = NextResponse.json({ success: true, user });
    response.headers.set("Set-Cookie", getSessionCookieHeader(token));
    return response;
  } catch (error) {
    console.error("OAuth API error:", error);
    return NextResponse.json(
      { success: false, error: "OAuth authentication failed." },
      { status: 500 }
    );
  }
}
