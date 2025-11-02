import { NavLink } from 'react-router';
import { PATHS } from '../../constants/PATHS.ts';
import styles from './../ui/Header/header.module.scss';
import { useAuth } from '../../hooks/useAuth.ts';
import { CircularProgress } from '@mui/material';

export const AuthButtons = () => {
  const { role, isLoading, signOut } = useAuth();

  return (
    <nav className={styles.headerNavigation}>
      <ul className={styles.headerNavigationWrapper}>
        {role === 'admin' && (
          <li className={styles.headerNavigationWrapper}>
            <NavLink to={PATHS.ADMIN}>Admin Panel</NavLink>
          </li>
        )}
        {role !== 'admin' && (
          <li>
            <NavLink to={PATHS.TICKETS}>Tickets</NavLink>
          </li>
        )}
        <li>
          <NavLink to={PATHS.PROFILE}>User info</NavLink>
        </li>
      </ul>
      <div className={styles.headerAuth}>
        {role ? (
          isLoading ? (
            <CircularProgress />
          ) : (
            <button
              onClick={signOut}
              className={styles.headerNavigationButtons + ' btn'}
            >
              Log out
            </button>
          )
        ) : (
          <span className={styles.headerNavigationButtons}>
            <NavLink to={PATHS.SIGN_IN}>Sign In</NavLink>
            <NavLink to={PATHS.SIGN_UP}>Sign Up</NavLink>
          </span>
        )}
      </div>
    </nav>
  );
};
