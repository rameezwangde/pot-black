import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface FrontendApiError {
  code: string;
  message: string;
  status: number;
}

export interface ApiTable {
  _id: string;
  name: string;
  code: string;
  type: string;
  zone: string;
  capacity: number;
  features: string[];
  isActive: boolean;
  status: 'active' | 'maintenance' | 'unavailable';
}

export interface AvailabilityRequest {
  tableId: string;
  startDateTime: string;
  durationMinutes: number;
}

export interface CreatedBooking {
  bookingReference: string;
  customerName: string;
  phone: string;
  email: string;
  players: number;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  status: string;
  table: { id: string; name: string; code: string; type: string; zone: string; capacity: number };
}

export interface CreateBookingRequest extends AvailabilityRequest {
  customerName: string;
  phone: string;
  email: string;
  players: number;
  specialRequest: string;
}

const toFrontendError = (error: unknown): FrontendApiError => {
  if (axios.isAxiosError(error)) {
    return {
      code: error.response?.data?.code ?? (error.code === 'ERR_CANCELED' ? 'REQUEST_CANCELLED' : 'API_ERROR'),
      message: error.response?.data?.message ?? (error.code === 'ERR_CANCELED'
        ? 'Request cancelled.'
        : 'We could not reach the booking service. Please try again.'),
      status: error.response?.status ?? 0,
    };
  }
  return { code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred. Please try again.', status: 0 };
};

export const getTables = async (signal?: AbortSignal) => {
  try {
    const response = await api.get<{ success: boolean; data: ApiTable[] }>('/tables', { signal });
    return response.data.data;
  } catch (error) {
    throw toFrontendError(error);
  }
};

export const checkAvailability = async (payload: AvailabilityRequest, signal?: AbortSignal) => {
  try {
    const response = await api.post('/availability/check', payload, { signal });
    return response.data;
  } catch (error) {
    throw toFrontendError(error);
  }
};

export const createBooking = async (bookingData: CreateBookingRequest, signal?: AbortSignal) => {
  try {
    const response = await api.post<{ success: boolean; data: CreatedBooking }>('/bookings', bookingData, { signal });
    return response.data.data;
  } catch (error) {
    throw toFrontendError(error);
  }
};

/* TODO: Replace five-second polling with Socket.IO after the public booking integration is stable. */
