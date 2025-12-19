import { JSX } from 'react';
import LabelBase from './LabelBase';
import { FormLabelContent } from '@/interfaces/FormTypes';

interface LabelForm {
  label?: FormLabelContent;
}
const LabelForm = ({ label }: LabelForm) => {
  if (!label) return null;
  if (typeof label === 'string') return <LabelBase>{label}</LabelBase>;
  return label;
};

export default LabelForm;
