import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserRoleProfile, AuthResponse } from '../services/api';

interface AuthContextType {
  user: UserRoleProfile | null;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    courseId?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRoleProfile | null>(() => {
    const cached = localStorage.getItem('dpskilltech_user_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('dpskilltech_auth_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate stored session on mount with the backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('dpskilltech_auth_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            // Token is invalid or expired
            api.clearToken();
            setUser(null);
            setToken(null);
          }
        } catch (e) {
          console.warn('Session verification fallback to cached profile:', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    courseId?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    const res = await api.getMe();
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const role = user ? user.role : null;
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
