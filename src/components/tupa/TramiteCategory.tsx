import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TramiteCategoryProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const TramiteCategory: React.FC<TramiteCategoryProps> = ({ icon, label, color }) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: color }]}>
        <View style={styles.iconBox}>{icon}</View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 60,
    marginHorizontal: 2,
  },
  container: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#222',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 15,
  },
});

export default TramiteCategory;