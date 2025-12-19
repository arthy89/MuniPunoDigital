import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TramiteProps {
  title: any;
  days: number;
  price: number;
  favorite?: boolean;
  details?: string;
  free?: boolean;
  onPress?: () => void;
}

const Tramite: React.FC<TramiteProps> = ({
  title,
  days,
  price,
  favorite,
  details,
  free,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconBox}>
        <Icon name="file-text-o" size={20} color="#5B8BF7" />
      </View>
      <View style={styles.info}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
                {favorite && (
            <Icon name="star" size={18} color="#f5d400" style={{ marginBottom: 8 }} />
        )}
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{days} días</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={[styles.metaText, free ? styles.free : {}]}>
            {free ? 'Gratis' : `S/ ${price.toFixed(2)}`}
          </Text>
        </View>
          <Text style={styles.details}>{details}</Text>
      </View>
      <View style={styles.right}>
        <Icon name="chevron-right" size={20} color="#B0B0B0" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    backgroundColor: '#E8EEFB',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  titleContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around', 
    gap: 15,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    color: '#8A8A8A',
    fontSize: 13,
    marginRight: 5,
  },
  free: {
    color: '#5B8BF7',
    fontWeight: 'bold',
  },
  details: {
    color: '#5B8BF7',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
});

export default Tramite;