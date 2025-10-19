import logo from '/images/favicon/favicon.svg';
import { NavLink } from 'react-router';
import { PATHS } from '../../../constants/PATHS.ts';
import styles from '/logo.module.scss';

export const Logo = () => {
  return (
    <NavLink to={PATHS.HOME} className={styles.logo}>
      <img src={logo} alt="Requests logo" />
    </NavLink>
  );
};
