import { CalendarCheck, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingHero() {
  return (
    <section className="relative min-h-[440px] h-[56vh] max-h-[620px] flex items-end overflow-hidden">
      <img src="/hero-image.png" alt="Pot Black billiards tables" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080605]/95 via-[#080605]/75 to-[#080605]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-transparent to-black/40" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 md:pb-20">
        <p className="text-[#D4AF37] text-[10px] sm:text-xs tracking-[.32em] uppercase mb-4">Pot Black Reservations</p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#F3E5AB] mb-5">Reserve Your Table</h1>
        <p className="max-w-2xl text-sm sm:text-base text-gray-300 font-light leading-relaxed">Choose your preferred table, date, and playing time. Live availability helps you plan your visit without waiting.</p>
        <div className="flex flex-wrap gap-5 sm:gap-8 mt-7 text-[10px] uppercase tracking-[.16em] text-gray-200">
          <span className="flex items-center gap-2"><Radio size={15} className="text-emerald-400" /> Live Table Availability</span>
          <span className="flex items-center gap-2"><CalendarCheck size={15} className="text-[#D4AF37]" /> Quick Slot Reservation</span>
        </div>
      </motion.div>
    </section>
  );
}

