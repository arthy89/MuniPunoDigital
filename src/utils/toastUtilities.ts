import { CustomToastType } from '@/interfaces/CustomToastType';
import Toast from 'react-native-toast-message';

export const toast: Record<CustomToastType, (msg: string) => void> = {
  info: (msg: string) =>
    Toast.show({ type: 'info', text1: '¡Información!', text2: msg }),
  success: (msg: string) =>
    Toast.show({ type: 'success', text1: '¡Éxito!', text2: msg }),
  error: (msg: string) =>
    Toast.show({ type: 'error', text1: '¡Error!', text2: msg }),
  warning: (msg: string) =>
    Toast.show({ type: 'warning', text1: '¡Advertencia!', text2: msg }),
};
