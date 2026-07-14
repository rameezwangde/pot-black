import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BookingHero from '../components/booking/BookingHero';
import BookingSteps from '../components/booking/BookingSteps';
import BookingFilters from '../components/booking/BookingFilters';
import DateSelector, { getToday } from '../components/booking/DateSelector';
import AvailabilityLegend from '../components/booking/AvailabilityLegend';
import AvailabilityStatus from '../components/booking/AvailabilityStatus';
import TableAvailabilityGrid from '../components/booking/TableAvailabilityGrid';
import TimeSlotSelector from '../components/booking/TimeSlotSelector';
import CustomerDetailsForm, { type FormErrors } from '../components/booking/CustomerDetailsForm';
import BookingSummary from '../components/booking/BookingSummary';
import BookingSuccessModal from '../components/booking/BookingSuccessModal';
import type { BookingTable, TimeSlot } from '../data/bookingMockData';
import { createBooking, getAvailableSlots, getAvailableTables } from '../services/bookingService';

export interface CustomerDetails { fullName: string; mobile: string; email: string; players: number; request: string; terms: boolean; }
const initialDetails = (players = 2): CustomerDetails => ({ fullName: '', mobile: '', email: '', players, request: '', terms: false });

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedPlayers, setSelectedPlayers] = useState(2);
  const [selectedDuration, setSelectedDuration] = useState('1 Hour');
  const [selectedTable, setSelectedTable] = useState<BookingTable>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>();
  const [availableTables, setAvailableTables] = useState<BookingTable[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [customerDetails, setCustomerDetails] = useState(initialDetails(2));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [reference, setReference] = useState('');
  const mounted = useRef(false);

  const loadTables = useCallback(async () => {
    setIsLoading(true);
    const result = await getAvailableTables({ date: selectedDate, players: selectedPlayers, duration: selectedDuration });
    setAvailableTables(result);
    setIsLoading(false);
  }, [selectedDate, selectedPlayers, selectedDuration]);

  useEffect(() => { void loadTables(); }, [loadTables]);
  useEffect(() => { if (!mounted.current) { mounted.current = true; return; } setSelectedTable(undefined); setSelectedSlot(undefined); setSlots([]); setCustomerDetails(initialDetails(selectedPlayers)); }, [selectedDate, selectedPlayers, selectedDuration]);

  const activeStep = selectedSlot ? 4 : selectedTable ? 3 : isLoading ? 1 : 2;
  const readableDate = useMemo(() => new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),[selectedDate]);
  const chooseTable = async (table: BookingTable) => { setSelectedTable(table); setSelectedSlot(undefined); setCustomerDetails(initialDetails(selectedPlayers)); setSlots(await getAvailableSlots({tableId:table.id,date:selectedDate,duration:selectedDuration})); window.setTimeout(() => document.getElementById('time-slots')?.scrollIntoView({behavior:'smooth',block:'start'}), 50); };
  const chooseSlot = (slot: TimeSlot) => { setSelectedSlot(slot); window.setTimeout(() => document.getElementById('customer-details')?.scrollIntoView({behavior:'smooth',block:'start'}),50); };
  const submit = async () => {
    if (!selectedTable || !selectedSlot) return;
    const next: FormErrors = {};
    if (!customerDetails.fullName.trim()) next.fullName = 'Full name is required.';
    if (!customerDetails.mobile.trim()) next.mobile = 'Mobile number is required.';
    if (!customerDetails.email.trim()) next.email = 'Email is required.'; else if (!/^\S+@\S+\.\S+$/.test(customerDetails.email)) next.email = 'Enter a valid email address.';
    if (customerDetails.players < 1 || customerDetails.players > selectedTable.capacity) next.players = `Enter between 1 and ${selectedTable.capacity} players.`;
    if (!customerDetails.terms) next.terms = 'You must agree before confirming.';
    setErrors(next); if (Object.keys(next).length) return;
    setIsSubmitting(true);
    await createBooking({ date:selectedDate, duration:selectedDuration, tableId:selectedTable.id, slotId:selectedSlot.id, customer:customerDetails });
    setReference(`PB-DEMO-${Math.floor(1000 + Math.random() * 9000)}`); setIsSubmitting(false); setIsSuccessModalOpen(true);
  };
  const reset = () => { setSelectedDate(getToday()); setSelectedPlayers(2); setSelectedDuration('1 Hour'); setSelectedTable(undefined); setSelectedSlot(undefined); setCustomerDetails(initialDetails(2)); setErrors({}); setIsSuccessModalOpen(false); window.scrollTo({top:0,behavior:'smooth'}); };

  return <><BookingHero /><div className="bg-[#080605] pb-24"><div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
    <BookingSteps activeStep={activeStep}/><BookingFilters date={selectedDate} players={selectedPlayers} duration={selectedDuration} loading={isLoading} onDate={setSelectedDate} onPlayers={setSelectedPlayers} onDuration={setSelectedDuration} onSearch={loadTables}/><DateSelector selected={selectedDate} onSelect={setSelectedDate}/>
    <section className="pt-4"><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6"><div><p className="text-[9px] uppercase tracking-[.3em] text-[#D4AF37] mb-2">{readableDate}</p><h2 className="text-4xl sm:text-5xl text-[#F3E5AB] mb-3">Table Availability</h2><p className="text-sm text-gray-400">Select a table to view and reserve an available playing slot.</p></div><AvailabilityLegend/></div><AvailabilityStatus/><div className="mt-6"><TableAvailabilityGrid tables={availableTables} selectedId={selectedTable?.id} loading={isLoading} onSelect={chooseTable}/></div></section>
    {selectedTable && <TimeSlotSelector table={selectedTable} date={selectedDate} duration={selectedDuration} players={selectedPlayers} slots={slots} selected={selectedSlot} onSelect={chooseSlot}/>} 
    {selectedTable && selectedSlot && <CustomerDetailsForm details={customerDetails} errors={errors} capacity={selectedTable.capacity} submitting={isSubmitting} onChange={setCustomerDetails} onSubmit={submit} summary={<BookingSummary date={selectedDate} table={selectedTable} slot={selectedSlot} players={customerDetails.players} duration={selectedDuration}/>}/>} 
  </div></div><BookingSuccessModal open={isSuccessModalOpen} reference={reference} date={selectedDate} table={selectedTable} slot={selectedSlot} players={customerDetails.players} onClose={() => setIsSuccessModalOpen(false)} onReset={reset}/></>;
}

