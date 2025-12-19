import theme from '@/theme';
import React, { ReactElement } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RenderIconProps {
  iconName: ReactElement | string;
  iconSize?: number;
  iconColor?: string;
}

export const renderIcon = ({
  iconName,
  iconSize = theme.typography.fontSize.lg,
  iconColor = theme.colors.primary,
}: RenderIconProps): ReactElement => {
  if (typeof iconName === 'string') {
    return <Icon name={iconName} size={iconSize} color={iconColor} />;
  }
  return iconName;
};
