import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  description: string;
  contact: string;
  onChangeDescription: (text: string) => void;
  onChangeContact: (text: string) => void;
  IsWrite: (val:boolean) => void;
};

export const FormFields = React.memo(({ description, contact, onChangeDescription, onChangeContact, IsWrite }: Props) => {
  return (
    <>
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Describe lo que ocurrió"
        value={description}
        onChangeText={onChangeDescription}
        onFocus={()=>IsWrite(false)}
        onEndEditing={()=>IsWrite(true)}
        onBlur={()=>IsWrite(true)}
      />

      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Agrega un número de contacto"
        value={contact}
        onChangeText={onChangeContact}
        keyboardType="phone-pad"
        onFocus={()=>IsWrite(false)}
        onEndEditing={()=>IsWrite(true)}
        onBlur={()=>IsWrite(true)}
      />
    </>
  );
});

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
});
