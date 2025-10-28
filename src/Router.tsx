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
import type { AuthGuardType } from './types/auth.ts';
import { AdminPage } from './pages/admin';
import { SignUpPage } from './pages/auth/signUp';
import { TicketsPage } from './pages/user/tickets';
import { SignInPage } from './pages/auth/signIn';
import { ProfilePage } from './pages/user/profile';
import { NotFoundPage } from './pages/notFound';
import { useAuth } from './hooks/useAuth.ts';

export const AuthGuard = ({ children, roles }: AuthGuardType) => {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate to={PATHS.SIGN_IN} replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={PATHS.HOME} element={<MainPage />} />
          <Route path={PATHS.SIGN_UP} element={<SignUpPage />} />
          <Route path={PATHS.SIGN_IN} element={<SignInPage />} />

          <Route
            path={PATHS.PROFILE}
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />

          <Route
            path={PATHS.TICKETS}
            element={
              <AuthGuard>
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
