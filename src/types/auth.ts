import type { ReactElement } from 'react';

export type AuthResponse = {
  success: boolean;
  role?: string;
  error?: string;
};

export type AuthContextType = {
  role: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<AuthResponse>;
  signUp: (username: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

export type AuthGuardType = {
  children: ReactElement;
  roles?: string[];
};

export type PublicOnlyGuardType = {
  children: ReactElement;
};

export type AuthFormProps = {
  title: string;
  error: string | null;
  onSubmit: (data: {
    username: string;
    password: string;
  }) => Promise<void> | void;
};
