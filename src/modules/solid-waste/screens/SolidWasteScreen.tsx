import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FormContainer from '@/components/FormContainer';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputForm from '@/components/inputs/InputForm';
import InputSelectForm from '@/components/inputs/InputSelectForm';
import ButtonForm from '@/components/buttons/ButtonForm';
import TextAreaForm from '@/components/inputs/InputTextAreaForm';
import solidWasteFormScheme, {
  SolidWasteFormData,
} from '../validations/SolidWasteFormScheme';
import ButtonAction from '@/components/buttons/ButtonAction';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/StackNavigator';
import { SelectData } from '@/interfaces/SelectTypes';
import { getIncidentList } from '../use-cases/getIncidentList';
import { useLocationPermission } from 'react-native-vision-camera';
import { MediaCamera } from '@/interfaces/CameraTypes';
import { createIncident } from '../use-cases/createIncident';
import { pickMediaAndCompress } from '@/utils/pickMedia';
import { toast } from '@/utils/toastUtilities';
import theme from '@/theme/theme';
import MediaPreview from '@/components/MediaPreview';
import { Text } from 'react-native-gesture-handler';
import { useColorTheme } from '@/hooks/useColorTheme';
import { ColorTheme } from '@/theme/colors';
import { showLoader, hideLoader } from '@/api/createApiClient';
import { REGEX_ONLY_DIGITS } from '@/utils/regex';
import CardInfo from '@/components/cards/CardInfo';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CardAlert from '@/components/cards/CardAlert';
import { useGeolocationWithFallback } from '@/hooks/useGeolocationWithFallback';
import { useMediaPermission } from '@/hooks/useMediaPermission';
type SolidWasteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SolidWaste'
>;

