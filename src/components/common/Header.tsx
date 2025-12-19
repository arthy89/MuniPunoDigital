import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
interface HeaderProps {
    title: string; // Título del encabezado
    onBackPress: () => void; // Función para manejar la presión del botón de retroceso
}
const Header = ({ title, onBackPress }:HeaderProps) => {
    return (
        <View style={styles.header}>
            {/* Botón de retroceso */}
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Título */}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0088CC',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16, // Espaciado para evitar la barra de notificaciones
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16, // Alineación con el espaciado superior
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Header;