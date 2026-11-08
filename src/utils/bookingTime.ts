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
  const is12Hour = /[AP]M$/i.test(time.trim());
  const timeFormat = is12Hour ? 'h:mm a' : 'HH:mm';
  let targetDate = DateTime.fromISO(date, { zone: CAFE_TIMEZONE });
  const parsedTime = DateTime.fromFormat(time.trim(), timeFormat, {
    zone: CAFE_TIMEZONE,
    locale: 'en',
  });
  if (!parsedTime.isValid) throw new Error('The selected Dubai booking date or time is invalid.');

  // Overnight hours (12:00 PM to 3:00 AM): slots in the early morning (< 6:00 AM)
  // belong to the operating session that began on 'date' at 12:00 PM.
  if (parsedTime.hour < 6) {
    targetDate = targetDate.plus({ days: 1 });
  }

  const dubaiDateTime = targetDate.set({
    hour: parsedTime.hour,
    minute: parsedTime.minute,
    second: 0,
    millisecond: 0,
  });

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

  // Daily operating hours: 12:00 PM to 3:00 AM (next day)
  const openingMinutes = 12 * 60; // 12:00 PM
  const closingMinutes = 27 * 60; // 3:00 AM next day (27 * 60)

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
      slots.push({ 
        id: slotStartDateTime.toFormat('yyyy-MM-dd_HH:mm'), 
        start: slotStartDateTime.toFormat('h:mm a'), 
        end: end.toFormat('h:mm a') 
      });
    }
  }
  return slots;
};
