const pulse = 'animate-pulse motion-reduce:animate-none border border-white/[.06] bg-[#140a0b]/70';

const Line = ({ className = '' }: { className?: string; key?: number | string }) => <div className={`rounded-sm bg-white/[.07] ${className}`}/>;

export function DashboardSkeleton() {
  return <div role="status" aria-label="Loading dashboard" className="space-y-8">
    <span className="sr-only">Loading dashboard...</span>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className={`${pulse} h-36 p-6`}><div className="flex justify-between"><Line className="h-2.5 w-28"/><Line className="h-5 w-5"/></div><Line className="mt-10 h-9 w-16"/></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2">{Array.from({ length: 2 }).map((_, panel) => <div key={panel} className={`${pulse} min-h-72`}><div className="border-b border-white/[.06] p-5"><Line className="h-7 w-48"/></div><div className="space-y-0">{Array.from({ length: 3 }).map((_, row) => <div key={row} className="border-b border-white/[.04] p-4"><Line className="h-3 w-32"/><Line className="mt-3 h-2.5 w-3/4"/></div>)}</div></div>)}</div>
  </div>;
}

export function BookingListSkeleton({ rows = 6 }: { rows?: number }) {
  return <div role="status" aria-label="Loading bookings">
    <span className="sr-only">Loading bookings...</span>
    <div className="hidden overflow-hidden border border-white/[.06] 2xl:block"><div className="grid grid-cols-8 gap-4 border-b border-white/[.06] p-4">{Array.from({ length: 8 }).map((_, index) => <Line key={index} className="h-2"/>)}</div>{Array.from({ length: rows }).map((_, index) => <div key={index} className="grid grid-cols-8 gap-4 border-b border-white/[.04] bg-[#140a0b]/50 p-4"><Line className="h-3"/><div><Line className="h-3"/><Line className="mt-2 h-2 w-2/3"/></div><Line className="h-3"/><div><Line className="h-3"/><Line className="mt-2 h-2 w-3/4"/></div><Line className="h-3 w-8"/><Line className="h-3"/><Line className="h-5 w-16"/><Line className="h-7"/></div>)}</div>
    <div className="grid gap-4 2xl:hidden">{Array.from({ length: Math.min(rows, 5) }).map((_, index) => <div key={index} className={`${pulse} p-5`}><div className="flex justify-between gap-4"><div className="w-1/2"><Line className="h-2.5 w-28"/><Line className="mt-3 h-6 w-full"/></div><Line className="h-6 w-20"/></div><div className="my-5 grid grid-cols-2 gap-4 border-y border-white/[.05] py-4"><Line className="h-3"/><Line className="h-3"/><Line className="h-3"/><Line className="h-3"/></div><div className="flex gap-2"><Line className="h-8 w-16"/><Line className="h-8 w-24"/><Line className="h-8 w-20"/></div></div>)}</div>
  </div>;
}

export function TableGridSkeleton() {
  return <div role="status" aria-label="Loading tables">
    <span className="sr-only">Loading tables...</span>
    <Line className="mb-4 h-8 w-52 animate-pulse"/>
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className={`${pulse} min-h-72 p-5`}><div className="flex justify-between"><div><Line className="h-2.5 w-28"/><Line className="mt-4 h-7 w-32"/></div><Line className="h-6 w-20"/></div><Line className="mt-7 h-3 w-36"/><div className="mt-5 flex gap-2"><Line className="h-7 w-24"/><Line className="h-7 w-28"/></div><div className="mt-12 flex gap-2"><Line className="h-8 w-14"/><Line className="h-8 w-24"/><Line className="h-8 w-20"/></div></div>)}</div>
  </div>;
}

export function WalkInListSkeleton() {
  return <BookingListSkeleton rows={5}/>;
}
