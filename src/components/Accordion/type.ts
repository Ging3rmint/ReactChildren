import { ReactNode } from 'react';

export interface IAccordionProps {
  id: string;
  header?: string;
  children?: ReactNode;
  className?: string;
  open?: boolean;
  icon?: string;
  iconClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClick?: (isOpen: boolean, id: string) => void;
  isGroup?: boolean;
}

export interface IAccordionWrapperProps {
  children?: ReactNode;
  className?: string;
  defaultOpenId?: string;
  onClick?: (isOpen: boolean, id: string) => void;
}
