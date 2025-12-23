import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '../components/Map';

interface Props {
    navigation: any;
}
const MicroPunoScreen = ({ navigation }: Props) => {

    return (
        <View style={styles.container}>
            <Map  />
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default MicroPunoScreen;
