import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ItemModal = ({ item, isOpen, onClose, currency = "IQD", lang = 'en', isDark = false, accentColor, variant = 'default' }) => {
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
  
  // --- VARIANTS ---
  const isLuxury = variant === 'luxury';
  const isModern = variant === 'modern'; 
  const isCafe = variant === 'cafe'; 
  const isCentered = isLuxury || isModern || isCafe; 

  const toggleLike = async (e) => {
    e.stopPropagation();
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newSaved = newStatus ? [...saved, item.id] : saved.filter(id => id !== item.id);
    if (newStatus) await supabase.rpc('increment_likes', { row_id: item.id });
    localStorage.setItem('favorites', JSON.stringify(newSaved));
  };

  // Animation
  const variants = isCentered ? {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { type: "spring", duration: 0.5, bounce: 0.3 }
  } : {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  };

  // Container Classes
  let containerClasses = "";
  if (isLuxury) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl bg-[#080808] border border-[#D4AF37]/40 rounded-sm`;
  } else if (isModern) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl rounded-2xl border ${isDark ? 'bg-[#0F172A] border-slate-700' : 'bg-white border-slate-200'}`;
  } else if (isCafe) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl rounded-[32px] overflow-hidden border-4 
        ${isDark ? 'bg-[#2A2624] border-[#3E3A36] text-[#E5E0D8]' : 'bg-[#F9F7F2] border-[#FFF] text-[#44403C]'}`;
  } else {
      containerClasses = `relative w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-t-[32px] sm:rounded-[32px]`;
  }

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex justify-center ${isCentered ? 'items-center px-4' : 'items-end sm:items-center sm:px-4'}`}>
        
        {/* BACKDROP */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} 
          className={`absolute inset-0 ${isLuxury ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-md'}`} 
        />

        <motion.div {...variants} className={containerClasses}>
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 z-20 p-2 transition-all active:scale-90 rounded-full ${
              isLuxury ? 'text-[#D4AF37]' : 
              isCafe ? `bg-black/20 hover:bg-black/30 text-white backdrop-blur-md` :
              `border backdrop-blur-md shadow-lg ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-black border-gray-200'}`
            }`}
          >
            <X size={20} />
          </button>

          {/* Like Button (Standard Position: Top Left) - Only for T1 */}
          {!isCentered && (
             <button onClick={toggleLike} className={`absolute top-4 left-4 z-20 p-2 rounded-full transition-all active:scale-90 border backdrop-blur-md shadow-lg ${isLiked ? 'bg-red-500 text-white border-red-500' : (isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-gray-400 border-gray-200')}`}>
               <Heart size={20} className={isLiked ? 'fill-current' : ''} />
             </button>
          )}

          {/* Image Section */}
          <div className={`w-full shrink-0 relative ${isLuxury ? 'h-64 border-b border-[#D4AF37]/20' : (isCafe ? 'h-72 m-2 w-[calc(100%-16px)] rounded-[28px] overflow-hidden' : 'h-80')}`}>
             {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.name_en} /> : <div className="w-full h-full flex items-center justify-center opacity-30">{lang === 'en' ? 'No Image' : 'لا توجد صورة'}</div>}
             {/* Gradient for Cafe */}
             {isCafe && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />}
          </div>

          {/* Content Section */}
          <div className={`flex-1 overflow-y-auto no-scrollbar ${isCentered ? 'p-8 flex flex-col items-center text-center' : 'p-8'}`}>
             
             <div className={isCentered ? "w-full space-y-4 mb-6" : "flex justify-between items-start gap-4 mb-6"}>
                {/* Title */}
                <h2 className={isLuxury 
                    ? "text-3xl font-display uppercase tracking-widest text-[#D4AF37]" 
                    : isCafe 
                        ? `text-3xl font-extrabold tracking-tight font-sans ${isDark ? 'text-[#E5E0D8]' : 'text-[#44403C]'}`
                        : `text-3xl font-bold leading-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`
                }>
                    {lang === 'en' ? item.name_en : item.name_ar}
                </h2>
                
                {isCentered ? (
                    <div className="flex flex-col items-center gap-4">
                        {/* Price */}
                        <div className={`text-2xl font-bold ${isLuxury ? 'text-[#E5E5E5]' : ''}`} style={isCafe ? { color: accentColor } : {}}>
                            {formattedPrice} <span className="text-sm opacity-70">{currency}</span>
                        </div>
                        
                        {/* Centered Heart Button (No Text, Just Icon) */}
                        <button 
                            onClick={toggleLike} 
                            className={`p-3 rounded-full transition-all active:scale-95 ${
                                isLuxury 
                                    ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10' 
                                    : 'bg-gray-100 dark:bg-white/5 hover:scale-105'
                            }`}
                        >
                            <Heart size={24} className={isLiked ? (isLuxury ? 'fill-[#D4AF37]' : 'fill-red-500 text-red-500') : (isLuxury ? 'text-[#D4AF37]' : 'text-gray-400')} />
                        </button>
                    </div>
                ) : (
                    <div className="text-2xl font-bold tracking-tight" style={{ color: accentColor }}>{formattedPrice}</div>
                )}
             </div>

             {/* Description */}
             <div className="space-y-3 w-full">
                {!isCentered && <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">{lang === 'en' ? 'Details' : 'التفاصيل'}</h3>}
                <p className={`text-lg leading-relaxed ${isLuxury ? "text-[#A0A0A0] font-luxury italic" : "opacity-80 font-medium"}`}>
                  {lang === 'en' ? item.description_en : item.description_ar || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح.")}
                </p>
             </div>
          </div>

          {/* Footer Section */}
          <div className={`p-6 pt-0 ${isLuxury ? 'bg-[#080808]' : (isCafe ? '' : `border-t ${isDark ? 'border-white/5' : 'border-gray-100'} bg-opacity-50`)}`}>
             <button 
                onClick={onClose} 
                style={{ backgroundColor: isLuxury ? 'transparent' : accentColor, borderColor: accentColor, color: isLuxury ? accentColor : '#fff' }} 
                className={isLuxury 
                    ? "w-full py-3 border text-sm font-display tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black transition-colors"
                    : isCafe 
                        ? "w-full py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all"
                        : "w-full py-4 rounded-2xl text-base font-bold tracking-wide shadow-lg active:scale-[0.98]"
                }
             >
                {lang === 'en' ? (isLuxury || isCafe ? 'Close' : 'Back to Menu') : (isLuxury || isCafe ? 'إغلاق' : 'العودة للقائمة')}
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemModal;