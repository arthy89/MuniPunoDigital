import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';
import {
  FlatList,
  FlatListProps,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface FlatListInfiniteScrollProps<T> extends FlatListProps<T> {
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

const  

FlatListInfiniteScroll = <T,>({
  data,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  onEndReached,
  style,
  contentContainerStyle,
  onEndReachedThreshold,
  ...props
}: FlatListInfiniteScrollProps<T>) => {
  const themeColor = useColorTheme();
  return (
    <FlatList
      {...props}
      data={data}
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      onEndReachedThreshold={onEndReachedThreshold || 0.6}
      ListFooterComponent={
        hasNextPage ? (
          <ActivityIndicator size="small" color={themeColor.primary} />
        ) : !hasNextPage && data && data.length ? (
          <Text style={styles.centerText}>No hay más elementos</Text>
        ) : null
      }
      onEndReached={value => {
        if (hasNextPage && !isFetchingNextPage) {
          onEndReached?.(value);
        }
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={themeColor.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <Text
              style={[styles.centerText, { color: themeColor.textSecondary }]}>
              No se encontraron resultados
            </Text>
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    margin: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  centerText: {
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FlatListInfiniteScroll;
