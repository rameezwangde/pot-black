import { motion } from 'motion/react';
const BilliardBallsIcon = () => (
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25">
    <circle cx="12" cy="26" r="4.5" />
    <circle cx="20" cy="26" r="4.5" />
    <circle cx="28" cy="26" r="4.5" />
    <circle cx="16" cy="18.5" r="4.5" />
    <circle cx="24" cy="18.5" r="4.5" />
    <circle cx="20" cy="11" r="4.5" />
  </svg>
);

const CrossedCuesIcon = () => (
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="12" x2="28" y2="28" />
    <line x1="28" y1="12" x2="12" y2="28" />
    <rect x="25" y="25" width="4" height="6" transform="rotate(-45 27 28)" />
    <rect x="11" y="25" width="4" height="6" transform="rotate(45 13 28)" />
    <circle cx="10" cy="10" r="1" fill="currentColor"/>
    <circle cx="30" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const CocktailIcon = () => (
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 12l10 10 10-10H10z" />
    <line x1="20" y1="22" x2="20" y2="32" />
    <line x1="15" y1="32" x2="25" y2="32" />
    <circle cx="26" cy="10" r="1.5" />
    <path d="M14 12l1 3" />
  </svg>
);

const LockIcon = () => (
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="13" y="18" width="14" height="12" rx="1.5" />
    <path d="M17 18v-4a3 3 0 016 0v4" />
    <circle cx="20" cy="24" r="1" />
    <path d="M20 25v2" />
  </svg>
);

export default function Amenities() {
  return (
    <section className="relative z-10 py-12 md:py-16 bg-[#0a0505]">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[#E2D2A4] uppercase tracking-[0.3em] text-[12px] font-medium block">PREMIUM AMENITIES</span>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {[
            { icon: <BilliardBallsIcon />, title: "WORLD CLASS TABLES", desc: "Professionally maintained\ntables for the perfect play." },
            { icon: <CrossedCuesIcon />, title: "TOP TIER EQUIPMENT", desc: "High quality cues and\naccessories for champions." },
            { icon: <CocktailIcon />, title: "LUXURY LOUNGE", desc: "Relax, unwind and enjoy our\nsignature food & drinks." },
            { icon: <LockIcon />, title: "PRIVATE SPACES", desc: "Exclusive rooms for private\nevents and gatherings." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center group px-6 lg:px-12 relative">
              <div className="text-[#D4AF37] mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                {feature.icon}
              </div>
              <h4 className="text-[#EAE0C8] text-[13px] font-semibold tracking-[0.1em] uppercase mb-5 whitespace-nowrap">{feature.title}</h4>
              <p className="text-[#9ca3af] text-[13px] font-light leading-[1.8] whitespace-pre-line max-w-[240px]">
                {feature.desc}
              </p>
              
              {/* Custom short vertical divider */}
              {i !== 3 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-24 bg-white/10" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
