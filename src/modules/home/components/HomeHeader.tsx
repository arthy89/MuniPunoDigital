// import InputBase from '@/components/inputs/InputBase';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import { View, Text, StyleSheet, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

interface HeaderProps {
  onMenuPress: () => void;
  onSearch: (text: string) => void;
}
const HomeHeader = ({ onMenuPress, onSearch }: HeaderProps) => {
  const colorTheme = useColorTheme();

  return (
    <View style={[styles.header, { backgroundColor: colorTheme.surface }]}>
      <View style={styles.topRow}>
        <Text style={[styles.headerTitle, { color: colorTheme.white }]}>
          Inicio
        </Text>
        <Image
          source={require('@/assets/images/munipuno.png')}
          style={styles.muniIcon}
        />
      </View>
      {/* <InputBase
        placeholder="Buscar"
        iconLeft={'search'}
        noBorder
        onChangeText={onSearch}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: theme.spacing.xxl,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: 'bold',
  },
  muniIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 0,
  },
});

export default HomeHeader;
