import { useColorThemeStore } from '@/store/useColorThemeStore';
import { ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const setTheme = useColorThemeStore(s => s.setColorTheme);

  useEffect(() => {
    if (systemScheme) {
      console.log('asdsystemScheme', systemScheme);
      // setTheme(systemScheme === 'dark' ? 'dark' : 'light');
      setTheme('light');
    }
  }, [systemScheme, setTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
