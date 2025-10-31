const basePath = 'https://api.tickets.yakovlevdev.com';

export const fetchRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(basePath + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.error || data.message || `HTTP error ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};
