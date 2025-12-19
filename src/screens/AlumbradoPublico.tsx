import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import ComingSoon from "@/components/ViewBuildApp";
const AlumbradoPublico: React.FC = () => {

  return (
    <View style={styles.screen}>
      <ComingSoon />
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

export default AlumbradoPublico;
