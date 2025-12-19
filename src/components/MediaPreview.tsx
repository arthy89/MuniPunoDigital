import { useColorTheme } from '@/hooks/useColorTheme';
import { MediaCamera } from '@/interfaces/CameraTypes';
import { ColorTheme } from '@/theme/colors';
import theme from '@/theme/theme';
import { renderIcon } from '@/utils/renderIcon';
import { memo } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';

interface MediaPreviewProps {
  media: MediaCamera[];
  onRemove: (index: number) => void;
}

const MediaPreview = memo(({ media, onRemove }: MediaPreviewProps) => {
  const colorTheme = useColorTheme();
  const styles = getStyles(colorTheme);
  return (
    <View style={styles.container}>
      {media.map(({ uri, type }, index) => (
        <View key={index} style={styles.itemWrapper}>
          {type.includes('image') ? (
            <Image source={{ uri }} style={styles.image} />
          ) : (
            <View style={styles.videoWrapper}>
              <Video
                source={{ uri }}
                style={styles.video}
                paused
                controls
                resizeMode="cover"
              />
            </View>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}>
            {renderIcon({
              iconName: 'close',
              iconSize: 14,
              iconColor: colorTheme.white,
            })}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
});

const getStyles = (color: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      justifyContent: 'center',
    },
    itemWrapper: {},
    image: {
      width: 80,
      height: 90,
      borderRadius: 8,
    },
    videoWrapper: {
      width: 160,
      height: 90,
      borderRadius: 8,
    },
    video: {
      width: '100%',
      height: '100%',
    },
    removeButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: color.danger,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
    },
  });

export default MediaPreview;
