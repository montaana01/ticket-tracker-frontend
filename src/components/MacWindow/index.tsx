import { type ReactNode, useState } from 'react';
import styles from './MacWindow.module.scss';
import container from './../ui/Container/container.module.scss';

export const MacWindow = ({ children }: { children: ReactNode }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div
        className={`${container.container} ${styles.modalWrapper} ${
          isMinimized ? styles.minimize : ''
        }`}
      >
        <div className={styles.modalHeader}>
          <button
            className={styles.modalHeaderClose + ' ' + styles.modalHeaderButton}
            onClick={handleClose}
          ></button>
          <button
            className={
              styles.modalHeaderMinimize + ' ' + styles.modalHeaderButton
            }
            onClick={handleMinimize}
          ></button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};
