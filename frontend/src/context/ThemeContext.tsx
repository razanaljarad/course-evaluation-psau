import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    bg: string;
    surface: string;
    navbar: string;
    navbarGradient: string;
    text: string;
    textMuted: string;
    border: string;
    card: string;
    input: string;
    accent: string;
    accentLight: string;
    success: string;
    warning: string;
    danger: string;
  };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  const colors = isDark ? {
    bg: '#0d1b1e',
    surface: '#132228',
    navbar: '#0d1b1e',
    navbarGradient: 'linear-gradient(135deg, #0d1b1e 0%, #1a3d35 100%)',
    text: '#e8f5f2',
    textMuted: '#7db5ab',
    border: '#1e3a33',
    card: '#132228',
    input: '#0d1b1e',
    accent: '#2d7a6b',
    accentLight: '#1a3d35',
    success: '#065f46',
    warning: '#78350f',
    danger: '#7f1d1d',
  } : {
    bg: '#f0f7f5',
    surface: '#e8f5f2',
    navbar: '#1a4d43',
    navbarGradient: 'linear-gradient(135deg, #1a4d43 0%, #2d7a6b 100%)',
    text: '#0f2922',
    textMuted: '#4a7c72',
    border: '#c5e0db',
    card: '#ffffff',
    input: '#ffffff',
    accent: '#2d7a6b',
    accentLight: '#e8f5f2',
    success: '#d1fae5',
    warning: '#fef9c3',
    danger: '#fee2e2',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
