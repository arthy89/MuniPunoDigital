import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Game from '../components/game/Game';
import ComingSoon from '@/components/ViewBuildApp';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/StackNavigator';

type DescubrePunoProps = NativeStackScreenProps<
  RootStackParamList,
  'DescubrePuno'
>;

const DescubrePuno = ({ navigation, route }: DescubrePunoProps) => {
  const { title } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ComingSoon />
      <Game />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
});

export default DescubrePuno;
