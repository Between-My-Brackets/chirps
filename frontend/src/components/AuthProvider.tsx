import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AuthResponse, User } from '../lib/api';
import * as api from '../lib/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'chirpy-auth';

interface StoredAuth {
  user: User;
  token: string;
  refreshToken: string;
}

function loadAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

function saveAuth(data: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTkn, setRefreshTkn] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
      setRefreshTkn(stored.refreshToken);
    }
  }, []);

  const handleAuthResponse = useCallback((res: AuthResponse) => {
    const userData: User = {
      id: res.id,
      email: res.email,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      isChirpyRed: res.isChirpyRed,
    };
    setUser(userData);
    setToken(res.token);
    setRefreshTkn(res.refreshToken);
    saveAuth({ user: userData, token: res.token, refreshToken: res.refreshToken });
  }, []);

  const loginFn = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    handleAuthResponse(res);
  }, [handleAuthResponse]);

  const registerFn = useCallback(async (email: string, password: string) => {
    // Create user then auto-login
    await api.register(email, password);
    const res = await api.login(email, password);
    handleAuthResponse(res);
  }, [handleAuthResponse]);

  const logout = useCallback(() => {
    if (refreshTkn) {
      api.revokeToken(refreshTkn).catch(() => {}); // best-effort
    }
    setUser(null);
    setToken(null);
    setRefreshTkn(null);
    clearAuth();
  }, [refreshTkn]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login: loginFn,
        register: registerFn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
