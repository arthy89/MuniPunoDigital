import { LatLng } from 'react-native-maps';
import { create } from 'zustand';

type LatLng1 = {
  latitude: number
  longitude: number
}
interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
interface RouteStore {
  colorRoute: string;
  setColorRoute: (color: string) => void;

  listPredictions: Prediction[];
  setListPredictions: (predictions: Prediction[]) => void;

  routeIndex: number | null;
  setRouteIndex: (index: number) => void;

  showRoute: boolean;
  setShowRoute: (value: boolean) => void;
  zoom: number; // nivel de zoom
  setZoom: (zoom: number) => void;

  middleRoute: LatLng1 | null;
  setMiddleRoute: (coord: LatLng1) => void;

  routeCoordinates: LatLng[]; // array de coordenadas
  setRouteCoordinates: (coords: LatLng[]) => void;
  // ruta resultante del Directions (caminata desde dispositivo/originPoint → inicio de ruta)
  walkingRoute: LatLng[];
  setWalkingRoute: (coords: LatLng[]) => void;
  
  // ruta a pie desde fin de ruta → destinationPoint
  walkingRouteToDestination: LatLng[];
  setWalkingRouteToDestination: (coords: LatLng[]) => void;

  // rutas obtenidas desde backend (lista opcional, cada elemento es any porque formato puede variar)
  fetchedRoutes: any[];
  setFetchedRoutes: (routes: any[]) => void;
  fitRoute: () => void;
  setFitRouteFunction: (fn: () => void) => void;

  // ruta seleccionada en la UI (para persistir el resaltado)
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;

  // puntos origen y destino seleccionados en el mapa/búsqueda
  originPoint: LatLng | null;
  destinationPoint: LatLng | null;
  setOriginPoint: (p: LatLng | null) => void;
  setDestinationPoint: (p: LatLng | null) => void;

  // Indica si el origen es dinámico (sigue al usuario) o fijo (dirección seleccionada)
  isOriginDynamic: boolean;
  setIsOriginDynamic: (value: boolean) => void;

}

export const useRouteStore = create<RouteStore>((set) => ({
  routeIndex: null,
  setRouteIndex: (index) => set({ routeIndex: index }),
  colorRoute: '', // color por defecto
  setColorRoute: (color) => set({ colorRoute: color }),
  listPredictions: [],
  setListPredictions: (predictions) => set({ listPredictions: predictions }),
  zoom: 0.01, // valor por defecto
  setZoom: (value) => set({ zoom: value }),

  showRoute: false,
  setShowRoute: (value) => set({ showRoute: value }),
  middleRoute: null,
  setMiddleRoute: (coords) => set({ middleRoute: coords }),
  routeCoordinates: [],
  setRouteCoordinates: (coords) => set({ routeCoordinates: coords }),
  fetchedRoutes: [],
  setFetchedRoutes: (routes) => set({ fetchedRoutes: routes }),

  walkingRoute: [],
  setWalkingRoute: (coords) => set({ walkingRoute: coords }),
  
  walkingRouteToDestination: [],
  setWalkingRouteToDestination: (coords) => set({ walkingRouteToDestination: coords }),

  fitRoute: () => { }, // valor por defecto
  setFitRouteFunction: (fn) => set({ fitRoute: fn }),

  selectedRouteId: null,
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),

  originPoint: null,
  destinationPoint: null,
  setOriginPoint: (p) => set({ originPoint: p }),
  setDestinationPoint: (p) => set({ destinationPoint: p }),

  isOriginDynamic: false,
  setIsOriginDynamic: (value) => set({ isOriginDynamic: value }),
}));