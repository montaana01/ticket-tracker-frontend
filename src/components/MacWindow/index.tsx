import { useState } from 'react';
import styles from './MacWindow.module.scss';
import container from './../ui/Container/container.module.scss';
import type { MacWindowType } from '../../types/modal.ts';

export const MacWindow = ({
  children,
  isOpen,
  defaultOpen = false,
  onClose,
}: MacWindowType) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);

  const open = isOpen !== undefined ? isOpen : internalOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  if (!open) return null;

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
