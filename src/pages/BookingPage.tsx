import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BookingHero from '../components/booking/BookingHero';
import BookingSteps from '../components/booking/BookingSteps';
import BookingFilters from '../components/booking/BookingFilters';
import DateSelector from '../components/booking/DateSelector';
import AvailabilityLegend from '../components/booking/AvailabilityLegend';
import AvailabilityStatus from '../components/booking/AvailabilityStatus';
import TableAvailabilityGrid from '../components/booking/TableAvailabilityGrid';
import TimeSlotSelector from '../components/booking/TimeSlotSelector';
import CustomerDetailsForm, { type FormErrors } from '../components/booking/CustomerDetailsForm';
import BookingSummary from '../components/booking/BookingSummary';
import BookingSuccessModal from '../components/booking/BookingSuccessModal';
import type { BookingTable, TimeSlot } from '../data/bookingMockData';
import {
  checkAvailability,
  createBooking,
  getTables,
  type CreatedBooking,
  type FrontendApiError,
} from '../services/bookingService';
import {
  createDubaiStartDateTime,
  durationToMinutes,
  generateDubaiTimeSlots,
  getDubaiToday,
} from '../utils/bookingTime';

export interface CustomerDetails {
  fullName: string;
  mobile: string;
  email: string;
  players: number;
  request: string;
  terms: boolean;
}

const initialDetails = (players = 2): CustomerDetails => ({
  fullName: '', mobile: '', email: '', players, request: '', terms: false,
});

