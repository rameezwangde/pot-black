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
    },
    {
      name: "James Wilson",
      role: "Snooker Enthusiast",
      text: "Exceptional tables and a great vibe. The best place in town for serious players who want a premium experience.",
      initial: "J"
    },
    {
      name: "Michael Chang",
      role: "Amateur League Player",
      text: "I love the weekly tournaments here. The staff is friendly, the competition is fierce, and the environment is spectacular.",
      initial: "M"
    },
    {
      name: "David Thompson",
      role: "Corporate Member",
      text: "We host our company events here. It's always a hit with the team, thanks to the VIP service and catering.",
      initial: "D"
    },
    {
      name: "Elena Rodriguez",
      role: "Beginner",
      text: "I took a few lessons here and the instructors are fantastic. Very welcoming environment for newcomers to the sport.",
      initial: "E"
    },
    {
      name: "Robert Chen",
      role: "Casual Player",
      text: "Perfect spot for a weekend game with friends. The food and drinks menu is also surprisingly good for a billiards club.",
      initial: "R"
    },
    {
      name: "Sophia Martinez",
      role: "Event Organizer",
      text: "Organized a charity tournament at Pot Black and everything was flawless. The management team went above and beyond.",
      initial: "S"
    },
    {
      name: "Daniel Kim",
      role: "Billiards Coach",
      text: "The equipment here is top-notch. I always recommend my students to practice at Pot Black to get used to fast cloth.",
      initial: "D"
    },
    {
      name: "Olivia Taylor",
      role: "Social Member",
      text: "Great atmosphere, nice music, and excellent service. A classy place to hang out even if you don't play much.",
      initial: "O"
    },
    {
      name: "William Davis",
      role: "Frequent Visitor",
      text: "The membership perks are totally worth it. Priority booking and exclusive events are a big plus for regulars like me.",
      initial: "W"
    },
    {
      name: "Emma White",
      role: "First-time Visitor",
      text: "Was blown away by the decor and the quality of the tables. The lighting makes every game feel like a televised final.",
      initial: "E"
    }
  ];

  // Double the testimonials array to create a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-[#0a0505] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-8 relative z-10 mb-16 md:mb-24">
        <div className="text-center">
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
      </div>

      <div className="relative w-full overflow-hidden flex pb-8">
        <motion.div
          className="flex gap-8 px-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div
              key={i}
              className="w-[350px] md:w-[450px] shrink-0 bg-[#120a0a] border border-[#2a1b1b] p-8 md:p-10 relative group hover:border-[#D4AF37]/30 transition-colors duration-500"
            >
              <Quote className="w-10 h-10 text-[#D4AF37]/20 absolute top-8 right-8" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-[#1a0f0a] border border-[#3d2314] flex items-center justify-center shrink-0">
                  <span className="text-[#D4AF37] font-serif text-xl">{testimonial.initial}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium tracking-wider uppercase text-sm truncate max-w-[200px]">{testimonial.name}</h4>
                  <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] mt-1">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed text-sm font-light">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
