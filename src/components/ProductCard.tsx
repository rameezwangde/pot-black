import { motion } from 'motion/react';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  key?: string | number;
  onImageClick?: (images: string[]) => void;
}

export default function ProductCard({ product, onImageClick }: ProductCardProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const isOutOfStock = product.stockStatus === 'Out of Stock' || product.quantityInStock <= 0;

  const cartItem = cartItems.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.cartQuantity : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(product.images && product.images.length > 0 ? product.images : [product.image]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#2A1B1B]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group flex flex-col"
    >
      <div 
        className="relative aspect-square overflow-hidden bg-black/40 cursor-pointer flex items-center justify-center"
        onClick={handleImageClick}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        {product.salePrice && (
          <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10">
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
          
          {quantityInCart > 0 ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase tracking-wider text-green-400 font-medium flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> In Cart
              </span>
              <div className="flex items-center bg-white/5 rounded-full border border-white/10 h-10">
                <button 
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="px-3 h-full text-white/70 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantityInCart}</span>
                <button 
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="px-3 h-full text-white/70 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-4 py-2.5 h-10 rounded-full flex items-center justify-center gap-2 transition-all duration-300 min-w-[100px] ${
                isOutOfStock 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black'
              }`}
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium tracking-wide hidden sm:block">Add</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
