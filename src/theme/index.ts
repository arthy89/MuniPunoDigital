import { StyleSheet } from 'react-native';

const spacing = {
  ssx: -2,
  sxs: 0,
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const typography = {
  fontFamily: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    bold: 'System',
    black: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  lineHeight: {
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  },
};

const colors = {
  primary: '#007DC5',
  primaryDark: '#005A94',
  secondary: '#00AEEF',

  background: '#F4F6FA',
  surface: '#FFFFFF',
  card: '#E5E5E5',

  textPrimary: '#1A1A1A',
  textSecondary: '#4D4D4D',
  textPlaceholder: '#A0A0A0',

  border: '#E0E0E0',
  danger: '#D32F2F',
  warning: '#FBC02D',
  success: '#388E3C',
  info: '#1976D2',

  white: '#FFFFFF',
  black: '#000000',
};

const shadow = {
  elevation: 10,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 6,
  shadowOpacity: 0.4,
};

const theme = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.white,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.white,
  },
  subtitleStrong: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.white,
  },
});

export default {
  colors,
  iconColor: colors.black,
  shadow,
  spacing,
  typography,
  ...theme,
};
