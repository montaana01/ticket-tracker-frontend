import { type ReactNode, useEffect, useState } from 'react';
import { fetchRequest } from '../helpers/fetchRequest.ts';
import { AuthContext } from '../context/AuthContext.ts';
import type {
  AuthResponse,
  SignInServerResponse,
  SignUpServerResponse,
} from '../types/auth.ts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetchRequest<{ data: { role: string } }>(
        '/auth/check'
      );
      setRole(response.data.role);
    } catch {
      setRole(null);
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
    setIsLoading(true);
    try {
      const response = await fetchRequest<SignInServerResponse>(
        '/auth/sign-in',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        }
      );
      setRole(response.data.role);
      return { success: true, role: response.data.role };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return {
        success: false,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      await fetchRequest<SignUpServerResponse>('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      const response = await fetchRequest<SignInServerResponse>(
        '/auth/sign-in',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        }
      );
      setRole(response.data.role);
      return { success: true, role: response.data.role };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return {
        success: false,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await fetchRequest('/auth/sign-out', { method: 'POST' });
    } catch {
      console.error('Sign out error:');
    } finally {
      setRole(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
