import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
interface MenuButtonProps {
    title: string;  // Título del botón
    iconName: string;  // Nombre del ícono de FontAwesome
    onPress: () => void;  // Función a ejecutar al presionar el botón
}

const MenuButton = ({ title, iconName, onPress }: MenuButtonProps) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon name={iconName} size={20} color="#0088CC" />
            </View>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0088CC', // Fondo azul para los botones
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        width: '90%',
        //shadowColor: '#000',
        //shadowOpacity: 0.1,
        //shadowRadius: 4,
        //elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#fff', // Fondo blanco para el ícono
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // Texto blanco
    },
});

export default MenuButton;