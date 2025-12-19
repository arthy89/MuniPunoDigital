import InputSelect, { InputSelectProps } from './InputSelect';
import { FormInputBase } from '@/interfaces/FormTypes';
import InputController from '../InputController';



interface InputSelectFormProps<T> extends InputSelectProps<T>, FormInputBase {
  flex?: number;
}

const InputSelectForm = <T,>({
  name,
  label,
  flex,
  ...inputFormProps
}: InputSelectFormProps<T>) => {
  return (
    <InputController<InputSelectProps<T>>
      name={name}
      label={label}
      flex={flex}
      InputComponent={InputSelect}
      InputComponentProps={inputFormProps}
    />
  );
};

export default InputSelectForm;
