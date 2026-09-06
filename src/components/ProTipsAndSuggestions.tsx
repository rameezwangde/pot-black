import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Target, Compass, Sparkles, BookOpen, ChevronRight, Award, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProTipsAndSuggestions() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'technique' | 'rules' | 'etiquette'>('all');
  const [expandedTip, setExpandedTip] = useState<number | null>(0);

  const proTips = [
    {
      id: 1,
      category: 'technique',
      title: 'Mastering Cue Ball English (Spin)',
      summary: 'Understand tangent line deflection and stun shots for millimeter cue ball positioning.',
      content: 'When hitting below center (backspin/draw), ensure your cue stick stays level rather than angling down steeply. A level cue minimizes miscues and creates a crisp, predictable reaction off the object ball.',
      icon: <Target className="w-5 h-5 text-[#D4AF37]" />,
      tag: 'Technique'
    },
    {
      id: 2,
      category: 'rules',
      title: '8-Ball vs 9-Ball Break Strategy',
      summary: 'Why full-force breaks aren’t always optimal on tournament-grade Simonis cloth.',
      content: 'On tight-cut tournament pockets, square ball contact is 10x more important than raw speed. Target the 2nd row ball in 9-ball or the apex ball in 8-ball with a firm, centered follow-through to park the cue ball in the middle.',
      icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
      tag: 'Strategy'
    },
    {
      id: 3,
      category: 'etiquette',
      title: 'Lounge & Table Etiquette',
      summary: 'Essential courtesies for championship tables and fellow club members.',
      content: 'Never place drinks or chalk face-down on table rails. Always wait for players on adjacent tables to finish their shot before stepping into their line of sight or crossing through the aisle.',
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
      tag: 'Etiquette'
    },
    {
      id: 4,
      category: 'technique',
      title: 'The Open vs Closed Bridge Choice',
      summary: 'When to lock the cue in a loop vs using an open V-bridge for elevated sightlines.',
      content: 'Use an open V-bridge when shooting over balls or needing maximum visual clarity on the cue tip contact point. Use a closed loop bridge for high-power break shots and deep draw shots.',
      icon: <Zap className="w-5 h-5 text-[#D4AF37]" />,
      tag: 'Fundamentals'
    }
  ];

  const filteredTips = activeCategory === 'all' 
    ? proTips 
    : proTips.filter(t => t.category === activeCategory);

  return (
    <section className="relative z-10 py-16 md:py-24 bg-[#0a0505] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Player Knowledge Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E2D2A4] uppercase tracking-wide">
              Pro Tips & Table Guidance
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md font-light leading-relaxed">
            Curated techniques, house rules, and game strategies from Pot Black’s resident cue masters to elevate your break.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {[
            { id: 'all', label: 'All Guidance' },
            { id: 'technique', label: 'Cue Technique' },
            { id: 'rules', label: 'Rules & Tactics' },
            { id: 'etiquette', label: 'Club Etiquette' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all rounded-full border ${
                activeCategory === tab.id
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-black/40 text-gray-400 border-white/10 hover:border-[#D4AF37]/50 hover:text-[#E2D2A4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tips Accordion / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTips.map((tip, idx) => {
              const isExpanded = expandedTip === tip.id;
              return (
                <motion.div
                  key={tip.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  className={`cursor-pointer group relative p-6 sm:p-7 rounded-sm border transition-all duration-300 bg-gradient-to-b from-[#140b0b]/90 to-[#0c0606]/90 backdrop-blur-md ${
                    isExpanded 
                      ? 'border-[#D4AF37]/60 shadow-[0_4px_30px_rgba(212,175,55,0.15)]' 
                      : 'border-white/10 hover:border-[#D4AF37]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-colors">
                        {tip.icon}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-[2px] border border-[#D4AF37]/20">
                        {tip.tag}
                      </span>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-90 text-[#D4AF37]' : 'group-hover:translate-x-1'
                      }`}
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-[#E2D2A4] group-hover:text-white transition-colors mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mb-3">
                    {tip.summary}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-white/10 pt-4 mt-3"
                      >
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light bg-black/40 p-4 rounded-sm border border-white/5">
                          💡 <strong className="text-[#E2D2A4] font-medium">Coach's Insight:</strong> {tip.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Read More in Blogs link */}
        <div className="mt-10 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors group"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore full training guides in our Journal & Blogs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
