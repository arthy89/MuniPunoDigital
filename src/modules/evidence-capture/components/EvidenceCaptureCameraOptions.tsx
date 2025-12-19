import { useCallback, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { MediaType } from 'react-native-image-picker';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 100;
const CENTER_OFFSET = (screenWidth - ITEM_WIDTH) / 2;

enum MediaMode {
  Photo = 'photo',
  Video = 'video',
}

const MODES = Object.values(MediaMode);

interface EvidenceCaptureCameraOptionsProps {
  onTakePhoto: () => void;
  onRecordVideo: () => void;
  onSelectMedia: () => void;
  handlePrensentModalPress: () => void;
  isRecording: boolean;
  mediaType: MediaType;
}

const EvidenceCaptureCameraOptions = ({
  onTakePhoto,
  onRecordVideo,
  onSelectMedia,
  handlePrensentModalPress,
  isRecording,
  mediaType,
}: EvidenceCaptureCameraOptionsProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [mode, setMode] = useState<MediaMode>(
    mediaType === 'video' ? MediaMode.Video : MediaMode.Photo,
  );
  const selectedScale = useSharedValue(1.2);

  const handleModeChange = useCallback(
    (newMode: MediaMode, index: number) => {
      scrollRef.current?.scrollTo({
        x: index * ITEM_WIDTH,
        animated: true,
      });
      setMode(newMode);
      selectedScale.value = withTiming(1.2, { duration: 200 });
    },
    [selectedScale],
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
      const newMode = MODES[index];
      if (newMode !== mode) {
        handleModeChange(newMode, index);
      }
    },
    [handleModeChange, mode],
  );

  const handleAction = useCallback(() => {
    mode === 'photo' ? onTakePhoto() : onRecordVideo();
  }, [mode, onTakePhoto, onRecordVideo]);

  const getIcon = useCallback(() => {
    return mode === 'video' ? (isRecording ? 'stop' : 'videocam') : 'camera';
  }, [mode, isRecording]);

  const getIconColor = useCallback(() => {
    return mode === 'video' && isRecording ? 'red' : '#000';
  }, [mode, isRecording]);

  return (
    <View style={[styles.wrapper]}>
      {/* Carrusel superior */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: CENTER_OFFSET }}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}>
          {MODES.filter(item =>
            mediaType === 'mixed' ? true : item === mediaType,
          ).map((item, index) => {
            const isSelected = item === mode;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => handleModeChange(item, index)}>
                <View style={styles.carouselItem}>
                  <Animated.Text
                    style={[
                      styles.carouselText,
                      isSelected && styles.selectedText,
                      {
                        transform: [{ scale: isSelected ? 1.2 : 1 }],
                      },
                    ]}>
                    {item === 'photo' ? 'Foto' : 'Video'}
                  </Animated.Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Controles inferiores */}
      <View style={styles.controlsRow}>
        {/* Galería */}
        <TouchableOpacity onPress={onSelectMedia}>
          <View style={styles.sideButton}>
            <Icon name="images-outline" size={30} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Botón principal */}
        <TouchableOpacity onPress={handleAction}>
          <Animated.View style={styles.mainButton}>
            <Icon name={getIcon()} size={35} color={getIconColor()} />
          </Animated.View>
        </TouchableOpacity>

        {/* Modal */}
        <TouchableOpacity onPress={handlePrensentModalPress}>
          <View style={styles.sideButton}>
            <Icon name="save-outline" size={35} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000000ee',
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  carouselWrapper: {
    height: 30,
    marginBottom: 12,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
  sideButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default EvidenceCaptureCameraOptions;
