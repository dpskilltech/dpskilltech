import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserRoleProfile, AuthResponse } from '../services/api';
import { supabase } from '../lib/supabase';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

interface AuthContextType {
  user: UserRoleProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** DB-sourced flag (profiles.requires_password_change). Frontend only reads, API clears. */
  requiresPasswordChange: boolean;
  login: (emailOrPhone: string, password: string) => Promise<AuthResponse>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Helper: fetch requires_password_change from profiles table via API
// This is the DB source of truth — NOT user_metadata.
// Reads from GET /api/student/profile-flags which is an RLS-gated lightweight check.
// =============================================================================
const getApiBase = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '');
};

const fetchRequiresPasswordChange = async (accessToken: string): Promise<boolean> => {
  try {
    const res = await fetch(`${getApiBase()}/api/student/profile-flags`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.requiresPasswordChange);
  } catch {
    // If API unavailable (dev offline), do not block login
    return false;
  }
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRoleProfile | null>(() => {
    const cached = localStorage.getItem('dpskilltech_user_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('dpskilltech_auth_token')
  );

  const [requiresPasswordChange, setRequiresPasswordChange] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ============================================================================
  // Initialize Auth Session from Supabase
  // ============================================================================
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check Supabase session (primary)
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const userMetadata = session.user.user_metadata || {};
            const userProfile: UserRoleProfile = {
              id: session.user.id,
              email: session.user.email || '',
              role: (userMetadata.role || 'STUDENT').toUpperCase() as any,
              fullName: userMetadata.full_name || session.user.email?.split('@')[0] || 'Academy Member',
              phone: session.user.phone || undefined
            };

            setUser(userProfile);
            setToken(session.access_token);
            localStorage.setItem('dpskilltech_auth_token', session.access_token);
            localStorage.setItem('dpskilltech_user_profile', JSON.stringify(userProfile));

            // CRITICAL: Read requires_password_change from DB (NOT from user_metadata)
            // profiles.requires_password_change is the single source of truth.
            const dbFlag = await fetchRequiresPasswordChange(session.access_token);
            setRequiresPasswordChange(dbFlag);

            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[AuthContext] Supabase session lookup error:', err);
        }
      }

      // 2. Fallback: API session verification (dev without Supabase configured)
      const storedToken = localStorage.getItem('dpskilltech_auth_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            api.clearToken();
            setUser(null);
            setToken(null);
          }
        } catch (e) {
          console.warn('[AuthContext] Session verification failed:', e);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen to Supabase auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          api.clearToken();
          setUser(null);
          setToken(null);
          setRequiresPasswordChange(false);
        } else if (session?.user) {
          const userMetadata = session.user.user_metadata || {};
          const userProfile: UserRoleProfile = {
            id: session.user.id,
            email: session.user.email || '',
            role: (userMetadata.role || 'STUDENT').toUpperCase() as any,
            fullName: userMetadata.full_name || session.user.email?.split('@')[0] || 'Academy Member',
            phone: session.user.phone || undefined
          };

          setUser(userProfile);
          setToken(session.access_token);
          localStorage.setItem('dpskilltech_auth_token', session.access_token);
          localStorage.setItem('dpskilltech_user_profile', JSON.stringify(userProfile));

          // Always read from DB — NOT from user_metadata
          const dbFlag = await fetchRequiresPasswordChange(session.access_token);
          setRequiresPasswordChange(dbFlag);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // ============================================================================
  // Login
  // ============================================================================
  const login = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // 1. Supabase Auth (primary — always tried first)
      if (supabase) {
        const isEmail = emailOrPhone.includes('@');
        const { data, error } = await supabase.auth.signInWithPassword(
          isEmail
            ? { email: emailOrPhone, password }
            : { phone: emailOrPhone, password }
        );

        if (!error && data.session && data.user) {
          const userMetadata = data.user.user_metadata || {};
          const userProfile: UserRoleProfile = {
            id: data.user.id,
            email: data.user.email || '',
            role: (userMetadata.role || 'STUDENT').toUpperCase() as any,
            fullName: userMetadata.full_name || data.user.email?.split('@')[0] || 'Academy Member',
            phone: data.user.phone || undefined
          };

          setUser(userProfile);
          setToken(data.session.access_token);
          localStorage.setItem('dpskilltech_auth_token', data.session.access_token);
          localStorage.setItem('dpskilltech_user_profile', JSON.stringify(userProfile));

          // Read requires_password_change from DB source of truth
          const dbFlag = await fetchRequiresPasswordChange(data.session.access_token);
          setRequiresPasswordChange(dbFlag);

          return { success: true, token: data.session.access_token, user: userProfile };
        }

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // 2. NEVER use mock login in production
      if (import.meta.env.PROD) {
        return {
          success: false,
          error: 'Authentication failed. Please verify your credentials with academic administration.'
        };
      }

      // 3. Dev fallback: API login (offline development only)
      const res = await api.login(emailOrPhone, password);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // changePassword
  // Two-step flow:
  //   Step 1: Supabase Auth updates the credential (password stored encrypted in auth.users)
  //   Step 2: Express API clears requires_password_change in profiles table (DB source of truth)
  //
  // Students CANNOT clear this flag via Supabase JS SDK directly —
  // the profiles UPDATE RLS WITH CHECK prevents self-modification of this field.
  // ============================================================================
  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      // Dev offline fallback — clear locally only
      setRequiresPasswordChange(false);
      return { success: true };
    }

    // Step 1: Update password in Supabase Auth (credential store)
    const { error: supabaseError } = await supabase.auth.updateUser({ password: newPassword });

    if (supabaseError) {
      return { success: false, error: supabaseError.message };
    }

    // Step 2: Clear requires_password_change in the DB via trusted Express API
    const currentToken = token || localStorage.getItem('dpskilltech_auth_token');
    if (currentToken) {
      try {
        const res = await fetch(`${getApiBase()}/api/student/password-changed`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });


        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('[AuthContext] Failed to clear password change flag in DB:', body);
          // Password was changed in Supabase Auth, but DB flag clearing failed.
          // The user will be reprompted on next login. Log for admin review.
        }
      } catch (fetchErr) {
        console.warn('[AuthContext] API unavailable — DB password-change flag not cleared:', fetchErr);
      }
    }

    // Step 3: Update local React state — dashboard unlocked
    setRequiresPasswordChange(false);
    return { success: true };
  };

  // ============================================================================
  // Logout
  // ============================================================================
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    api.clearToken();
    setUser(null);
    setToken(null);
    setRequiresPasswordChange(false);
    localStorage.removeItem('dpskilltech_auth_token');
    localStorage.removeItem('dpskilltech_user_profile');
  };

  const refreshUser = async () => {
    const res = await api.getMe();
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const role: UserRole | null = user ? (user.role as UserRole) : null;
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        requiresPasswordChange,
        login,
        changePassword,
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
