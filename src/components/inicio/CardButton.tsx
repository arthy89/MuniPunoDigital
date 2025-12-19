import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet,Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome
interface CardButtonProps {
    title: string; // Título del botón
    iconName?: string; // Nombre del ícono
    iconSource?: ImageSourcePropType; // Fuente del ícono
    onPress: () => void; // Función para manejar la presión del botón   
}

const CardButton = ({ title, iconName, iconSource, onPress }:CardButtonProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                {iconSource ? (
                    <Image source={iconSource} style={styles.iconImage} />
                ) : (
                    <Icon name={iconName || 'question'} size={40} color="#d3d3d3" style={styles.cardIcon} /> 
                )}
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '22%', // Ajuste para que quepan 4 elementos por fila
        aspectRatio: 1, // Mantiene el botón cuadrado
        alignItems: 'center', // Centra horizontalmente
        justifyContent: 'space-between', // Distribuye ícono y texto uniformemente
        marginBottom: 16,
    },
    iconImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    iconContainer: {
        width: 66,
        height: 66,
        backgroundColor: '#fff',
        borderRadius: 23,
        alignItems: 'center', // Centra el ícono horizontalmente
        justifyContent: 'center', // Centra el ícono verticalmente
        marginBottom: 8, // Espaciado entre el ícono y el texto
        elevation: 2,
    },
    cardIcon: {
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

export default CardButton;