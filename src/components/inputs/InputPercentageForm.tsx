import { FormInputBase } from '@/interfaces/FormTypes';
import InputPercentage, { InputPercentageProps } from './InputPercentage';
import InputController from '../InputController';

interface InputPercentageFormProps
  extends InputPercentageProps,
    FormInputBase {}
const InputPercentageForm = ({
  name,
  label,
  ...props
}: InputPercentageFormProps) => {
  return (
    <InputController
      InputComponent={InputPercentage}
      name={name}
      label={label}
      InputComponentProps={props}
    />
  );
};

export default InputPercentageForm;
