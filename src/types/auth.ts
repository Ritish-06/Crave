export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "kitchen";
  createdAt: string;
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

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export type PendingActionType =
  | { type: "ADD_TO_CART"; payload: () => void | Promise<void>; description?: string }
  | { type: "CHECKOUT"; payload: () => void | Promise<void>; description?: string }
  | { type: "REORDER"; payload: () => void | Promise<void>; description?: string }
  | { type: "CUSTOM"; payload: () => void | Promise<void>; description?: string };
