import React from 'react';
import { motion } from 'motion/react';

export default function Blogs() {
  return (
    <>
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0505]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-[#0a0505]/30 to-transparent" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-medium">Pot Black</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            Our <span className="italic text-[#D4AF37]">Blogs</span>
          </motion.h1>
        </div>
      </section>

      <div className="min-h-[40vh] pb-24 relative z-10 bg-[#0a0505]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center text-gray-400">
            <p>Coming Soon...</p>
          </div>
        </div>
      </div>
    </>
  );
}
