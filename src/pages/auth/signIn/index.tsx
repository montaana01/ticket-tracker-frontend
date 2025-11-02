import { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth.ts';
import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';

export const SignInPage = () => {
  const { role, isLoading, signIn, authError, removeErrors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from?.pathname) || PATHS.HOME;

  useEffect(() => {
    if (role) {
      navigate(from, { replace: true });
    }
  }, [role, navigate, from]);

  const handleSubmit = async (data: {
    username: string;
    password: string;
  }): Promise<void> => {
    removeErrors();
    const result = await signIn(data.username, data.password);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthForm
      title="Sign in"
      error={authError}
      loading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};
