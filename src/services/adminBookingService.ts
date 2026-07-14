import { adminApi, type AdminApiError } from './adminService';

export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'playing' | 'completed' | 'cancelled' | 'no-show';

export interface AdminTable {
  _id: string;
  name: string;
  code: string;
  type: string;
  zone: string;
  capacity: number;
  features?: string[];
  isActive?: boolean;
  status?: 'active' | 'maintenance' | 'unavailable';
}

export interface AdminBooking {
  _id: string;
  bookingReference: string;
  table: AdminTable;
  customerName: string;
  phone: string;
  email?: string;
  players: number;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  extensionMinutes?: number;
  specialRequest?: string;
  status: BookingStatus;
  source: 'website' | 'walk-in' | 'phone' | 'admin';
  createdBy: 'customer' | 'admin' | 'staff' | 'system';
  cancelledAt?: string | null;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalBookingsToday: number;
  confirmedToday: number;
  checkedInToday: number;
  playingNow: number;
  completedToday: number;
  cancelledToday: number;
  noShowToday: number;
  walkInsToday: number;
  websiteBookingsToday: number;
  occupiedTablesNow: number;
  availableTablesNow: number;
  totalActiveTables: number;
}

export interface DashboardData {
  date: string;
  timezone: string;
  summary: DashboardSummary;
  upcomingBookings: AdminBooking[];
  activeBookings: AdminBooking[];
}

export interface BookingQuery {
  date?: string;
  status?: string;
  tableId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface Pagination { page: number; limit: number; total: number; pages: number; }
export interface WalkInPayload { tableId: string; customerName: string; phone: string; email?: string; players: number; startDateTime: string; durationMinutes: number; specialRequest: string; }

const request = async <T>(work: () => Promise<{ data: { data: T } }>) => {
  try { return (await work()).data.data; }
  catch (error) { throw error as AdminApiError; }
};

export const getDashboardData = () => request<DashboardData>(() => adminApi.get('/admin/dashboard'));
export const getAdminBookings = (params: BookingQuery) => request<{ bookings: AdminBooking[]; pagination: Pagination }>(() => adminApi.get('/admin/bookings', { params }));
export const getAdminBooking = (identifier: string) => request<{ booking: AdminBooking }>(() => adminApi.get(`/admin/bookings/${encodeURIComponent(identifier)}`)).then(data => data.booking);
export const createWalkInBooking = (payload: WalkInPayload) => request<{ booking: AdminBooking }>(() => adminApi.post('/admin/bookings/walk-in', payload));
export const updateBookingStatus = (identifier: string, status: BookingStatus) => request<{ booking: AdminBooking }>(() => adminApi.patch(`/admin/bookings/${encodeURIComponent(identifier)}/status`, { status }));
export const extendBooking = (identifier: string, additionalMinutes: number) => request<Record<string, unknown>>(() => adminApi.patch(`/admin/bookings/${encodeURIComponent(identifier)}/extend`, { additionalMinutes }));
export const cancelBooking = (identifier: string, reason: string) => request<Record<string, unknown>>(() => adminApi.patch(`/admin/bookings/${encodeURIComponent(identifier)}/cancel`, { reason }));
export const moveBookingToTable = (identifier: string, tableId: string) => request<{ booking: AdminBooking }>(() => adminApi.patch(`/admin/bookings/${encodeURIComponent(identifier)}/table`, { tableId }));
export const getTables = () => request<AdminTable[]>(() => adminApi.get('/tables'));
