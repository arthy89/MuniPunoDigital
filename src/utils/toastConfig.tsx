import { ToastProps } from 'react-native-toast-message';
import CustomToast from '../components/CustomToast';
import { JSX } from 'react';
import { CustomToastType } from '../interfaces/CustomToastType';

const toastConfig: Record<CustomToastType, (props: ToastProps) => JSX.Element> =
  {
    success: (props: ToastProps) => <CustomToast {...props} type="success" />,
    error: (props: ToastProps) => <CustomToast {...props} type="error" />,
    info: (props: ToastProps) => <CustomToast {...props} type="info" />,
    warning: (props: ToastProps) => <CustomToast {...props} type="warning" />,
  };

export default toastConfig;
