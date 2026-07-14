import { adminApi, type AdminApiError } from './adminService';
import type { AdminTable, BookingStatus } from './adminBookingService';

export type OperationalStatus = 'available' | 'reserved' | 'occupied' | 'maintenance' | 'unavailable' | 'inactive';
export interface OperationalBooking { bookingReference: string; customerName: string; players?: number; startDateTime: string; endDateTime: string; status: BookingStatus; }
export interface OperationalTable extends AdminTable { operationalStatus: OperationalStatus; currentBooking: OperationalBooking | null; nextBooking: OperationalBooking | null; createdAt: string; updatedAt: string; }
export interface TablePayload { name: string; code: string; type: string; zone: string; capacity: number; features: string[]; }
export interface TableStatusPayload { status?: 'active' | 'maintenance' | 'unavailable'; isActive?: boolean; force?: boolean; }

const request = async <T>(work: () => Promise<{ data: { data: T } }>) => {
  try { return (await work()).data.data; }
  catch (error) { throw error as AdminApiError; }
};
export const getAdminTables = () => request<OperationalTable[]>(() => adminApi.get('/admin/tables'));
export const createTable = (payload: TablePayload) => request<{ table: AdminTable }>(() => adminApi.post('/admin/tables', payload));
export const updateTable = (id: string, payload: TablePayload) => request<{ table: AdminTable }>(() => adminApi.patch(`/admin/tables/${id}`, payload));
export const updateTableStatus = (id: string, payload: TableStatusPayload) => request<{ table: AdminTable }>(() => adminApi.patch(`/admin/tables/${id}/status`, payload));
export const deactivateTable = async (id: string) => {
  try { return (await adminApi.delete(`/admin/tables/${id}`)).data; }
  catch (error) { throw error as AdminApiError; }
};
