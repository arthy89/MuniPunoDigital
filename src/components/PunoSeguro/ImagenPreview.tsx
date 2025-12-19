import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';

type Props = {
  onPhotoUri: string[];
  onRemove: (index: number) => void;
};

// Función para agregar "file://" al URI si no lo tiene
const normalizeUri = (uri: string) => {
  return uri.startsWith('file://') ? uri : `file://${uri}`;
};

// Función para determinar si es un video o una imagen
const getFileType = (uri: string) => {
  const extension = uri.split('.').pop()?.toLowerCase();
  return extension === 'mp4' ? 'video' : 'image';
};

export const ImagePreview = React.memo(({ onPhotoUri, onRemove }: Props) => (
  <View style={styles.imageContainer}>
    {onPhotoUri.map((uri, index) => {
      const normalizedUri = normalizeUri(uri); 
      const type = getFileType(normalizedUri); 

      return (
        <View key={index} style={styles.imageWrapper}>
          {type === 'image' ? (
            <Image source={{ uri: normalizedUri }} style={styles.image} />
          ) : (
            <View style={styles.videoWrapper}>
              <Video
                source={{ uri: normalizedUri }}
                style={styles.video} 
                paused={true} 
                controls
                resizeMode="cover"
                
              />
            </View>
          )}
          <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(index)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    })}
  </View>
));

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 3,
    alignItems: 'flex-end',
    marginHorizontal: 'auto',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  image: {
    width: 80,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: 160,   // ancho fijo
    height: 90,   // altura fija (relación 10:8 aprox)
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 8, // Aplicamos el borde en el contenedor del video
    overflow: 'hidden', // Aseguramos que el borde se mantenga limpio
  },
  video: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
