import { useCallback } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS, check } from 'react-native-permissions';

/**
 * Hook para manejar permisos de galería según la versión de Android.
 * 
 * Android 13+ (API 33+):
 * - Usa Photo Picker nativo (no requiere permisos runtime)
 * - Solo necesita READ_MEDIA_IMAGES declarado en manifest
 * 
 * Android 12 y anteriores:
 * - Requiere READ_EXTERNAL_STORAGE
 * 
 * @returns Función para verificar/solicitar permisos de galería
 */
export const useMediaPermission = () => {
  /**
   * Verifica y solicita permisos de galería si es necesario.
   * En Android 13+ retorna true directamente (usa Photo Picker).
   */
  const requestMediaPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      
      if (permission === RESULTS.GRANTED) {
        return true;
      }
      
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return result === RESULTS.GRANTED;
    }

    // Android
    const androidVersion = typeof Platform.Version === 'number' 
      ? Platform.Version 
      : parseInt(Platform.Version, 10);
      
    if (androidVersion >= 33) {
      // Android 13+ usa Photo Picker (no requiere permisos runtime)
      return true;
    }

    // Android 12 y anteriores necesitan READ_EXTERNAL_STORAGE
    const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    
    if (permission === RESULTS.GRANTED) {
      return true;
    }

    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return result === RESULTS.GRANTED;
  }, []);

  return { requestMediaPermission };
};
