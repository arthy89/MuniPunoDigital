import { View, Text, StyleSheet } from 'react-native';
import React, { ComponentType } from 'react';
import { InputBaseProps } from './inputs/InputBase';
import { FormInputBase } from '@/interfaces/FormTypes';
import LabelForm from './labels/LabelForm';
import { useFormContainerContext } from '@/hooks/useFormContainerContext';
import { Controller } from 'react-hook-form';
import TextErrorForm from './text-error/TextErrorForm';

interface InputControllerProps<InputProps extends object>
  extends FormInputBase {
  InputComponent: ComponentType<InputProps>;
  InputComponentProps: InputProps;
  flex?: number;
}

const InputController = <InputProps extends object>({
  label,
  name,
  InputComponent,
  InputComponentProps,
  flex,
}: InputControllerProps<InputProps>) => {
  const { control } = useFormContainerContext();
  return (
    <View style={{ flex }}>
      <LabelForm label={label} />
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <InputComponent
                {...InputComponentProps}
                onBlur={onBlur}
                onChangeValue={onChange}
                value={value}
              />
              <TextErrorForm message={error?.message} />
            </>
          )}
        />
      ) : (
        <InputComponent {...InputComponentProps} />
      )}
    </View>
  );
};

// const styles = StyleSheet.create({});

export default InputController;
