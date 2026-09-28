import { motion } from 'motion/react';
import { Check, Star, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Membership() {
  const tiers = [
    {
      name: 'Silver',
      price: 'AED 1,500',
      period: 'per year',
      icon: <Shield className="w-8 h-8 text-gray-300" />,
      features: [
        'Priority booking access',
        '10% off food and beverages',
        'Standard equipment rental included',
        'Access to Silver members lounge',
      ],
      color: 'from-gray-300 to-gray-500',
      text: 'text-gray-300'
    },
    {
      name: 'Gold',
      price: 'AED 2,750',
      period: 'per year',
      icon: <Crown className="w-8 h-8 text-[#D4AF37]" />,
      features: [
        'All Silver benefits',
        '25% off food and beverages',
        'Premium cue selection included',
        'VIP private room priority',
        'Free entry to monthly tournaments',
        'Complimentary valet parking'
      ],
      color: 'from-[#CBA469] to-[#D4AF37]',
      text: 'text-[#D4AF37]',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0505]">
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0505]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-transparent to-transparent" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#968351] uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6 block"
          >
            Exclusive Access
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            Pot Black <span className="italic text-[#D4AF37]">Membership</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed"
          >
            Elevate your experience with our premium membership tiers. Enjoy priority bookings, exclusive discounts, and unparalleled VIP treatment.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 sm:py-24 z-10 bg-[#0a0505]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative bg-[#140b0b]/90 border ${tier.popular ? 'border-[#D4AF37]' : 'border-white/10'} p-8 rounded-sm overflow-hidden`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-widest py-1 px-3">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${tier.color} bg-opacity-10`}>
                    {tier.icon}
                  </div>
                  <h3 className={`text-2xl font-serif uppercase tracking-widest ${tier.text}`}>{tier.name}</h3>
                </div>
                
                <div className="mb-8">
                  <span className="text-3xl sm:text-4xl text-white font-serif">{tier.price}</span>
                  <span className="text-gray-500 text-sm ml-2">{tier.period}</span>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${tier.text}`} />
                      <span className="text-gray-300 text-sm font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/contact"
                  className={`w-full block text-center py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                    tier.popular 
                      ? 'bg-[#D4AF37] text-black hover:bg-[#F3E5AB]' 
                      : 'border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  Inquire Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
