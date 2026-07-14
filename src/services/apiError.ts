import axios from 'axios';

export interface SafeApiError {
  code: string;
  message: string;
  status: number;
  retryable: boolean;
}

const statusMessages: Record<number, string> = {
  400: 'Some submitted information is invalid. Please review it and try again.',
  401: 'Session expired. Please login again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested record could not be found.',
  409: 'This request conflicts with a recent change. Refresh and try again.',
  429: 'Too many requests were made. Please wait a moment and try again.',
  500: 'Pot Black services are temporarily unavailable. Please try again shortly.',
};

const unsafeMessagePattern = /(axios|node_modules|stack|validationerror|casterror|mongoserver|econn|\bat\s+\S+\s*\(|error:\s)/i;

const safeCode = (value: unknown, fallback: string) => typeof value === 'string' && /^[A-Z][A-Z0-9_]{1,79}$/.test(value) ? value : fallback;

const safeServerMessage = (value: unknown, status: number) => {
  if (status >= 500 || typeof value !== 'string') return undefined;
  const message = value.trim();
  if (!message || message.length > 240 || unsafeMessagePattern.test(message)) return undefined;
  return message;
};

export const isSafeApiError = (error: unknown): error is SafeApiError => Boolean(
  error && typeof error === 'object' &&
  typeof (error as SafeApiError).code === 'string' &&
  typeof (error as SafeApiError).message === 'string' &&
  typeof (error as SafeApiError).status === 'number' &&
  typeof (error as SafeApiError).retryable === 'boolean',
);

export const normalizeApiError = (error: unknown): SafeApiError => {
  if (isSafeApiError(error)) return error;

  if (!axios.isAxiosError(error)) {
    return { code: 'UNEXPECTED_ERROR', message: 'Something went wrong. Please try again.', status: 0, retryable: true };
  }

  if (error.code === 'ERR_CANCELED') {
    return { code: 'REQUEST_CANCELLED', message: 'Request cancelled.', status: 0, retryable: false };
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return { code: 'REQUEST_TIMEOUT', message: 'The request took too long. Please try again.', status: 0, retryable: true };
  }

  if (!error.response) {
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return offline
      ? { code: 'NETWORK_OFFLINE', message: 'You appear to be offline. Check your internet connection and try again.', status: 0, retryable: true }
      : { code: 'BACKEND_UNAVAILABLE', message: 'The Pot Black service cannot be reached right now. Please try again shortly.', status: 0, retryable: true };
  }

  const status = error.response.status;
  const data = error.response.data as { code?: unknown; message?: unknown } | undefined;
  const fallbackCode = status === 400 ? 'BAD_REQUEST'
    : status === 401 ? 'UNAUTHORIZED'
      : status === 403 ? 'FORBIDDEN'
        : status === 404 ? 'NOT_FOUND'
          : status === 409 ? 'CONFLICT'
            : status === 429 ? 'RATE_LIMITED'
              : status >= 500 ? 'SERVER_ERROR' : 'API_ERROR';

  return {
    code: safeCode(data?.code, fallbackCode),
    message: safeServerMessage(data?.message, status) ?? statusMessages[status] ?? (status >= 500
      ? statusMessages[500]
      : 'The request could not be completed. Please try again.'),
    status,
    retryable: status === 409 || status === 429 || status >= 500,
  };
};