const isRequestCancelled = (error: unknown) => (error as FrontendApiError)?.code === 'REQUEST_CANCELLED';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(getDubaiToday());
  const [selectedPlayers, setSelectedPlayers] = useState(2);
  const [selectedDuration, setSelectedDuration] = useState('1 Hour');
  const [selectedTable, setSelectedTable] = useState<BookingTable>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>();
  const [availableTables, setAvailableTables] = useState<BookingTable[]>([]);
  const [unavailableSlotIds, setUnavailableSlotIds] = useState<Set<string>>(new Set());
  const [customerDetails, setCustomerDetails] = useState(initialDetails(2));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSlotId, setCheckingSlotId] = useState<string | number>();
  const [tableError, setTableError] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const [lastCheckedAt, setLastCheckedAt] = useState<Date>();
  const [successBooking, setSuccessBooking] = useState<CreatedBooking>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const tableController = useRef<AbortController>();
  const availabilityController = useRef<AbortController>();
  const pollingController = useRef<AbortController>();
  const submissionController = useRef<AbortController>();
  const requestId = useRef(0);
  const selectionKey = useRef('');

  const loadTables = useCallback(async (showSkeleton = true) => {
    tableController.current?.abort();
    const controller = new AbortController();
    tableController.current = controller;
    if (showSkeleton) setIsLoading(true);
    setTableError('');
    try {
      const result = await getTables(controller.signal);
      const activeTables: BookingTable[] = result
        .filter(table => table.isActive && table.status === 'active')
        .map(table => ({
          id: table._id,
          code: table.code,
          name: table.name,
          type: table.type,
          capacity: table.capacity,
          zone: table.zone,
          features: table.features,
          status: 'available',
        }));
      setAvailableTables(activeTables);
    } catch (error) {
      if (!isRequestCancelled(error)) setTableError('Unable to load tables. Please try again.');
    } finally {
      if (tableController.current === controller) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTables();
    return () => {
      tableController.current?.abort();
      availabilityController.current?.abort();
      pollingController.current?.abort();
      submissionController.current?.abort();
    };
  }, [loadTables]);

  const durationMinutes = durationToMinutes(selectedDuration);
  const visibleTables = useMemo(
    () => availableTables.filter(table => table.capacity >= selectedPlayers),
    [availableTables, selectedPlayers],
  );
  const slots = useMemo<TimeSlot[]>(
    () => generateDubaiTimeSlots(durationMinutes).map(slot => ({
      ...slot,
      status: unavailableSlotIds.has(slot.id) ? 'booked' : 'available',
    })),
    [durationMinutes, unavailableSlotIds],
  );
  const readableDate = useMemo(
    () => new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    [selectedDate],
  );
  const activeStep = selectedSlot ? 4 : selectedTable ? 3 : isLoading ? 1 : 2;

  const invalidateSelection = (players = selectedPlayers) => {
    requestId.current += 1;
    selectionKey.current = '';
    availabilityController.current?.abort();
    pollingController.current?.abort();
    setSelectedTable(undefined);
    setSelectedSlot(undefined);
    setUnavailableSlotIds(new Set());
    setCheckingSlotId(undefined);
    setApiMessage('');
    setErrors({});
    setCustomerDetails(initialDetails(players));
  };

  const changeDate = (date: string) => {
    setSelectedDate(date);
    invalidateSelection(selectedPlayers);
    void loadTables(false);
  };

  const changePlayers = (players: number) => {
    setSelectedPlayers(players);
    invalidateSelection(players);
    void loadTables(false);
  };

  const changeDuration = (duration: string) => {
    setSelectedDuration(duration);
    invalidateSelection(selectedPlayers);
    void loadTables(false);
  };

  const chooseTable = (table: BookingTable) => {
    requestId.current += 1;
    availabilityController.current?.abort();
    pollingController.current?.abort();
    selectionKey.current = `${selectedDate}|${table.id}|${selectedDuration}`;
    setSelectedTable(table);
    setSelectedSlot(undefined);
    setUnavailableSlotIds(new Set());
    setCheckingSlotId(undefined);
    setApiMessage('');
    setErrors({});
    setCustomerDetails(initialDetails(selectedPlayers));
    void loadTables(false);
    window.setTimeout(() => document.getElementById('time-slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const markSlotUnavailable = (slotId: string | number) => {
    setUnavailableSlotIds(current => new Set(current).add(String(slotId)));
  };

  const chooseSlot = async (slot: TimeSlot) => {
    if (!selectedTable || slot.status !== 'available') return;
    availabilityController.current?.abort();
    const controller = new AbortController();
    availabilityController.current = controller;
    const currentRequest = ++requestId.current;
    const currentKey = `${selectedDate}|${selectedTable.id}|${selectedDuration}|${slot.id}`;
    selectionKey.current = currentKey;
    setCheckingSlotId(slot.id);
    setSelectedSlot(undefined);
    setApiMessage('');

    try {
      const startDateTime = createDubaiStartDateTime({ date: selectedDate, time: slot.start });
      await checkAvailability({ tableId: selectedTable.id, startDateTime, durationMinutes }, controller.signal);
      if (requestId.current !== currentRequest || selectionKey.current !== currentKey) return;
      setSelectedSlot(slot);
      setLastCheckedAt(new Date());
      window.setTimeout(() => document.getElementById('customer-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch (error) {
      if (isRequestCancelled(error) || requestId.current !== currentRequest) return;
      const apiError = error as FrontendApiError;
      if (apiError.code === 'BOOKING_CONFLICT') markSlotUnavailable(slot.id);
      setApiMessage(apiError.message);
    } finally {
      if (requestId.current === currentRequest) setCheckingSlotId(undefined);
    }
  };

  useEffect(() => {
    if (!selectedTable || !selectedSlot) return;
    const currentKey = `${selectedDate}|${selectedTable.id}|${selectedDuration}|${selectedSlot.id}`;

    const pollSelectedSlot = async () => {
      pollingController.current?.abort();
      const controller = new AbortController();
      pollingController.current = controller;
      try {
        const startDateTime = createDubaiStartDateTime({ date: selectedDate, time: selectedSlot.start });
        await checkAvailability({ tableId: selectedTable.id, startDateTime, durationMinutes }, controller.signal);
        if (selectionKey.current === currentKey) setLastCheckedAt(new Date());
      } catch (error) {
        if (isRequestCancelled(error) || selectionKey.current !== currentKey) return;
        const apiError = error as FrontendApiError;
        if (apiError.code === 'BOOKING_CONFLICT') {
          markSlotUnavailable(selectedSlot.id);
          setSelectedSlot(undefined);
          selectionKey.current = `${selectedDate}|${selectedTable.id}|${selectedDuration}`;
          setApiMessage('This slot is no longer available. Please select another time.');
          window.setTimeout(() => document.getElementById('time-slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        } else {
          setApiMessage(apiError.message);
        }
      }
    };

    // TODO: Replace polling with Socket.IO after the public booking integration is stable.
    const interval = window.setInterval(() => void pollSelectedSlot(), 5000);
    return () => {
      window.clearInterval(interval);
      pollingController.current?.abort();
    };
  }, [durationMinutes, selectedDate, selectedDuration, selectedSlot, selectedTable]);

  const submit = async () => {
    if (!selectedTable) {
      setApiMessage('Please select a table.');
      return;
    }
    if (!selectedSlot) {
      setApiMessage('Please select an available time slot.');
      return;
    }
    if (!durationMinutes) {
      setApiMessage('Please select a valid booking duration.');
      return;
    }

    const next: FormErrors = {};
    if (!customerDetails.fullName.trim()) next.fullName = 'Full name is required.';
    if (!customerDetails.mobile.trim()) next.mobile = 'Mobile number is required.';
    if (!customerDetails.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(customerDetails.email)) next.email = 'Enter a valid email address.';
    if (customerDetails.players < 1 || customerDetails.players > selectedTable.capacity) next.players = `Enter between 1 and ${selectedTable.capacity} players.`;
    if (!customerDetails.terms) next.terms = 'You must agree before confirming.';
    setErrors(next);
    if (Object.keys(next).length) return;

    submissionController.current?.abort();
    const controller = new AbortController();
    submissionController.current = controller;
    setIsSubmitting(true);
    setApiMessage('');
    try {
      const startDateTime = createDubaiStartDateTime({ date: selectedDate, time: selectedSlot.start });
      const booking = await createBooking({
        tableId: selectedTable.id,
        customerName: customerDetails.fullName.trim(),
        phone: customerDetails.mobile.trim(),
        email: customerDetails.email.trim(),
        players: customerDetails.players,
        startDateTime,
        durationMinutes,
        specialRequest: customerDetails.request.trim(),
      }, controller.signal);
      setErrors({});
      setSuccessBooking(booking);
      setIsSuccessModalOpen(true);
      markSlotUnavailable(selectedSlot.id);
      setSelectedSlot(undefined);
      setLastCheckedAt(new Date());
      void loadTables(false);
    } catch (error) {
      if (isRequestCancelled(error)) return;
      const apiError = error as FrontendApiError;
      if (apiError.code === 'BOOKING_CONFLICT') {
        markSlotUnavailable(selectedSlot.id);
        setSelectedSlot(undefined);
        setApiMessage('This slot was just booked by another customer. Please choose another time.');
        window.setTimeout(() => document.getElementById('time-slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      } else {
        setApiMessage(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    requestId.current += 1;
    availabilityController.current?.abort();
    pollingController.current?.abort();
    submissionController.current?.abort();
    setSelectedDate(getDubaiToday());
    setSelectedPlayers(2);
    setSelectedDuration('1 Hour');
    setSelectedTable(undefined);
    setSelectedSlot(undefined);
    setUnavailableSlotIds(new Set());
    setCustomerDetails(initialDetails(2));
    setErrors({});
    setApiMessage('');
    setSuccessBooking(undefined);
    setIsSuccessModalOpen(false);
    setLastCheckedAt(undefined);
    void loadTables(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <>
    <BookingHero />
    <div className="bg-[#080605] pb-16 sm:pb-24"><div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
      <BookingSteps activeStep={activeStep}/>
      <BookingFilters date={selectedDate} players={selectedPlayers} duration={selectedDuration} loading={isLoading} onDate={changeDate} onPlayers={changePlayers} onDuration={changeDuration} onSearch={() => void loadTables()}/>
      <DateSelector selected={selectedDate} onSelect={changeDate}/>
      {apiMessage && <div role="alert" className="border border-red-800/40 bg-red-950/20 px-5 py-4 text-sm text-red-200">{apiMessage}</div>}
      <section className="pt-4"><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6"><div><p className="text-[9px] uppercase tracking-[.3em] text-[#D4AF37] mb-2">{readableDate}</p><h2 className="text-4xl sm:text-5xl text-[#F3E5AB] mb-3">Table Availability</h2><p className="text-sm text-gray-400">Select a table to view and reserve an available playing slot.</p></div><AvailabilityLegend/></div><AvailabilityStatus lastCheckedAt={lastCheckedAt} checking={checkingSlotId !== undefined}/>
        <div className="mt-6">{tableError && !isLoading ? <div className="border border-red-800/40 bg-[#100b0a] p-6 text-center sm:p-10"><p className="text-gray-300 mb-5">{tableError}</p><button type="button" onClick={() => void loadTables()} className="border border-[#D4AF37]/40 px-6 py-3 text-[10px] uppercase tracking-[.18em] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#080605]">Retry</button></div> : <TableAvailabilityGrid tables={visibleTables} selectedId={selectedTable?.id} loading={isLoading} onSelect={chooseTable}/>}</div>
      </section>
      {selectedTable && <TimeSlotSelector table={selectedTable} date={selectedDate} duration={selectedDuration} players={selectedPlayers} slots={slots} selected={selectedSlot} checkingSlotId={checkingSlotId} message={apiMessage} onSelect={slot => void chooseSlot(slot)}/>}
      {selectedTable && selectedSlot && <CustomerDetailsForm details={customerDetails} errors={errors} capacity={selectedTable.capacity} submitting={isSubmitting} onChange={setCustomerDetails} onSubmit={() => void submit()} summary={<BookingSummary date={selectedDate} table={selectedTable} slot={selectedSlot} players={customerDetails.players} duration={selectedDuration}/>}/>}
    </div></div>
    <BookingSuccessModal open={isSuccessModalOpen} booking={successBooking} onClose={() => setIsSuccessModalOpen(false)} onReset={reset}/>
  </>;
}
