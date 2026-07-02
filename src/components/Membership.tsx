import { motion } from 'motion/react';
import { ArrowRight, Crown } from 'lucide-react';

export default function Membership() {
  const plans = [
    {
      name: "GOLD",
      desc: "Experience exclusive benefits and priority access to tournaments.",
      price: "AED 2,750",
      period: "/ 12 MONTHS",
      features: [
        "15% Off on Games",
        "15% Off on Food",
        "Free Parking and Locker",
        "2 Entry Free in Tournament",
        "Birthday Celebration"
      ],
      isPopular: true
    },
    {
      name: "SILVER",
      desc: "Perfect for regular players who love the game and community.",
      price: "AED 1,500",
      period: "/ 12 MONTHS",
      features: [
        "10% Off on Games",
        "10% Off on Food",
        "Free Locker",
        "1 Entry Free in Tournament",
        "Birthday Celebration"
      ],
      isPopular: false
    }
  ];

  return (
    <section id="membership" className="relative z-10 pt-24 md:pt-32 pb-12 md:pb-16 bg-[#0a0505]">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 xl:grid-cols-[4fr_8fr] gap-16 lg:gap-24 items-center">
          
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl lg:text-[2.75rem] font-serif text-[#E2D2A4] leading-[1.15] mb-6 uppercase drop-shadow-md">
              MEMBERSHIP<br/>THAT ELEVATES
            </h2>
            <p className="text-[#9ca3af] font-light mb-10 leading-[1.8] text-[13px] max-w-sm">
              Unlock exclusive privileges, priority bookings, members only events and a community of players who live the game.
            </p>
            <div>
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 border border-[#8C7640]/40 bg-black/50 text-[#8C7640] font-medium text-[10px] uppercase tracking-[0.2em] hover:bg-[#8C7640]/10 hover:border-[#8C7640] transition-all rounded-[1px]">
                VIEW PLANS <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto xl:mx-0 xl:ml-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className={`relative flex flex-col p-10 lg:p-12 transition-colors rounded-[2px] ${plan.isPopular ? 'border border-[#B39A5D] bg-[#110808]/80' : 'border border-white/5 bg-[#110808]/40'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-[#B39A5D] text-black text-[9px] uppercase tracking-[0.2em] px-6 py-1.5 font-bold rounded-sm">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4 text-[#D4AF37]">
                      <Crown className="w-8 h-8" strokeWidth={1.25} />
                    </div>
                    <h3 className="text-[13px] font-medium text-white uppercase tracking-[0.2em] mb-4">{plan.name}</h3>
                    <p className="text-[11px] text-[#9ca3af] mb-6 leading-relaxed px-4">{plan.desc}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl lg:text-[2.5rem] font-serif text-[#D4AF37]">{plan.price}</span>
                      <span className="text-[9px] text-[#9ca3af] uppercase tracking-wider">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="flex flex-col space-y-4 px-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#d1d5db] text-[12px] font-light">
                        <span className="text-[#D4AF37] text-lg leading-none mt-[-2px]">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
