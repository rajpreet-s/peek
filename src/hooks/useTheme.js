/*global chrome*/
import { useState, useEffect, useCallback } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  const applyTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    chrome.storage.local.set({ theme: newTheme });
  }, []);

  useEffect(() => {
    const initializeTheme = async () => {
      const data = await chrome.storage.local.get('theme');
      const savedTheme = data?.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyTheme(savedTheme);
    };
    initializeTheme();
  }, [applyTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  return { theme, toggleTheme };
};