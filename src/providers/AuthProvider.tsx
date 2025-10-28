import { type ReactNode, useState } from 'react';
import { fetchRequest } from '../helpers/fetchRequest.ts';
import { AuthContext } from '../context/AuthContext.ts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  const signIn = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const data = await fetchRequest('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setRole(data.role);
      return true;
    } catch {
      return false;
    }
  };

  const signUp = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      return await fetchRequest('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    } catch {
      return false;
    }
  };

  const signOut = async () => {
    try {
      await fetchRequest('/auth/sign-out', { method: 'POST' });
    } catch {
      await cookieStore.delete('auth_token');
    }
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
