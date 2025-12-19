import InputController from '../InputController';
import { FormInputBase } from '@/interfaces/FormTypes';
import InputDate, { InputDateProps } from './InputDate';

interface InputDateFormProps extends InputDateProps, FormInputBase {}
const InputDateForm = ({name, label, ...props}: InputDateFormProps) => {
  return (
    <InputController
      InputComponent={InputDate}
      name={name}
      label={label}
      InputComponentProps={props}
    />
  );
};

export default InputDateForm;
