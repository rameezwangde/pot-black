export type TableStatus = 'available' | 'partially-booked' | 'booked' | 'unavailable';
export type SlotStatus = 'available' | 'booked' | 'unavailable';

export interface BookingTable {
  id: string;
  name: string;
  type: string;
  capacity: number;
  zone: string;
  status: TableStatus;
  features: string[];
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  status: SlotStatus;
}

export const tables: BookingTable[] = [
  { id: 'table-01', name: 'Table 01', type: 'English Pool', capacity: 4, zone: 'Main Hall', status: 'available', features: ['Tournament Size', 'Premium Cloth'] },
  { id: 'table-02', name: 'Table 02', type: 'English Pool', capacity: 4, zone: 'Main Hall', status: 'partially-booked', features: ['Professional Lighting', 'Premium Cues'] },
  { id: 'table-03', name: 'Table 03', type: 'American Pool', capacity: 6, zone: 'Private Lounge', status: 'available', features: ['Private Seating', 'Table Service'] },
  { id: 'table-04', name: 'Table 04', type: 'American Pool', capacity: 6, zone: 'Private Lounge', status: 'booked', features: ['Private Seating', 'Table Service'] },
  { id: 'table-05', name: 'Table 05', type: 'Snooker', capacity: 4, zone: 'Championship Area', status: 'available', features: ['Full Size Table', 'Professional Lighting'] },
  { id: 'table-06', name: 'Table 06', type: 'Snooker', capacity: 4, zone: 'Championship Area', status: 'partially-booked', features: ['Full Size Table', 'Premium Cloth'] },
  { id: 'table-07', name: 'Table 07', type: 'VIP Pool', capacity: 6, zone: 'VIP Room', status: 'available', features: ['Private Room', 'Dedicated Service'] },
  { id: 'table-08', name: 'Table 08', type: 'VIP Pool', capacity: 6, zone: 'VIP Room', status: 'unavailable', features: ['Private Room', 'Dedicated Service'] },
];

export const timeSlots: TimeSlot[] = [
  { id: 1, start: '10:00 AM', end: '11:00 AM', status: 'available' },
  { id: 2, start: '11:00 AM', end: '12:00 PM', status: 'booked' },
  { id: 3, start: '12:00 PM', end: '1:00 PM', status: 'available' },
  { id: 4, start: '1:00 PM', end: '2:00 PM', status: 'available' },
  { id: 5, start: '2:00 PM', end: '3:00 PM', status: 'booked' },
  { id: 6, start: '3:00 PM', end: '4:00 PM', status: 'available' },
  { id: 7, start: '4:00 PM', end: '5:00 PM', status: 'available' },
  { id: 8, start: '5:00 PM', end: '6:00 PM', status: 'available' },
  { id: 9, start: '6:00 PM', end: '7:00 PM', status: 'booked' },
  { id: 10, start: '7:00 PM', end: '8:00 PM', status: 'available' },
  { id: 11, start: '8:00 PM', end: '9:00 PM', status: 'available' },
  { id: 12, start: '9:00 PM', end: '10:00 PM', status: 'unavailable' },
];

