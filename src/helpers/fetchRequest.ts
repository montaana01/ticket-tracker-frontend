import type { ApiResponseType } from '../types/api.ts';

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

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data: ApiResponseType<T> = await response.json();
  if (!data.data) {
    throw new Error('No data received from server');
  }

  return data.data;
};
