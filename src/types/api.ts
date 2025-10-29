export type ApiResponseType<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
