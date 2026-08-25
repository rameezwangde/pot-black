import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Accessories', 'Bags & Cases', 'Billiards Cues', 'Billiards Cue Tips'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/products-hero.jpg" alt="Pot Black Pro Shop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0505]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-[#0a0505]/30 to-transparent" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            Premium <span className="italic text-[#D4AF37]">Gear</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base"
          >
            Elevate your game with our curated selection of professional billiards equipment.
          </motion.p>
        </div>
      </section>

      <div className="min-h-screen pb-24 relative z-10 bg-[#0a0505]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">

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
              <ProductCard 
                key={product.id} 
                product={product} 
                onImageClick={(images) => {
                  setLightboxImages(images);
                  setLightboxIndex(0);
                }}
              />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center text-white/50 py-20 text-lg font-light tracking-wide">
              No products found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white z-[110] transition-colors bg-black/20 rounded-full p-2"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt="Product View" 
                className="max-h-[90vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {lightboxImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black p-3 rounded-full transition-all border border-white/10"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#D4AF37] text-white hover:text-black p-3 rounded-full transition-all border border-white/10"
                  >
                    <ChevronRight size={32} />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full border border-white/10 text-white/80 text-sm tracking-widest font-medium">
                    {lightboxIndex + 1} / {lightboxImages.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
