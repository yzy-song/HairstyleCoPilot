'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '../types';
import * as authApi from '../api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUpSalon: (email: string, password: string, salonName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Validate token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    authApi
      .getMe()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('token', res.accessToken);
    setToken(res.accessToken);
    const u = await authApi.getMe();
    setUser(u);
    router.push('/dashboard');
  }, [router]);

  const signUpSalon = useCallback(async (email: string, password: string, salonName: string) => {
    const res = await authApi.signUpSalon(email, password, salonName);
    localStorage.setItem('token', res.accessToken);
    setToken(res.accessToken);
    const u = await authApi.getMe();
    setUser(u);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, signUpSalon }}>
      {children}
    </AuthContext.Provider>
  );
}
