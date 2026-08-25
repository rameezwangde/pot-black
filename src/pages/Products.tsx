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
