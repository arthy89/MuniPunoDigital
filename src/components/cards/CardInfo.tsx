import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardBase from './CardBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme';

interface CardInfoProps {
  title?: string;
  subtitle?: string;
  iconName: string;
}

const CardInfo = ({title, subtitle, iconName}: CardInfoProps) => {
  const colorTheme = useColorTheme();
  const styles = getStyles();

  return (
    <CardBase containerStyle={{borderRadius:20, flexDirection:'row'}} backgroundColor={colorTheme.white} borderColor={colorTheme.cardBorder}  >
      <View style={styles.containerIcon}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#B39DDB", borderRadius: 20, opacity:0.5 }]} />
        <Icon name={iconName} size={40} color="#B39DDB" />
      </View>
      <View style={styles.col}>
        <Text style={styles.title} >{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </CardBase>
  );
};

const getStyles = () =>
  StyleSheet.create({
    title: { 
      color: '#000', 
      fontWeight: 'bold', 
      fontSize: theme.typography.fontSize.md, 
      marginBottom: theme.spacing.xxs 
    },
    subtitle: { 
      color: '#000', 
      fontSize: theme.typography.fontSize.xs, 
      marginBottom: theme.spacing.sm ,
      paddingRight: theme.spacing.sm
    },
    containerIcon: { 
      alignSelf: 'center', 
      padding: theme.spacing.xxs, 
      borderRadius:"50%"
    },
    col: { 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      marginRight: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
  });

export default CardInfo;
