import { StyleSheet, View } from 'react-native';
import ButtonBase, { ButtonBaseProps } from './ButtonBase';
import theme from '@/theme/theme';
import { useColorTheme } from '@/hooks/useColorTheme';
import { Text } from 'react-native-gesture-handler';

interface ButtonCategoryProps extends ButtonBaseProps {
  color: string;
}
const ButtonCategory = ({ color, text, ...props }: ButtonCategoryProps) => {
  const colorTheme = useColorTheme();

  return (
    <View style={styles.buttonContainer}>
      <ButtonBase
        style={[
          styles.button,
          {
            backgroundColor: color,
          },
        ]}
        {...props}
      />
      <Text style={[styles.buttonText, { color: colorTheme.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    gap: theme.spacing.xxs,
  },
  button: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default ButtonCategory;
