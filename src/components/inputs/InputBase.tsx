import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import type { StyleProp } from 'react-native';
import { IconBaseProps } from '@/interfaces/IconTypes';
import { ColorTheme } from '@/theme/colors';
import theme from '@/theme/theme';
import { useColorTheme } from '@/hooks/useColorTheme';
import { renderIcon } from '@/utils/renderIcon';
import React, { ReactElement } from 'react';

export interface InputBaseProps extends TextInputProps, IconBaseProps {
  allowedRegex?: RegExp;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextStyle;
  onChangeValue?: (value: string) => void;
  noBorder?: boolean;
  shadow?: boolean;
  onPressInRight?: () => void;
  inputRef?: React.Ref<TextInput>;
}

const InputBase = ({
  allowedRegex,
  onChangeValue,
  onPressInRight,
  iconLeft,
  iconRight,
  iconSize = theme.typography.fontSize.lg,
  iconColor,
  style,
  containerStyle,
  inputStyle,
  noBorder,
  shadow,
  ...props
}: InputBaseProps) => {
  const colorTheme = useColorTheme();
  const onChange = (text: string) => {
    if (allowedRegex) {
      text = text.replace(allowedRegex, '');
    }
    onChangeValue?.(text);
  };

  const styles = getStyles(colorTheme);
  return (
    <View
      style={[
        styles.container,
        noBorder && { borderBottomWidth: 1 },
        shadow && { ...theme.shadow },
        containerStyle,
      ]}>
      {iconLeft && (
        <View style={theme.input().iconLeft}>
          {renderIcon({ iconName: iconLeft, iconSize, iconColor })}
        </View>
      )}
      <TextInput
        {...props}
        style={[inputStyle,styles.textInput, style]}
        onChangeText={onChange}
        placeholderTextColor={colorTheme.textPlaceholder}
      />
      {/*iconRight && (
        <View style={theme.input().iconRight}>
          {renderIcon({ iconName: iconRight, iconSize, iconColor })}
        </View>
      )*/}

      {iconRight && (
        <TouchableOpacity
          onPress={onPressInRight}
          style={theme.input().iconRight}>
          {renderIcon({ iconName: iconRight, iconSize, iconColor })}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBase;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.input(colors).container,
    },
    textInput: {
      flex: 1,
      padding: 0,
      ...theme.input(colors).text,
    },
  });
