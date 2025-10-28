import type { ReactNode } from 'react';
import styles from './MacWindow.module.scss';

export const MacWindow = ({ children }: { children: ReactNode }) => {
  return <div className={styles.modal}>{children}</div>;
};
