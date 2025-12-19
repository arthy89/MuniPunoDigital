import { Image, Video } from 'react-native-compressor';
import { CompressorOptions } from 'react-native-compressor/lib/typescript/Image';
export const compressImage = async (
  imageUri: string,
  options?: CompressorOptions,
) => {
  try {
    const compressedImage = await Image.compress(imageUri, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      output: 'jpg',
      disablePngTransparency: true,
      ...options,
    });
    console.log('Exito al comprimir imagen');
    return compressedImage;
  } catch (error) {
    console.error('Error al comprimir imagen', error);
    throw error;
  }
};

type VideoCompresssionType = {
  bitrate?: number;
  maxSize?: number;
  compressionMethod?: 'auto' | 'manual';
  minimumFileSizeForCompress?: number;
  getCancellationId?: (cancellationId: string) => void;
  downloadProgress?: (progress: number) => void;
  progressDivider?: number;
};
export const compressVideo = async (
  videoUri: string,
  options?: VideoCompresssionType,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  try {
    const compressedVideo = await Video.compress(videoUri, options, onProgress);
    return compressedVideo;
  } catch (error) {
    console.error('Error al comprimir video', error);
    throw error;
  }
};
