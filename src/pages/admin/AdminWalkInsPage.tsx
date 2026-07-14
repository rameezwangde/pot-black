import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, SearchX, UserRoundPlus } from 'lucide-react';
import BookingDetailsPanel from '../../components/admin/BookingDetailsPanel';
import BookingStatusBadge from '../../components/admin/BookingStatusBadge';
import CancelBookingModal from '../../components/admin/CancelBookingModal';
import ExtendBookingModal from '../../components/admin/ExtendBookingModal';
import MoveTableModal from '../../components/admin/MoveTableModal';
import WalkInBookingModal from '../../components/admin/WalkInBookingModal';
import { useAdminToast } from '../../context/AdminToastContext';
import { getAdminBooking, getAdminBookings, getTables, updateBookingStatus, type AdminBooking, type AdminTable, type BookingStatus } from '../../services/adminBookingService';
import type { AdminApiError } from '../../services/adminService';
import { formatAdminDate, formatTimeRange, statusLabels, statusTransitions } from '../../utils/adminBookingUi';
import { getDubaiToday } from '../../utils/bookingTime';
import { WalkInListSkeleton } from '../../components/admin/AdminLoadingSkeletons';
import EmptyState from '../../components/common/EmptyState';
import ApiErrorCard from '../../components/common/ApiErrorCard';

