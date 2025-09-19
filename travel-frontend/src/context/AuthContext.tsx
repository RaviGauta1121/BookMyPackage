// ==================== src/contexts/AuthContext.tsx ====================
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterRequest, AuthContextType } from '../types/auth';
import { AuthService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const storedToken = AuthService.getAuthToken();
    const storedUser = AuthService.getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw so component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(data);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw so component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};