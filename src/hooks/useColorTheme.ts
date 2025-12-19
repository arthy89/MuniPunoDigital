import { useColorThemeStore } from '@/store/useColorThemeStore';

export const useColorTheme = () => useColorThemeStore(state => state.colorTheme);
export const useToggleColorTheme = () =>
  useColorThemeStore(state => state.toggleColorTheme);
