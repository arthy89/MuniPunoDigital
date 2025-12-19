import React from 'react';
// import useMainTheme from '../hooks/useMainTheme';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { useColorTheme } from '@/hooks/useColorTheme';
import { useColorThemeStore } from '@/store/useColorThemeStore';

const MainNavigator = () => {
  const isDark = useColorThemeStore(state => state.mode === 'dark');
  const colors = useColorTheme();
  const MyTheme: ReactNavigation.Theme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      primary: colors.primary,
      text: colors.white,
      card: colors.surface,
      border: colors.border,
    },
  };
  return (
    <NavigationContainer theme={MyTheme}>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default MainNavigator;
