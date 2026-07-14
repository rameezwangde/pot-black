import { useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { deactivateTable, updateTableStatus, type OperationalTable } from '../../services/adminTableService';
import type { AdminApiError } from '../../services/adminService';
import { formatAdminDateTime } from '../../utils/adminBookingUi';

export type TableStatusAction = 'active' | 'maintenance' | 'unavailable' | 'deactivate';
const labels = { active: 'Reactivate Table', maintenance: 'Mark Maintenance', unavailable: 'Mark Unavailable', deactivate: 'Deactivate Table' };
export default function TableStatusModal({ table, action, onClose, onSuccess }: { table: OperationalTable; action: TableStatusAction; onClose: () => void; onSuccess: (message: string) => void }) {
  const [force, setForce] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hasFuture = Boolean(table.nextBooking);
  const isRestrictiveStatus = action === 'maintenance' || action === 'unavailable';
  const submit = async () => {
    setSubmitting(true); setError('');
    try {
      if (action === 'deactivate') await deactivateTable(table._id);
      else await updateTableStatus(table._id, { status: action, isActive: true, force: isRestrictiveStatus ? force : undefined });
      onSuccess(action === 'deactivate' ? 'Table deactivated successfully.' : 'Table status updated successfully.');
    } catch (requestError) { setError((requestError as AdminApiError).message); }
    finally { setSubmitting(false); }
  };
  return <AdminModalShell title={labels[action]} onClose={onClose}>
    <p className="text-sm leading-6 text-gray-400">You are updating <span className="text-[#F3E5AB]">{table.name} ({table.code})</span>.</p>
    {action === 'deactivate' && <div className="mt-5 border border-red-900/40 bg-red-950/20 p-4 text-xs leading-5 text-red-200">Deactivation removes this table from public availability. Tables with active or future bookings cannot be deactivated.</div>}
    {hasFuture && <div className="mt-5 border border-[#D4AF37]/35 bg-[#D4AF37]/8 p-4 text-xs leading-5 text-[#F3E5AB]"><p>This table has a future booking: {table.nextBooking?.bookingReference} at {formatAdminDateTime(table.nextBooking!.startDateTime)}.</p>{isRestrictiveStatus && <label className="mt-4 flex cursor-pointer items-start gap-3 text-red-200"><input type="checkbox" checked={force} onChange={event => setForce(event.target.checked)} className="mt-0.5 accent-[#D4AF37]"/>I understand existing bookings will not be cancelled and want to force this status change.</label>}</div>}
    {table.currentBooking && ['checked-in','playing'].includes(table.currentBooking.status) && <div className="mt-5 border border-red-900/40 bg-red-950/20 p-4 text-xs text-red-200">This table has an active session. Restrictive status changes are blocked.</div>}
    {error && <p aria-live="polite" className="mt-4 border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="flex-1 border border-white/10 py-3 text-[9px] uppercase text-gray-400">Close</button><button type="button" onClick={() => void submit()} disabled={submitting || (hasFuture && isRestrictiveStatus && !force)} className={`flex-1 py-3 text-[9px] font-semibold uppercase disabled:opacity-40 ${action === 'deactivate' ? 'bg-[#6f171a] text-white' : 'bg-[#D4AF37] text-black'}`}>{submitting ? 'Updating...' : labels[action]}</button></div>
  </AdminModalShell>;
}

