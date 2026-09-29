import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "../types";
import { AuthApi } from "../api/endpoints";
import { getAuthToken, setAuthToken } from "../api/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, fetch the current user to restore the session.
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    AuthApi.me()
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user, token } = await AuthApi.login({ email, password });
    setAuthToken(token);
    setUser(user);
  }

  async function register(data: { email: string; password: string; firstName: string; lastName: string }) {
    const { user, token } = await AuthApi.register(data);
    setAuthToken(token);
    setUser(user);
  }

  async function logout() {
    try {
      await AuthApi.logout();
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
