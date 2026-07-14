const items = [['bg-emerald-500','Available'],['bg-[#D4AF37]','Selected'],['bg-[#7f3030]','Booked'],['bg-gray-500','Unavailable']];
export default function AvailabilityLegend() { return <div className="flex flex-wrap gap-x-5 gap-y-2">{items.map(([color,label]) => <span key={label} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-400"><i className={`w-2 h-2 rounded-full ${color}`} />{label}</span>)}</div>; }

