export const getTheme = (storage_key: string): string => {
  const savedTheme = localStorage.getItem(storage_key);
  if (savedTheme) {
    return savedTheme;
  }

  const systemPrefersLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches;
  return systemPrefersLight ? 'light' : 'dark';
};
