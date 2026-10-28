import crypto from "crypto";
import fs from "fs";
import path from "path";
import { AuthUser } from "@/types/auth";

export interface StoredUser extends AuthUser {
  passwordHash: string;
  salt: string;
}

const USERS_FILE_PATH = path.join(process.cwd(), "src/data/.users.json");

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Pre-seeded demo user
const DEMO_SALT = "crave_demo_salt_9482";
const DEFAULT_USERS: StoredUser[] = [
  {
    id: "user-crave-01",
    name: "Ritish Sharma",
    email: "ritish@example.com",
    phone: "+91 98201 44521",
    role: "customer",
    createdAt: new Date("2026-01-15").toISOString(),
    salt: DEMO_SALT,
    passwordHash: hashPassword("password123", DEMO_SALT)
  }
];

// In-memory cache for fast hot execution
let memoryUsers: StoredUser[] | null = null;

function loadUsers(): StoredUser[] {
  if (memoryUsers) return memoryUsers;

  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf-8");
      memoryUsers = JSON.parse(data);
      return memoryUsers!;
    }
  } catch (err) {
    console.error("Failed to read .users.json, using default in-memory users:", err);
  }

  memoryUsers = [...DEFAULT_USERS];
  saveUsers(memoryUsers);
  return memoryUsers;
}

function saveUsers(users: StoredUser[]): void {
  memoryUsers = users;
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write .users.json:", err);
  }
}

export function findUserByEmailOrPhone(identifier: string): StoredUser | null {
  const users = loadUsers();
  const clean = identifier.trim().toLowerCase();
  return (
    users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (u.phone && u.phone.replace(/\s+/g, "") === clean.replace(/\s+/g, ""))
    ) || null
  );
}

export function findUserById(id: string): StoredUser | null {
  const users = loadUsers();
  return users.find((u) => u.id === id) || null;
}

export function verifyUserCredentials(
  identifier: string,
  plainPassword: string
): AuthUser | null {
  const user = findUserByEmailOrPhone(identifier);
  if (!user) return null;

  const computedHash = hashPassword(plainPassword, user.salt);
  if (crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(user.passwordHash, "hex"))) {
    const { passwordHash: _, salt: __, ...publicUser } = user;
    return publicUser;
  }

  return null;
}

export function createUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): { user?: AuthUser; error?: string } {
  const users = loadUsers();
  const cleanEmail = data.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { error: "An account with this email address already exists." };
  }

  if (data.phone) {
    const cleanPhone = data.phone.trim().replace(/\s+/g, "");
    if (users.some((u) => u.phone && u.phone.replace(/\s+/g, "") === cleanPhone)) {
      return { error: "An account with this phone number already exists." };
    }
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(data.password, salt);

  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: cleanEmail,
    phone: data.phone?.trim(),
    role: "customer",
    createdAt: new Date().toISOString(),
    salt,
    passwordHash
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash: _, salt: __, ...publicUser } = newUser;
  return { user: publicUser };
}

// In-memory OTP store (phone -> { otp, expiresAt })
const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

export function sendPhoneOtp(rawPhone: string): { otp: string; success: boolean; error?: string } {
  const cleanPhone = rawPhone.trim().replace(/\s+/g, "");
  if (cleanPhone.length < 10) {
    return { otp: "", success: false, error: "Please enter a valid 10-digit mobile number." };
  }

  // Generate 6-digit numeric OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(cleanPhone, { otp: generatedOtp, expiresAt });
  return { otp: generatedOtp, success: true };
}

export function verifyPhoneOtp(
  rawPhone: string,
  inputOtp: string
): { user?: AuthUser; error?: string } {
  const cleanPhone = rawPhone.trim().replace(/\s+/g, "");
  const trimmedOtp = inputOtp.trim();

  const record = otpStore.get(cleanPhone);
  const isDemoCode = trimmedOtp === "123456";
  const isValid = (record && record.otp === trimmedOtp && Date.now() <= record.expiresAt) || isDemoCode;

  if (!isValid) {
    return { error: "Invalid or expired verification code. Use 123456 or request a new code." };
  }

  // Clear OTP once verified
  otpStore.delete(cleanPhone);

  const users = loadUsers();
  const existingUser = users.find(
    (u) => u.phone && u.phone.replace(/\s+/g, "") === cleanPhone
  );

  if (existingUser) {
    const { passwordHash: _, salt: __, ...publicUser } = existingUser;
    return { user: { ...publicUser, authProvider: "phone_otp" } };
  }

  // Auto-register new user with phone
  const salt = generateSalt();
  const passwordHash = hashPassword(generateSalt(), salt);
  const suffix = cleanPhone.slice(-4);
  const newUser: StoredUser = {
    id: `user-phone-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: `Foodie (${suffix})`,
    email: `phone.${suffix}@crave.local`,
    phone: cleanPhone.startsWith("+") ? cleanPhone : `+91 ${cleanPhone}`,
    role: "customer",
    createdAt: new Date().toISOString(),
    salt,
    passwordHash,
    authProvider: "phone_otp"
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash: _, salt: __, ...publicUser } = newUser;
  return { user: publicUser };
}

export function findOrCreateOAuthUser(
  provider: "google" | "apple",
  profile: { email: string; name: string; avatarUrl?: string }
): AuthUser {
  const users = loadUsers();
  const cleanEmail = profile.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    if (!existing.avatarUrl && profile.avatarUrl) {
      existing.avatarUrl = profile.avatarUrl;
      saveUsers(users);
    }
    const { passwordHash: _, salt: __, ...publicUser } = existing;
    return { ...publicUser, authProvider: provider };
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(generateSalt(), salt);
  const newUser: StoredUser = {
    id: `user-${provider}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: profile.name.trim() || `${provider.toUpperCase()} Foodie`,
    email: cleanEmail,
    role: "customer",
    createdAt: new Date().toISOString(),
    salt,
    passwordHash,
    avatarUrl: profile.avatarUrl,
    authProvider: provider
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash: _, salt: __, ...publicUser } = newUser;
  return publicUser;
}
