import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
interface MenuLinkProps {
    title: string;
    iconName: string;
    onPress: () => void;
}

const MenuLink = ({ title, iconName, onPress }: MenuLinkProps) => {
    return (
        <TouchableOpacity style={styles.link} onPress={onPress}>
            <Icon name={iconName} size={18} color="#333" style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        left: 5,
    },
    icon: {
        marginRight: 12,
    },
    title: {
        fontSize: 14,
        color: '#333',
    },
});

export default MenuLink;