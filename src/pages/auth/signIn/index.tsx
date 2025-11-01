import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';
import { CircularProgress } from '@mui/material';

export const SignInPage = () => {
  const { role, isLoading, signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from?.pathname) || PATHS.HOME;

  useEffect(() => {
    if (role) {
      navigate(from, { replace: true });
    }
  });

  const handleSubmit = async (data: {
    username: string;
    password: string;
  }): Promise<void> => {
    setError(null);

    const result = await signIn(data.username, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Wrong login/password');
    }
  };

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }

  return <AuthForm title="Sign in" error={error} onSubmit={handleSubmit} />;
};
