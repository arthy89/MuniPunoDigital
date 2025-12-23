import { View, StyleSheet, Text, TouchableOpacity, PanResponder, Animated, Dimensions, ScrollView} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/StackNavigator';
import HomeHeader from '../components/HomeHeader';
import HomeIcon from '../components/HomeIcon';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import WelcomeCard from '@/components/cards/CardWelcome';
import EmergencyCard from '@/components/cards/CardEmergency';
import { useRef } from 'react';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const cards: {
  id: string;
  title: string;
  iconName?: string;
  iconSource?: any;
  screen: keyof Omit<
    RootStackParamList,
    'EvidanceCaptureCamera' | 'Description'
  >;
}[] = [
    {
      id: '1',
      title: 'Residuos sólidos',
      iconName: 'trash',
      iconSource: require('@/assets/icons/tacho_verde.png'),
      screen: 'SolidWaste',
    },
    {
      id: '2',
      title: 'TUPA',
      iconName: 'file',
      iconSource: require('@/assets/icons/documento.png'),
      screen: 'Tupa',
    },
    {
      id: '3',
      title: 'Directorio telefónico',
      iconName: 'phone',
      iconSource: require('@/assets/icons/telefono.png'),
      screen: 'TelephoneDirectory',
    },
    /*
    {
      id: '4',
      title: 'Seguridad',
      iconName: 'shield', //iconSource: require('../assets/icons/proteger.png'),
      screen: 'DescubrePuno',
    },*/
    {
      id: '6',
      title: 'Chapa tu micro',
      iconName: 'bus',
      iconSource: require('@/assets/icons/micro.png'),
      screen: 'MicroPuno',
    },
    // {
    //   id: '5',
    //   title: 'Puno seguro',
    //   iconName: 'shield', // iconSource: require('../assets/icons/policia.png'),
    //   screen: 'DescubrePuno',
    // },
    // {
    //   id: '7',
    //   title: 'Descubre puno',
    //   iconName: 'map', //iconSource: require('../assets/icons/viajar.png'),
    //   screen: 'DescubrePuno',
    // },
    /*
    {
      id: '8',
      title: 'Alumbrado público',
      iconName: 'lightbulb-o', //iconSource: require('../assets/icons/alumbrado.png'),
      screen: 'DescubrePuno',
    },
    {
      id: '9',
      title: 'Incendio',
      iconName: 'fire-extinguisher', //iconSource: require('../assets/icons/bombero.png'),
      screen: 'DescubrePuno',
    },*/
    // { id: '10', title: 'Ver todo', iconName: 'plus', screen: 'DescubrePuno' },
  ];

const backgroundColors = [
  '#4FBA6F',
  '#4086F4',
  '#0073AC',
  '#149CEF',
  '#FFB655'
];

const { width, height } = Dimensions.get('window');
const BUBBLE_SIZE = 60;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const colorsTheme = useColorTheme();

  const pan = useRef(new Animated.ValueXY({
    x: width - BUBBLE_SIZE - 20,
    y: height - BUBBLE_SIZE - 150,
    // y: height * 0.6, // Posición inicial más arriba usando porcentaje
  })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.extractOffset();
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        const toX = gestureState.moveX < width / 2
          ? 20
          : width - BUBBLE_SIZE - 20;

        const toY = Math.min(
          Math.max(gestureState.moveY - BUBBLE_SIZE / 2, 20),
          height - BUBBLE_SIZE - 80
          // safasdad
        );

        Animated.spring(pan, {
          toValue: { x: toX, y: toY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;


  return (
    <View style={styles.container}>

      {/* //! Header  */}
      <HomeHeader
        onMenuPress={() => navigation.navigate('Menu')}
        onSearch={() => console.log('hola')}
      />
      <View
        style={[
          { flex: 1 },
          {
            backgroundColor: colorsTheme.background,
          },
        ]}
      >
        <ScrollView>

          {/* //! Card de Bienvenida */}
          <WelcomeCard />

          {/* //! Separador "Servicios Rapidos" */}
          <View style={{ width: '90%', alignSelf: 'center', marginVertical: theme.spacing.md }}>
            <Text style={styles.subTitle}>Servicios rápidos</Text>
          </View>

          {/* //todo: ICONOS (6) */}
          <View
            style={[
              styles.cardsContainer,
              {
                backgroundColor: colorsTheme.background,
              },
            ]}
          >
            {cards.map((card, i) => (
              <HomeIcon
                key={card.id}
                title={card.title}
                iconName={card.iconName}
                iconSource={card.iconSource}
                backgroundColor={backgroundColors[i]}
                onPress={() => {
                  if (card.screen === 'DescubrePuno') {
                    navigation.navigate(card.screen, { title: card.title });
                  } else {
                    navigation.navigate(card.screen);
                  }
                }}
              />
            ))}
          </View>
          
        </ScrollView>
      </View>

      {/* //! Card de Emergencia */}
      <EmergencyCard />

      {/* //! Botón flotante de chat */}
      {/* <Animated.View
        style={[styles.fab, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ChatBot')}
          style={styles.fabInnerTouchable}
        >
          <View style={styles.fabInner}>
            <Icon name="comments" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    gap: theme.spacing.sm,
    // borderColor: '#000',
    // borderWidth: 1,
  },
  subTitle: {
    fontSize: theme.subtitle.fontSize,
    fontFamily: theme.subtitle.fontFamily,
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    zIndex: 100,
    elevation: 8,
    width: 70, // Asegura un área sensible amplia
    height: 70,
  },
  fabInnerTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabInner: {
    backgroundColor: '#0088cc',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;