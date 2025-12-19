import { BaseToast, ToastProps } from 'react-native-toast-message';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomToastType } from '../interfaces/CustomToastType';
import { useColorTheme } from '@/hooks/useColorTheme';

interface CustomToastProps extends ToastProps {
  type: CustomToastType;
}

const icons: Record<CustomToastType, string> = {
  success: 'check-circle',
  error: 'times-circle',
  info: 'info-circle',
  warning: 'exclamation-triangle',
};

const CustomToast = (props: CustomToastProps) => {
  const { type } = props;
  const iconName = icons[type];
  const colorTheme = useColorTheme();

  const colors: Record<CustomToastType, string> = {
    success: colorTheme.success,
    error: colorTheme.danger,
    info: colorTheme.info,
    warning: colorTheme.warning,
  };
  return (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colorTheme.background,
        borderLeftWidth: 10,
        borderLeftColor: colors[type],
      }}
      text1Style={{ color: colors[type] }}
      text2Style={{ color: colorTheme.textPrimary }}
      renderTrailingIcon={() => (
        <View style={{ justifyContent: 'center', paddingRight: 16 }}>
          <Icon name={iconName} size={20} color={colors[type]} />
        </View>
      )}
    />
  );
};

export default CustomToast;
