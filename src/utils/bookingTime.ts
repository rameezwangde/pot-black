import { DateTime } from 'luxon';

export const CAFE_TIMEZONE = 'Asia/Dubai';

export const getDubaiToday = () => DateTime.now().setZone(CAFE_TIMEZONE).toISODate()!;

export const getDubaiDateOptions = (count = 7) => {
  const today = DateTime.now().setZone(CAFE_TIMEZONE).startOf('day');
  return Array.from({ length: count }, (_, index) => {
    const date = today.plus({ days: index });
    return { value: date.toISODate()!, weekday: date.toFormat('ccc'), label: date.toFormat('dd LLL').toUpperCase() };
  });
};

export const durationToMinutes = (duration: string) => {
  const durations: Record<string, number> = {
    '30 Minutes': 30,
    '1 Hour': 60,
    '1 Hour 30 Minutes': 90,
    '2 Hours': 120,
  };
  return durations[duration] ?? 0;
};

export const createDubaiStartDateTime = ({ date, time }: { date: string; time: string }) => {
  const timeFormat = /[AP]M$/i.test(time.trim()) ? 'h:mm a' : 'HH:mm';
  const dubaiDateTime = DateTime.fromFormat(`${date} ${time}`, `yyyy-MM-dd ${timeFormat}`, {
    zone: CAFE_TIMEZONE,
    locale: 'en',
  });
  if (!dubaiDateTime.isValid) throw new Error('The selected Dubai booking date or time is invalid.');
  return dubaiDateTime.toUTC().toISO();
};

export const formatUtcToDubaiTime = (isoDate: string) =>
  DateTime.fromISO(isoDate, { setZone: true }).setZone(CAFE_TIMEZONE).toFormat('h:mm a');

export const formatUtcToDubaiDate = (isoDate: string) =>
  DateTime.fromISO(isoDate, { setZone: true }).setZone(CAFE_TIMEZONE).toFormat('d LLLL yyyy');

export const generateDubaiTimeSlots = (durationMinutes: number) => {
  const openingMinutes = 10 * 60;
  const closingMinutes = 23 * 60;
  const slots: Array<{ id: string; start: string; end: string }> = [];
  for (let startMinutes = openingMinutes; startMinutes + durationMinutes <= closingMinutes; startMinutes += 30) {
    const start = DateTime.fromObject(
      { hour: Math.floor(startMinutes / 60), minute: startMinutes % 60 },
      { zone: CAFE_TIMEZONE },
    );
    const end = start.plus({ minutes: durationMinutes });
    slots.push({ id: start.toFormat('HH:mm'), start: start.toFormat('h:mm a'), end: end.toFormat('h:mm a') });
  }
  return slots;
};
