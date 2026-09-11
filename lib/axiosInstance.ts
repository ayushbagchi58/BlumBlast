import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { clearAuthData, getAccessToken } from './auth';

// Normalized error shape returned to all callers
export interface ApiError {
  status: number | null;
  message: string;
  errors?: Record<string, string[]>; // validation field errors
  raw: AxiosError;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attaches Bearer token from localStorage on every outgoing request.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const normalized = normalizeError(error);

    switch (normalized.status) {
      case 401:
        // Unauthenticated — clear session and send to login
        if (typeof window !== 'undefined') {
          clearAuthData();
          window.location.href = '/login';
        }
        break;

      case 403:
        // Forbidden — user lacks permission, surface the message
        console.warn('[API] 403 Forbidden:', normalized.message);
        break;

      case 404:
        console.warn('[API] 404 Not Found:', normalized.message);
        break;

      case 422:
        // Validation errors — field-level details kept in normalized.errors
        console.warn('[API] 422 Unprocessable Entity:', normalized.errors);
        break;

      case 429:
        console.warn('[API] 429 Too Many Requests — rate limited.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        console.error('[API] Server error:', normalized.status, normalized.message);
        break;

      case null:
        // Network error or request cancelled (no response received)
        if (axios.isCancel(error)) {
          console.warn('[API] Request cancelled:', error.message);
        } else {
          console.error('[API] Network error — no response received.');
        }
        break;

      default:
        console.error('[API] Unexpected error:', normalized.status, normalized.message);
    }

    return Promise.reject(normalized);
  }
);

// Converts any AxiosError into a predictable ApiError shape.
function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown> | undefined;

    const message =
      (data?.message as string) ||
      (data?.error as string) ||
      error.message ||
      'An unexpected error occurred.';

    const errors =
      (data?.errors as Record<string, string[]>) ?? undefined;

    return {
      status: error.response.status,
      message,
      errors,
      raw: error,
    };
  }

  // Request was made but no response (timeout, network down, CORS, etc.)
  return {
    status: null,
    message: error.message || 'Network error. Please check your connection.',
    raw: error,
  };
}

export default axiosInstance;
