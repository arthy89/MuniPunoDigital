import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { ZodObject, ZodRawShape } from 'zod';
import { createContext, ReactNode } from 'react';
import theme from '@/theme';

export interface FormContainerContextInterface {
  schemaShape?: ZodRawShape;
  onSubmit: () => void;
}

export const FormContainerContext =
  createContext<FormContainerContextInterface | null>(null);

interface FormContainerProps<FormData extends FieldValues> {
  form: UseFormReturn<FormData>;
  schema?: ZodObject<ZodRawShape>;
  onSubmit: () => void;
  children: ReactNode;
  style?: ViewStyle;
}
const FormContainer = <FormData extends FieldValues>({
  form,
  onSubmit,
  children,
  schema,
  style,
}: FormContainerProps<FormData>) => {
  // const onSubmitForm: SubmitHandler<FormData> = data => {
  //   onSubmit?.(data);
  // };
  return (
    <FormProvider {...form}>
      <FormContainerContext.Provider
        value={{
          schemaShape: schema?.shape,
          onSubmit,
        }}>
        <View style={[styles.container, style]}>{children}</View>
      </FormContainerContext.Provider>
    </FormProvider>
  );
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
    width: '90%',
    alignSelf: 'center',
  },
});
