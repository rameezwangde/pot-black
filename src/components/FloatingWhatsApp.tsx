import React from 'react';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/971566977607"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce-slow group drop-shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp Logo" 
        className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg"
      />
      {/* Optional Hover Text */}
      <span className="absolute right-full mr-4 bg-white text-black text-sm font-semibold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
        Chat with us!
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
