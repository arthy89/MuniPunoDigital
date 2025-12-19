import React from 'react';
import { FormInputBase } from '@/interfaces/FormTypes';
import InputBase, { InputBaseProps } from './InputBase';
import InputController from '../InputController';

interface TextAreaProps extends InputBaseProps, FormInputBase {
  flex?: number;
}

const TextAreaForm = ({
  name,
  label,
  flex,
  ...textAreaProps
}: TextAreaProps) => {
  return (
    <InputController
      name={name}
      label={label}
      flex={flex}
      InputComponent={InputBase}
      InputComponentProps={{
        ...textAreaProps,
        multiline: true, // Habilita múltiples líneas
        numberOfLines: 4, // Número de líneas visibles por defecto
        style: [{ height: 100 }, textAreaProps.style], // Ajusta la altura del TextArea
      }}
    />
  );
};

export default TextAreaForm;