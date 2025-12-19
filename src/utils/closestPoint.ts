import { LatLng } from 'react-native-maps';

export function getClosestPointIndex(
  userLocation: LatLng,
  routeCoords: LatLng[]
): number {
  let minDist = Infinity;
  let minIdx = 0;
  for (let i = 0; i < routeCoords.length; i++) {
    const dx = userLocation.latitude - routeCoords[i].latitude;
    const dy = userLocation.longitude - routeCoords[i].longitude;
    const dist = dx * dx + dy * dy;
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }
  return minIdx;
}