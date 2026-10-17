import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { themes } from '../constants/theme';

const ThemeContext = createContext(null);

/**
 * Guarda o modo claro ou escuro e entrega as cores de theme.js.
 */
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState(systemScheme === 'dark' ? 'dark' : 'light');

  /**
   * Alterna entre os temas light e dark.
   */
  function toggleTheme() {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  const value = {
    mode,
    colors: themes[mode],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Atalho para ler o tema e alternar o modo.
 */
export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Faltou o ThemeProvider');
  }
  return context;
}
