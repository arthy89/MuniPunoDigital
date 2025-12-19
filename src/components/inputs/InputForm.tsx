import { FormInputBase } from '@/interfaces/FormTypes';
import InputBase, { InputBaseProps } from './InputBase';
import InputController from '../InputController';

interface InputFormProps extends InputBaseProps, FormInputBase {
  flex?: number;
}
const InputForm = ({
  name,
  label,
  flex,
  ...inputFormProps
}: InputFormProps) => {
  return (
    <InputController
      name={name}
      label={label}
      flex={flex}
      InputComponent={InputBase}
      InputComponentProps={inputFormProps}
    />
  );
};

export default InputForm;
