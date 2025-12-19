import { StyleSheet } from 'react-native';
import { ColorTheme } from './colors';

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
  elevation: 2,
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
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  subtitleStrong: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
  },
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
});

const input = (colors?: ColorTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      borderWidth:1,
      padding: spacing.sm,
      ...(colors
        ? { borderColor: colors.textPlaceholder, backgroundColor: colors.card }
        : {}),
    },

    text: {
      ...(colors ? { color: colors.textPrimary } : {}),
      fontSize: typography.fontSize.sm,
    },
    iconLeft: {
      marginRight: spacing.xs,
    },
    iconRight: {
      marginLeft: spacing.xs,
    },
  });

export default {
  shadow,
  spacing,
  typography,
  input,
  ...theme,
};