const MAX_MEDIA_LENGTH = 3;
const SolidWasteScreen = ({ navigation }: SolidWasteScreenProps) => {
  const form = useForm<SolidWasteFormData>({
    resolver: zodResolver(solidWasteFormScheme),
    defaultValues: { media: [] },
  });
  const media = form.getValues('media');
  const [incidents, setIncidents] = useState<SelectData[]>([]);
  const {
    hasPermission: hasPermissionLocation,
    requestPermission: requestPermissionLocation,
  } = useLocationPermission();
  const { requestMediaPermission } = useMediaPermission();

  const colorsTheme = useColorTheme();

  const getDataCatalogos = async () => {
    const incidents = await getIncidentList();
    setIncidents(incidents);
  };

  useEffect(() => {
    if (!hasPermissionLocation) requestPermissionLocation();
  }, [hasPermissionLocation]);

  useEffect(() => {
    getDataCatalogos();
  }, []);

  const handleSelectMedia = async () => {
    if (media.length >= MAX_MEDIA_LENGTH) {
      toast.warning(`Solo se aceptan ${MAX_MEDIA_LENGTH} imágenes como máximo`);
      return;
    }
    
    // Verificar/solicitar permisos (solo necesario en Android 12 o anteriores)
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      toast.warning('Se requiere permiso para acceder a la galería');
      return;
    }
    
    const pickMedia = await pickMediaAndCompress({
      currentLength: media.length,
      mediaType: 'photo',
    });
    if (!pickMedia) return;
    form.setValue('media', [...media, ...pickMedia]);
  };
  const handleRemoveImage = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    form.setValue('media', updated, { shouldValidate: true });
  };

  const onSetmedia = (media: MediaCamera[]) => {
    form.setValue('media', media);
  };

  const openCamera = () => {
    navigation.navigate('EvidanceCaptureCamera', {
      onSaveMedia: onSetmedia,
      mediaUris: media,
      mediaType: 'photo',
      maxMediaLength: MAX_MEDIA_LENGTH,
    });
  };

  // Hook para obtener ubicación con manejo automático de permisos y fallback
  const { getLocation } = useGeolocationWithFallback({
    enableLogging: true,
    onError: (message) => toast.warning(message),
  });

  const onSubmit = async (data: SolidWasteFormData) => {
    showLoader();
    try {
      // Obtener ubicación (con permisos, habilitación de GPS y fallback automáticos)
      const location = await getLocation();

      // Enviar formulario con ubicación
      const body = {
        ...data,
        location,
      };
      console.log('Formulario listo para enviar:', body);
      await createIncident(body);

      hideLoader();
      toast.success('Formulario enviado con éxito');
      navigation.navigate('Home');
    } catch (err) {
      hideLoader();
      // console.error('Error al enviar formulario:', err);
      toast.warning(`Error: ${err instanceof Error ? err.message : ''}`);
    }
  };

  const onErrorForm = (errors: FieldErrors<SolidWasteFormData>) => {
    if (errors.media?.message) {
      toast.warning(errors.media?.message);
    }
  };

  const styles = getStyles(colorsTheme);

  return (
    <ScrollView contentContainerStyle={[{ flex: 0, backgroundColor: colorsTheme.backgroundContainer }]}>
      <CardInfo title={"Recoleccion de Basura"} subtitle={"Reporta problemas con la recolección de basura o limpieza."} iconName={"restore-from-trash"} />
      <FormContainer
        form={form}
        style={{ flex: 1, backgroundColor: colorsTheme.white, borderRadius: 20, padding: theme.spacing.md, }}
        onSubmit={form.handleSubmit(onSubmit, onErrorForm)}>
        <InputSelectForm
          iconLeft="exclamation-circle"
          name="incident"
          label="Título de reporte *"
          data={incidents}
          labelField="label"
          valueField="value"
        />
        <TextAreaForm
          name="description"
          label="Descripción detallada *"
          placeholder="Escribe aquí..."
          style={styles.textArea}
        />
        <InputForm
          iconLeft={'phone'}
          label="Celular *"
          name="phone"
          placeholder="Ingrese su número de celular"
          keyboardType="phone-pad"
          allowedRegex={REGEX_ONLY_DIGITS}
          maxLength={9}
        />

        <View style={styles.lineSeparatorCategory} ></View>
        <Text style={styles.subtitle} >Fotografías</Text>
        <MediaPreview
          media={form.watch('media')}
          onRemove={handleRemoveImage}
        />
        {form.watch('media').length < MAX_MEDIA_LENGTH && (
          <View style={styles.containerPhotography}>
            <Text style={{ color: colorsTheme.textPlaceholder, textAlign: 'center', paddingHorizontal: 15 }} >Agrega fotos y/o imagenes, para ayudarnos a entender mejor el problema</Text>
            <View style={styles.containerButtons}>
              <ButtonAction
                text={'Cámara'}
                onPress={openCamera}
                iconLeft={'camera'}
              />
              <ButtonAction
                text={'Galería'}
                onPress={handleSelectMedia}
                iconLeft={'image'}
              />
            </View>
          </View>
        )}
        <ButtonForm iconLeft="send" />

        <CardAlert
          title="Importante"
          items={[
            'Se enviará su ubicación para saber el lugar del reporte. *',
            'Solo se permite enviar 3 fotos como máximo. *',
          ]}
          iconName="exclamation-triangle"
          color="#7A5200"
          backgroundColor="#FFFDEB" />

      </FormContainer>
    </ScrollView>
  );
};
const getStyles = (color: ColorTheme) =>
  StyleSheet.create({
    containerButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    textArea: {
      fontSize: 16,
      textAlignVertical: 'top', // Alinea el texto al inicio verticalmente
    },
    textInfo: {
      fontSize: theme.typography.fontSize.sm,
      color: color.primary,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: 'bold',
      color: color.black,
    },
    lineSeparatorCategory: {
      height: 1,
      backgroundColor: color.black,
      opacity: 0.5,
      marginVertical: theme.spacing.xs,
    },
    containerPhotography: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 140,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: color.border,
      borderRadius: 12,
    }
  });

export default SolidWasteScreen;
