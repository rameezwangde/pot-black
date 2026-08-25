import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stockStatus === 'Out of Stock' || product.quantityInStock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#2A1B1B]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.salePrice && (
          <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Sale
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white text-lg font-bold tracking-widest uppercase border-y border-white/20 py-2 px-8">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs text-[#D4AF37] uppercase tracking-widest mb-2">
          {product.category}
        </div>
        
        <h3 className="text-xl font-medium text-white mb-3 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-white/60 text-sm mb-6 line-clamp-3 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-white/40 line-through text-sm">AED {product.price}</span>
                <span className="text-xl text-[#D4AF37] font-semibold">AED {product.salePrice}</span>
              </div>
            ) : (
              <span className="text-xl text-white font-semibold">AED {product.price}</span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                : 'bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black hover:scale-110'
            }`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
