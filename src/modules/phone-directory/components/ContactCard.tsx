import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import { Contact } from '../interfaces/PhoneDirectory';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColorTheme } from '@/theme/colors';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import { toast } from '@/utils/toastUtilities';
interface ContactCardProps {
  contact: Contact;
}

const ContactCard = ({ contact }: ContactCardProps) => {
  const { correo, nombre, telefono } = contact;
  const colorTheme = useColorTheme();

  const handlePhonePress = () => {
    if (!telefono || telefono.trim() === '') {
      Alert.alert('Error', 'El número de teléfono no es válido.');
      return;
    }

    const cleanedPhone = telefono.replace(/[^\d]/g, ''); // Solo números
    const phoneUrl = `tel:${cleanedPhone}`; // Formato para abrir el marcador telefónico

    console.log('Intentando abrir:', phoneUrl);

    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        console.log('¿Puede abrir el marcador?', supported); // ← Esto es clave
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'No se puede abrir el marcador telefónico.');
        }
      })
      .catch(err => {
        console.error('Error al abrir el marcador:', err);
        Alert.alert('Error', 'Ocurrió un problema al intentar llamar.');
      });
  };

  // Función para abrir el cliente de correo con la dirección cargada
  /*
  const handleEmailPress = () => {
    if (!correo) {
      Alert.alert('Error', 'La dirección de correo no está disponible.');
      return;
    }

    const emailUrl = `mailto:${correo}`;
    Linking.canOpenURL(emailUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(emailUrl); // Abre el cliente de correo con la dirección
        } else {
          Alert.alert('Error', 'No se puede abrir el cliente de correo.');
        }
      })
      .catch(err => console.error('Error al abrir el cliente de correo:', err));
  };*/
  const handleEmailPress = () => {
    if (!correo) {
      toast.info('La dirección de correo no está disponible.');
      return;
    }

    Clipboard.setString(correo);
    toast.success('La dirección de correo ha sido copiada al portapapeles.');

  };
  const styles = getStyles(colorTheme);
  return (
    <View style={styles.card}>
      {/* Información del contacto */}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.details}>TEL: {telefono}</Text>
        <View style={styles.iconContainer}>
          <Text style={styles.details}>Correo: {correo}</Text>
          <TouchableOpacity style={styles.copy} onPress={handleEmailPress}>
            <Icon name="content-copy" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.iconPhone}  >
        <Icon
          name="phone"
          size={25}
          color={colorTheme.white}

          onPress={handlePhonePress}
        />
      </View>
      {/** 
        <View style={styles.iconEmail}  >
          <Icon
            name="email"
            size={25}
            color={colorTheme.white}
            onPress={handleEmailPress}
          />
        </View>
          */}
    </View>
  );
};

const getStyles = (color: ColorTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: color.card,
      borderRadius: 14,
      flexDirection: 'row',
      padding: theme.spacing.sm,
      ...theme.shadow,
      elevation: 4,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: 'bold',
      color: color.border,
      marginBottom: theme.spacing.xxs,
    },
    details: {
      fontSize: theme.typography.fontSize.sm,
      color: color.textSecondary,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs
    },
    iconContact: {
      backgroundColor: color.textPlaceholder,
      alignSelf: 'flex-start',
      borderRadius: 50,
      padding: theme.spacing.xs / 2,
      marginRight: theme.spacing.xs / 2
    },
    iconPhone: {
      backgroundColor: "#15AE01",
      alignSelf: 'center',
      padding: theme.spacing.sm,
      borderRadius: 50
    },
    iconEmail: {
      backgroundColor: "#0088CC",
      padding: theme.spacing.sm,
      borderRadius: 50
    },
    copy: {
      backgroundColor: color.textPlaceholder,
      paddingVertical: theme.spacing.xxs,
      paddingHorizontal: theme.spacing.xxs,
      borderRadius: theme.spacing.xs,
      opacity:0.3,
    },
  });
export default ContactCard;
