import { MediaCamera } from '@/interfaces/CameraTypes';
import { View, Image, StyleSheet } from 'react-native';

interface EvidenceCaptureShowMediaProps {
  media: MediaCamera[];
}
const EvidenceCaptureShowMedia = ({ media }: EvidenceCaptureShowMediaProps) => {
  return (
    <View style={styles.imageContainer}>
      {media.map(({ uri }, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    bottom: 170,
    right: 7,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Blanco con transparencia
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 2,
  },
});

export default EvidenceCaptureShowMedia;
