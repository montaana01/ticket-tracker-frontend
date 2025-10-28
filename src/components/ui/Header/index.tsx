import { Container } from '../Container';
import { Logo } from '../Logo';
import { AuthButtons } from '../../AuthButtons';
import { ThemeSwitcher } from '../ThemeSwitcher';
import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerWrapper}>
          <ThemeSwitcher />
          <div className={styles.headerLogo}>
            <Logo />
          </div>
          <AuthButtons />
        </div>
      </Container>
    </header>
  );
};
