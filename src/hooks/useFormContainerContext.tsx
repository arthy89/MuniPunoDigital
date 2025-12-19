import { use } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { FormContainerContext } from '../components/FormContainer';
import { Alert } from 'react-native';
// Hook personalizado para usar el contexto
export function useFormContainerContext<FormData extends FieldValues>() {
  const rhfContext = useFormContext<FormData>();
  const context = use(FormContainerContext);
  if (!context) {
    return { schemaShape: null, onSubmit: () => {()=>Alert.alert("Formulario enviado")}, ...rhfContext };
  }

  return { ...context, ...rhfContext };
}
