import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import { IconBaseProps } from '@/interfaces/IconTypes';
import { renderIcon } from '@/utils/renderIcon';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
type NewDropdownCustomProps<T> = Omit<DropdownProps<T>, 'onChange'>;
export interface InputSelectProps<T>
  extends NewDropdownCustomProps<T>,
    IconBaseProps {
  onChangeValue?: (value: T) => void;
}
const InputSelect = <T,>({
  onChangeValue,
  iconLeft,
  iconRight,
  iconSize = theme.typography.fontSize.lg,
  iconColor,
  ...props
}: InputSelectProps<T>) => {
  const colorTheme = useColorTheme();
  return (
    <Dropdown
      style={[theme.input(colorTheme).container, props.style]}
      containerStyle={{ backgroundColor: colorTheme.card, borderWidth: 0 }}
      selectedTextStyle={theme.input(colorTheme).text}
      activeColor={colorTheme.primaryLight}
      itemContainerStyle={{
        backgroundColor: colorTheme.card,
      }}
      inputSearchStyle={{
        color: colorTheme.textSecondary,
      }}
      itemTextStyle={[theme.input(colorTheme).text]}
      placeholderStyle={{
        color: colorTheme.textPlaceholder,
        fontSize: theme.typography.fontSize.sm,
      }}
      {...(iconLeft && {
        renderLeftIcon: () => (
          <View style={theme.input().iconLeft}>
            {renderIcon({ iconName: iconLeft, iconSize, iconColor })}
          </View>
        ),
      })}
      {...(iconRight && {
        renderRightIcon: () => (
          <View style={theme.input().iconLeft}>
            {renderIcon({ iconName: iconRight, iconSize, iconColor })}
          </View>
        ),
      })}
      iconColor={colorTheme.textSecondary}
      placeholder="Seleccione una opción"
      {...props}
      onChange={value => {
        onChangeValue?.(value);
      }}
    />
  );
};

export default InputSelect;
