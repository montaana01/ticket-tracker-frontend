const basePath = 'https://api.tickets.yakovlevdev.com';

export const fetchRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(basePath + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
};
