import type { ReactNode } from 'react';

export type MacWindowType = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: VoidFunction;
};
