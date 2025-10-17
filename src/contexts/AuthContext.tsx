import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../utils/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && api.isAuthenticated();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          const response = await api.getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        api.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) => {
    try {
      const response = await api.register(userData);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Even if the API call fails, we should still clear the local state
    } finally {
      // Always clear the local state and token
      setUser(null);
      api.removeToken();
    }
  };

  const updateUser = async (userData: any) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const response = await api.updateUser(user.id, userData);
      setUser(response.user);
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Refresh user failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
