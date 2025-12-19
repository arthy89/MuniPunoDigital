import React from 'react';
import ButtonBase, { ButtonBaseProps } from './ButtonBase';
import { StyleSheet } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';

interface ButtonActionProps extends ButtonBaseProps {}
const ButtonAction = ({ ...props }: ButtonActionProps) => {
  const colorTheme = useColorTheme();
  return (
    <ButtonBase
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colorTheme.background,
          borderColor: colorTheme.border,
        },
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
      textStyle={[styles.buttonText, { color: colorTheme.primary }]}
      iconColor={colorTheme.primary}
      iconSize={theme.typography.fontSize.md}
      iconContainerStyle={{ marginRight: 0, marginLeft: 0 }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: 110,
    height: 50,
    gap: theme.spacing.xs,
    borderWidth: 1,
  },
  buttonText: { fontSize: theme.typography.fontSize.sm, fontWeight: 'normal' },
});

export default ButtonAction;
