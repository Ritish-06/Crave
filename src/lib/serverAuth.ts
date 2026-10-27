import crypto from "crypto";
import { NextRequest } from "next/server";
import { AuthUser } from "@/types/auth";
import { findUserById } from "@/data/usersStore";

export const SESSION_COOKIE_NAME = "crave_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "crave_production_session_signing_secret_9941";

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString();
}

function signPayload(payloadStr: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(payloadStr).digest("base64url");
}

export function createSessionToken(user: AuthUser): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  };

  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadStr);
  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): AuthUser | null {
  try {
    const [payloadStr, signature] = token.split(".");
    if (!payloadStr || !signature) return null;

    const expectedSig = signPayload(payloadStr);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(payloadStr));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }

    const user = findUserById(payload.userId);
    if (!user) return null;

    const { passwordHash: _, salt: __, ...publicUser } = user;
    return publicUser;
  } catch {
    return null;
  }
}

export function getServerUser(request: NextRequest): AuthUser | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

export function getSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${isProd ? "; Secure" : ""}`;
}

export function getClearSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? "; Secure" : ""}`;
}
