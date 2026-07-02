import { motion } from 'motion/react';
import { Target, Shield, Trophy } from 'lucide-react';
import AnimatedHeading from './AnimatedHeading';

export default function Equipment() {
  const features = [
    {
      icon: <Trophy className="w-10 h-10 text-billiards-gold" />,
      title: "Championship Tables",
      description: "Play on full-size professional tables with slate beds, meticulously leveled and maintained daily for tournament-grade true roll."
    },
    {
      icon: <Shield className="w-10 h-10 text-billiards-gold" />,
      title: "Simonis Green Felt",
      description: "Every table is draped in premium Simonis worsted wool cloth, ensuring the fastest, most consistent play surface available."
    },
    {
      icon: <Target className="w-10 h-10 text-billiards-gold" />,
      title: "Aramith Pro Balls",
      description: "Experience the perfect strike with Super Aramith Pro-Cup sets, featuring superior balance, rebound, and the iconic measles cue ball."
    }
  ];

  return (
    <section id="equipment" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-billiards-dark -z-20" />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-billiards-dark/90 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1575444758702-4a6b92f72e9e?q=80&w=2000&auto=format&fit=crop" 
          alt="Billiards Equipment" 
          className="w-full h-full object-cover opacity-10 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-billiards-dark via-transparent to-billiards-dark z-20" />
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-billiards-gold/20 to-transparent z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-billiards-emerald/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            className="text-billiards-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Uncompromising Quality
          </motion.span>
          <AnimatedHeading delay={0.1} className="text-4xl md:text-5xl lg:text-6xl font-serif">
            Premium <span className="italic gold-text-gradient">Equipment</span>
          </AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-10 hover:border-billiards-gold/40 transition-all duration-700 group hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-billiards-gold/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 w-20 h-20 bg-billiards-dark/80 border border-billiards-gold/20 flex items-center justify-center rounded-full group-hover:scale-110 group-hover:border-billiards-gold/50 transition-all duration-500 shadow-inner">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-white group-hover:text-billiards-gold transition-colors duration-500">{feature.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
