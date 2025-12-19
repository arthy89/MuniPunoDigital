import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardBase from '@/components/cards/CardBase';
import { useColorTheme } from '@/hooks/useColorTheme';
import { ColorTheme } from '@/theme/colors';
import theme from '@/theme/theme';

interface AlertBoxProps {
  title: string;
  items: string[];
  iconName?: string;
  color?: string; // Color del ícono y texto principal
  backgroundColor?: string;
}

const CardAlert: React.FC<AlertBoxProps> = ({
  title,
  items,
  iconName = 'exclamation-triangle',
  color = '#7A5200',
  backgroundColor = '#FFFDEB',
}) => {
  const theme = useColorTheme();
  const styles = getStyles(theme, color);

  return (
    <CardBase
      backgroundColor={backgroundColor}
      borderColor={color}
      containerStyle={{ width: '100%', marginVertical: 0 }}
    >
      <View style={styles.header}>
        <Icon name={iconName} size={16} color={color} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.list}>
        {items.map((item, idx) => (
          <Text key={idx} style={styles.item}>
            • {item}
          </Text>
        ))}
      </View>
    </CardBase>
  );
};

export default CardAlert;

const getStyles = (colors: ColorTheme, color: string) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xxs,
    },
    icon: {
      marginRight: theme.spacing.xxs,
    },
    title: {
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize.sm,
      color,
    },
    list: {
      gap: theme.spacing.xxs,
    },
    item: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.fontSize.lg,
      color,
    },
  });
