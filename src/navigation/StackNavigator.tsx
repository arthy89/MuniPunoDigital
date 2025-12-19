import PunoSeguro from '../screens/PunoSeguroScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MicroPuno from '../modules/micro-puno/screens/MicroPunoScreen';
import AlumbradoPublico from '../screens/AlumbradoPublico';
import Description from '../components/tupa/Description';
import DescubrePunoScreen from '@/screens/DescubrePunoScreen';
import HomeScreen from '@home/screens/HomeScreen';
import SolidWasteScreen from '@solid-waste/screens/SolidWasteScreen';
import { MediaCamera } from '@/interfaces/CameraTypes';
import { MediaType } from 'react-native-image-picker';
import TupaStack from '@tupa/navigation/TupaStack';
import EvidanceCaptureScreen from '@evidence-capture/screens/EvidenceCaptureScreen';
import PhoneDirectoryScreen from '@phone-directory/screens/PhoneDirectoryScreen';
import MenuScreen from '@/screens/MenuScreen';
import DescubrePuno from '@/screens/DescubrePunoScreen';
import ChatBotScreen from '@/modules/chatbot/screens/ChatBotScreen';
import React from 'react';
import { TextInput } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  SolidWaste: undefined;
  PublicLighting: undefined;
  PunoSafe: undefined;
  Tupa: undefined;
  TelephoneDirectory: undefined;
  Description: { code: string };
  DiscoverPuno: undefined;
  MicroPuno: undefined;
  Menu: undefined;
  DescubrePuno: { title: string };
  EvidanceCaptureCamera: {
    mediaUris: MediaCamera[];
    onSaveMedia: (mediaUris: MediaCamera[]) => void;
    mediaType: MediaType;
    maxMediaLength: number;
  };
  ChatBot: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SolidWaste"
        component={SolidWasteScreen}
        options={{ headerTitle: 'Residuos Sólidos' }}
      />
      <Stack.Screen
        name="EvidanceCaptureCamera"
        component={EvidanceCaptureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PublicLighting" component={AlumbradoPublico} />
      <Stack.Screen name="PunoSafe" component={PunoSeguro} />
      {/* <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Tupa"
        component={TupaStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Description" component={Description} />
      <Stack.Screen
        name="TelephoneDirectory"
        options={{ headerTitle: 'Directorio Telefónico' }}
        component={PhoneDirectoryScreen}
      />

      {/* //! CHAPA TU MICRO! STACK SCREEN */}
      {/* <Stack.Screen
        name="MicroPuno"
        options={{ headerShown:false }}
        component={MicroPuno}
      /> */}

      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DescubrePuno" component={DescubrePuno} />
      <Stack.Screen name="ChatBot" component={ChatBotScreen} options={{ headerTitle: 'ChatBot',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',          
        },
        headerTintColor: '#0088cc',
        headerTitleStyle: {
          color: '#0088cc',
        },
        statusBarStyle:'dark',
      }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
