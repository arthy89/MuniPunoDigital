import { useColorTheme } from '@/hooks/useColorTheme';
import { useLoaderStore } from '@/store/useLoaderStore';
import { use } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

const GlobalLoader = () => {
  const isLoading = useLoaderStore(state => state.isLoading);
  if (!isLoading) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      {/* <ActivityIndicator size="large" color={colorTheme.primary} /> */}
      <Image
        source={require('@/assets/svg/loading.gif')}
        style={{
          width: '40%',
          height: 100,
          borderRadius: 15,
          marginBottom: 16,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default GlobalLoader;
