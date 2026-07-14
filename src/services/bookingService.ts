import { tables, timeSlots } from '../data/bookingMockData';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAvailableTables = async ({ players }: { date: string; players: number; duration: string }) => {
  // TODO: Replace mock response with GET /api/availability.
  await wait(450);
  return tables.filter((table) => table.capacity >= players);
};

export const getAvailableSlots = async (_params: { tableId: string; date: string; duration: string }) => {
  // TODO: Replace mock response with GET /api/tables/:tableId/slots.
  return Promise.resolve(timeSlots);
};

export const createBooking = async <T,>(bookingData: T) => {
  // TODO: Replace mock response with POST /api/bookings.
  await wait(800);
  return { success: true, data: bookingData };
};

/*
  Future Socket.IO events: booking:created, booking:updated, booking:extended,
  booking:cancelled, availability:updated. Refetch availability when received.
*/

