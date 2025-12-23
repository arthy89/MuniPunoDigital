import { LatLng } from 'react-native-maps';
import axios from 'axios';
import { getClosestPointIndex } from '@/utils/closestPoint';
import { decodePolyline } from '@/utils/decodePolyline';

const API_KEY = 'AIzaSyAEWdhPlzOFzTPj5O-4mw293_clHfLI5QA';

/**
 * Calcula la distancia entre dos coordenadas en metros (fórmula de Haversine)
 */
export function calculateDistance(coord1: LatLng, coord2: LatLng): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

/**
 * Obtiene la ruta a pie desde el origen hasta el punto más cercano de la ruta
 */
export async function fetchWalkingRoute(
  userLocation: LatLng,
  routeCoordinates: LatLng[]
): Promise<LatLng[] | null> {
  if (!userLocation || routeCoordinates.length === 0) {
    return null;
  }

  try {
    // Encontrar el punto más cercano en la ruta
    const idx = getClosestPointIndex(userLocation, routeCoordinates);
    const nearestPoint = routeCoordinates[idx];

    // Calcular distancia al punto más cercano
    const distanceToRoute = calculateDistance(userLocation, nearestPoint);

    // Si ya está muy cerca (< 15 metros), no mostrar ruta a pie
    if (distanceToRoute < 15) {
      console.log('Usuario muy cerca de la ruta, no se muestra walking route');
      return [];
    }

    // Llamar a Google Directions API
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${nearestPoint.latitude},${nearestPoint.longitude}`;
    const url = 'https://maps.googleapis.com/maps/api/directions/json';

    const response = await axios.get(url, {
      params: {
        origin,
        destination,
        mode: 'walking',
        key: API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      console.warn('Directions API error:', response.data.status, response.data.error_message);
      return null;
    }

    const route = response.data.routes?.[0];
    if (route) {
      const encoded = route.overview_polyline?.points;
      if (encoded) {
        const decoded = decodePolyline(encoded);
        console.log(`Ruta a pie calculada: ${decoded.length} puntos, distancia: ${distanceToRoute.toFixed(1)}m`);
        return decoded;
      }
    }

    return null;
  } catch (error) {
    console.warn('Error al obtener ruta a pie:', error);
    return null;
  }
}

/**
 * Calcula ambos segmentos de ruta a pie:
 * - Segmento 1: originPoint (PIN_GREEN) → punto más cercano de routeCoordinates
 * - Segmento 2: punto más lejano de routeCoordinates → destinationPoint (PIN_RED)
 * 
 * @returns { segment1, segment2 } donde cada uno puede ser LatLng[] | null
 */
export async function fetchBothWalkingSegments(
  userLocation: LatLng,
  originPoint: LatLng | null,
  destinationPoint: LatLng | null,
  routeCoordinates: LatLng[]
): Promise<{ segment1: LatLng[] | null; segment2: LatLng[] | null }> {
  if (routeCoordinates.length === 0) {
    return { segment1: null, segment2: null };
  }

  try {
    // SEGMENTO 1: originPoint → inicio de ruta
    let segment1: LatLng[] | null = null;

    // Si hay originPoint, crear ruta: originPoint → punto más cercano de routeCoordinates
    if (originPoint) {
      // Encontrar punto más cercano al originPoint en la ruta
      const idxStart = getClosestPointIndex(originPoint, routeCoordinates);
      const nearestToOrigin = routeCoordinates[idxStart];

      // Verificar si el originPoint está muy cerca de la ruta (< 10m)
      const distanceOriginToRoute = calculateDistance(originPoint, nearestToOrigin);
      
      if (distanceOriginToRoute < 10) {
        console.log(`Origin Point muy cerca de la ruta (${distanceOriginToRoute.toFixed(1)}m), no se muestra segmento 1`);
        segment1 = [];
      } else {
        // Llamar a Directions API: originPoint → punto más cercano en ruta
        const origin = `${originPoint.latitude},${originPoint.longitude}`;
        const destination = `${nearestToOrigin.latitude},${nearestToOrigin.longitude}`;
        const url = 'https://maps.googleapis.com/maps/api/directions/json';

        const response = await axios.get(url, {
          params: {
            origin,
            destination,
            mode: 'walking',
            key: API_KEY,
          },
        });

        if (response.data.status === 'OK') {
          const route = response.data.routes?.[0];
          if (route?.overview_polyline?.points) {
            segment1 = decodePolyline(route.overview_polyline.points);
            console.log(`Segmento 1 calculado: ${segment1.length} puntos (PIN_GREEN → inicio ruta)`);
          }
        }
      }
    }

    // SEGMENTO 2: fin de ruta → destinationPoint (PIN_RED)
    let segment2: LatLng[] | null = null;

    if (destinationPoint) {
      // Encontrar punto más lejano (último de la ruta) o más cercano al destinationPoint
      const idxEnd = getClosestPointIndex(destinationPoint, routeCoordinates);
      const nearestToDestination = routeCoordinates[idxEnd];

      // Verificar si el destinationPoint está muy cerca de la ruta (< 10m)
      const distanceDestinationToRoute = calculateDistance(destinationPoint, nearestToDestination);
      
      if (distanceDestinationToRoute < 10) {
        console.log(`Destination Point muy cerca de la ruta (${distanceDestinationToRoute.toFixed(1)}m), no se muestra segmento 2`);
        segment2 = [];
      } else {
        const origin = `${nearestToDestination.latitude},${nearestToDestination.longitude}`;
        const destination = `${destinationPoint.latitude},${destinationPoint.longitude}`;
        const url = 'https://maps.googleapis.com/maps/api/directions/json';

        const response = await axios.get(url, {
          params: {
            origin,
            destination,
            mode: 'walking',
            key: API_KEY,
          },
        });

        if (response.data.status === 'OK') {
          const route = response.data.routes?.[0];
          if (route?.overview_polyline?.points) {
            segment2 = decodePolyline(route.overview_polyline.points);
            console.log(`Segmento 2 calculado: ${segment2.length} puntos (fin ruta → PIN_RED)`);
          }
        }
      }
    }

    return { segment1, segment2 };
  } catch (error) {
    console.warn('Error al calcular segmentos a pie:', error);
    return { segment1: null, segment2: null };
  }
}
