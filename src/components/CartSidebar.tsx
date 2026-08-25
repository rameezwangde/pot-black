import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const { clearCart } = useCart();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
      setTimeout(() => {
        setCheckoutSuccess(false);
        toggleCart();
      }, 3000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-[#1A0E0E] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#D4AF37]" size={24} />
                <h2 className="text-xl font-medium uppercase tracking-widest text-white">Your Cart</h2>
              </div>
              <button 
                onClick={toggleCart}
                className="text-white/50 hover:text-white transition-colors p-2"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 && !checkoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-lg font-light tracking-wide">Your cart is empty.</p>
                </div>
              ) : checkoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-white">Order Placed!</h3>
                  <p className="text-white/60">Thank you for your purchase.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/40 hover:text-red-400 transition-colors shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-[#D4AF37] text-sm mt-1">AED {item.salePrice || item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-white/5 rounded-full border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                              className="p-1.5 text-white/70 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.cartQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              className="p-1.5 text-white/70 hover:text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/5 p-6 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-xl text-white font-semibold">AED {cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-gradient-to-r from-[#b38b4d] to-[#d4b075] text-black font-semibold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform duration-300 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
