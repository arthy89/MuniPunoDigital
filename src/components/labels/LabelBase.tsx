import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

interface LabelBaseProps extends TextProps {
  text?: string;
  marginVertical?: number;
  marginBottom?: number;
  marginTop?: number;
}

const LabelBase = ({
  text,
  children,
  style,
  marginVertical,
  marginBottom = theme.spacing.xs,
  marginTop,
  ...props
}: LabelBaseProps) => {
  const colorsTheme = useColorTheme();
  return (
    <Text
      style={[
        styles.label,
        {
          color: colorsTheme.textSecondary,
          marginBottom,
          marginTop,
          marginVertical,
        },
        style,
      ]}
      {...props}>
      {children || text}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: 'bold',
  },
});

export default LabelBase;
