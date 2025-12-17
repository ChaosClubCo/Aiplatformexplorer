import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile, LoginCredentials } from '../utils/validation';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INTERNAL_USER: UserProfile = {
  id: 'internal-user',
  name: 'Internal User',
  email: 'user@int.com',
  role: 'admin',
  organization: 'INT Inc.',
  // Using a placeholder avatar
  avatarUrl: 'https://github.com/shadcn.png'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Hardcoded authenticated state for internal tool usage
  const [state] = useState<AuthState>({
    user: INTERNAL_USER,
    isLoading: false,
    isAuthenticated: true,
    error: null,
  });

  const login = async (credentials: LoginCredentials) => {
    // No-op for internal tool
    console.log('Login request ignored - Internal Tool Mode');
    return Promise.resolve();
  };

  const logout = async () => {
    // No-op for internal tool
    console.log('Logout request ignored - Internal Tool Mode');
    return Promise.resolve();
  };

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
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
