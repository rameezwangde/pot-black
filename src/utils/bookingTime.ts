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

export const generateDubaiTimeSlots = (durationMinutes: number, selectedDateIso?: string) => {
  const targetDate = selectedDateIso 
    ? DateTime.fromISO(selectedDateIso, { zone: CAFE_TIMEZONE }) 
    : DateTime.now().setZone(CAFE_TIMEZONE);
    
  const weekday = targetDate.weekday; // 1 = Mon, 7 = Sun
  const isWeekend = weekday === 6 || weekday === 7;

  // Mon-Fri 2 PM-12 AM / Sat-Sun 12 PM-2 AM
  const openingMinutes = isWeekend ? 12 * 60 : 14 * 60;
  const closingMinutes = isWeekend ? 26 * 60 : 24 * 60;

  const slots: Array<{ id: string; start: string; end: string }> = [];
  const now = DateTime.now().setZone(CAFE_TIMEZONE);
  const startOfDay = targetDate.startOf('day');

  for (let startMinutes = openingMinutes; startMinutes + durationMinutes <= closingMinutes; startMinutes += 30) {
    let includeSlot = true;
    
    const slotStartDateTime = startOfDay.plus({ minutes: startMinutes });
    const end = slotStartDateTime.plus({ minutes: durationMinutes });
    
    if (selectedDateIso) {
      if (slotStartDateTime <= now) {
        includeSlot = false;
      }
    }
    
    if (includeSlot) {
      // Use HH:mm for ID. Wait, if it crosses midnight, id might overlap if it was possible, but since a day's slots are unique, it's fine.
      // But let's keep id format as HH:mm. If we want to represent 25:00 as 01:00, toFormat('HH:mm') does exactly that.
      slots.push({ 
        id: slotStartDateTime.toFormat('HH:mm'), 
        start: slotStartDateTime.toFormat('h:mm a'), 
        end: end.toFormat('h:mm a') 
      });
    }
  }
  return slots;
};
