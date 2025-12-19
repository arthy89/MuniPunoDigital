import { useColorTheme } from '@/hooks/useColorTheme';
import { ColorTheme } from '@/theme/colors';
import theme from '@/theme/theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TupaProcedureCardProps {
  title: any;
  days: number;
  price: number;
  favorite?: boolean;
  details?: string;
  free?: boolean;
  onPress?: () => void;
}

const TupaProcedureCard: React.FC<TupaProcedureCardProps> = ({
  title,
  days,
  price,
  favorite,
  details,
  free,
  onPress,
}) => {
  const colorTheme = useColorTheme();
  const styles = getStyle(colorTheme);
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.iconBox}>
        <Icon name="file-text-o" size={20} color={colorTheme.primary} />
      </View>
      <View style={styles.info}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {title.length > 50 ? title.slice(0, 50) + '...' : title || 'Procedimiento'}
          </Text>
          {favorite && <Icon name="star" size={18} color={colorTheme.yellow} />}
        </View>
        <View style={styles.meta}>
          {/*<Text style={styles.metaText}>{days} días</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={[styles.metaText, free && styles.free]}>
            {free ? 'Gratis' : `S/ ${price.toFixed(2)}`}
          </Text>
           */}
        </View>
        <Text style={styles.details}>{details}</Text>
      </View>
      <View style={styles.arrowRight}>
        <Icon
          name="chevron-right"
          size={20}
          color={colorTheme.textPlaceholder}
        />
      </View>
    </TouchableOpacity>
  );
};

const getStyle = (color: ColorTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: color.card,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.xs,
      ...theme.shadow,
    },
    iconBox: {
      backgroundColor: color.primaryLight,
      borderRadius: 8,
      padding: theme.spacing.xs,
      marginRight: theme.spacing.xs,
    },
    titleContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: theme.spacing.xxs,
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      flexShrink: 1,
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize.sm,
      color: color.textPrimary,
    },

    meta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      color: color.textSecondary,
      fontSize: theme.typography.fontSize.xs,
      marginRight: theme.spacing.xxs,
    },
    free: {
      color: color.primary,
      fontWeight: 'bold',
    },
    details: {
      color: color.primary,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: 'bold',
      alignSelf: 'flex-end',
    },
    arrowRight: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default TupaProcedureCard;
