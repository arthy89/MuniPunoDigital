import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import CardBase from './CardBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '@/theme';
import { toast } from '@/utils/toastUtilities';
import Clipboard from '@react-native-clipboard/clipboard';


const EmergencyCard = () => {
    const [telefono, setTelefono] = useState<string>('(051) 601010');

    const handleCopyContact = () => {
        if (!telefono) {
            toast.info('La dirección de correo no está disponible.');
            return;
        }

        Clipboard.setString(telefono);
        toast.success('El número de teléfono ha sido copiada al portapapeles.');

    };

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

    return (
        <CardBase borderColor="#DC354E40" containerStyle={styles.card}>
            <View style={styles.col}>
                <View style={styles.row}>
                    <Icon name="report" size={24} color={"#F8CAD0"} />
                    <Text style={styles.alert}>Serenazgo</Text>
                </View>
                <Text style={styles.desc}>Línea directa 24/7</Text>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handlePhonePress}>
                <Icon name="phone" size={24} color="#F6CAD0" />
                <Text style={styles.btnText}> (051) 601010</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.copy} onPress={handleCopyContact} >
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', borderRadius: 10, opacity: 0.16 }]} />
                <Icon name="content-copy" size={24} color="#AAA" />
            </TouchableOpacity>
        </CardBase>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.sm,
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    col: { 
        flexDirection: 'column', 
        alignItems: 'center', 
    },
    alert: { 
        marginLeft: theme.spacing.xs, 
        color: '#7F1F2A', 
        fontWeight: 'bold', 
        fontSize: theme.typography.fontSize.md 
    },
    desc: { 
        fontSize: theme.typography.fontSize.xs, 
        marginBottom: theme.spacing.ssx, 
        color: '#C1394B' 
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#DF0000',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xs,
        borderRadius: 10,
    },
    copy: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xs,
        borderRadius: 10,
    },
    btnText: { color: '#fff', fontWeight: 'bold' },
});

export default EmergencyCard;
