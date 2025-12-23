import theme from '@/theme';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouteStore } from '../resources/useRouteStore';
import { fetchWalkingRoute } from '../utils/walkingRouteHelper';

type Ruta = any;
interface RutaProps {
  ruta: Ruta;
  onButtonSheetRef: React.RefObject<BottomSheetModal | null>;
  mapRef: React.RefObject<MapView | null>;
  setUbi: React.Dispatch<React.SetStateAction<boolean>>;
  userLocation?: LatLng | null;
  isSelected: boolean;
  onSelect: () => void;
  pinHome?: any;
  pinFin?: any;
}

const normalizeCoordinates = (input: any[]): LatLng[] => {
  if (!Array.isArray(input) || input.length === 0) return [];
  if (typeof input[0] === 'object' && ('latitude' in input[0] || 'lat' in input[0])) {
    return input.map((c: any) => ({
      latitude: c.latitude ?? c.lat,
      longitude: c.longitude ?? c.lng ?? c.lon,
    }));
  }
  if (Array.isArray(input[0])) {
    // GeoJSON: [lng, lat]
    return input.map((pair: any) => ({
      latitude: Number(pair[1]),
      longitude: Number(pair[0]),
    }));
  }
  return [];
};

const RutaCard = ({ ruta, onButtonSheetRef, mapRef, setUbi, userLocation, isSelected, onSelect }: RutaProps) => {
  const setRouteCoordinates = useRouteStore((state) => state.setRouteCoordinates);
  const setMiddleRoute = useRouteStore((state) => state.setMiddleRoute);
  const setColorRoute = useRouteStore((state) => state.setColorRoute);
  const setShowRoute = useRouteStore((state) => state.setShowRoute);
  const setWalkingRoute = useRouteStore((s) => s.setWalkingRoute);

  const handleSelectRoute = async (ruta: any) => {
    onSelect();
    setUbi(true);

    // Busca las coordenadas en el objeto de la ruta
    let coords: LatLng[] = [];
    if (ruta.geom_geojson && Array.isArray(ruta.geom_geojson.coordinates)) {
      coords = normalizeCoordinates(ruta.geom_geojson.coordinates);
    } else if (ruta.geometry && Array.isArray(ruta.geometry.coordinates)) {
      coords = normalizeCoordinates(ruta.geometry.coordinates);
    } else if (Array.isArray(ruta.coordinates)) {
      coords = normalizeCoordinates(ruta.coordinates);
    }
    if (coords.length > 0) {
      const midIndex = Math.floor(coords.length / 2);
      setMiddleRoute(coords[midIndex]);
      setRouteCoordinates(coords);
      setShowRoute(true);
      setColorRoute(ruta.color ?? '#0088cc');
      onButtonSheetRef?.current?.dismiss();
      mapRef?.current?.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      // Calcular ruta a pie usando helper centralizado
      if (userLocation) {
        const walking = await fetchWalkingRoute(userLocation, coords);
        if (walking !== null) {
          setWalkingRoute(walking);
        }
      } else {
        setWalkingRoute([]); // sin ubicación, limpiar
      }
    } else {
      // Si no hay coordenadas, no hace nada
      // Puedes mostrar un toast o alerta si lo deseas
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isSelected && styles.cardSelected
      ]} 
      onPress={() => handleSelectRoute(ruta)}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconBox, { backgroundColor: ruta.color ?? '#0088cc' }]}>
          <Icon name="directions-bus" size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rutaNombre}>{ruta.nombre ?? 'Ruta'}</Text>
          <Text style={styles.rutaDetalle}>{ruta.nombre ?? 'Ruta'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ListaRutasProps {
  onButtonSheetRef: React.RefObject<BottomSheetModal | null>;
  mapRef: React.RefObject<MapView | null>;
  setUbi: React.Dispatch<React.SetStateAction<boolean>>;
  userLocation?: LatLng | null;
  pinHome?: any;
  pinFin?: any;
  openedFromSearch?: boolean;
}

const ListaDeRutas: React.FC<ListaRutasProps> = ({ onButtonSheetRef, mapRef, setUbi, userLocation, pinHome, pinFin, openedFromSearch }) => {
  const fetchedRoutes = useRouteStore((s) => s.fetchedRoutes);
  const selectedRouteId = useRouteStore((s) => s.selectedRouteId);
  const setSelectedRouteId = useRouteStore((s) => s.setSelectedRouteId);
  const items = (fetchedRoutes && fetchedRoutes.length > 0)
    ? fetchedRoutes.map((r: any, i: number) => ({ ...r, id: String(i) }))
    : [];

  return (
    <View style={styles.container}>
      {/* Leyenda */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Image source={pinHome} style={styles.pinIcon} />
          <Text style={styles.legendText}>Inicio de la ruta</Text>
        </View>
        <View style={styles.legendItem}>
          <Image source={pinFin} style={styles.pinIcon} />
          <Text style={styles.legendText}>Fin de la ruta</Text>
        </View>
      </View>
      <Text style={styles.title}>{openedFromSearch ? 'Rutas disponibles según tu búsqueda' : 'Rutas disponibles'}</Text>
      {/* <Text style={styles.subTitle}>Seleccione una ruta para ver más detalles</Text> */}
      {!openedFromSearch && (
        <TextInput
          placeholder="Buscar rutas..."
          style={styles.searchInput}
          placeholderTextColor={theme.colors.textPlaceholder}
          editable={false}
        />
      )}
      {items.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: '#888', fontSize: 16 }}>No hay rutas disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RutaCard 
              ruta={item} 
              mapRef={mapRef} 
              onButtonSheetRef={onButtonSheetRef} 
              setUbi={setUbi} 
              userLocation={userLocation}
              isSelected={selectedRouteId === item.id}
              onSelect={() => setSelectedRouteId(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default ListaDeRutas;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    alignSelf: 'center',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderColor: '#00000040',
    borderWidth: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 0,
    borderColor: '#00000040',
    borderWidth: 1,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#0088cc',
    backgroundColor: '#f7fafd',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 4,
  },
  rutaNombre: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  rutaDetalle: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  detalle: {
    fontSize: 12,
    color: '#555',
  },
  precio: {
    color: '#007aff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  verRutaBtn: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    alignItems: 'center',
  },
  verRutaText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  lineSeparatorCategory: {
    height: 1,
    backgroundColor: theme.colors.black,
    opacity: 0.5,
    marginVertical: theme.spacing.md,
  },
  pinIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
});