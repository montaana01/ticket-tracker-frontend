import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';

export const SignInPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const from = (location.state && location.state.from?.pathname) || PATHS.HOME;

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

  return <AuthForm title="Sign in" error={error} onSubmit={handleSubmit} />;
};
