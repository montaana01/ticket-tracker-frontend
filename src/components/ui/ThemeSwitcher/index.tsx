import { useEffect, useState } from 'react';
import { getTheme } from '../../../helpers/getTheme.ts';
import styles from './theme.module.scss';

const THEME_KEY = 'theme';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(getTheme(THEME_KEY));

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={styles.switcherContainer} title="Theme switcher">
      <label id="switcher" className={styles.switcher}>
        <input
          id="switcher"
          type="checkbox"
          className={styles.switcherInput}
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <span className={styles.switcherSlider} />
      </label>
    </div>
  );
};
