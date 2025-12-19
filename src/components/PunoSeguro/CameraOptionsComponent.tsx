import React, { useRef, useState } from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 100;
const CENTER_OFFSET = (screenWidth - ITEM_WIDTH) / 2;

type Mode = 'photo' | 'video';

const modes: Mode[] = ['photo', 'video'];

interface CameraControlsProps {
  onTakePhoto: () => void;
  onRecordVideo: () => void;
  onSelectMedia: () => void;
  handlePrensentModalPress: () => void;
  isRecording: boolean;
}

const CameraControls = ({
  onTakePhoto,
  onRecordVideo,
  onSelectMedia,
  isRecording,
  handlePrensentModalPress,
}: CameraControlsProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [mode, setMode] = useState<Mode>('photo');
  const selectedScale = useSharedValue(1.2);
  const unselectedScale = 1;
  const insets = useSafeAreaInsets();
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_WIDTH);
    const newMode = modes[index];
    if (newMode !== mode) {
      setMode(newMode);
      selectedScale.value = withTiming(1.2, { duration: 200 });
    }
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * ITEM_WIDTH,
      animated: true,
    });
    setMode(modes[index]);
    selectedScale.value = withTiming(1.2, { duration: 200 });
  };

  const handleAction = () => {
    if (mode === 'photo') {
      onTakePhoto();
    } else {
      onRecordVideo();
    }
  };

  const getIcon = () => {
    if (mode === 'video') {return isRecording ? 'stop' : 'videocam'}
    return 'camera';
  };

  const getIconColor = () => {
    if (mode === 'video' && isRecording) {return 'red'}
    return '#000';
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || 30 }]}>
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
          scrollEventThrottle={16}
        >
          {modes.map((item, index) => {
            const isSelected = item === mode;
            return (
              <TouchableOpacity key={item} onPress={() => scrollToIndex(index)}>
                <View style={styles.carouselItem}>
                  <Animated.Text
                    style={[
                      styles.carouselText,
                      isSelected && styles.selectedText,
                      {
                        transform: [{ scale: isSelected ? 1.2 : unselectedScale }],
                      },
                    ]}
                  >
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
          <Animated.View style={[styles.mainButton]}>
            <Icon name={getIcon()} size={35} color={getIconColor()} />
          </Animated.View>
        </TouchableOpacity>

        {/* Botón Show Modal */}
        <TouchableOpacity onPress={handlePrensentModalPress}>
                    <View style={styles.sideButton}><Icon name="chevron-back" color={'#fff'} size={40} /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingVertical: 30,
    alignItems: 'center',
    bottom: 2,
    right: '4%',
 
  },
  carouselWrapper: {
    height: 40,
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
    //backgroundColor: '#333',
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

export default CameraControls;
