import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserProfile, Role, Permission, ROLE_PERMISSIONS } from '../types/auth';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock initial user for demo purposes
const MOCK_USER: UserProfile = {
  id: 'usr_123456',
  email: 'demo@enterprise.ai',
  fullName: 'Alex Innovation',
  role: 'admin', // Default to admin for full access
  organizationId: 'org_789',
  avatarUrl: 'https://github.com/shadcn.png',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null, // Start null to simulate auth check
    isLoading: true,
    isAuthenticated: false,
  });

  // Simulate session check
  useEffect(() => {
    const initAuth = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check local storage for persisted role preference
      const savedRole = localStorage.getItem('ape_demo_role') as Role;
      const user = { ...MOCK_USER, role: savedRole || 'admin' };
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    };

    initAuth();
  }, []);

  const login = async (email: string, role: Role = 'viewer') => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = { ...MOCK_USER, email, role };
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 400));
    localStorage.removeItem('ape_demo_role');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const switchRole = (role: Role) => {
    if (!state.user) return;
    localStorage.setItem('ape_demo_role', role);
    setState(prev => ({
      ...prev,
      user: { ...prev.user!, role }
    }));
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    const permissions = ROLE_PERMISSIONS[state.user.role];
    return permissions.includes(permission);
  };

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    switchRole,
    hasPermission
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
