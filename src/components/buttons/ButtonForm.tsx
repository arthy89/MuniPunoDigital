import { View, Text } from 'react-native';
import ButtonCustom, { ButtonBaseProps } from './ButtonBase';
import { useFormContainerContext } from '@/hooks/useFormContainerContext';

interface ButtonFormProps extends ButtonBaseProps {}

const ButtonForm = ({ ...props }: ButtonFormProps) => {
  const { onSubmit } = useFormContainerContext();

  return <ButtonCustom onPress={onSubmit} text="Enviar Reporte" {...props} />;
};

export default ButtonForm;
