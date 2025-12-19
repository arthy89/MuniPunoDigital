import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TupaScreen from '../screens/TupaScreen';
import TupaDetailScreen from '../screens/TupaDetailScreen';

export type TupaStackParamList = {
  TupaHome: undefined;
  TupaDetail: { code: string };
};

const Stack = createNativeStackNavigator<TupaStackParamList>();

const TupaStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TupaHome"
        component={TupaScreen}
        options={{ title: 'TUPA' }}
      />
      <Stack.Screen name="TupaDetail" component={TupaDetailScreen} />
    </Stack.Navigator>
  );
};

export default TupaStack;
