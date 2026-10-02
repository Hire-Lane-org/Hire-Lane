"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

interface LocalAccount {
  id: string;
  email: string;
  password: string;
  full_name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ACCOUNTS_KEY = "hirelane_local_accounts";
const ACTIVE_SESSION_KEY = "hirelane_current_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured()) {
      // Supabase Authentication
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!isMounted) return;
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              full_name:
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0] ||
                "User",
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Local Storage Authentication
      if (typeof window !== "undefined") {
        const sessionStr = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (sessionStr) {
          try {
            const parsed = JSON.parse(sessionStr);
            if (parsed?.id && parsed?.email) {
              setUser(parsed);
            } else {
              setUser(null);
            }
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: cleanName,
              },
              emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/callback`,
            },
          });
          if (error) return { error: error.message };
          return {};
        } catch (err: any) {
          return { error: err.message || "Failed to sign up." };
        }
      }

      // Local isolated signup
      if (typeof window === "undefined") return { error: "Window unavailable" };

      try {
        const rawAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
        const accounts: LocalAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];

        if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
          return { error: "An account with this email already exists." };
        }

        const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newAccount: LocalAccount = {
          id: newId,
          email: cleanEmail,
          password,
          full_name: cleanName,
        };

        accounts.push(newAccount);
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));

        const sessionUser: AuthUser = {
          id: newId,
          email: cleanEmail,
          full_name: cleanName,
        };

        // Initialize completely clean user data partitions
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(`hirelane_apps_${newId}`, JSON.stringify([]));
        localStorage.setItem(`hirelane_interviews_${newId}`, JSON.stringify([]));
        localStorage.setItem(`hirelane_resumes_${newId}`, JSON.stringify([]));
        localStorage.setItem(
          `hirelane_profile_${newId}`,
          JSON.stringify({
            id: newId,
            full_name: cleanName,
            email: cleanEmail,
            phone: null,
            location: null,
            linkedin_url: null,
            avatar_url: null,
            college: null,
            degree: null,
            graduation_year: null,
            cgpa: null,
            preferred_roles: [],
            preferred_locations: [],
            work_authorization: "-",
            experience_level: "-",
            preferred_industries: [],
            preferred_company_size: null,
            notice_period: "-",
            bio: null,
          })
        );

        setUser(sessionUser);
        return {};
      } catch (err: any) {
        return { error: err.message || "Failed to create account." };
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (error) return { error: error.message };
          return {};
        } catch (err: any) {
          return { error: err.message || "Failed to sign in." };
        }
      }

      // Local isolated signin
      if (typeof window === "undefined") return { error: "Window unavailable" };

      try {
        const rawAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
        const accounts: LocalAccount[] = rawAccounts ? JSON.parse(rawAccounts) : [];

        const account = accounts.find(
          (a) => a.email.toLowerCase() === cleanEmail && a.password === password
        );

        if (!account) {
          return { error: "Invalid email or password." };
        }

        const sessionUser: AuthUser = {
          id: account.id,
          email: account.email,
          full_name: account.full_name,
        };

        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return {};
      } catch (err: any) {
        return { error: err.message || "Failed to sign in." };
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || "Google sign in failed." };
      }
    }

    // Offline Google sign in simulation with clean new user
    const googleId = `usr_google_${Date.now()}`;
    const sessionUser: AuthUser = {
      id: googleId,
      email: "google.user@example.com",
      full_name: "Google User",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(`hirelane_apps_${googleId}`, JSON.stringify([]));
      localStorage.setItem(`hirelane_interviews_${googleId}`, JSON.stringify([]));
      localStorage.setItem(`hirelane_resumes_${googleId}`, JSON.stringify([]));
      localStorage.setItem(
        `hirelane_profile_${googleId}`,
        JSON.stringify({
          id: googleId,
          full_name: "Google User",
          email: "google.user@example.com",
          phone: null,
          location: null,
          linkedin_url: null,
          avatar_url: null,
          college: null,
          degree: null,
          graduation_year: null,
          cgpa: null,
          preferred_roles: [],
          preferred_locations: [],
          work_authorization: "-",
          experience_level: "-",
          preferred_industries: [],
          preferred_company_size: null,
          notice_period: "-",
          bio: null,
        })
      );
    }
    setUser(sessionUser);
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
