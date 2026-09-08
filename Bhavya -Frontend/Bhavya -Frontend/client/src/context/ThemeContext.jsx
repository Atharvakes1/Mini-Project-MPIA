import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = {
  'cyber-dark': {
    name: 'Cyber Dark',
    accent: '#a855f7',
    accentName: 'purple',
    bg: '#09090b',
  },
  'neon-cyan': {
    name: 'Neon Cyan',
    accent: '#06b6d4',
    accentName: 'cyan',
    bg: '#0a0a0f',
  },
  'midnight-oled': {
    name: 'Midnight OLED',
    accent: '#10b981',
    accentName: 'emerald',
    bg: '#000000',
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('campusvibe_theme') || 'cyber-dark';
  });

  useEffect(() => {
    localStorage.setItem('campusvibe_theme', currentTheme);
    document.documentElement.classList.add('dark');

    // Apply theme-specific CSS custom properties
    const theme = themes[currentTheme];
    if (theme) {
      document.documentElement.style.setProperty('--accent-color', theme.accent);
      document.documentElement.style.setProperty('--bg-color', theme.bg);
    }
  }, [currentTheme]);

  const switchTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themeKey);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: themes[currentTheme],
        themes,
        switchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
