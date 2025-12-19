import { View } from 'react-native';
import React from 'react';
import theme from '@/theme/theme';
import InputBase from '@/components/inputs/InputBase';
import ContactCard from '../components/ContactCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPhoneList } from '../use-cases/getPhoneList';
import FlatListInfiniteScroll from '@/components/flatlists/FlatListInfiniteScroll';
import { PhoneDirectoryQueryKey } from '../constants/contactData';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
const LIMIT = 10;

const PhoneDirectoryScreen = () => {
  const { handleSearch, search } = useDebouncedSearch();
  const tupaProcedureList = useInfiniteQuery({
    queryKey: [PhoneDirectoryQueryKey, { search }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      getPhoneList({ page: pageParam, limit: LIMIT, search }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === LIMIT ? allPages.length + 1 : undefined,
  });

  return (
    <View style={{ ...theme.container, gap: theme.spacing.md }}>
      <InputBase
        noBorder
        iconLeft={'search'}
        placeholder="Buscar"
        shadow
        onChangeValue={handleSearch}
      />
      <FlatListInfiniteScroll
        data={tupaProcedureList.data?.pages.flat() ?? []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ContactCard contact={item} />}
        contentContainerStyle={{
          gap: theme.spacing.sm,
        }}
        hasNextPage={tupaProcedureList.hasNextPage}
        isLoading={tupaProcedureList.isLoading}
        isFetchingNextPage={tupaProcedureList.isFetchingNextPage}
        onEndReached={() => tupaProcedureList.fetchNextPage()}
      />
    </View>
  );
};

export default PhoneDirectoryScreen;