const field='border border-white/10 bg-black/25 px-3 py-3 text-xs text-[#F3E5AB] outline-none focus:border-[#D4AF37] [color-scheme:dark]';
const actionClass='border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[.11em] text-gray-300 hover:border-[#D4AF37]/40';
const actionLabels: Partial<Record<BookingStatus,string>>={ 'checked-in':'Check In', playing:'Start Playing', completed:'Complete' };
export default function AdminWalkInsPage(){
  const {showToast}=useAdminToast();
  const [date,setDate]=useState(getDubaiToday());
  const [status,setStatus]=useState('');
  const [tableId,setTableId]=useState('');
  const [searchInput,setSearchInput]=useState('');
  const [search,setSearch]=useState('');
  const [bookings,setBookings]=useState<AdminBooking[]>([]);
  const [tables,setTables]=useState<AdminTable[]>([]);
  const [tablesLoading,setTablesLoading]=useState(true);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [walkInOpen,setWalkInOpen]=useState(false);
  const [details,setDetails]=useState<AdminBooking>();
  const [detailsLoading,setDetailsLoading]=useState(false);
  const [extendTarget,setExtendTarget]=useState<AdminBooking>();
  const [cancelTarget,setCancelTarget]=useState<AdminBooking>();
  const [moveTarget,setMoveTarget]=useState<AdminBooking>();
  const [actionLoading,setActionLoading]=useState('');
  useEffect(()=>{const timer=window.setTimeout(()=>setSearch(searchInput.trim()),400);return()=>window.clearTimeout(timer)},[searchInput]);
  useEffect(()=>{getTables().then(data=>setTables(data.filter(table=>table.isActive&&table.status==='active'))).catch(requestError=>showToast((requestError as AdminApiError).message,'error')).finally(()=>setTablesLoading(false))},[showToast]);
  const load=useCallback(async(background=false)=>{if(!background)setLoading(true);setError('');try{const result=await getAdminBookings({date,status:status||undefined,tableId:tableId||undefined,search:search||undefined,source:'walk-in',limit:100,sort:'start-asc'});setBookings(result.bookings);setTotal(result.pagination.total)}catch(requestError){setError((requestError as AdminApiError).message)}finally{if(!background)setLoading(false)}},[date,status,tableId,search]);
  useEffect(()=>{void load()},[load]);
  useEffect(()=>{const timer=window.setInterval(()=>void load(true),10000);return()=>window.clearInterval(timer)},[load]); // TODO: Replace polling with Socket.IO when real-time events are introduced.
  const openDetails=async(booking:AdminBooking)=>{setDetails(booking);setDetailsLoading(true);try{setDetails(await getAdminBooking(booking.bookingReference))}catch(requestError){showToast((requestError as AdminApiError).message,'error');setDetails(undefined)}finally{setDetailsLoading(false)}};
  const refresh=async(message:string)=>{showToast(message);await load(true);if(details){try{setDetails(await getAdminBooking(details.bookingReference))}catch(requestError){showToast((requestError as AdminApiError).message,'error')}}};
  const changeStatus=async(booking:AdminBooking,nextStatus:BookingStatus)=>{setActionLoading(`${booking._id}:${nextStatus}`);try{await updateBookingStatus(booking.bookingReference,nextStatus);await refresh('Booking status updated successfully.')}catch(requestError){showToast((requestError as AdminApiError).message,'error')}finally{setActionLoading('')}};
  const modalSuccess=async(message:string)=>{setExtendTarget(undefined);setCancelTarget(undefined);setMoveTarget(undefined);await refresh(message)};
  const actions=(booking:AdminBooking)=><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>void openDetails(booking)} className={actionClass}>View</button>{statusTransitions[booking.status].filter(next=>!['cancelled','no-show','confirmed'].includes(next)).map(next=><button key={next} type="button" disabled={actionLoading===`${booking._id}:${next}`} aria-busy={actionLoading===`${booking._id}:${next}`} onClick={()=>void changeStatus(booking,next)} className={actionClass}>{actionLoading===`${booking._id}:${next}`?'Updating...':actionLabels[next]??statusLabels[next]}</button>)}{booking.status==='playing'&&<button type="button" onClick={()=>setExtendTarget(booking)} className={actionClass}>Extend</button>}{['confirmed','checked-in','playing'].includes(booking.status)&&<button type="button" onClick={()=>setMoveTarget(booking)} className={actionClass}>Move Table</button>}{['confirmed','checked-in'].includes(booking.status)&&<button type="button" onClick={()=>setCancelTarget(booking)} className={`${actionClass} border-red-900/40 text-red-300`}>Cancel</button>}</div>;
  const clearFilters=()=>{setDate(getDubaiToday());setStatus('');setTableId('');setSearchInput('');setSearch('')};
  const hasActiveFilters=Boolean(status||tableId||search||date!==getDubaiToday());
  const summary={playing:bookings.filter(item=>item.status==='playing').length,waiting:bookings.filter(item=>item.status==='confirmed').length,completed:bookings.filter(item=>item.status==='completed').length};
  return <section className="mx-auto max-w-[1500px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[9px] uppercase tracking-[.3em] text-[#D4AF37]">On-Site Guests</p><h2 className="mb-3 text-3xl text-[#F3E5AB] min-[390px]:text-4xl sm:text-5xl">Walk-In Management</h2><p className="text-sm text-gray-400">Register on-site guests quickly and monitor today’s walk-in reservations.</p></div><button type="button" onClick={()=>setWalkInOpen(true)} className="flex w-full items-center justify-center gap-2 bg-[#D4AF37] sm:w-auto px-5 py-3.5 text-[9px] font-semibold uppercase text-black"><Plus size={15}/>New Walk-In Booking</button></div>
    <div className="mb-6 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 lg:grid-cols-4">{Object.entries({'Walk-Ins Today':total,'Currently Playing':summary.playing,'Waiting / Confirmed':summary.waiting,'Completed Today':summary.completed}).map(([label,value])=><article key={label} className="border border-white/10 bg-[#140a0b]/60 p-4"><p className="text-[8px] uppercase tracking-[.13em] text-gray-500">{label}</p><p className="mt-3 font-serif text-3xl text-[#F3E5AB]">{loading?'—':value}</p></article>)}</div>
    <div className="mb-6 grid gap-3 border border-[#D4AF37]/15 bg-[#140a0b]/60 p-4 sm:grid-cols-2 xl:grid-cols-4"><input type="date" value={date} onChange={event=>setDate(event.target.value)} className={field}/><select value={status} onChange={event=>setStatus(event.target.value)} className={field}><option value="">All Statuses</option>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select value={tableId} disabled={tablesLoading} onChange={event=>setTableId(event.target.value)} className={field}><option value="">{tablesLoading?'Loading tables...':'All Tables'}</option>{tables.map(table=><option key={table._id} value={table._id}>{table.code} · {table.name}</option>)}</select><label className="relative"><Search size={14} className="absolute left-3 top-3.5 text-gray-600"/><input value={searchInput} onChange={event=>setSearchInput(event.target.value)} placeholder="Search reference, customer, phone or email" className={`${field} w-full pl-9`}/></label></div>
    {error&&bookings.length>0&&<p role="alert" className="mb-4 border border-red-900/30 bg-red-950/15 px-4 py-3 text-xs text-red-200">Refresh failed. Current walk-in data remains visible.</p>}
    {error&&!bookings.length?<ApiErrorCard title="Unable to Load Walk-Ins" message={error} onRetry={()=>void load()}/>:loading?<WalkInListSkeleton/>:!bookings.length?<EmptyState icon={hasActiveFilters?SearchX:UserRoundPlus} title={hasActiveFilters?'No Matching Walk-Ins':'No Walk-Ins Today'} description={hasActiveFilters?'No walk-in booking matches the selected filters. Clear them to see today’s complete list.':'Today’s on-site guests will appear here as soon as a walk-in booking is created.'} actionLabel={hasActiveFilters?'Clear Filters':'Add Walk-In Booking'} onAction={hasActiveFilters?clearFilters:()=>setWalkInOpen(true)}/>:<><div className="hidden overflow-x-auto xl:block"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-[#D4AF37]/20 text-[8px] uppercase text-gray-500">{['Reference','Customer','Phone','Table','Time','Players','Status','Actions'].map(label=><th key={label} className="px-3 py-4 font-normal">{label}</th>)}</tr></thead><tbody className="divide-y divide-white/5">{bookings.map(booking=><tr key={booking._id} className="bg-[#140a0b]/40 text-xs"><td className="px-3 py-4 text-[#D4AF37]">{booking.bookingReference}</td><td className="px-3 py-4 text-[#F3E5AB]">{booking.customerName}</td><td className="px-3 py-4 text-gray-400">{booking.phone}</td><td className="px-3 py-4 text-gray-300">{booking.table.code} · {booking.table.name}</td><td className="px-3 py-4 text-gray-300">{formatAdminDate(booking.startDateTime)}<p className="mt-1 text-[9px] text-gray-500">{formatTimeRange(booking)}</p></td><td className="px-3 py-4">{booking.players}</td><td className="px-3 py-4"><BookingStatusBadge status={booking.status}/></td><td className="px-3 py-4">{actions(booking)}</td></tr>)}</tbody></table></div><div className="grid gap-4 xl:hidden">{bookings.map(booking=><article key={booking._id} className="min-w-0 border border-white/10 bg-[#140a0b]/70 p-4 sm:p-5"><div className="flex flex-col justify-between gap-3 min-[390px]:flex-row"><div><p className="break-all text-[9px] text-[#D4AF37]">{booking.bookingReference}</p><h3 className="mt-1 text-xl text-[#F3E5AB]">{booking.customerName}</h3><p className="text-[10px] text-gray-500">{booking.phone}</p></div><BookingStatusBadge status={booking.status}/></div><div className="my-4 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 border-y border-white/5 py-4 text-xs"><p>{booking.table.name} ({booking.table.code})</p><p>{booking.players} players</p><p>{formatAdminDate(booking.startDateTime)}</p><p>{formatTimeRange(booking)}</p></div>{actions(booking)}</article>)}</div></>}
    {details&&<BookingDetailsPanel booking={details} loading={detailsLoading} updatingStatus={actionLoading.startsWith(`${details?._id}:`)?actionLoading.slice(details!._id.length+1) as BookingStatus:undefined} onClose={()=>setDetails(undefined)} onStatus={next=>void changeStatus(details,next)} onExtend={()=>setExtendTarget(details)} onCancel={()=>setCancelTarget(details)} onMove={()=>setMoveTarget(details)}/>}
    {extendTarget&&<ExtendBookingModal booking={extendTarget} onClose={()=>setExtendTarget(undefined)} onSuccess={()=>void modalSuccess('Booking extended successfully.')}/>}
    {cancelTarget&&<CancelBookingModal booking={cancelTarget} onClose={()=>setCancelTarget(undefined)} onSuccess={()=>void modalSuccess('Booking cancelled successfully.')}/>}
    {moveTarget&&<MoveTableModal booking={moveTarget} onClose={()=>setMoveTarget(undefined)} onSuccess={()=>void modalSuccess('Booking moved successfully.')}/>}
    {walkInOpen&&<WalkInBookingModal onClose={()=>setWalkInOpen(false)} onSuccess={reference=>{setWalkInOpen(false);void refresh(reference?`Walk-in ${reference} created successfully.`:'Walk-in booking created successfully.')}}/>}
  </section>;
}
