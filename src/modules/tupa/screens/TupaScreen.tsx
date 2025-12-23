import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import theme from '@/theme/theme';
import InputBase from '@/components/inputs/InputBase';
import { useColorTheme } from '@/hooks/useColorTheme';
import { ColorTheme } from '@/theme/colors';
import { useInfiniteQuery } from '@tanstack/react-query';
import { tupaQueryKey } from '../constants/tupaQueryKey';
import { getTupaProcedureList } from '../use-cases/getTupaProcedureList';
import FlatListInfiniteScroll from '@/components/flatlists/FlatListInfiniteScroll';
import TupaProcedureCard from '../components/TupaProcedureCard';
import { TupaStackParamList } from '../navigation/tupaStack';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';

const CATEGORIES = [
  {
    icon: 'user',
    label: 'Trámites personales',
    color: '#A084E8',
  },
  {
    icon: 'building',
    label: 'Planeamiento urbano',
    color: '#F7A4A4',
  },
  {
    icon: 'wrench',
    label: 'Construcción y licencias',
    color: '#F7D060',
  },
  {
    icon: 'car',
    label: 'Transporte y movilidad',
    color: '#A3D8F4',
  },
  {
    icon: 'ellipsis-h',
    label: 'Otros',
    color: '#B6E2A1',
  },
];

type TupaScreenProps = NativeStackScreenProps<TupaStackParamList, 'TupaHome'>;

const LIMIT = 10;
export default function TupaScreen({ navigation }: TupaScreenProps) {
  const { handleSearch, search } = useDebouncedSearch();

  const colorTheme = useColorTheme();

  const tupaProcedureList = useInfiniteQuery({
    queryKey: [tupaQueryKey, { search }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      getTupaProcedureList({ page: pageParam, limit: LIMIT, search }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === LIMIT ? allPages.length + 1 : undefined,
  });

  const styles = getStyles(colorTheme);
  return (
    <View style={{ ...theme.container, gap: theme.spacing.md }}>
      <InputBase
        placeholder="Buscar por codigo o nombre"
        iconLeft={'search'}
        onChangeValue={handleSearch}
        noBorder
        containerStyle={{ ...theme.shadow }}
      />
      {/**
      <Text style={styles.sectionTitle}>CATEGORÍAS</Text>

      <View style={styles.categories}>
        {CATEGORIES.map(el => (
          <ButtonCategory
            key={el.label}
            color={el.color}
            text={el.label}
            iconLeft={el.icon}
          />
        ))}
      </View>
       */}

      <Text style={styles.sectionTitle}>TRÁMITES</Text>
      <FlatListInfiniteScroll
        data={tupaProcedureList.data?.pages.flat() ?? []}
        keyExtractor={item => item.codigo}
        renderItem={({ item }) => (
          <TupaProcedureCard
            title={item.nombre}
            days={10}
            price={10000}
            favorite={false}
            details={'Ver detalles'}
            free={true}
            onPress={() =>
              navigation.navigate('TupaDetail', { code: item.codigo })
            }
          />
        )}
        hasNextPage={tupaProcedureList.hasNextPage}
        isLoading={tupaProcedureList.isLoading}
        isFetchingNextPage={tupaProcedureList.isFetchingNextPage}
        onEndReached={() => tupaProcedureList.fetchNextPage()}
      />
    </View>
  );
}

const getStyles = (color: ColorTheme) =>
  StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: '#fff',
      borderRadius: 15,
      paddingVertical: 4,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      alignSelf: 'center',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    categories: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize.md,
      color: color.textSecondary,
    },
  });
