import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';

interface User {
  email?: string;
  name?: string;
  sub?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  idToken: string | undefined;
  accessToken: string | undefined;
  login: () => Promise<void>;
  logout: () => void;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const LOGOUT_URI = import.meta.env.VITE_LOGOUT_URI || window.location.origin;

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useOidcAuth();

  const signOutRedirect = () => {
    window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
  };

  const value: AuthContextType = {
    user: auth.user ? {
      email: auth.user.profile.email as string | undefined,
      name: auth.user.profile.name as string | undefined,
      sub: auth.user.profile.sub,
    } : null,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    idToken: auth.user?.id_token,
    accessToken: auth.user?.access_token,
    login: () => auth.signinRedirect(),
    logout: () => {
      auth.removeUser();
      signOutRedirect();
    },
    error: auth.error || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export the OIDC hook for direct access if needed
export { useAuth as useOidcAuth } from 'react-oidc-context';
