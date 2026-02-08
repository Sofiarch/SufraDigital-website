import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, UtensilsCrossed } from 'lucide-react';
import BlurImage from './BlurImage';

const MenuCard = ({ 
  item, 
  cart = [], 
  onUpdateCart, 
  currency = "IQD", 
  isDark = false, 
  accentColor = "#D4AF37", 
  lang = 'en',
  onImageClick 
}) => {
  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAvailable = item.is_available !== false;

  const handleAdd = (e) => { e.stopPropagation(); onUpdateCart(item, 1); };
  const handleInc = (e) => { e.stopPropagation(); onUpdateCart(item, quantity + 1); };
  const handleDec = (e) => { e.stopPropagation(); onUpdateCart(item, quantity - 1); };

  // Dynamic Styles
  const cardBg = isDark ? '#1C1917' : '#FFFFFF';
  const textColor = isDark ? '#E7E5E4' : '#422006';
  const borderColor = isDark ? '#333' : '#E7E5E4';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-2xl flex flex-col h-full transition-all duration-300
        ${!isAvailable ? 'opacity-60 grayscale cursor-not-allowed' : ''}
      `}
      style={{ 
        backgroundColor: cardBg,
        boxShadow: isDark 
            ? '0 10px 40px -10px rgba(0,0,0,0.6)' 
            : '0 10px 40px -10px rgba(120, 53, 15, 0.1)', // Warm shadow for light mode
        border: `1px solid ${borderColor}`
      }}
    >
      {/* 1. BRAND ACCENT STRIP */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ backgroundColor: accentColor }} />

      {/* --- IMAGE AREA --- */}
      <div 
        className="relative h-36 md:h-44 overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => isAvailable && onImageClick(item)}
      >
        {item.image_url ? (
          <BlurImage 
            src={item.image_url} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
             <UtensilsCrossed size={32} strokeWidth={1.5} />
          </div>
        )}
        
        {/* Gradient Overlay (Depth) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* 2. STYLISH PRICE TAG (Glassmorphism) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-lg flex items-baseline gap-1 border border-white/40">
            <span className="text-sm md:text-base font-black" style={{ color: accentColor }}>
                {Number(item.price).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-black opacity-60 uppercase tracking-wider">
                {currency}
            </span>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-4 pt-3 flex flex-col flex-1 relative justify-between">
        
        {/* Title ONLY (Description Removed) */}
        <div 
            className="cursor-pointer mb-4" 
            onClick={() => isAvailable && onImageClick(item)}
        >
            <h3 className="font-bold text-lg leading-tight font-cairo group-hover:text-amber-600 transition-colors" style={{ color: textColor }}>
                {lang === 'en' ? item.name_en : item.name_ar}
            </h3>
        </div>

        {/* --- FOOTER: ACTION --- */}
        <div className="flex items-center justify-between mt-auto">
            
            {/* Status Text */}
            {!isAvailable ? (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
                    {lang === 'en' ? 'SOLD OUT' : 'نفذت الكمية'}
                </span>
            ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>
                    {lang === 'en' ? 'Order' : 'اطلب'}
                </span>
            )}

            {/* 3. DYNAMIC BUTTON */}
            <div className="h-10">
                <AnimatePresence mode="wait" initial={false}>
                    {quantity === 0 ? (
                        <motion.button
                            key="add-btn"
                            layoutId={`btn-${item.id}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleAdd}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95
                                ${!isAvailable ? 'pointer-events-none opacity-50 bg-gray-300' : ''}
                            `}
                            style={{ 
                                backgroundColor: isAvailable ? accentColor : undefined, 
                                color: isDark ? '#000' : '#FFF' 
                            }}
                        >
                            <Plus size={20} strokeWidth={3} />
                        </motion.button>
                    ) : (
                        <motion.div
                            key="qty-ctrl"
                            layoutId={`btn-${item.id}`}
                            className="h-10 rounded-full flex items-center p-1 shadow-inner min-w-[100px] border"
                            style={{ 
                                backgroundColor: isDark ? '#27272A' : '#F8F8F8',
                                borderColor: isDark ? '#333' : '#E5E5E5' 
                            }}
                        >
                            <button 
                                onClick={handleDec} 
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-90 transition-colors"
                                style={{ color: textColor }}
                            >
                                <Minus size={16} strokeWidth={2.5} />
                            </button>
                            
                            <motion.span 
                                key={`qty-${quantity}`}
                                initial={{ y: 5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex-1 text-center font-black text-sm"
                                style={{ color: accentColor }}
                            >
                                {quantity}
                            </motion.span>

                            <button 
                                onClick={handleInc} 
                                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                                style={{ backgroundColor: accentColor, color: isDark ? '#000' : '#FFF' }}
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;