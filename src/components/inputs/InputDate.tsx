import InputBase from './InputBase';
import DateTimePicker, {
  DateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import { Pressable } from 'react-native';
import { useState } from 'react';
import dayjsSpanish, { formatDateUtc } from '@/utils/dayjsSpanish';

type CustomDateTimePickerProps = Omit<
  DateTimePickerProps,
  'onConfirm' | 'onCancel'
>;
export interface InputDateProps extends CustomDateTimePickerProps {
  onChangeDate?: (date: Date) => void;
  value?: Date;
}
const InputDate = ({ onChangeDate, value, ...props }: InputDateProps) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const onShowDatePicker = () => {
    setShowTimePicker(prev => !prev);
  };

  const changeDate = (date: Date) => {
    onChangeDate?.(date);
    onShowDatePicker();
  };

  return (
    <Pressable onPress={onShowDatePicker}>
      <InputBase
        editable={false}
        value={value ? formatDateUtc(value) : 'dd/mm/yyyy'}
      />
      <DateTimePicker
        date={value ? dayjsSpanish(value).toDate() : undefined}
        isVisible={showTimePicker}
        mode="date"
        {...props}
        onConfirm={changeDate}
        onCancel={onShowDatePicker}
      />
    </Pressable>
  );
};

export default InputDate;
