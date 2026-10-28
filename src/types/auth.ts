export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "kitchen";
  createdAt: string;
  avatarUrl?: string;
  authProvider?: "password" | "phone_otp" | "google" | "apple";
}

export interface LoginCredentials {
  identifier: string; // Email or Phone
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface OAuthPayload {
  provider: "google" | "apple";
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  testOtp?: string;
}

export type PendingActionType =
  | { type: "ADD_TO_CART"; payload: () => void | Promise<void>; description?: string }
  | { type: "CHECKOUT"; payload: () => void | Promise<void>; description?: string }
  | { type: "REORDER"; payload: () => void | Promise<void>; description?: string }
  | { type: "CUSTOM"; payload: () => void | Promise<void>; description?: string };
