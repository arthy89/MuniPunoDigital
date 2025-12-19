import React, { ReactNode } from 'react';
import {
  Text,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { renderIcon } from '@/utils/renderIcon';
import { IconBaseProps } from '@/interfaces/IconTypes';
import theme from '@/theme/theme';
import { useColorTheme } from '@/hooks/useColorTheme';

export type Size = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
export type Variant = 'solid' | 'outline' | 'ghost' | 'link';

export interface ButtonBaseProps extends PressableProps, IconBaseProps {
  text?: string;
  children?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  size?: Size;
  variant?: Variant;
  
}

const sizeStyles: Record<
  Size,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    borderRadius: number;
  }
> = {
  xxxs: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontSize: 10,
    borderRadius: 4,
  },
  xxs: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 12,
    borderRadius: 6,
  },
  xs: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 13,
    borderRadius: 8,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    borderRadius: 10,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 12,
  },
  lg: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    borderRadius: 14,
  },
};

const ButtonBase = ({
  children,
  text,
  style,
  iconLeft,
  iconRight,
  iconSize,
  textStyle,
  iconColor,
  iconContainerStyle,
  size = 'lg',
  variant = 'solid',
  ...props
}: ButtonBaseProps) => {
  const colorTheme = useColorTheme();
  const { paddingVertical, paddingHorizontal, fontSize, borderRadius } =
    sizeStyles[size];

  const getBackground = (pressed: boolean) => {
    switch (variant) {
      case 'solid':
        return pressed ? colorTheme.primaryDark : colorTheme.primary;
      case 'outline':
        return pressed ? colorTheme.white : 'transparent';
      case 'ghost':
      case 'link':
        return 'transparent';
      default:
        return colorTheme.primary;
    }
  };

  const getBorder = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: colorTheme.primary,
      };
    }
    return {};
  };

  const getTextColor = () => {
    switch (variant) {
      case 'solid':
        return colorTheme.white;
      case 'outline':
      case 'ghost':
        return colorTheme.primary;
      case 'link':
        return colorTheme.primary;
      default:
        return colorTheme.white;
    }
  };

  iconColor = iconColor || getTextColor();
  iconSize = iconSize || fontSize;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          paddingVertical,
          paddingHorizontal,
          borderRadius,
          backgroundColor: getBackground(pressed),
          ...getBorder(),
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}>
      {iconLeft && (
        <View style={[text && styles.iconLeft, iconContainerStyle]}>
          {renderIcon({ iconName: iconLeft, iconSize, iconColor })}
        </View>
      )}

      {children ||
        (text && (
          <Text
            style={[
              styles.text,
              { fontSize, color: getTextColor() },
              variant === 'link' && styles.linkText,
              textStyle,
            ]}>
            {text}
          </Text>
        ))}

      {iconRight && (
        <View style={[text && styles.iconRight, iconContainerStyle]}>
          {renderIcon({ iconName: iconRight, iconSize, iconColor })}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
  text: {
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

export default ButtonBase;
