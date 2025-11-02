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
  const [authError, setAuthError] = useState<string | null>(null);

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetchRequest<{ data: { role: string } }>(
        '/auth/check'
      );
      setRole(response.data.role);
      setAuthError(null);
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
    setAuthError(null);
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
      setAuthError(message);
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
    setAuthError(null);
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
      setAuthError(message);
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
      setAuthError(null);
      setIsLoading(false);
    }
  };

  const removeErrors = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        role,
        isLoading,
        authError,
        signIn,
        signUp,
        signOut,
        removeErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
