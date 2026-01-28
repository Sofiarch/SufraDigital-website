import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import BlurImage from './BlurImage';

const MenuCard = ({ item, currency = "IQD", isDark = false, accentColor, onClick }) => {
  const rawPrice = String(item.price).replace(/[^0-9.]/g, '');
  const formattedPrice = isNaN(Number(rawPrice)) ? "0" : Number(rawPrice).toLocaleString();

  // Favorites Logic
  const [isLiked, setIsLiked] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved).includes(item.id) : false;
  });

  const toggleLike = (e) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newSaved = isLiked ? saved.filter(id => id !== item.id) : [...saved, item.id];
    localStorage.setItem('favorites', JSON.stringify(newSaved));
    setIsLiked(!isLiked);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={cardVariants} layout onClick={() => onClick(item)} whileTap={{ scale: 0.96 }} whileHover={{ y: -4 }} className="w-full cursor-pointer group select-none relative">
      <div className="w-full h-[220px] rounded-[24px] overflow-hidden mb-4 relative shadow-lg bg-gray-100">
        <button onClick={toggleLike} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-sm active:scale-90 transition-all hover:bg-black/40">
           <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} />
        </button>
        
        {item.image_url ? (
          <>
            <BlurImage src={item.image_url} alt={item.name_en} className="w-full h-full" />
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-200'}`}><span className="text-gray-400 text-sm">No Image</span></div>
        )}
      </div>
      <div className="px-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-bold text-lg leading-snug uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name_en}</h3>
          <span className="shrink-0 font-bold text-lg tracking-tight" style={{ color: accentColor }}>{formattedPrice} <span className="text-[10px] opacity-60 align-top">{currency}</span></span>
        </div>
        <p className={`text-[13px] leading-relaxed mt-2 line-clamp-2 font-medium opacity-80 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description_en || "Tap to view details"}</p>
      </div>
    </motion.div>
  );
};
export default MenuCard;