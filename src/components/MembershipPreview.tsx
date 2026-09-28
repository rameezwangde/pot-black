import { motion } from 'motion/react';
import { Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedHeading from './AnimatedHeading';

export default function MembershipPreview() {
  const tiers = [
    {
      name: 'Silver',
      price: 'AED 1,500',
      period: '/ year',
      icon: <Shield className="w-6 h-6 text-gray-300" />,
      features: ['Priority booking access', '10% off F&B', 'Standard equipment rental'],
      color: 'from-gray-300 to-gray-500',
      text: 'text-gray-300'
    },
    {
      name: 'Gold',
      price: 'AED 2,750',
      period: '/ year',
      icon: <Crown className="w-6 h-6 text-[#D4AF37]" />,
      features: ['All Silver benefits', '25% off F&B', 'VIP private room priority', 'Complimentary valet'],
      color: 'from-[#CBA469] to-[#D4AF37]',
      text: 'text-[#D4AF37]',
      popular: true
    }
  ];

  return (
    <section className="py-20 sm:py-32 relative bg-[#0a0505] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3"
          >
            Exclusive Club Access
          </motion.p>
          <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            Membership <span className="italic gold-text-gradient">Tiers</span>
          </AnimatedHeading>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Elevate your experience with our premium memberships. Enjoy priority bookings, exclusive discounts, and VIP treatment.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-[#140b0b] border ${tier.popular ? 'border-[#D4AF37]' : 'border-white/10'} p-8 rounded-sm shadow-xl flex flex-col h-full`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-sm">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-full bg-gradient-to-br ${tier.color} bg-opacity-10 border border-white/5`}>
                  {tier.icon}
                </div>
                <h3 className={`text-xl font-serif uppercase tracking-widest ${tier.text}`}>{tier.name}</h3>
              </div>
              
              <div className="mb-8">
                <span className="text-3xl sm:text-4xl text-white font-serif tracking-wide">{tier.price}</span>
                <span className="text-gray-500 text-sm ml-2 font-light">{tier.period}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`text-lg leading-none ${tier.text}`}>•</span>
                    <span className="text-gray-300 text-sm font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/membership"
                className={`w-full block text-center py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                    : 'border border-white/20 text-white hover:border-gray-300 hover:bg-white/5'
                }`}
              >
                View Full Benefits
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
