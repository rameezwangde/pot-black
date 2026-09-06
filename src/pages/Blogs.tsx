import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, ArrowRight, Tag, Search, Sparkles, BookOpen, ChevronRight, X } from 'lucide-react';
import { blogPosts, type BlogPost } from '../data/blogData';

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Pro Tips & Technique', 'Game Guides', 'Lifestyle & Events', 'Behind The Scenes'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
  const regularPosts = filteredPosts.filter(p => (selectedCategory === 'All' && !searchQuery ? !p.featured : true));

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[45vh] flex items-center bg-gradient-to-b from-[#140808] to-[#0a0505]">
        <div className="absolute inset-0 z-0">
          <img
            src="/cta_bg.png"
            alt="Blogs Header Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505]/80 via-[#0a0505]/95 to-[#0a0505]" />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-medium">Pot Black Journal</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-4 tracking-wide"
          >
            News, Insights & <span className="italic text-[#D4AF37]">Cue Tips</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed"
          >
            Explore game strategies, table physics, tournament recaps, and club stories written by our master coaches and players.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="min-h-[50vh] pb-24 relative z-10 bg-[#0a0505]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls: Search & Categories */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-y border-white/10 mb-12">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all rounded-full border ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-black/40 text-gray-400 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#140b0b] border border-white/10 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Featured Post (shown if in 'All' category and no search active) */}
          {selectedCategory === 'All' && !searchQuery && featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 rounded-sm border border-[#D4AF37]/30 bg-gradient-to-r from-[#180d0d] via-[#120707] to-[#0e0505] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140808] via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-[2px] flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Article</span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-[#D4AF37] mb-3">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4] group-hover:text-white transition-colors mb-4 leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-gray-400">{featuredPost.author.role}</p>
                    </div>

                    <button
                      onClick={() => setSelectedPost(featuredPost)}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37] group-hover:text-white transition-colors"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setSelectedPost(post)}
                  className="cursor-pointer group flex flex-col justify-between rounded-sm border border-white/10 bg-[#140b0b]/70 hover:border-[#D4AF37]/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 overflow-hidden"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="h-52 w-full overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-[2px]">
                        {post.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#D4AF37]" /> {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif text-[#E2D2A4] group-hover:text-white transition-colors mb-3 leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-[2px] border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-light">{post.author.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37] group-hover:text-white transition-colors">
                      Read <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-black/20 border border-white/5 rounded-sm">
              <BookOpen className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#E2D2A4] mb-2">No Articles Found</h3>
              <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6 font-light">
                We couldn't find any articles matching your search criteria. Try a different query or category filter.
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-[2px]"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#140b0b] border border-[#D4AF37]/40 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-white/10 text-gray-300 hover:text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Cover Image */}
              <div className="h-64 sm:h-72 w-full relative">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140b0b] via-[#140b0b]/40 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#D4AF37] text-black px-3 py-1 rounded-[2px]">
                    {selectedPost.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-10">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedPost.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedPost.readTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedPost.author.name} ({selectedPost.author.role})</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#E2D2A4] mb-6 leading-snug">
                  {selectedPost.title}
                </h2>

                <div className="space-y-4 text-gray-300 text-sm sm:text-base font-light leading-relaxed border-t border-white/10 pt-6">
                  {selectedPost.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Tags in modal */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-sm border border-[#D4AF37]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer CTA in modal */}
                <div className="mt-8 p-6 bg-black/40 border border-[#D4AF37]/20 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-serif text-[#E2D2A4] uppercase">Ready to test these techniques?</h4>
                    <p className="text-xs text-gray-400 font-light">Book a championship table or VIP session at Pot Black.</p>
                  </div>
                  <a
                    href="/booking"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#CBA469] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.15em] rounded-[2px] shrink-0"
                  >
                    Book Table Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
