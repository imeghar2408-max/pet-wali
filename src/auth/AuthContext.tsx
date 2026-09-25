import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAccount, AuthRole, authApi, CaptainService } from './authApi.ts';

interface AuthContextValue {
  role: AuthRole;
  user: AuthAccount | null;
  loading: boolean;
  error: string;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (values: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => Promise<void>;
  registerCaptain: (values: {
    name: string; email: string; phone: string; password: string; confirmPassword: string;
    yearsExperience: number; servicesOffered: CaptainService[]; bio: string; profilePhoto?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ role: AuthRole; children: React.ReactNode }> = ({ role, children }) => {
  const [user, setUser] = useState<AuthAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    authApi.me().then((account) => {
      if (mounted && account?.role === role) setUser(account);
      else if (mounted && account) void authApi.logout();
    }).catch(() => {
      if (mounted) setError('We could not restore your session. Please sign in again.');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [role]);

  const login = useCallback(async (email: string, password: string) => {
    setError('');
    const account = await authApi.login(role, email, password);
    setUser(account);
  }, [role]);

  const registerUser = useCallback(async (values: {
    name: string; email: string; phone: string; password: string; confirmPassword: string;
  }) => {
    setError('');
    setUser(await authApi.register('USER', values));
  }, []);

  const registerCaptain = useCallback(async (values: {
    name: string; email: string; phone: string; password: string; confirmPassword: string;
    yearsExperience: number; servicesOffered: CaptainService[]; bio: string; profilePhoto?: string;
  }) => {
    setError('');
    setUser(await authApi.register('CAPTAIN', values));
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    role, user, loading, error,
    clearError: () => setError(''),
    login: async (email, password) => {
      try { await login(email, password); } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Unable to sign in.';
        setError(message); throw cause;
      }
    },
    registerUser: async (values) => {
      try { await registerUser(values); } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Unable to create your account.';
        setError(message); throw cause;
      }
    },
    registerCaptain: async (values) => {
      try { await registerCaptain(values); } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Unable to create your account.';
        setError(message); throw cause;
      }
    },
    logout,
  }), [role, user, loading, error, login, registerUser, registerCaptain, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
