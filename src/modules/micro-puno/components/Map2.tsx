import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, PermissionsAndroid, ActivityIndicator, Platform, Alert, StyleSheet, TouchableOpacity, TextInput, Text, Dimensions, } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, Region, MapType, LatLng } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import theme from '@/theme';
import Modal from '../components/BottomSheetComponent';
import ListaDeRutas from '../components/MicroList';
import MapTypeModal from './MapType';
import { useRouteStore } from '../resources/useRouteStore';
import SearchRoutes from './SearchRoutes';
import requestLocationPermission from '../hooks/useGetUserLocation';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const RoutesRef = useRef<BottomSheetModal | null>(null);
  const MapTypeRef = useRef<BottomSheetModal | null>(null);
  const SearchRoutesRef = useRef<BottomSheetModal | null>(null);
  const navigation = useNavigation();
  const [mapType, setMapType] = useState<MapType>('terrain');
  const [location, setLocation] = useState<Region>();
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [showsContentLarge, setShowsContentLarge] = useState(true);
  const zoom = useRouteStore((state) => state.zoom);
  const showRoute = useRouteStore((state) => state.showRoute);
  const setFitRouteFunction = useRouteStore((state) => state.setFitRouteFunction);
  const routeCoordinates = useRouteStore((state) => state.routeCoordinates);
  const setRouteCoordinates = useRouteStore((state) => state.setRouteCoordinates);
  const colorRoute = useRouteStore((state) => state.colorRoute);
  const walkingRoute = useRouteStore((s) => s.walkingRoute);
  const [userLocationEnabled, setUserLocationEnabled] = useState<boolean>(false);
  const [showsMyLocationButton, setShowsMyLocationButton] = useState<boolean>(true);
  const [seguir, setSeguir] = useState<boolean>(true);



  const handleActivateUserLocation = () => {
    setUserLocationEnabled(true);
  }

  async function getUserLocation() {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No se puede acceder a tu ubicación.');
      return;
    }
    setIsGettingLocation(true);
    handleActivateUserLocation();
    Geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        };
        //setLocation(coords);
        setUserLocation(coords);
        mapRef.current?.animateToRegion(coords, 1000);
        setIsGettingLocation(false);
      },
      (error) => {
        console.log('Error al obtener ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener tu ubicación');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }

  const handleUserLocationChange = (event: any) => {
    console.log("userLocationChange", event.nativeEvent.coordinate);
    if (seguir && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }
  };

  const handleRegionChange = (newRegion: Region) => {
    setLocation(newRegion);
  };
  const handlePrensentModalPress = useCallback((onButtonSheetRef: React.RefObject<BottomSheetModal | null>) => {
    onButtonSheetRef.current?.present();
  }, []);

  const resetToNorth = () => {
    mapRef.current?.animateCamera({
      heading: 0,
      pitch: 0, // opcional, para resetear el ángulo
    });
  };

  const handleToggleRoutes = () => {
    console.log("---zoom---", zoom)
    //cuando se tiene el origen y el destino se cierra el modal de search rutas y se habre el de rutas
    SearchRoutesRef.current?.close();
    handlePrensentModalPress(RoutesRef);
    console.log("RouteCoordinates", routeCoordinates);
    //setShowRoute();
  }

  const handleToggleLayers = () => {
    handlePrensentModalPress(MapTypeRef);
  }

  const handleSearchRutes = () => {
    setShowsContentLarge(true);
    handlePrensentModalPress(SearchRoutesRef);
  }

  // Se ejecuta cada vez que entras a esta pantalla
  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
    }, [])
  );

  useEffect(() => {
    setRouteCoordinates([]);
    setFitRouteFunction(() => getUserLocation());
    getUserLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={"google"}
        mapType={mapType}
        showsMyLocationButton={showsMyLocationButton}
        showsUserLocation={userLocationEnabled}
        showsCompass={false}
        onUserLocationChange={handleUserLocationChange}
        onRegionChangeComplete={handleRegionChange}
        initialRegion={{
          latitude: -15.8402,
          longitude: -70.0219,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/*location && <Marker coordinate={location} title="Tú estás aquí" />*/}
        {showRoute && routeCoordinates.length > 0 && (
          <>
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
      <TouchableOpacity style={styles.botonMyLocation} onPress={() => getUserLocation()}>
        {
          isGettingLocation ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="my-location" size={30} color="#fff" />
        }

      </TouchableOpacity>
      <TouchableOpacity style={styles.verRutasBtn} onPress={handleToggleRoutes} >
        <Icon name="alt-route" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.compass} onPress={resetToNorth}>
        <Icon1 name="compass" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.LayerTypeBtn} onPress={handleToggleLayers} >
        <Icon name="layers" size={30} color="#fff" />
      </TouchableOpacity>
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
      <Modal onButtonSheetRef={RoutesRef} snapPoints={['55%', '65', '80%']}   >
        <ListaDeRutas mapRef={mapRef} onButtonSheetRef={RoutesRef} setUbi={setUserLocationEnabled} userLocation={userLocation} />
      </Modal>

      {/** Modal para Buscar rutas */}
      <Modal onButtonSheetRef={SearchRoutesRef} snapPoints={showsContentLarge ? ['100%'] : ['35%', '100%']}  >
        <SearchRoutes setShow={setShowsContentLarge} userLocation={userLocation} location={location} show={showsContentLarge} handleToggleRoutes={handleToggleRoutes} />
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
});

export default MapScreen;
