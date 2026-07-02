import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Gallery() {
  const images = [
    "/gallery_1.png",
    "/gallery_2.png",
    "/gallery_3.png",
    "/gallery_4.png",
    "/gallery_5.png"
  ];

  return (
    <section id="gallery" className="relative z-10 py-24 md:py-32 border-t border-white/5 bg-[#241616]/30">
      <div className="max-w-[1600px] mx-auto px-8 mb-16 flex justify-center">
        <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-semibold">GALLERY</span>
      </div>

      <div className="w-full flex overflow-x-auto snap-x hide-scrollbar mb-16 gap-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="shrink-0 w-[280px] md:w-[20vw] aspect-[4/3] snap-center overflow-hidden border border-white/5 group relative cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src={img} 
              alt={`Gallery ${i+1}`} 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <a href="#" className="inline-flex items-center gap-3 px-8 py-4 border border-[#D4AF37]/50 text-white text-xs uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-colors">
          VIEW FULL GALLERY <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </a>
      </div>
    </section>
  );
}
