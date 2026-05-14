import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getStoredUser, getToken, setStoredUser, setToken } from "./api";

export interface AuthUser {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  organization?: string;
  org?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: Record<string, unknown>) => Promise<AuthUser>;
  logout: () => void;
  refreshProfile: () => Promise<AuthUser | null>;
  updateProfile: (patch: Partial<AuthUser> & Record<string, unknown>) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function pickUser(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (p.user && typeof p.user === "object") return p.user as AuthUser;
  if (p.data && typeof p.data === "object") return p.data as AuthUser;
  return p as AuthUser;
}
function pickToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  for (const k of ["token", "accessToken", "access_token", "jwt", "authToken"]) {
    const v = p[k];
    if (typeof v === "string" && v) return v;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());
  const [token, setTokState] = useState<string | null>(() => getToken());
  const [loading, setLoading] = useState<boolean>(() => !!getToken() && !getStoredUser());

  const refreshProfile = useCallback(async (): Promise<AuthUser | null> => {
    if (!getToken()) return null;
    try {
      const data = await api<unknown>("/auth/profile");
      const u = pickUser(data);
      if (u) {
        setUser(u);
        setStoredUser(u);
      }
      return u;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (getToken() && !user) {
      refreshProfile().finally(() => mounted && setLoading(false));
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [refreshProfile, user]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<unknown>("/auth/login", { method: "POST", body: { email, password }, auth: false });
    const tok = pickToken(data);
    if (!tok) throw new Error("Login response missing token");
    setToken(tok);
    setTokState(tok);
    let u = pickUser(data);
    if (!u || !u.email) {
      const profile = await api<unknown>("/auth/profile");
      u = pickUser(profile);
    }
    if (!u) throw new Error("Failed to load profile");
    setUser(u);
    setStoredUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const data = await api<unknown>("/auth/register", { method: "POST", body: payload, auth: false });
    const tok = pickToken(data);
    if (tok) {
      setToken(tok);
      setTokState(tok);
    }
    let u = pickUser(data);
    if (tok && (!u || !u.email)) {
      const profile = await api<unknown>("/auth/profile");
      u = pickUser(profile);
    }
    if (u) {
      setUser(u);
      setStoredUser(u);
    }
    return u ?? ({} as AuthUser);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setTokState(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<AuthUser> & Record<string, unknown>) => {
    const data = await api<unknown>("/auth/profile", { method: "PUT", body: patch });
    const u = pickUser(data) ?? { ...(user ?? {}), ...patch };
    setUser(u);
    setStoredUser(u);
    return u;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
