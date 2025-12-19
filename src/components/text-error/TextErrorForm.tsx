import React from 'react';
import TextError from './TextError';

export interface TextErrorFormProps {
  message?: string;
}

const TextErrorForm = ({ message }: TextErrorFormProps) => {
  if (!message) return null;
  return (
    <TextError>
      {message === 'Required' ? 'El campo es requerido' : message}
    </TextError>
  );
};

export default TextErrorForm;
