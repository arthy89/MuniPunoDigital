import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme';
import {
  View,
  Text,
  ImageSourcePropType,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HomeIconProps {
  title: string;
  iconName?: string;
  iconSource?: ImageSourcePropType;
  onPress: () => void;
  backgroundColor?: string;
}
const HomeIcon = ({
  onPress,
  title,
  iconName = 'question',
  iconSource,
  backgroundColor,
}: HomeIconProps) => {
  const colorsTheme = useColorTheme();
  return (
    <TouchableOpacity style={[styles.iconContainer, { backgroundColor: colorsTheme.white }]} onPress={onPress}>
      <View
        style={[styles.image]}
      >
         <View style={[StyleSheet.absoluteFill, { backgroundColor: `${backgroundColor}` || 'transparent', borderRadius: 20, opacity:0.18 }]} />
        {iconSource ? (
          <Image source={iconSource} style={styles.iconImage} />
        ) : (
          <Icon
            name={iconName}
            size={40}
            color={colorsTheme.textPlaceholder}
            style={styles.cardIcon}
          />
        )}
      </View>
      <Text style={[styles.cardTitle, { color: colorsTheme.black }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: '20%',
    alignItems: 'center',
    //gap: theme.spacing.xs,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
   // opacity: 0.5,
    position: 'relative'
  },
  iconImage: {
    position: 'absolute',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 100,
    height: 140,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    gap: theme.spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  cardIcon: {
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
});
export default HomeIcon;
