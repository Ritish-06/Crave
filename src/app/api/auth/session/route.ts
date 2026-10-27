import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const user = getServerUser(request);
    return NextResponse.json({ success: true, user: user || null });
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    if (err?.digest === "NEXT_PRERENDER_INTERRUPTED" || err?.message?.includes("prerender")) {
      throw error;
    }
    console.error("Session check API error:", error);
    return NextResponse.json({ success: true, user: null });
  }
}
