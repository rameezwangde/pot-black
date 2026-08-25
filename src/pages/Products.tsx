import { useState } from 'react';
import { motion } from 'motion/react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Accessories', 'Bags & Cases', 'Billiards Cues', 'Billiards Cue Tips'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-medium">Pot Black Pro Shop</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-normal text-white uppercase tracking-wider mb-6"
          >
            Premium <span className="font-serif italic text-[#D4AF37]">Gear</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Elevate your game with our curated selection of professional billiards equipment.
          </motion.p>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === category
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-semibold'
                  : 'bg-transparent border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-white/50 py-20 text-lg font-light tracking-wide">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
