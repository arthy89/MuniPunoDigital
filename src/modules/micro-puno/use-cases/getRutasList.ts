import coordsApi from "@/api/coordsApi";
// import { FilterApi } from "@/interfaces/FilterApiTypes";

interface RutaParams {
  origen: { latitude: number; longitude: number } | null;
  destino: { latitude: number; longitude: number } | null;
}

export const getRutasList = async ({
  origen,
  destino,
}: RutaParams) => {
  // El backend espera un body con { origen: { lat, lng }, destino: { lat, lng } }
  const payload = {
    origen: origen ? { lat: origen.latitude, lng: origen.longitude } : null,
    destino: destino ? { lat: destino.latitude, lng: destino.longitude } : null,
  };

  const response = await coordsApi.post('/rutas', payload);
  return response.data;
};