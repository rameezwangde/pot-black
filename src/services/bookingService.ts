import axios from 'axios';
import { normalizeApiError, type SafeApiError } from './apiError';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export type FrontendApiError = SafeApiError;

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

const toFrontendError = (error: unknown): FrontendApiError => normalizeApiError(error);

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
