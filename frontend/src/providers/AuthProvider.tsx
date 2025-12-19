// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect } from 'react';
// Added 'type' keyword here to fix the import error
import type { User, LoginCredentials, RegisterCredentials } from '../features/auth/types';
import { authApi } from '../features/auth/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// ✅ FIXED: Added 'export' so useAuth.ts can find it
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { user } = await authApi.getProfile();
          setUser(user);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles
    });
  };

  const register = async (credentials: RegisterCredentials) => {
    await authApi.register(credentials);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// ❌ DELETED useAuth from here (it is now in src/hooks/useAuth.ts)