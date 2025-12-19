import { ColorTheme, darkColors, lightColors } from '@/theme/colors';
import { create } from 'zustand';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  mode: ThemeType;
  colorTheme: ColorTheme;
  toggleColorTheme: () => void;
  setColorTheme: (mode: ThemeType) => void;
}

export const useColorThemeStore = create<ThemeState>(set => ({
  mode: 'light',
  colorTheme: lightColors,
  toggleColorTheme: () =>
    set(state => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      return {
        mode: newMode,
        colorTheme: newMode === 'light' ? lightColors : darkColors,
      };
    }),
  setColorTheme: mode =>
    set(() => ({
      mode,
      colorTheme: mode === 'light' ? lightColors : darkColors,
    })),
}));
