import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
interface ContactCardProps {
    name: string; // Nombre del contacto
    phone: string; // Número de teléfono del contacto
    email: string; // Correo electrónico del contacto
}
const ContactCard = ({ name, phone, email }: ContactCardProps) => {
    // Función para abrir el marcador telefónico con el número cargado
    const handlePhonePress = () => {
        if (!phone) {
            Alert.alert('Error', 'El número de teléfono no está disponible.');
            return;
        }

        const phoneUrl = `tel:${phone.replace(/\s+/g, '')}`; // Elimina espacios del número
        Linking.canOpenURL(phoneUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(phoneUrl); // Abre el marcador telefónico con el número
                } else {
                    Alert.alert('Error', 'No se puede abrir el marcador telefónico.');
                }
            })
            .catch((err) => console.error('Error al abrir el marcador:', err));
    };

    // Función para abrir el cliente de correo con la dirección cargada
    const handleEmailPress = () => {
        if (!email) {
            Alert.alert('Error', 'La dirección de correo no está disponible.');
            return;
        }

        const emailUrl = `mailto:${email}`;
        Linking.canOpenURL(emailUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(emailUrl); // Abre el cliente de correo con la dirección
                } else {
                    Alert.alert('Error', 'No se puede abrir el cliente de correo.');
                }
            })
            .catch((err) => console.error('Error al abrir el cliente de correo:', err));
    };

    return (
        <View style={styles.card}>
            {/* Información del contacto */}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.details}>TEL: {phone}</Text>
                <Text style={styles.details}>Correo: {email}</Text>
            </View>

            {/* Íconos de acción */}
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconCircle} onPress={handlePhonePress}>
                    <Icon name="phone" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconCircle, styles.smallIconCircle]}
                    onPress={handleEmailPress}
                >
                    <Icon name="envelope" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0088CC',
        alignItems: 'center',
        justifyContent: 'center',
        //marginBottom: 8, // Espaciado entre los íconos
    },
    smallIconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#0088CC',
    },
});

export default ContactCard;