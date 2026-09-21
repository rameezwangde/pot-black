import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// This interface matches the Tina CMS schema we defined for the Gallery
export interface GalleryCategory {
  title: string;
  description?: string;
  images: string[];
}

// Simulated fetch from Tina CMS content/gallery directory
// In a real Tina setup, you would use `client.queries.galleryConnection()` here.
const fetchGalleryCategories = async (): Promise<GalleryCategory[]> => {
  // Placeholder data that matches the Tina CMS JSON structure
  return [
    {
      title: "Tournaments",
      description: "Highlights from our recent professional snooker and billiards tournaments.",
      images: [
        "/event_1.png",
        "/event_2.png",
        "/event_3.png"
      ]
    },
    {
      title: "Lounge & VIP",
      description: "Experience our premium lounge area and exclusive VIP rooms.",
      images: [
        "/vip_room.png",
        "/gallery_4.png",
        "/gallery_5.png"
      ]
    },
    {
      title: "Coaching",
      description: "Expert coaching sessions for all skill levels.",
      images: [
        "/expert_coaching.png",
        "/gallery_1.png",
        "/gallery_2.png",
        "/gallery_3.png"
      ]
    }
  ];
};

export default function Gallery() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGalleryCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].title);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const currentCategoryData = categories.find(c => c.title === activeCategory);

  return (
    <>
      {/* Page Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 overflow-hidden min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a0505]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E0E] via-[#0a0505]/50 to-[#0a0505]" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-medium">Pot Black</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#E2D2A4] uppercase drop-shadow-md mb-8 tracking-wide"
          >
            Our <span className="italic text-[#D4AF37]">Gallery</span>
          </motion.h1>
          
          {/* Category Tabs */}
          {!loading && categories.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12"
            >
              {categories.map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(cat.title)}
                  className={`text-xs md:text-sm uppercase tracking-[0.2em] pb-2 border-b-2 transition-colors duration-300 ${
                    activeCategory === cat.title 
                      ? 'border-[#D4AF37] text-[#D4AF37]' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-12 relative z-10 bg-[#0a0505] min-h-[60vh]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          ) : currentCategoryData ? (
            <div className="flex flex-col items-center">
              {currentCategoryData.description && (
                <motion.p 
                  key={`desc-${currentCategoryData.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center max-w-2xl mb-12"
                >
                  {currentCategoryData.description}
                </motion.p>
              )}
              
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              >
                <AnimatePresence mode="popLayout">
                  {currentCategoryData.images.map((imgSrc, index) => (
                    <motion.div
                      key={`${currentCategoryData.title}-${imgSrc}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-sm aspect-[4/3] bg-black/50"
                    >
                      <img 
                        src={imgSrc} 
                        alt={`${currentCategoryData.title} image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-colors duration-500 pointer-events-none m-4" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              No gallery items found.
            </div>
          )}
          
        </div>
      </section>
    </>
  );
}
