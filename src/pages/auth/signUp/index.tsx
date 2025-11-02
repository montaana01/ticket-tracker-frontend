import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth.ts';
import { PATHS } from '../../../constants/PATHS.ts';
import { AuthForm } from '../../../components/ui/AuthForm';

export const SignUpPage = () => {
  const { role, isLoading, signUp, authError, removeErrors } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role) {
      navigate(PATHS.HOME);
    }
  });

  const handleSubmit = async (data: { username: string; password: string }) => {
    removeErrors();
    await signUp(data.username, data.password);
  };

  return (
    <AuthForm
      title="Sign up"
      error={authError}
      loading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};
