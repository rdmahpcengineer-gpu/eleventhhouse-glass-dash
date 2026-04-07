import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  logout: () => void;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGION = 'us-east-1';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
const COGNITO_ENDPOINT = `https://cognito-idp.${REGION}.amazonaws.com/`;

const STORAGE_KEYS = {
  idToken: 'ehcx_id_token',
  accessToken: 'ehcx_access_token',
  refreshToken: 'ehcx_refresh_token',
  user: 'ehcx_user',
};

async function cognitoRequest(target: string, body: object) {
  const res = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.__type || 'Authentication failed');
  }
  return data;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.idToken);
    const storedAccess = localStorage.getItem(STORAGE_KEYS.accessToken);
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (storedToken && storedUser) {
      try {
        const claims = parseJwt(storedToken);
        const now = Math.floor(Date.now() / 1000);
        if ((claims.exp as number) > now) {
          setIdToken(storedToken);
          setAccessToken(storedAccess || undefined);
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired — try refresh
          const refresh = localStorage.getItem(STORAGE_KEYS.refreshToken);
          if (refresh) {
            refreshSession(refresh).catch(() => clearSession());
          } else {
            clearSession();
          }
        }
      } catch {
        clearSession();
      }
    }
    setIsLoading(false);
  }, []);

  function clearSession() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    setUser(null);
    setIdToken(undefined);
    setAccessToken(undefined);
  }

  async function refreshSession(refreshToken: string) {
    const data = await cognitoRequest('InitiateAuth', {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: refreshToken },
      ClientId: CLIENT_ID,
    });
    const result = data.AuthenticationResult;
    storeSession(result);
  }

  function storeSession(result: { IdToken: string; AccessToken: string; RefreshToken?: string }) {
    const claims = parseJwt(result.IdToken);
    const u: User = {
      email: claims.email as string,
      name: (claims.name || claims['cognito:username'] || claims.email) as string,
      sub: claims.sub as string,
    };
    localStorage.setItem(STORAGE_KEYS.idToken, result.IdToken);
    localStorage.setItem(STORAGE_KEYS.accessToken, result.AccessToken);
    if (result.RefreshToken) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, result.RefreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
    setIdToken(result.IdToken);
    setAccessToken(result.AccessToken);
    setUser(u);
  }

  async function login(email: string, password: string) {
    setError(null);
    const data = await cognitoRequest('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: { USERNAME: email, PASSWORD: password },
      ClientId: CLIENT_ID,
    });

    if (!data.AuthenticationResult) {
      // Cognito returned a challenge instead of tokens
      const challenge = data.ChallengeName || 'unknown challenge';
      throw new Error(
        `Authentication requires additional step: ${challenge}. Please contact your administrator or complete the challenge in the AWS Console.`
      );
    }

    storeSession(data.AuthenticationResult);
  }

  async function signup(email: string, password: string, name: string) {
    setError(null);
    await cognitoRequest('SignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });
    return { needsConfirmation: true };
  }

  async function confirmSignup(email: string, code: string) {
    setError(null);
    await cognitoRequest('ConfirmSignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });
  }

  function logout() {
    clearSession();
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      idToken,
      accessToken,
      login,
      signup,
      confirmSignup,
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
