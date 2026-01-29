import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Import Supabase for the counter

const ItemModal = ({ item, isOpen, onClose, currency = "IQD", lang = 'en', isDark = false, accentColor, variant = 'default' }) => {
  // Reset state when modal opens/closes or item changes
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      const saved = localStorage.getItem('favorites');
      setIsLiked(saved ? JSON.parse(saved).includes(item.id) : false);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;
  
  const rawPrice = String(item.price).replace(/[^0-9.]/g, '');
  const formattedPrice = isNaN(Number(rawPrice)) ? "0" : Number(rawPrice).toLocaleString();
  const isLuxury = variant === 'luxury';

  // --- LIKE HANDLER ---
  const toggleLike = async (e) => {
    e.stopPropagation();
    
    // 1. Optimistic UI Update
    const newStatus = !isLiked;
    setIsLiked(newStatus);

    // 2. Local Storage (Persist for user)
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newSaved;
    if (newStatus) {
        newSaved = [...saved, item.id];
        // 3. Database Update (Only increment if adding like)
        await supabase.rpc('increment_likes', { row_id: item.id });
    } else {
        newSaved = saved.filter(id => id !== item.id);
    }
    localStorage.setItem('favorites', JSON.stringify(newSaved));
  };

  // --- VARIANTS ---
  const variants = isLuxury ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  } : {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  };

  const containerClasses = isLuxury 
    ? `relative w-full max-w-lg overflow-hidden flex flex-col shadow-2xl bg-[#080808] border border-[#D4AF37]/40 rounded-sm` 
    : `relative w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-t-[32px] sm:rounded-[32px]`;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex justify-center ${isLuxury ? 'items-center px-4' : 'items-end sm:items-center sm:px-4'}`}>
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onClose} 
          className={`absolute inset-0 ${isLuxury ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-md'}`} 
        />

        <motion.div {...variants} className={containerClasses}>
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 z-20 p-2 transition-transform active:scale-90 ${
              isLuxury ? 'text-[#D4AF37] hover:rotate-90 duration-500' : `rounded-full border backdrop-blur-md shadow-lg ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-black border-gray-200'}`
            }`}
          >
            <X size={isLuxury ? 24 : 20} />
          </button>

          {/* Like Button (Standard Mode Placement: Top Left) */}
          {!isLuxury && (
             <button 
               onClick={toggleLike}
               className={`absolute top-4 left-4 z-20 p-2 rounded-full border backdrop-blur-md shadow-lg transition-all active:scale-90 ${
                 isLiked 
                   ? 'bg-red-500 text-white border-red-500' 
                   : (isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-gray-400 border-gray-200')
               }`}
             >
               <Heart size={20} className={isLiked ? 'fill-current' : ''} />
             </button>
          )}

          {/* Image */}
          <div className={`w-full shrink-0 relative ${isLuxury ? 'h-64 border-b border-[#D4AF37]/20' : 'h-80'}`}>
             {item.image_url ? (
               <img src={item.image_url} className="w-full h-full object-cover" alt={item.name_en} />
             ) : (
               <div className="w-full h-full flex items-center justify-center opacity-30">{lang === 'en' ? 'No Image' : 'لا توجد صورة'}</div>
             )}
             <div className={`absolute inset-0 pointer-events-none ${isLuxury ? 'bg-gradient-to-t from-[#080808] to-transparent' : 'bg-gradient-to-b from-black/30 to-transparent'}`} />
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto no-scrollbar ${isLuxury ? 'p-8 flex flex-col items-center' : 'p-8'}`}>
             
             <div className={isLuxury ? "w-full text-center space-y-4 mb-6" : "flex justify-between items-start gap-4 mb-6"}>
                <h2 className={isLuxury ? "text-3xl md:text-4xl text-[#D4AF37] font-display uppercase tracking-widest text-center" : `text-3xl font-bold leading-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {lang === 'en' ? item.name_en : item.name_ar}
                </h2>
                
                <div className={`flex items-center gap-4 ${isLuxury ? 'justify-center border-t border-b border-[#D4AF37]/30 py-3' : ''}`}>
                    {/* Price */}
                    <div className={isLuxury ? "text-xl text-[#E5E5E5] font-display tracking-wide" : "text-2xl font-bold tracking-tight whitespace-nowrap"} style={!isLuxury ? { color: accentColor } : {}}>
                        {formattedPrice} <span className="text-sm opacity-70">{currency}</span>
                    </div>

                    {/* Like Button (Luxury Mode Placement: Center next to price) */}
                    {isLuxury && (
                        <button onClick={toggleLike} className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors">
                            <Heart size={20} className={isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''} />
                        </button>
                    )}
                </div>
             </div>

             <div className="space-y-3 w-full">
                {!isLuxury && <h3 className={`text-xs font-bold uppercase tracking-[0.15em] opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>{lang === 'en' ? 'Details' : 'التفاصيل'}</h3>}
                <p className={isLuxury ? "text-lg leading-relaxed text-[#A0A0A0] font-luxury italic text-center" : `text-lg leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {lang === 'en' ? item.description_en : item.description_ar || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح.")}
                </p>
             </div>
          </div>

          {/* Footer */}
          <div className={`p-6 ${isLuxury ? 'bg-[#080808]' : `border-t ${isDark ? 'border-white/5' : 'border-gray-100'} bg-opacity-50`}`}>
             <button 
                onClick={onClose} 
                style={isLuxury ? { borderColor: accentColor, color: accentColor } : { backgroundColor: accentColor, color: isDark ? '#000' : '#fff' }} 
                className={isLuxury ? "w-full py-3 border text-sm font-display tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-colors duration-500" : "w-full py-4 rounded-2xl text-base font-bold tracking-wide shadow-lg active:scale-[0.98]"}
             >
                {lang === 'en' ? (isLuxury ? 'Close' : 'Back to Menu') : (isLuxury ? 'إغلاق' : 'العودة للقائمة')}
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemModal;