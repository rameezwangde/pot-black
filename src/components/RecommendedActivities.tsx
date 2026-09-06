import { motion } from 'motion/react';
import { Sparkles, Trophy, Users, Shield, ArrowRight, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendedActivities() {
  const recommendations = [
    {
      badge: "MOST POPULAR",
      category: "Social & Leisure",
      title: "Casual 8-Ball & Lounge Session",
      desc: "Perfect for friends, couples, or informal gatherings. Enjoy chilled beverages, artisan snacks, and relaxed gameplay.",
      duration: "1 - 2 Hours",
      suitableFor: "Casual players & Groups (2-6)",
      tableType: "English or American Pool",
      features: ["Complimentary lounge seating", "Food & beverage service table-side", "Standard & pro house cues provided"],
      actionText: "Book Casual Table",
      link: "/booking",
      highlight: false
    },
    {
      badge: "CHAMPIONSHIP GRADE",
      category: "Competitive & Pro",
      title: "Championship Snooker Solo & Match Play",
      desc: "Practice precision potting and break-building on full-size 12ft tournament slate tables equipped with shadowless lighting.",
      duration: "2 - 3 Hours",
      suitableFor: "Snooker enthusiasts & Tournament players",
      tableType: "12ft Full-Size Snooker",
      features: ["Strachan 6811 tournament cloth", "Laser-calibrated lighting canopy", "Scoreboard & electronic timer support"],
      actionText: "Reserve Snooker Table",
      link: "/booking",
      highlight: true
    },
    {
      badge: "EXCLUSIVE EXPERIENCE",
      category: "Private Luxury",
      title: "VIP Lounge & Private Suite Match",
      desc: "Host private parties, corporate networking events, or birthday tournaments in a secluded high-end room with dedicated staff.",
      duration: "3+ Hours / Half-Day",
      suitableFor: "Corporate events, Parties & VIP Guests",
      tableType: "VIP American Pool Suite",
      features: ["Private audio & entertainment system", "Dedicated club host & butler service", "Custom catering options"],
      actionText: "Inquire VIP Booking",
      link: "/booking",
      highlight: false
    }
  ];

  return (
    <section className="relative z-10 py-16 md:py-24 bg-gradient-to-b from-[#0a0505] via-[#120808] to-[#0a0505]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated For Your Playstyle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E2D2A4] uppercase tracking-wide mb-4">
            Recommended Activities
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
            Not sure what to book? Discover our tailored cue sports experiences designed for casual games, intense tournament practice, or VIP celebrations.
          </p>
        </div>

        {/* 3 Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex flex-col justify-between p-8 rounded-sm transition-all duration-300 ${
                rec.highlight
                  ? 'bg-gradient-to-b from-[#221010] to-[#120707] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.18)] lg:-translate-y-2'
                  : 'bg-[#140b0b]/80 border border-white/10 hover:border-[#D4AF37]/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-[2px] ${
                    rec.highlight 
                      ? 'bg-[#D4AF37] text-black shadow-sm' 
                      : 'bg-white/5 text-[#D4AF37] border border-[#D4AF37]/20'
                  }`}>
                    {rec.badge}
                  </span>
                  <span className="text-xs text-gray-400 font-light">
                    {rec.category}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-2xl font-serif text-[#E2D2A4] mb-3 leading-snug">
                  {rec.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {rec.desc}
                </p>

                {/* Quick Attributes */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 mb-6 bg-black/20 px-3 rounded-sm">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{rec.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{rec.suitableFor}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 mb-8">
                  {rec.features.map((feat, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-xs text-gray-300 font-light">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                to={rec.link}
                className={`w-full py-3.5 px-6 rounded-[2px] text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 ${
                  rec.highlight
                    ? 'bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02]'
                    : 'bg-transparent border border-[#D4AF37]/50 text-[#E2D2A4] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]'
                }`}
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
