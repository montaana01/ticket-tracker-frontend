import type { ReactElement } from 'react';

export type AuthContextType = {
  role: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  signOut: VoidFunction;
};

export type AuthGuardType = {
  children: ReactElement;
  roles?: string[];
};
