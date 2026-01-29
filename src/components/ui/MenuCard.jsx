import React from 'react';
import { motion } from 'framer-motion';
import BlurImage from './BlurImage';

const MenuCard = ({ item, currency = "IQD", isDark = false, accentColor, onClick, lang = 'en' }) => {
  const rawPrice = String(item.price).replace(/[^0-9.]/g, '');
  const formattedPrice = isNaN(Number(rawPrice)) ? "0" : Number(rawPrice).toLocaleString();
  // Default to true if undefined
  const isAvailable = item.is_available !== false; 

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={cardVariants} 
      layout 
      // Only allow click if available
      onClick={() => isAvailable && onClick(item)} 
      whileTap={isAvailable ? { scale: 0.96 } : {}} 
      whileHover={isAvailable ? { y: -4 } : {}} 
      className={`w-full cursor-pointer group select-none relative ${!isAvailable ? 'grayscale opacity-80 cursor-not-allowed' : ''}`}
    >
      {/* Image Container */}
      <div className="w-full h-[220px] rounded-[24px] overflow-hidden mb-4 relative shadow-lg bg-gray-100">
        {item.image_url ? (
          <>
            <BlurImage src={item.image_url} alt={item.name_en} className="w-full h-full" />
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-200'}`}>
            <span className="text-gray-400 text-sm">{lang === 'en' ? 'No Image' : 'لا توجد صورة'}</span>
          </div>
        )}

        {/* SOLD OUT OVERLAY */}
        {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg transform -rotate-6">
                    {lang === 'en' ? 'Sold Out' : 'نفذت الكمية'}
                </span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-4">
          {/* Title - Strikethrough if unavailable */}
          <h3 className={`font-bold text-lg leading-snug uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-900'} ${!isAvailable ? 'line-through decoration-red-500/50' : ''}`}>
            {lang === 'en' ? item.name_en : item.name_ar}
          </h3>
          {/* Price - Grey if unavailable */}
          <span className="shrink-0 font-bold text-lg tracking-tight" style={{ color: isAvailable ? accentColor : '#9CA3AF' }}>
            {formattedPrice} <span className="text-[10px] opacity-60 align-top">{currency}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;