import type { AuthContextType } from '../types/auth.ts';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.ts';

export const useAuth: () => AuthContextType = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
