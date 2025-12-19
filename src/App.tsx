import 'react-native-reanimated';
import { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importar este componente
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeProvider from '@/providers/ThemeProvider';
import MainNavigator from '@/navigation/MainNavigator';
import GlobalLoader from './components/loaders/GlobalLoader';
import Toast from 'react-native-toast-message';
import toastConfig from './utils/toastConfig';
import QueryClientProvider from './providers/QueryClientProvider';
import AppWrapper from './AppWrapper';
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0); // Animación de opacidad

  useEffect(() => {
    // Iniciar la animación de opacidad
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Simular un tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Image
            style={{ width: 100, height: 120, marginBottom: 20 }}
            source={require('@/assets/images/munipuno.png')}></Image>
          <Text style={styles.logoText}>MuniPuno Digital</Text>
          <ActivityIndicator size="large" color="#ffffff" />
        </Animated.View>
      </View>
    );
  }

  // Renderiza la navegación principal después de la carga
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider>
            <AppWrapper>
              <MainNavigator />
              <GlobalLoader />
              <Toast position="top" config={toastConfig} />
            </AppWrapper>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0088cc',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
});

export default App;
