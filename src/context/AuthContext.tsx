import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  email?: string;
  name?: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  devLogin: () => void;
  logout: () => void;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_USER_KEY = 'ehcx_dev_user';

function mapSupabaseUser(su: SupabaseUser): User {
  return {
    email: su.email,
    name: su.user_metadata?.name || su.user_metadata?.full_name || su.email,
    id: su.id,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for dev user first
    const devUser = localStorage.getItem(DEV_USER_KEY);
    if (devUser) {
      try {
        setUser(JSON.parse(devUser));
        setIsLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEV_USER_KEY);
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ? mapSupabaseUser(s.user) : null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ? mapSupabaseUser(s.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) throw new Error(err.message);
  }

  async function signup(email: string, password: string, name: string) {
    setError(null);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, full_name: name },
      },
    });
    if (err) throw new Error(err.message);
    return { needsConfirmation: true };
  }

  function devLogin() {
    const devUser: User = {
      email: 'dev@ehcx.ai',
      name: 'Dev User',
      id: 'dev-local-user',
    };
    localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
    setUser(devUser);
  }

  async function logout() {
    localStorage.removeItem(DEV_USER_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      session,
      login,
      signup,
      devLogin,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
