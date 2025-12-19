import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import {
  useCameraPermission,
  useMicrophonePermission,
  Camera,
  useCameraDevice,
  VideoFile,
} from 'react-native-vision-camera';
//import { CameraRoll } from "@react-native-camera-roll/camera-roll";
//import BottomSheetComponent from './BottomSheetComponent';
import RNFS from 'react-native-fs';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image as CompressorImage, Video } from 'react-native-compressor';
import CameraControls from './CameraOptionsComponent';
import Modal from './BottomSheetComponent';
import formatFileSize from '../../utils/formatFilesSize';
import { compressImage, compressVideo } from '../../utils/compressMedia';


  interface VideoData {
    path: string;
    duration?: number;
    size?: number;
  }

  type BottomSheetProps = {
    urlPhotos: string[]; // Lista de imágenes
    // onRemoveImage: (index: number) => void; // Función para eliminar imágenes
    // onSubmit: () => void; // Función para enviar el formulario
  };
  // Función para comprimir imagen
  const ShowImagesComponent: React.FC<BottomSheetProps> = ({ urlPhotos }) => {
    return (
      <View style={styles.imageContainer}>
        {urlPhotos.map((url: string, index) => (
          <Image key={index} source={{ uri: url }} style={styles.image} />
        ))}
      </View>
    );
  };

  interface CameraComponentProps {
    itemsSG?: { label: string; value: string }[];
    formName?: string;
  }

  const CameraComponent = ({ formName, itemsSG }: CameraComponentProps) => {
    const bottonSheetRef = useRef<BottomSheetModal | null>(null);
    const camera = useRef<Camera>(null);
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const {
      hasPermission: hasPermissionMicroPhone,
      requestPermission: requestPermissionMicroPhone,
    } = useMicrophonePermission();

    const [mediaUris, setMediaUris] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [videoUri, setVideoUri] = useState<VideoData | null>(null);
    const [adImg, setAdImg] = useState(false);
    const [photoUris, setPhotoUris] = useState<string[]>([]);
    const [photoBlob, setPhotoBlob] = useState<Array<{ nombre: any; uri: string }>>([]);

    useEffect(() => {
      if (!hasPermission) requestPermission();
      // El permiso de micrófono se solicitará solo cuando se intente grabar video
    }, [hasPermission]);

    const handlePrensentModalPress = useCallback(() => {
      bottonSheetRef.current?.present();
    }, []);

    const handleSheetModalStop = useCallback(() => {
      bottonSheetRef.current?.dismiss();
    }, []);

    const takePhoto = async () => {
      if (photoUris.length >= 3) {
        Alert.alert('Error', 'Solo se aceptan 3 imágenes como máximo');
        return;
      }

      if (camera.current) {
        try {
          const photo = await camera.current.takePhoto();
          const result = await fetch(`file://${photo.path}`);
          const blob = await result.blob();
          setPhotoBlob(prev => [...prev, { nombre: blob, uri: 'xd' }]);
          setAdImg(true);

          const originalStat = await RNFS.stat(photo.path);
          console.log('Tamaño original:', formatFileSize(originalStat.size));

          const compressedImageUri = await compressImage(photo.path);
          const compressedStat = await RNFS.stat(compressedImageUri);
          console.log('Tamaño comprimido:', formatFileSize(compressedStat.size));

          setMediaUris(prev => [...prev, compressedImageUri]);
          setPhotoUris(prev => [...prev, compressedImageUri]);
        } catch (error) {
          console.error('Error al capturar la foto:', error);
        }
      }
    };

    const RecordingVideo = async () => {
      if (isRecording) {
        stopRecording();
        return;
      }

      // Solicitar permiso de micrófono solo cuando se va a grabar video
      if (!hasPermissionMicroPhone) {
        const granted = await requestPermissionMicroPhone();
        if (!granted) {
          Alert.alert('Permiso requerido', 'Se necesita acceso al micrófono para grabar video');
          return;
        }
      }

      setIsRecording(true);
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

      camera.current?.startRecording({
        onRecordingFinished: async video => {
          try {
            setIsRecording(false);
            const originalStat = await RNFS.stat(video.path);
            console.log('Tamaño original:', formatFileSize(originalStat.size));

            const compressedVideoUri = await compressVideo(video.path);
            const compressedStat = await RNFS.stat(compressedVideoUri);
            console.log('Tamaño comprimido:', formatFileSize(compressedStat.size));

            setVideoUri({ path: compressedVideoUri });
            setPhotoUris(prev => [...prev, compressedVideoUri]);
          } catch (error) {
            console.error('Error al procesar el video:', error);
          } finally {
            setIsRecording(false);
          }
        },
        onRecordingError: error => {
          console.error('Error al grabar video:', error);
          setIsRecording(false);
        },
      });
    };

    const stopRecording = async () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      await camera.current?.stopRecording();
      setIsRecording(false);
    };

    const handleRemoveImage = (index: number) => {
      setPhotoUris(prev => prev.filter((_, i) => i !== index));
    };

    const handleSelectMedia = async () => {
      if (photoUris.length >= 3) {
        Alert.alert('Error', 'Solo se aceptan 3 imágenes como máximo');
        return;
      }

      launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1 }, async response => {
        if (response.didCancel) {
          console.log('Selección cancelada');
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Error al seleccionar media');
          return;
        }

        const media = response.assets?.[0];
        if (!media) return;

        try {
          const originalStat = await RNFS.stat(media.uri!);
          console.log('Tamaño original:', formatFileSize(originalStat.size));

          if (media.type?.startsWith('image')) {
            const compressedImageUri = await compressImage(media.uri!);
            const compressedStat = await RNFS.stat(compressedImageUri);
            console.log('Tamaño comprimido:', formatFileSize(compressedStat.size));

            setPhotoUris(prev => [...prev, compressedImageUri]);
            setAdImg(true);
          } else if (media.type?.startsWith('video')) {
            const compressedVideoUri = await compressVideo(media.uri!);
            const compressedStat = await RNFS.stat(compressedVideoUri);
            console.log('Tamaño comprimido:', formatFileSize(compressedStat.size));

            setVideoUri({ path: compressedVideoUri });
            setPhotoUris(prev => [...prev, compressedVideoUri]);
            setAdImg(true);
          }
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
        }
      });
    };
    /*
      const saveImageToGallery = async (uri: string) => {
          try {
              const result = await CameraRoll.save(uri, { type: 'photo' });
              console.log('Imagen guardada en la galería:', result);
          } catch (error) {
              console.error('Error al guardar la imagen:', error);
          }
      };
      // Guardar un video en la galería
      const saveVideoToGallery = async (uri: string) => {
          try {
              const result = await CameraRoll.save(uri, { type: 'video' });
              console.log('Video guardado en la galería:', result);
          } catch (error) {
              console.error('Error al guardar el video:', error);
          }
      };*/



    /*const handleSubmit = () => {
          Alert.alert('Formulario enviado con las imágenes:');
      };*/

    if (!device) {
      return <Text style={styles.loadingText}>Cargando cámara...</Text>;
    }

    if (!hasPermission) {
      return (
        <Text style={styles.permissionText}>
          No se tiene permiso para usar la cámara.
        </Text>
      );
    }


    return (
      <View style={styles.container}>
        <Camera
          style={{ flex: 1 }}
          ref={camera}
          device={device}
          isActive={true}
          photo={true}
          video={true}
          audio={true}
        />
        {isRecording && <Text style={styles.contador}>00:00:0{seconds}s</Text>}
        <CameraControls
          onTakePhoto={takePhoto}
          onRecordVideo={RecordingVideo}
          onSelectMedia={handleSelectMedia}
          isRecording={isRecording}
          handlePrensentModalPress={handlePrensentModalPress}
        />
        {mediaUris.length > 0 && <ShowImagesComponent urlPhotos={mediaUris} />}
         
        <Modal
          onButtonSheetRef={bottonSheetRef}
          onPhotoUri={photoUris}
          onTakePhoto={handleSheetModalStop}
          onRemove={handleRemoveImage}
          onPickImage={handleSelectMedia}
          formName={formName}
          itemsSG={itemsSG}
        />

      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    loadingText: {
      flex: 1,
      color: '#000',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },
    contador: {
      position: 'absolute',
      top: 10,
      left: '40%',
      fontSize: 15,
      color: '#fff',
    },
    permissionText: {
      flex: 1,
      color: '#fff',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },
    captureButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: '#fff',
      borderRadius: 50,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButtonText: {
      fontSize: 20,
    },
    formButton: {
      position: 'absolute',
      bottom: 30,
      right: 7,
      alignSelf: 'flex-end',
      backgroundColor: '#333',
      borderRadius: 32,
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
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
    imageWrapper: {
      position: 'relative',
      marginRight: 8,
      marginBottom: 8,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 2,
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
    submitButton: {
      backgroundColor: '#0088cc',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default CameraComponent;

