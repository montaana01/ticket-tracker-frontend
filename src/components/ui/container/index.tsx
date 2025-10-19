import type { ReactNode } from 'react';
import styles from '/container.module.scss';

export const Container = ({ children }: { children: ReactNode }) => {
  return <div className={styles.container}>{children}</div>;
};
