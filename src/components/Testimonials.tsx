import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Pro Player",
      text: "Pot Black offers the finest tables in the city. The atmosphere is unmatched, and the equipment is maintained to tournament standards.",
      initial: "A"
    },
    {
      name: "Sarah Jenkins",
      role: "Regular Member",
      text: "The perfect place to unwind after work. The VIP lounge feels incredibly exclusive, and the service is always impeccable.",
      initial: "S"
    },
    {
      name: "Mohammed Al Fayed",
      role: "Tournament Champion",
      text: "I've played in clubs all over the world, and Pot Black stands out for its pure class, amazing lighting, and true-roll tables.",
      initial: "M"
    }
  ];

  return (
    <section className="py-24 bg-[#0a0505] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-medium block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            WORDS FROM OUR GUESTS
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl font-serif text-white mb-6 uppercase tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Testimonials
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="bg-[#120a0a] border border-[#2a1b1b] p-8 md:p-10 relative group hover:border-[#D4AF37]/30 transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Quote className="w-10 h-10 text-[#D4AF37]/20 absolute top-8 right-8" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#1a0f0a] border border-[#3d2314] flex items-center justify-center">
                  <span className="text-[#D4AF37] font-serif text-xl">{testimonial.initial}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium tracking-wider uppercase text-sm">{testimonial.name}</h4>
                  <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] mt-1">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed text-sm font-light">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
