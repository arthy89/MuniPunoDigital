import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PunoSeguro from '../screens/PunoSeguroScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="PunoSeguro" component={PunoSeguro} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
