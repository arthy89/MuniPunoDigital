import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';

export default function Navigation() {
    return (
        <NavigationContainer>
            {/* Add your navigators here */}
            <DrawerNavigator/>
        </NavigationContainer>
    );
}