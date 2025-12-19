import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import theme from '@/theme';
import { compressImage, compressVideo } from '@/utils/compressMedia';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/StackNavigator';
import { MediaCamera } from '@/interfaces/CameraTypes';
import { pickMediaAndCompress } from '@/utils/pickMedia';
import mime from 'react-native-mime-types';
import EvidenceCaptureCameraOptions from '../components/EvidenceCaptureCameraOptions';
import EvidenceCaptureShowMedia from '../components/EvidenceCaptureShowMedia';
import { toast } from '@/utils/toastUtilities';
import { formatFileDateMobile } from '@/utils/dayjsSpanish';

type EvidanceCaptureScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EvidanceCaptureCamera'
>;
const EvidanceCaptureScreen = ({
  navigation,
  route,
}: EvidanceCaptureScreenProps) => {
  const { params } = route;
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [mediaUris, setMediaUris] = useState<MediaCamera[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  useEffect(() => {
    if (!cameraPermission.hasPermission) cameraPermission.requestPermission();
    // Solo solicitar permiso de micrófono si se va a grabar video
    if (params.mediaType === 'video' && !microphonePermission.hasPermission)
      microphonePermission.requestPermission();
  }, [cameraPermission.hasPermission, microphonePermission.hasPermission, params.mediaType]);

  useEffect(() => {
    if (params.mediaUris) setMediaUris(params.mediaUris);
  }, [params.mediaUris]);

  const onTakePhoto = async () => {
    if (mediaUris.length >= params.maxMediaLength)
      return toast.warning(
        `Solo se aceptan ${params.maxMediaLength} imágenes como máximo`,
      );
    if (!camera.current) return;
    const photo = await camera.current.takePhoto();
    const compressedImageUri = await compressImage(photo.path);
    setMediaUris([
      ...mediaUris,
      {
        uri: compressedImageUri,
        date: formatFileDateMobile(),
        type: mime.lookup(photo.path) || 'image/jpeg',
      },
    ]);
  };

  const onRecordVideo = async () => {
    if (isRecording) return stopRecording();
    if (mediaUris.length >= params.maxMediaLength)
      return toast.warning(
        `Solo se aceptan ${params.maxMediaLength} imágenes como máximo`,
      );
    setIsRecording(true);
    startCountdown();
    camera.current?.startRecording({
      onRecordingFinished: async video => {
        setIsRecording(false);
        const compressedVideoUri = await compressVideo(video.path);
        setMediaUris([
          ...mediaUris,
          {
            uri: compressedVideoUri,
            date: formatFileDateMobile(),
            type: mime.lookup(video.path) || 'video/mp4',
          },
        ]);
      },
      onRecordingError: error => {
        setIsRecording(false);
      },
    });
  };

  const startCountdown = () => {
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 29) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };
  const stopRecording = async () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    await camera.current?.stopRecording();
    setIsRecording(false);
  };

  const handleSelectMedia = async () => {
    if (mediaUris.length >= params.maxMediaLength)
      return toast.warning(
        `Solo se aceptan ${params.maxMediaLength} imágenes como máximo`,
      );
    const pickMedia = await pickMediaAndCompress({
      currentLength: mediaUris.length,
      mediaType: params.mediaType,
    });
    if (!pickMedia) return;
    setMediaUris([...mediaUris, ...pickMedia]);
  };
  const onSaveMedia = () => {
    params.onSaveMedia(mediaUris);
    navigation.goBack();
  };
  if (!device) {
    return <Text style={styles.screenText}>Cargando cámara...</Text>;
  }

  if (!cameraPermission.hasPermission) {
    return (
      <Text style={styles.screenText}>
        No se tiene permiso para usar la cámara.
      </Text>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        ref={camera}
        device={device}
        isActive
        photo={params.mediaType === 'photo' || params.mediaType === 'mixed'}
        video={params.mediaType === 'video' || params.mediaType === 'mixed'}
        audio={params.mediaType === 'video' || params.mediaType === 'mixed'}
      />
      <EvidenceCaptureCameraOptions
        onTakePhoto={onTakePhoto}
        onRecordVideo={onRecordVideo}
        handlePrensentModalPress={onSaveMedia}
        isRecording={isRecording}
        onSelectMedia={handleSelectMedia}
        mediaType={params.mediaType}
      />
      {mediaUris.length > 0 && <EvidenceCaptureShowMedia media={mediaUris} />}
      {isRecording && <Text style={styles.contador}>30 / {seconds}s</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  screenText: {
    flex: 1,
    color: theme.colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: theme.typography.fontSize.xl,
  },
  counterText: {
    position: 'absolute',
    top: 10,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
  },
  contador: {
    position: 'absolute',
    top: 10,
    left: '40%',
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#ff0000',
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontWeight: 'bold',
  },
});

export default EvidanceCaptureScreen;
