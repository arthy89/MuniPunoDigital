import theme from '@/theme';
import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';

interface TextErrorProps extends TextProps {
  text?: string;
  color?: string;
  fontSize?: number;
  position?: TextStyle['position'];
}

const TextError = ({
  text,
  color = theme.colors.danger,
  fontSize = theme.typography.fontSize.sm,
  position = 'relative',
  children,
  style,
  ...props
}: TextErrorProps) => {
  return (
    <Text
      style={[styles.base, { color, fontSize, position }, style]}
      {...props}>
      {text || children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    lineHeight: 10,
  },
});

export default TextError;
