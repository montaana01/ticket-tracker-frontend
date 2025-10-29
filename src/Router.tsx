import { PATHS } from './constants/PATHS.ts';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router';
import { Layout } from './layout/Layout.tsx';
import { MainPage } from './pages/main';
import type { AuthGuardType, PublicOnlyGuardType } from './types/auth.ts';
import { AdminPage } from './pages/admin';
import { SignUpPage } from './pages/auth/signUp';
import { TicketsPage } from './pages/user/tickets';
import { SignInPage } from './pages/auth/signIn';
import { ProfilePage } from './pages/user/profile';
import { NotFoundPage } from './pages/notFound';
import { useAuth } from './hooks/useAuth.ts';
import { CircularProgress } from '@mui/material';

export const AuthGuard = ({ children, roles }: AuthGuardType) => {
  const { role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }

  if (!role) {
    return <Navigate to={PATHS.SIGN_IN} replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }: PublicOnlyGuardType) => {
  const { role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }

  if (role) {
    const from = location.state?.from?.pathname || PATHS.HOME;
    return <Navigate to={from} replace />;
  }

  return children;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={PATHS.HOME} element={<MainPage />} />
          <Route
            path={PATHS.SIGN_UP}
            element={
              <PublicOnlyRoute>
                <SignUpPage />
              </PublicOnlyRoute>
            }
          />

          <Route
            path={PATHS.SIGN_IN}
            element={
              <PublicOnlyRoute>
                <SignInPage />
              </PublicOnlyRoute>
            }
          />

          <Route
            path={PATHS.PROFILE}
            element={
              <AuthGuard roles={['user', 'admin']}>
                <ProfilePage />
              </AuthGuard>
            }
          />

          <Route
            path={PATHS.TICKETS}
            element={
              <AuthGuard roles={['user']}>
                <TicketsPage />
              </AuthGuard>
            }
          />

          <Route
            path={PATHS.ADMIN}
            element={
              <AuthGuard roles={['admin']}>
                <AdminPage />
              </AuthGuard>
            }
          />
          <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
