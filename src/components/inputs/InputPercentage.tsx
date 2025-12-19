import React from 'react';
import InputBase, { InputBaseProps } from './InputBase';

export interface InputPercentageProps extends InputBaseProps {}

const InputPercentage = ({ onChangeText, ...props }: InputPercentageProps) => {
  const handleChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');

    const num = parseInt(numericText, 10);

    if (numericText === '' || (!isNaN(num) && num <= 100)) {
      onChangeText?.(numericText);
    }
  };
  return (
    <InputBase keyboardType="numeric" {...props} onChangeText={handleChange} />
  );
};

export default InputPercentage;
