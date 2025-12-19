import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import {ImagePreview} from './ImagenPreview';
import {FormFields} from './FormFields';
import ImageOptionSelector from './ImageOptionSelector';
import uploadMediaWithData, { UploadData } from '../../services/UploadData';

interface VideoData {
  path: string;
  duration?: number;
  size?: number;
}
interface ModalProps {
  onTakePhoto: () => void;
  imageArray: Array<{nombre: any; uri?: string}>;
  onPhotoUri: any[];
  onRemove: (index: number) => void;
  onPickImage: () => void;
  onButtonSheetRef: React.RefObject<BottomSheetModal | null>;
  itemsSG?: { label: string; value: string }[];
  formName?: string;
}

const BottomSheetModalComponent: React.FC<ModalProps> = ({
  onTakePhoto,
  onPhotoUri,
  onRemove,
  onPickImage,
  onButtonSheetRef,
  formName,
  itemsSG,
}) => {
  const snapPointsInitial = useMemo(() => ['90%', '100%'], []);
  const [incident, setIncident] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isWrite, setIsWrite] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    console.log('xdxdx test', test);
    console.log('imageArray', onPhotoUri);
    const xdxd = await Promise.all(
      onPhotoUri.map(async file => {
        console.log('fileee', file);

        const response = await fetch(file);
        const blob = await response.blob();

        const fileName = 'foto_' + Date.now() + '.jpg'; // ✅ Generar nombre confiable
        const finalFinal = new File([blob], fileName, {
          type: blob.type,
          lastModified: Date.now(),
        });

        console.log('file', finalFinal);

        // const result = await fetch(file);
        // const blob = await result.blob();
        // console.log('blob', blob);

        // Devuelve el objeto que necesitas
        return {
          nombre: finalFinal,
          uri: file,
        };
      }),
    );

    console.log('mappp', xdxd);
    // const result = await fetch(`file://${photo.path}`);
    // const blob = await result.blob();

    // console.log('Blob:', blob);
    // arrayBlob.push({nombre: blob, uri: 'xd'});
    if (!incident || !description || !contact) {
      Alert.alert('Por favor, completa todos los campos.');
      return;
    } else {
      setIsUploading(true);

      const data: UploadData = {
        description: description,
        ubicacion: 'jr huaraz 123',
        catalogo_id: 1,
        celular: contact, // Aquí se pasan las imágenes o videos
        imagesArray: xdxd,
      };

      try {
        const response = await uploadMediaWithData(data);
        console.log('Respuesta del servidor:', response);
        Alert.alert('Subida exitosa', 'Los archivos se subieron correctamente');
        /* Toast.show({
           type: 'success', // 'success', 'error', 'info'
           text1: '¡Enviado con éxito!',
           text2: 'Los archivos se subieron correctamente.'
         });*/
      } catch (error) {
        console.error('Error al subir:', error);
        Alert.alert('Error', 'No se pudo subir los archivos');
      } finally {
        setIsUploading(false);
      }
    }
    // onSubmit({incident, description, contact});
  };

  const handleSheetModalStop = useCallback(() => {
    onButtonSheetRef?.current?.dismiss();
  }, [onButtonSheetRef]);

  // FIX: El BottomSheetModal se cerraba incluso al hacer click en zonas vacías del modal.
  // Solución: usamos BottomSheetBackdrop con pressBehavior="close" para que solo cierre
  // al tocar fuera del BottomSheet (fuera del área visible).
  // Esto evita que se cierre cuando el usuario interactúa con contenido del modal.
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close" // Esto hace que se cierre solo al tocar fuera del BottomSheet
      />
    ),
    [],
  );

  useEffect(() => {
    if (onButtonSheetRef?.current) {
      onButtonSheetRef.current.present();
    }
  }, [onButtonSheetRef]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={onButtonSheetRef}
        index={0}
        snapPoints={snapPointsInitial}
        enablePanDownToClose
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        onDismiss={handleSheetModalStop}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>FORMULARIO {formName}</Text>
          {isWrite && (
            <>
              <ImageOptionSelector
                onCantidad={onPhotoUri.length}
                onTakePhoto={onTakePhoto}
                onPickImage={onPickImage}
              />
              <ImagePreview onPhotoUri={onPhotoUri} onRemove={onRemove} />
            </>
          )}
          <Text style={styles.label}>Incidente: *</Text>
          {itemsSG && (
            <DropDownPicker
              open={openDropdown}
              value={incident}
              items={itemsSG}
              setOpen={setOpenDropdown}
              setValue={setIncident}
              placeholder="¿Qué ocurrió?"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          )}
          <FormFields
            description={description}
            contact={contact}
            onChangeDescription={setDescription}
            onChangeContact={setContact}
            IsWrite={setIsWrite}
          />

          <Text style={styles.note}>
            *Se enviará su ubicación para saber el lugar del reporte*
          </Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>ENVIAR</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
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
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  photoButton: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#ccc',
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  note: {
    fontSize: 12,
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    position: 'absolute',
    bottom: 10, // Ajusta la posición según tu diseño
    left: 10,
    right: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: 160, // ancho fijo
    height: 100, // altura fija (relación 10:8 aprox)
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 12,
  },
});

export default BottomSheetModalComponent;
