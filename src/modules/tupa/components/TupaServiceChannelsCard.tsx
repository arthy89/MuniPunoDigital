import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme';
import { ColorTheme } from '@/theme/colors';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TupaServiceChannelsCardProps {
  title: string;
  info: string;
  icon: string;
}
const TupaServiceChannelsCard = ({
  icon,
  info,
  title,
}: TupaServiceChannelsCardProps) => {
  const colorTheme = useColorTheme();
  const styles = getStyle(colorTheme);
  return (
    <View style={styles.channelBox}>
      <Icon name={icon} size={18} color={colorTheme.primary} />
      <Text style={styles.channelTitle}>{title}</Text>
      <Text style={styles.channelInfo}>{info}</Text>
    </View>
  );
};

const getStyle = (color: ColorTheme) =>
  StyleSheet.create({
    channelBox: {
      flex: 1,
      // backgroundColor: '#eaf3fb',
      backgroundColor: color.primaryLight,
      borderRadius: 8,
      padding: theme.spacing.xs,
      alignItems: 'center',
      gap: theme.spacing.xxxs,
    },
    channelTitle: {
      color: color.textPrimary,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    channelInfo: {
      color: color.textPrimary,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
    },
  });

export default TupaServiceChannelsCard;
