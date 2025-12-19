import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ImageOptionSelectorProps {
  onPickImage: () => void;
  onTakePhoto: () => void;
  onCantidad: number;
}

const ImageOptionSelector = ({ onPickImage, onTakePhoto, onCantidad }: ImageOptionSelectorProps) => {
  return (
    onCantidad < 3 ? ( // Mostrar opciones solo si onCantidad es menor a 3
      <View style={styles.container}>
        {/* Botón: Subir imagen */}
        <TouchableOpacity style={styles.optionBox} onPress={onPickImage}>
          <Icon name="image" size={25} color="#007ac1" />
          <Text style={styles.label}>Subir una imagen</Text>
        </TouchableOpacity>

        {/* Botón: Tomar foto */}
        <TouchableOpacity style={styles.optionBox} onPress={onTakePhoto}>
          <Icon name="camera" size={25} color="#007ac1" />
          <Text style={styles.label}>Tomar una foto</Text>
        </TouchableOpacity>
      </View>
    ) : null // No mostrar nada si onCantidad es 3 o más
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 8,
  },
  optionBox: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007ac1',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: 100,
  },
  label: {
    marginTop: 8,
    color: '#007ac1',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default ImageOptionSelector;