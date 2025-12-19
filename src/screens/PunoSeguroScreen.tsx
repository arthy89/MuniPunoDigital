// import CameraComponent from '@/components/punoseguro/CameraComponent'
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const PunoSeguro: React.FC = () => {
  return (
    <View style={styles.screen}>
      {/* <CameraComponent /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
});

export default PunoSeguro;
