import { lightColors } from './colors';

const spacing = {
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

const shadow = {
  elevation: 10,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 6,
  shadowOpacity: 0.4,
};

export const createTheme = (colors: typeof lightColors) => ({
  colors,
  spacing,
  typography,
  shadow,
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

export type ThemeType = ReturnType<typeof createTheme>;
