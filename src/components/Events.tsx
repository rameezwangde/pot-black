import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Events() {
  const events = [
    {
      date: "24",
      month: "MAY",
      title: "8 BALL TOURNAMENT",
      fullDate: "24 MAY 2025",
      subtitle: "PRIZE POOL ₹50,000",
      image: "/event_1.png"
    },
    {
      date: "07",
      month: "JUN",
      title: "POT BLACK MASTERS",
      fullDate: "07 JUNE 2025",
      subtitle: "PRIZE POOL ₹1,00,000",
      image: "/event_2.png"
    },
    {
      date: "14",
      month: "JUN",
      title: "LADIES NIGHT OUT",
      fullDate: "14 JUNE 2025",
      subtitle: "FREE ENTRY",
      image: "/event_3.png"
    }
  ];

  return (
    <section id="events" className="relative z-10 pt-12 md:pt-16 pb-24 md:pb-32 bg-[#0a0505]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-16 justify-between items-center">
          
          <motion.div 
            className="xl:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#9ca3af] uppercase tracking-[0.2em] text-[10px] font-semibold mb-6 block">TOURNAMENTS & EVENTS</span>
            <h2 className="text-4xl lg:text-[2.25rem] font-serif text-[#E2D2A4] leading-[1.2] mb-6 uppercase drop-shadow-md">
              WHERE CHAMPIONS<br/>ARE MADE.
            </h2>
            <p className="text-[#9ca3af] font-light mb-10 leading-[1.8] text-[13px] max-w-sm">
              From exciting tournaments to exclusive members events, the action never stops.
            </p>
            <a href="#" className="inline-flex items-center gap-3 px-8 py-4 border border-[#8C7640]/40 bg-black/50 text-[#8C7640] font-medium text-[10px] uppercase tracking-[0.2em] hover:bg-[#8C7640]/10 hover:border-[#8C7640] transition-all rounded-[1px]">
              VIEW UPCOMING EVENTS <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <div className="w-full min-w-0 xl:w-2/3 flex items-center gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="group relative flex flex-col rounded-[2px] overflow-hidden border border-white/5 bg-[#110808] cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-[#8C7640]/30 flex flex-col items-center justify-center w-[46px] h-[52px] rounded-sm">
                      <span className="text-white font-serif text-[15px] leading-none mb-1">{event.date}</span>
                      <span className="text-[#8C7640] text-[8px] font-bold uppercase tracking-widest">{event.month}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-white font-medium text-[13px] tracking-[0.1em] mb-4 uppercase">{event.title}</h3>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[#9ca3af] text-[10px] uppercase tracking-wider">{event.fullDate}</span>
                      <span className="text-[#8C7640] text-[10px] uppercase tracking-wider font-medium">{event.subtitle}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="hidden lg:flex flex-col gap-4 shrink-0">
              <button className="w-[42px] h-[42px] rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#8C7640] hover:text-[#8C7640] transition-colors bg-[#110808]">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="w-[42px] h-[42px] rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#8C7640] hover:text-[#8C7640] transition-colors bg-[#110808]">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
