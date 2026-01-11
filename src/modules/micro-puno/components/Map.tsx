import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  PermissionsAndroid,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  Keyboard,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Region, MapType, LatLng  } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import theme from '@/theme';
import Modal from '../components/BottomSheetComponent';
import ListaDeRutas from '../components/MicroList';
import MapTypeModal from './MapType';
import { useRouteStore } from '../resources/useRouteStore';
import SearchRoutes, { SearchRoutesHandle } from './SearchRoutes';
import requestLocationPermission from '../hooks/useGetUserLocation';
import { calculateDistance, fetchWalkingRoute, fetchBothWalkingSegments } from '../utils/walkingRouteHelper';

const { width, height } = Dimensions.get('window');

const PIN_GREEN = require('@/assets/images/pins/verde.png');
const PIN_RED = require('@/assets/images/pins/rojo.png');
const PIN_HOME = require('@/assets/images/pins/pin-inicio.png');
const PIN_FIN = require('@/assets/images/pins/pin-fin.png');

interface Location {
  latitude: number;
  longitude: number;
}

const Map = () => {
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  // const [location, setLocation] = useState<Region>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Región actual del mapa para selección manual (centro)
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  const [showBotones, setShowBotones] = useState(true);
  
  const mapRef = useRef<MapView>(null);
  const watchId = useRef<number | null>(null);
  const retryAttempts = useRef(0);

  const RoutesRef = useRef<BottomSheetModal | null>(null);
  const MapTypeRef = useRef<BottomSheetModal | null>(null);
  const SearchRoutesRef = useRef<BottomSheetModal | null>(null);
  const SearchRoutesComponentRef = useRef<SearchRoutesHandle | null>(null);
  const navigation = useNavigation();
  const [mapType, setMapType] = useState<MapType>('terrain');
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [showsContentLarge, setShowsContentLarge] = useState(true);
  const zoom = useRouteStore((state) => state.zoom);
  const showRoute = useRouteStore((state) => state.showRoute);
  const setFitRouteFunction = useRouteStore((state) => state.setFitRouteFunction);
  const routeCoordinates = useRouteStore((state) => state.routeCoordinates);
  const setRouteCoordinates = useRouteStore((state) => state.setRouteCoordinates);
  const colorRoute = useRouteStore((state) => state.colorRoute);
  const setShowRoute = useRouteStore((state) => state.setShowRoute);
  const fetchedRoutes = useRouteStore((state) => state.fetchedRoutes);
  const setFetchedRoutes = useRouteStore((state) => state.setFetchedRoutes);
  const walkingRoute = useRouteStore((s) => s.walkingRoute);
  const setWalkingRoute = useRouteStore((s) => s.setWalkingRoute);
  const walkingRouteToDestination = useRouteStore((s) => s.walkingRouteToDestination);
  const setWalkingRouteToDestination = useRouteStore((s) => s.setWalkingRouteToDestination);
  const originPoint = useRouteStore((s) => s.originPoint);
  const destinationPoint = useRouteStore((s) => s.destinationPoint);
  const setOriginPoint = useRouteStore((s) => s.setOriginPoint);
  const setDestinationPoint = useRouteStore((s) => s.setDestinationPoint);
  const isOriginDynamic = useRouteStore((s) => s.isOriginDynamic);
  const setIsOriginDynamic = useRouteStore((s) => s.setIsOriginDynamic);
  const setSelectedRouteId = useRouteStore((s) => s.setSelectedRouteId);
  const [userLocationEnabled, setUserLocationEnabled] = useState<boolean>(false);
  const [showsMyLocationButton, setShowsMyLocationButton] = useState<boolean>(true);
  const [seguir, setSeguir] = useState<boolean>(true);

  // Referencias para el recálculo de ruta a pie
  const lastWalkingRouteOrigin = useRef<LatLng | null>(null);
  const lastWalkingRouteUpdate = useRef<number>(0);

  //todo CONVENCION
  const onMapReady = () => {
    setShowUserLocation(true);
  }

  // Definir todos los callbacks antes de cualquier return condicional
  const handlePrensentModalPress = useCallback((onButtonSheetRef: React.RefObject<BottomSheetModal | null>) => {
    onButtonSheetRef.current?.present();
  }, []);

  const resetToNorth = () => {
    mapRef.current?.animateCamera({
      heading: 0,
      pitch: 0,
    });
  };

  const [routesOpenedFromSearch, setRoutesOpenedFromSearch] = useState<boolean>(false);
  const handleToggleRoutes = (fromSearch: boolean = false) => {
    console.log("---zoom---", zoom)
    // openedFromSearch se determina si hay rutas buscadas en el store
    // O si fromSearch es true (llamado desde "Buscar micros")
    const hasSearchedRoutes = fetchedRoutes && fetchedRoutes.length > 0;
    setRoutesOpenedFromSearch(fromSearch || hasSearchedRoutes);
    SearchRoutesRef.current?.close();
    MapTypeRef.current?.close();
    handlePrensentModalPress(RoutesRef);
    console.log("RouteCoordinates", routeCoordinates);
  }

  const handleToggleLayers = () => {
    SearchRoutesRef.current?.close();
    RoutesRef.current?.close();
    handlePrensentModalPress(MapTypeRef);
  }

  const handleSearchRutes = () => {
    setShowsContentLarge(true);
    RoutesRef.current?.close();
    MapTypeRef.current?.close();
    handlePrensentModalPress(SearchRoutesRef);
  }

  // Funcion para limpiar datos
  const handleClearAllData = () => {
    // Limpiar rutas buscadas
    setFetchedRoutes([]);
    // Limpiar selección de ruta
    setSelectedRouteId(null);
    // Limpiar ruta pintada en el mapa
    setRouteCoordinates([]);
    setShowRoute(false);
    // Limpiar pines personalizados
    setOriginPoint(null);
    setDestinationPoint(null);
    setIsOriginDynamic(false);
    // Limpiar rutas a pie
    setWalkingRoute([]);
    setWalkingRouteToDestination([]);
  }

  const centerToUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Error requesting permissions:', err);
      return false;
    }
  };

  const getLocationWithFallback = async () => {
    return new Promise<Location>((resolve, reject) => {
      // Primer intento: Alta precisión con timeout corto
      Geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (error) => {
          console.log('Intento 1 falló (alta precisión), intentando con baja precisión...');
          
          // Segundo intento: Baja precisión pero más rápido
          Geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              });
            },
            (error2) => {
              console.error('Ambos intentos fallaron:', error2);
              reject(error2);
            },
            {
              enableHighAccuracy: false, // Baja precisión = más rápido
              timeout: 10000,
              maximumAge: 30000 // Acepta ubicaciones hasta de 30 segundos atrás
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 8000, // Timeout más corto para el primer intento
          maximumAge: 5000
        }
      );
    });
  };

  useEffect(() => {
    const startTracking = async () => {
      const hasPermission = await requestPermissions();
      
      if (!hasPermission) {
        setError('Permisos de ubicación denegados. Por favor, habilítalos en configuración.');
        setIsLoading(false);
        return;
      }

      try {
        // Obtener posición inicial con fallback
        const newLocation = await getLocationWithFallback();
        setLocation(newLocation);
        // Guardar también la ubicación del usuario para cálculos de rutas a pie
        setUserLocation({ latitude: newLocation.latitude, longitude: newLocation.longitude });
        setIsLoading(false);
        setError(null);
        retryAttempts.current = 0;
        
        // Centrar el mapa usando directamente la ubicación obtenida
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        }, 300);

        // Iniciar seguimiento continuo después de obtener la primera ubicación
        watchId.current = Geolocation.watchPosition(
          (pos) => {
            const updatedLocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            };
            setLocation(updatedLocation);
            setUserLocation(updatedLocation);
            // Si el origen es dinámico ("Mi ubicación"), actualizar el pin verde
            if (isOriginDynamic) {
              setOriginPoint(updatedLocation);
            }
          },
          (err) => {
            console.error('Watch position error:', err);
            // No mostramos error en watch porque ya tenemos una ubicación inicial
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 5000,
            fastestInterval: 3000,
          }
        );
      } catch (err: any) {
        console.error('Error getting position:', err);
        
        let errorMessage = 'No se pudo obtener tu ubicación.';
        
        if (err.code === 3) { // TIMEOUT
          errorMessage = 'El GPS está tardando mucho. Asegúrate de estar en un lugar abierto y que el GPS esté activado.';
        } else if (err.code === 1) { // PERMISSION_DENIED
          errorMessage = 'Permisos de ubicación denegados.';
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          errorMessage = 'Ubicación no disponible. Verifica que el GPS esté activo.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    startTracking();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Limpiar los datos al montar el componente
  useEffect(() => {
    handleClearAllData();
    return () => {
      handleClearAllData();
    };
  }, []);

  // Detectar cuando se abre/cierra el teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowBotones(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowBotones(true);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Resetear referencias cuando cambia la ruta seleccionada
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      console.log('Ruta seleccionada cambió, reseteando referencias para recalcular rutas a pie');
      lastWalkingRouteOrigin.current = null;
      lastWalkingRouteUpdate.current = 0;
    }
  }, [routeCoordinates]);

  // Recalcular ruta a pie cuando el usuario se mueve significativamente
  useEffect(() => {
    if (!userLocation || routeCoordinates.length === 0) {
      return;
    }

    const now = Date.now();
    const DISTANCE_THRESHOLD = 10; // metros
    const TIME_THRESHOLD = 15000; // 15 segundos

    // Si no hay origen previo, guardarlo y calcular rutas iniciales
    if (!lastWalkingRouteOrigin.current) {
      lastWalkingRouteOrigin.current = userLocation;
      lastWalkingRouteUpdate.current = now;
      
      // Calcular ambos segmentos
      (async () => {
        // Si el origen es dinámico, usar userLocation; si no, usar originPoint
        const effectiveOrigin = isOriginDynamic ? userLocation : originPoint;
        const { segment1, segment2 } = await fetchBothWalkingSegments(
          userLocation,
          effectiveOrigin,
          destinationPoint,
          routeCoordinates
        );
        if (segment1 !== null) {
          setWalkingRoute(segment1);
        }
        if (segment2 !== null) {
          setWalkingRouteToDestination(segment2);
        }
      })();
      return;
    }

    // Solo recalcular si el origen NO es dinámico o si el usuario se movió significativamente
    const distance = calculateDistance(lastWalkingRouteOrigin.current, userLocation);
    const timeSinceLastUpdate = now - lastWalkingRouteUpdate.current;

    // Recalcular si:
    // 1. El usuario se movió > 10m Y han pasado al menos 15s
    // 2. O si el origen NO es dinámico (cambio manual de origen)
    const shouldRecalculate = 
      (distance > DISTANCE_THRESHOLD && timeSinceLastUpdate > TIME_THRESHOLD) ||
      (!isOriginDynamic && distance > DISTANCE_THRESHOLD);

    if (shouldRecalculate) {
      console.log(`Recalculando rutas a pie (origen ${isOriginDynamic ? 'dinámico' : 'fijo'}, distancia: ${distance.toFixed(1)}m)...`);
      lastWalkingRouteOrigin.current = userLocation;
      lastWalkingRouteUpdate.current = now;

      (async () => {
        // Si el origen es dinámico, usar userLocation; si no, usar originPoint
        const effectiveOrigin = isOriginDynamic ? userLocation : originPoint;
        const { segment1, segment2 } = await fetchBothWalkingSegments(
          userLocation,
          effectiveOrigin,
          destinationPoint,
          routeCoordinates
        );
        if (segment1 !== null) {
          setWalkingRoute(segment1);
        }
        if (segment2 !== null) {
          setWalkingRouteToDestination(segment2);
        }
      })();
    }
  }, [userLocation, routeCoordinates, originPoint, destinationPoint, isOriginDynamic, setWalkingRoute, setWalkingRouteToDestination]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        onMapReady={onMapReady}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        mapType={mapType}
        // loadingEnabled={true}
        initialRegion={{
          latitude: location?.latitude  || -15.8402,
          longitude: location?.longitude || -70.0219,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >

        {/*location && <Marker coordinate={location} title="Tú estás aquí" />*/}
        {originPoint && (
          <Marker
            coordinate={originPoint}
            title="Origen"
            image={PIN_GREEN}
          />
        )}
        {destinationPoint && (
          <Marker
            coordinate={destinationPoint}
            title="Destino"
            image={PIN_RED}
          />
        )}
        {showRoute && routeCoordinates.length > 0 && (
          <>

            {/* Icono de Inicio  */}
            <Marker
              coordinate={routeCoordinates[0]}
              title="Inicio de ruta"
              image={PIN_HOME}
            />

            {/* Icono fin */}
            <Marker
              coordinate={routeCoordinates[routeCoordinates.length - 1]}
              title="Fin de ruta"
              image={PIN_FIN}
            />

            <Polyline
              key="selected-route"
              coordinates={routeCoordinates}
              strokeColor={colorRoute}
              strokeWidth={5}
            />
          </>
        )}

        {/* Ruta a pie calculada (walkingRoute) */}
        {walkingRoute && walkingRoute.length > 0 && (
          <Polyline
            key="walking-route"
            coordinates={walkingRoute}
            strokeColor={'#1E90FF'}
            strokeWidth={4}
            lineDashPattern={[1, 2]}
          />
        )}

        {/* Ruta a pie hacia destino (walkingRouteToDestination) */}
        {walkingRouteToDestination && walkingRouteToDestination.length > 0 && (
          <Polyline
            key="walking-route-to-destination"
            coordinates={walkingRouteToDestination}
            strokeColor={'#1E90FF'}
            strokeWidth={4}
            lineDashPattern={[1, 2]}
          />
        )}
      </MapView>

      <View style={{
        height: 80,
        paddingTop: 10,
        paddingHorizontal: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {/* Botón de regreso */}
        <TouchableOpacity style={{ marginRight: theme.spacing.xxs, padding: theme.spacing.xs, backgroundColor: '#0088CC', borderRadius: 50 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Buscador */}
        <TouchableOpacity style={styles.container} onPress={handleSearchRutes} >
          <Icon name="search" size={20} color="#A0A0A0" style={styles.icon} />
          <TextInput
            placeholder={"¿A dónde quieres ir?"}
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* //! BOTONES: mantener MyLocation y Compass en selección, ocultar VerRutas y Layers */}
      {showBotones && (
        <>
          {/* Siempre visibles: centrar ubicación y brújula */}
          <TouchableOpacity style={styles.botonMyLocation} onPress={() => centerToUserLocation()}>
            {isLoading ? (
              <ActivityIndicator size={30} color="#fff" />
            ) : (
              <Icon name="my-location" size={30} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.compass} onPress={resetToNorth}>
            <Icon1 name="compass" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Ocultos en modo selección (showsContentLarge=false) */}
          {showsContentLarge && (
            <>
              <TouchableOpacity 
                style={[
                  styles.verRutasBtn,
                  { backgroundColor: (fetchedRoutes && fetchedRoutes.length > 0) ? '#4CAF50' : '#0088CC' }
                ]} 
                onPress={() => handleToggleRoutes(false)} 
              >
                <Icon name="alt-route" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.LayerTypeBtn} onPress={handleToggleLayers} >
                <Icon name="layers" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleClearAllData} >
                <Icon name="delete" size={30} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {/*  */}

      {/* Marcador centrado */}
      {
        showsContentLarge === false &&
        (
          <View pointerEvents="none" style={styles.markerFixed}>
            <View style={styles.marker}>
              <View style={styles.point}></View>
            </View>
            <View style={styles.makerBottom}>
            </View>
          </View>
        )
      }
      {/** Modal para tipos de Mapas */}
      <Modal onButtonSheetRef={MapTypeRef} snapPoints={['35%', '40%']} >
        <MapTypeModal setMapType={setMapType} />
      </Modal>
      {/** Modal para Listado de Rutas*/}
      <Modal onButtonSheetRef={RoutesRef} snapPoints={['55%', '65%', '80%']}   >
        <ListaDeRutas 
          mapRef={mapRef} 
          onButtonSheetRef={RoutesRef} 
          setUbi={setUserLocationEnabled} 
          userLocation={userLocation}
          pinHome={PIN_HOME}
          pinFin={PIN_FIN}
          openedFromSearch={routesOpenedFromSearch}
        />
      </Modal>

      {/** Modal para Buscar rutas */}
      <Modal 
        onButtonSheetRef={SearchRoutesRef}
        snapPoints={showsContentLarge ? ['100%'] : ['35%', '100%']}
        onClosePress={() => {
          // Si estamos en modo selección (showsContentLarge=false), volver a "Chapa tu micro" (true)
          if (!showsContentLarge) {
            // Limpiar dirección autocompletada al salir de selección
            SearchRoutesComponentRef.current?.clearAutocompleteIfSelecting?.();
            setShowsContentLarge(true);
          } else {
            // Si ya estamos en "Chapa tu micro", cerrar el modal normalmente
            SearchRoutesRef.current?.dismiss();
          }
        }}
      >
        <SearchRoutes
          ref={SearchRoutesComponentRef}
          setShow={setShowsContentLarge}
          userLocation={userLocation}
          show={showsContentLarge}
          handleToggleRoutes={handleToggleRoutes}
          centerCoords={mapRegion ? { latitude: mapRegion.latitude, longitude: mapRegion.longitude } : undefined}
          pinGreen={PIN_GREEN}
          pinRed={PIN_RED}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: 110,
    position: 'absolute',
    top: 60,
    right: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 5,
    gap: 2,
    //fontSize: theme.typography.fontSize.xs,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: theme.spacing.xs,
    paddingHorizontal: 12,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  botonMyLocation: {
    position: 'absolute',
    top: "24%",
    right: theme.spacing.sm,
    backgroundColor: '#0088CC',
    borderRadius: 50,
    padding: 8,

  },
  verRutasBtn: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: "31%",
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#0088CC',
  },
  LayerTypeBtn: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: "10%",
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#0088CC',
  },
  compass: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: "17%",
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#0088CC',
  },
  deleteBtn: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: "38%",
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#0088CC',
  },
  markerFixed: {
    position: 'absolute',
    top: height / 2 - 45, // Ajuste para centrar
    left: width / 2 - 10,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#0f0f0fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  makerBottom: {
    width: 5,
    height: 30,
    backgroundColor: '#0f0f0fff',
    position: 'absolute',
    top: 18,
    left: 7,

  },
  point:{
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 7.5,
    left: 8,
  },
  coordinateBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
  },
  // map: {
  //   flex: 1,
  // },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  loaderSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationButtonText: {
    fontSize: 24,
  },
  customMarker: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pinWrapper: {
    alignItems: 'center',
  },
  pinHead: {
    width: 18,
    height: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  pinStem: {
    width: 3,
    height: 26,
    backgroundColor: '#000',
    borderRadius: 3,
    marginTop: -2,
  },
});

export default Map;