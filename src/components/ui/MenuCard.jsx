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

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative overflow-hidden rounded-lg md:rounded-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full
        ${!isAvailable ? 'opacity-60 grayscale cursor-not-allowed' : ''}
      `}
      style={{ 
        backgroundColor: isDark ? '#18181B' : '#FFFBEB',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(93,64,55,0.15)',
        border: isDark ? '1px solid #27272A' : '1px solid #E7E5E4'
      }}
    >
      {/* --- IMAGE AREA --- */}
      <div 
        className="relative h-32 md:h-48 overflow-hidden cursor-pointer"
        onClick={() => isAvailable && onImageClick(item)}
      >
        {item.image_url ? (
          <BlurImage 
            src={item.image_url} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/5">
             <UtensilsCrossed size={24} className="opacity-20" style={{ color: isDark ? '#FFF' : '#000' }} />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Price Tag (Larger Text) */}
        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-white/95 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-md text-sm md:text-base font-black shadow-lg flex items-center gap-1" 
             style={{ color: accentColor }}>
            {Number(item.price).toLocaleString()} 
            <span className="opacity-70 text-[10px] md:text-xs font-bold">{currency}</span>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-2 md:p-4 flex flex-col flex-1 relative justify-between">
        
        {/* Title (Larger Text) */}
        <div 
            className="cursor-pointer mb-2" 
            onClick={() => isAvailable && onImageClick(item)}
        >
            <h3 className="font-black text-base md:text-lg leading-tight font-cairo line-clamp-2" 
                style={{ color: isDark ? '#E7E5E4' : '#5D4037' }}>
                {lang === 'en' ? item.name_en : item.name_ar}
            </h3>
        </div>

        {/* --- DYNAMIC ACTION BUTTON --- */}
        <div className="flex justify-end mt-auto h-9 md:h-10">
            <AnimatePresence mode="wait" initial={false}>
                {quantity === 0 ? (
                    <motion.button
                        key="add-btn"
                        layoutId={`btn-${item.id}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={handleAdd}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all
                            ${!isAvailable ? 'pointer-events-none opacity-50' : ''}
                        `}
                        style={{ backgroundColor: accentColor, color: isDark ? '#000' : '#FFF' }}
                    >
                        <Plus size={20} strokeWidth={3} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="qty-ctrl"
                        layoutId={`btn-${item.id}`}
                        className="h-9 md:h-10 rounded-full flex items-center justify-between px-1 shadow-lg overflow-hidden min-w-[90px] md:min-w-[110px]"
                        style={{ backgroundColor: accentColor, color: isDark ? '#000' : '#FFF' }}
                    >
                        <button onClick={handleDec} className="w-8 h-full flex items-center justify-center hover:bg-black/10 active:scale-90"><Minus size={16} strokeWidth={3} /></button>
                        <span className="font-black text-sm md:text-base w-6 text-center">{quantity}</span>
                        <button onClick={handleInc} className="w-8 h-full flex items-center justify-center hover:bg-black/10 active:scale-90"><Plus size={16} strokeWidth={3} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;