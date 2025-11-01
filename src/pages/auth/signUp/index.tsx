import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth.ts';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';
import { CircularProgress } from '@mui/material';

export const SignUpPage = () => {
  const { role, isLoading, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      navigate(PATHS.HOME);
    }
  });

  const handleSubmit = async (data: { username: string; password: string }) => {
    setError(null);

    const result = await signUp(data.username, data.password);
    if (!result.success) {
      setError(result.error || 'Error while registration');
    }
  };

  if (isLoading) return <CircularProgress color="secondary" />;

  return <AuthForm title="Sign up" error={error} onSubmit={handleSubmit} />;
};
