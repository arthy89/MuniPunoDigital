import theme from '@/theme';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapType } from 'react-native-maps';

const mapTypes = [
  {
    key: 'standard',
    label: 'Predeterminado',
    image: require('@/assets/images/micropuno/predeterminado.png'), // Cambia por la ruta de tu imagen
  },
  {
    key: 'satellite',
    label: 'Satellite',
    image: require('@/assets/images/micropuno/satelite.png'),
  },
  {
    key: 'hybrid',
    label: 'Relieve',
    image: require('@/assets/images/micropuno/relieve.png'),
  },
];

const MapTypeSelector = ({ onSelect, selectedType }: { onSelect: (key: MapType) => void; selectedType: MapType }) => (
  <View style={styles.row}>
    {mapTypes.map((type) => (
      <TouchableOpacity
        key={type.key}
        style={[
          styles.card,
          selectedType === type.key && styles.selectedCard,
        ]}
        onPress={() => onSelect(type.key as MapType)}
        activeOpacity={0.8}
      >
        <Image source={type.image} style={styles.image} />
        <Text style={styles.label}>{type.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MapTypeModal = ({setMapType}:{setMapType:React.Dispatch<React.SetStateAction<MapType>>}) => {
  const [selected, setSelected] = useState<MapType>('standard');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipo de mapa</Text>
      <Text style={styles.subtitle}>Seleccione un tipo de mapa</Text>
      <MapTypeSelector selectedType={selected} onSelect={(key: MapType) => {
        setSelected(key);
        setMapType(key);
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
    fontSize: 13,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //gap: theme.spacing.xxs,
  },
  card: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d7d7d7',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    width: 110,
  },
  selectedCard: {
    borderColor: '#0088cc',
    backgroundColor: '#e6f4fa',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#0088CC',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export default MapTypeModal;