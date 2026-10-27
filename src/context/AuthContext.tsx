"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { AuthUser, LoginCredentials, SignupData } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  pendingActionDescription: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  /**
   * Guards any ordering action.
   * If logged in, runs the action immediately.
   * If not logged in, queues the action, opens the LoginModal, and runs it once after login.
   * Returns true if already authenticated, false if login modal was opened.
   */
  requireAuth: (action: () => void | Promise<void>, description?: string) => boolean;
  cancelPendingAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingActionDescription, setPendingActionDescription] = useState<string | null>(null);

  const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null);

  // Check initial session from server cookie
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Session verification error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const executePendingAction = useCallback(async () => {
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setPendingActionDescription(null);
      try {
        await action();
      } catch (err) {
        console.error("Failed to execute resumed action after login:", err);
      }
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials)
        });

        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setLoginModalOpen(false);
          // Resume intended action
          setTimeout(() => {
            executePendingAction();
          }, 100);
          return { success: true };
        }
        return { success: false, error: data.error || "Login failed." };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [executePendingAction]
  );

  const signup = useCallback(
    async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.success && result.user) {
          setUser(result.user);
          setLoginModalOpen(false);
          // Resume intended action
          setTimeout(() => {
            executePendingAction();
          }, 100);
          return { success: true };
        }
        return { success: false, error: result.error || "Account creation failed." };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [executePendingAction]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
  }, []);

  const requireAuth = useCallback(
    (action: () => void | Promise<void>, description?: string): boolean => {
      if (user) {
        action();
        return true;
      }

      pendingActionRef.current = action;
      setPendingActionDescription(description || "continue your order");
      setLoginModalOpen(true);
      return false;
    },
    [user]
  );

  const cancelPendingAction = useCallback(() => {
    pendingActionRef.current = null;
    setPendingActionDescription(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoginModalOpen,
        setLoginModalOpen,
        pendingActionDescription,
        login,
        signup,
        logout,
        requireAuth,
        cancelPendingAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
