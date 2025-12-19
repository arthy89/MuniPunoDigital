import { useCallback } from 'react';
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export interface LocationCoords {
  lat: number;
  lng: number;
}

interface UseGeolocationWithFallbackOptions {
  onError?: (message: string) => void;
  enableLogging?: boolean;
}

/**
 * Hook que maneja la obtención de ubicación con fallback automático.
 * 
 * En Android:
 * 1. Solicita permiso runtime ACCESS_FINE_LOCATION
 * 2. Intenta habilitar GPS si está desactivado (usando RNAndroidLocationEnabler)
 * 3. Intenta obtener ubicación con low accuracy (network/fused) y timeout de 60s
 * 4. Si timeout, reintenta con high accuracy (GPS) y timeout de 90s
 * 
 * En iOS:
 * 1. Solicita permiso LOCATION_WHEN_IN_USE
 * 2. Obtiene ubicación directamente (high accuracy)
 * 
 * @returns Función async que retorna { lat, lng } o lanza error
 */
export const useGeolocationWithFallback = (
  options: UseGeolocationWithFallbackOptions = {},
) => {
  const { onError, enableLogging = false } = options;

  const log = useCallback(
    (message: string, data?: any) => {
      if (enableLogging) {
        console.log(`[Geolocation] ${message}`, data);
      }
    },
    [enableLogging],
  );

  const logError = useCallback(
    (message: string, error?: any) => {
      if (enableLogging) {
        // Clg del error
        // console.error(`[Geolocation Error] ${message}`, error); 
      }
    },
    [enableLogging],
  );

  /**
   * Obtiene ubicación con fallback de low a high accuracy.
   */
  const getLocationWithFallback = useCallback(
    (
      onSuccess: (coords: LocationCoords) => void,
      onFailure: (message: string) => void,
    ): Promise<void> => {
      return new Promise((resolve) => {
        log('Solicitando ubicación: low accuracy (network/fused)');
        Geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            log('Ubicación obtenida (low accuracy)', coords);
            onSuccess(coords);
            resolve();
          },
          (err) => {
            logError('Geolocation error (low accuracy)', err);
            // Si timeout en low accuracy, reintentamos con alta precisión (GPS)
            if (Platform.OS === 'android' && err && err.code === 3) {
              log('Timeout en low accuracy, reintentando con enableHighAccuracy:true (GPS)');
              Geolocation.getCurrentPosition(
                (position2) => {
                  const coords = {
                    lat: position2.coords.latitude,
                    lng: position2.coords.longitude,
                  };
                  log('Ubicación obtenida (high accuracy fallback)', coords);
                  onSuccess(coords);
                  resolve();
                },
                (err2) => {
                  logError('Geolocation error (high accuracy fallback)', err2);
                  onFailure('Active la ubicación de su dispositivo');
                  resolve();
                },
                { enableHighAccuracy: true, timeout: 90000, maximumAge: 0 },
              );
            } else {
              onFailure(
                Platform.OS === 'android'
                  ? 'Active la ubicación de su dispositivo'
                  : 'No se pudo obtener la ubicación',
              );
              resolve();
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 10000,
          },
        );
      });
    },
    [log, logError],
  );

  /**
   * Intenta habilitar GPS en Android (opcional).
   */
  const tryEnableGps = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const enabler = RNAndroidLocationEnabler as any;
      if (enabler && typeof enabler.promptForEnableLocationIfNeeded === 'function') {
        const enablerResult = await enabler.promptForEnableLocationIfNeeded({
          interval: 10000,
        });
        log('RNAndroidLocationEnabler resultado:', enablerResult);
        return true;
      } else {
        log('RNAndroidLocationEnabler no disponible en runtime');
        return true; // Continuar aunque no esté disponible
      }
    } catch (err) {
      logError('RNAndroidLocationEnabler error', err);
      return true; // Continuar aunque falle el enabler
    }
  }, [log, logError]);

  /**
   * Solicita permisos de ubicación según la plataforma.
   */
  const requestLocationPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      log('Resultado permiso ACCESS_FINE_LOCATION:', permission);
      return permission === RESULTS.GRANTED;
    } else {
      const permission = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE as any,
      ).catch(() => null);
      log('Resultado permiso iOS LOCATION_WHEN_IN_USE:', permission);
      return permission === RESULTS.GRANTED;
    }
  }, [log]);

  /**
   * Función principal que orquesta toda la lógica de geolocalización.
   * Retorna { lat, lng } o lanza error.
   */
  const getLocation = useCallback(
    async (): Promise<LocationCoords> => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            // Paso 1: Solicitar permisos
            const permissionGranted = await requestLocationPermissions();
            if (!permissionGranted) {
              const errorMsg = 'Se requiere permiso de ubicación';
              logError(errorMsg);
              onError?.(errorMsg);
              reject(new Error(errorMsg));
              return;
            }

            // Paso 2: Intentar habilitar GPS (Android)
            await tryEnableGps();

            // Paso 3: Obtener ubicación con fallback
            let locationObtained = false;
            let obtainedCoords: LocationCoords | null = null;

            await getLocationWithFallback(
              (coords) => {
                locationObtained = true;
                obtainedCoords = coords;
              },
              (errorMessage) => {
                onError?.(errorMessage);
              },
            );

            if (locationObtained && obtainedCoords) {
              resolve(obtainedCoords);
            } else {
              reject(new Error('No se pudo obtener la ubicación'));
            }
          } catch (err) {
            logError('Error general en getLocation', err);
            onError?.('Ocurrió un error al obtener la ubicación');
            reject(err);
          }
        })();
      });
    },
    [requestLocationPermissions, tryEnableGps, getLocationWithFallback, log, logError, onError],
  );

  return { getLocation };
};
