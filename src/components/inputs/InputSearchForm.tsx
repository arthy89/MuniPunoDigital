import InputSearchBase from './InputSearchBase';
import InputController from '../InputController';
import { FormInputBase } from '@/interfaces/FormTypes';
import { InputBaseProps } from './InputBase';

interface InputFormSearchLocationProps extends InputBaseProps, FormInputBase {
  flex?: number;
  onSelectPlace?: (place: { description: string; place_id: string }) => void;
}

const InputFormSearchLocation = ({
  name,
  label,
  flex,
  
  onSelectPlace,
  ...inputProps
}: InputFormSearchLocationProps) => {
  return (
    <InputController
      name={name}
      label={label}
      flex={flex}
      InputComponent={InputSearchBase}
      InputComponentProps={{ ...inputProps, onSelectPlace }}
    />
  );
};

export default InputFormSearchLocation;
