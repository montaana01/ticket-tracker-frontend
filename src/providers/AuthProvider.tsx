import { type ReactNode, useEffect, useState } from 'react';
import { fetchRequest } from '../helpers/fetchRequest.ts';
import { AuthContext } from '../context/AuthContext.ts';
import type { AuthResponse } from '../types/auth.ts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<void> => {
    try {
      const data = await fetchRequest<{ role: string }>('/api/user/profile');
      setRole(data.role);
    } catch (error) {
      setRole(null);
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const data = await fetchRequest<{ role: string }>('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setRole(data.role);
      return { success: true, role: data.role };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return {
        success: false,
        error: message,
      };
    }
  };

  const signUp = async (
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const data = await fetchRequest<{ role: string }>('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setRole(data.role);
      return { success: true, role: data.role };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return {
        success: false,
        error: message,
      };
    }
  };

  const signOut = async () => {
    try {
      await fetchRequest('/auth/sign-out', { method: 'POST' });
    } catch {
      console.error('Sign out error:');
    }
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
