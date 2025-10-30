import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth.ts';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';

export const SignUpPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { username: string; password: string }) => {
    setError(null);

    const result = await signUp(data.username, data.password);
    if (result.success) {
      navigate(PATHS.HOME);
    } else {
      setError(result.error || 'Error while registration');
    }
  };

  return <AuthForm title="Sign up" error={error} onSubmit={handleSubmit} />;
};
