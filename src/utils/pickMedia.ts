import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { compressImage, compressVideo } from './compressMedia';
import { formatFileDateMobile } from './dayjsSpanish';

interface PickMediaAndCompressOptions extends ImageLibraryOptions {
  currentLength: number;
}
export const pickMediaAndCompress = async ({
  currentLength = 0,
  ...options
}: PickMediaAndCompressOptions) => {
  const { mediaType = 'mixed', selectionLimit = 3, ...rest } = options;
  const media = await launchImageLibrary({
    mediaType,
    selectionLimit: selectionLimit - currentLength,
    includeExtra: true,
    ...rest,
  });
  if (media.didCancel || !media.assets?.[0]) return;
  const compressedMedia = media.assets.map(async pickMedia => ({
    uri: pickMedia.type?.startsWith('image')
      ? await compressImage(pickMedia.uri!)
      : await compressVideo(pickMedia.uri!),
    date: formatFileDateMobile(pickMedia.timestamp) || '',
    type: pickMedia.type || '',
  }));
  return Promise.all(compressedMedia);
};
