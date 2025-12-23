import { useCallback, useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Alert, Platform } from 'react-native';

export interface WatchedLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

interface UseWatchedLocationParams {
  /** Solicita permiso antes de iniciar el watch */
  requestPermission: () => Promise<boolean>;
  /** Opciones adicionales (limitadas) */
  options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    distanceFilter?: number;
    interval?: number; // Android
    fastestInterval?: number; // Android
  };
  /** Distancia mínima (m) para considerar un update relevante */
  distanceFilterMeters?: number;
  /** Intervalo mínimo entre updates (ms) */
  minIntervalMs?: number;
}

interface UseWatchedLocationResult {
  location: WatchedLocation | null;
  lastLocation: WatchedLocation | null;
  isWatching: boolean;
  error: string | null;
  startWatching: () => Promise<void>;
  stopWatching: () => void;
  reset: () => void;
}

// Haversine para distancia en metros
function distanceMeters(a: WatchedLocation, b: WatchedLocation): number {
  const R = 6371e3; // Radio tierra en metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const c = 2 * Math.atan2(
    Math.sqrt(sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon),
    Math.sqrt(1 - sinLat * sinLat - Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon)
  );
  return R * c;
}

export function useWatchedLocation({
  requestPermission,
  options,
  distanceFilterMeters = 3, // Evita spam de updates <3m
  minIntervalMs = 1500, // Evita actualizaciones demasiado rápidas
}: UseWatchedLocationParams): UseWatchedLocationResult {
  const [location, setLocation] = useState<WatchedLocation | null>(null);
  const [lastLocation, setLastLocation] = useState<WatchedLocation | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateTsRef = useRef<number>(0);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current != null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  }, []);

  const startWatching = useCallback(async () => {
    if (isWatching) return;
    const granted = await requestPermission();
    if (!granted) {
      setError('Permiso de ubicación denegado');
      Alert.alert('Ubicación', 'No se otorgó el permiso de ubicación.');
      return;
    }
    setError(null);
    setIsWatching(true);
    // Obtener posición inicial rápida
    Geolocation.getCurrentPosition(
      (pos) => {
        const initial: WatchedLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
          timestamp: pos.timestamp,
        };
        setLocation(initial);
        setLastLocation(initial);
        lastUpdateTsRef.current = Date.now();
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = Geolocation.watchPosition(
      (pos) => {
        const next: WatchedLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
          timestamp: pos.timestamp,
        };

        const now = Date.now();
        const timeDiff = now - lastUpdateTsRef.current;
        if (lastLocation) {
          const dist = distanceMeters(lastLocation, next);
          if (dist < distanceFilterMeters && timeDiff < minIntervalMs) {
            return; // Ignora movimiento muy pequeño y demasiado rápido
          }
        }
        setLocation(next);
        setLastLocation(next);
        lastUpdateTsRef.current = now;
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: distanceFilterMeters,
        interval: 5000, // Aumentado a 5 segundos para reducir carga
        fastestInterval: 3000, // Aumentado a 3 segundos
        ...options,
      }
    );
  }, [distanceFilterMeters, isWatching, lastLocation, minIntervalMs, options, requestPermission]);

  const reset = useCallback(() => {
    setLocation(null);
    setLastLocation(null);
    lastUpdateTsRef.current = 0;
  }, []);

  // Limpieza en unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return { location, lastLocation, isWatching, error, startWatching, stopWatching, reset };
}

export default useWatchedLocation;