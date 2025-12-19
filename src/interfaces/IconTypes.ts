import { ReactElement } from 'react';

export interface IconBaseProps {
  icon?: ReactElement | string;
  iconLeft?: ReactElement | string;
  iconRight?: ReactElement | string;
  iconSize?: number;
  iconColor?: string;
}
