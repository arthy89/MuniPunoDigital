import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardBase from './CardBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '@/theme';
import { useColorTheme } from '@/hooks/useColorTheme';

const WelcomeCard = () => {
  const colorTheme = useColorTheme();
  const styles = getStyles();

  return (
    <CardBase backgroundColor={colorTheme.surface} containerStyle={styles.card}>
      <Text style={styles.title}>¡Bienvenido, Vecin@!</Text>
      <Text style={styles.subtitle}>Gestiona todos tus trámites municipales desde aquí</Text>

      <View style={styles.row}>
        <Icon name="place" size={18} color="#fff" />
        <Text style={styles.info}> Jr. Deustua N° 458, Cercado/Puno</Text>
      </View>

      <View style={styles.row}>
        <Icon name="phone" size={18} color="#fff" />
        <Text style={styles.info}> (051) 601000</Text>
      </View>
    </CardBase>
  );
};

const getStyles = () =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.xxs,
      paddingVertical: theme.spacing.md,
    },
    title: { 
      color: '#fff', 
      fontWeight: 'bold', 
      fontSize: theme.typography.fontSize.lg, 
      marginBottom: theme.spacing.xxs 
    },
    subtitle: { 
      color: '#fff', 
      fontSize: theme.typography.fontSize.md, 
      marginBottom: theme.spacing.xxs 
    },
    row: { 
      flexDirection: 'row', 
      alignItems: 'center',
      marginBottom: theme.spacing.ssx
    },
    info: { 
      color: '#fff', 
      marginLeft: theme.spacing.xxs 
    },
  });

export default WelcomeCard;
