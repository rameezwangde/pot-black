import { DateTime } from 'luxon';
import { CAFE_TIMEZONE } from './bookingTime';
import type { AdminBooking, BookingStatus } from '../services/adminBookingService';

export const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending', confirmed: 'Confirmed', 'checked-in': 'Checked In', playing: 'Playing', completed: 'Completed', cancelled: 'Cancelled', 'no-show': 'No Show',
};

export const statusTransitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked-in', 'cancelled', 'no-show'],
  'checked-in': ['playing', 'cancelled'],
  playing: ['completed'],
  completed: [], cancelled: [], 'no-show': [],
};

export const canExtend = (booking: AdminBooking) => ['confirmed', 'checked-in', 'playing'].includes(booking.status);
export const canMove = (booking: AdminBooking) => !['completed', 'cancelled', 'no-show'].includes(booking.status);
export const canCancel = (booking: AdminBooking) => ['pending', 'confirmed', 'checked-in'].includes(booking.status);

export const formatAdminDate = (iso: string) => DateTime.fromISO(iso, { setZone: true }).setZone(CAFE_TIMEZONE).toFormat('d LLLL yyyy');
export const formatAdminTime = (iso: string) => DateTime.fromISO(iso, { setZone: true }).setZone(CAFE_TIMEZONE).toFormat('h:mm a');
export const formatAdminDateTime = (iso: string) => `${formatAdminDate(iso)}, ${formatAdminTime(iso)}`;
export const formatTimeRange = (booking: AdminBooking) => `${formatAdminTime(booking.startDateTime)} â€“ ${formatAdminTime(booking.endDateTime)}`;
export const remainingTime = (booking: AdminBooking) => {
  const minutes = Math.max(0, Math.ceil(DateTime.fromISO(booking.endDateTime).diffNow('minutes').minutes));
  if (!minutes) return 'Ending now';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${rest}m remaining` : `${rest}m remaining`;
};

