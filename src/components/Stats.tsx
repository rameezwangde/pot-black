import { motion } from 'motion/react';
import { Trophy, Users, Crosshair } from 'lucide-react';

export default function Stats() {
  return (
    <div className="bg-[#0a0505] relative z-10 w-full">
      <div className="max-w-[1200px] mx-auto px-4 py-12 border-b border-white/5 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          
          <motion.div 
            className="flex w-full max-w-xs items-center gap-5 sm:gap-6 md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Crosshair size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">20+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Premium Tables</p>
            </div>
          </motion.div>

          <div className="hidden md:block w-[1px] h-16 bg-white/5" />

          <motion.div 
            className="flex w-full max-w-xs items-center gap-5 sm:gap-6 md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Trophy size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">5+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Years of Legacy</p>
            </div>
          </motion.div>

          <div className="hidden md:block w-[1px] h-16 bg-white/5" />

          <motion.div 
            className="flex w-full max-w-xs items-center gap-5 sm:gap-6 md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-1">2K+</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Happy Members</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
