import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Minus, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ItemModal = ({ 
    item, isOpen, onClose, 
    cart = [], onUpdateCart, 
    currency = "IQD", lang = 'en', isDark = false, 
    accentColor, buttonTextColor, 
    variant = 'default' 
}) => {
  const [isLiked, setIsLiked] = useState(false);

  // Get current quantity from cart directly
  const cartItem = item && cart.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

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

  // --- ANIMATED BUTTON HANDLERS ---
  const handleAdd = () => onUpdateCart(item, 1);
  const handleInc = () => onUpdateCart(item, quantity + 1);
  const handleDec = () => onUpdateCart(item, quantity - 1);

  // Modal Animation
  const variants = isCentered ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", duration: 0.5, bounce: 0.3 }
  } : {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  };

  // Styles
  let containerClasses = "";
  if (isLuxury) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl bg-[#080808] border border-[#D4AF37]/40 rounded-sm`;
  } else if (isModern) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl rounded-2xl border ${isDark ? 'bg-[#0F172A] border-slate-700' : 'bg-white border-slate-200'}`;
  } else if (isCafe) {
      containerClasses = `relative w-full max-w-lg flex flex-col shadow-2xl rounded-[32px] overflow-hidden border-4 ${isDark ? 'bg-[#2A2624] border-[#3E3A36] text-[#E5E0D8]' : 'bg-[#F9F7F2] border-[#FFF] text-[#44403C]'}`;
  } else {
      // DEFAULT (Template 1): Changed h-[90vh] to h-auto max-h-[90vh] to fix spacing
      containerClasses = `relative w-full max-w-md h-auto max-h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-t-[32px] sm:rounded-[32px]`;
  }

  // Button Color Logic
  const dynamicTextColor = buttonTextColor || '#fff';
  const btnBaseClass = isLuxury 
    ? "bg-[#D4AF37] text-black border border-[#D4AF37]" 
    : isCafe 
        ? "bg-[#6F4E37] text-white shadow-lg"
        : `shadow-lg`;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex justify-center ${isCentered ? 'items-center px-4' : 'items-end sm:items-center sm:px-4'}`}>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className={`absolute inset-0 ${isLuxury ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-md'}`} />
        
        <motion.div {...variants} className={containerClasses}>
          
          <button onClick={onClose} className={`absolute top-4 right-4 z-20 p-2 transition-all active:scale-90 rounded-full ${isLuxury ? 'text-[#D4AF37]' : isCafe ? `bg-black/20 hover:bg-black/30 text-white backdrop-blur-md` : `border backdrop-blur-md shadow-lg ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-black border-gray-200'}`}`}>
            <X size={20} />
          </button>

          {!isCentered && (
             <button onClick={toggleLike} className={`absolute top-4 left-4 z-20 p-2 rounded-full transition-all active:scale-90 border backdrop-blur-md shadow-lg ${isLiked ? 'bg-red-500 text-white border-red-500' : (isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-gray-400 border-gray-200')}`}>
               <Heart size={20} className={isLiked ? 'fill-current' : ''} />
             </button>
          )}

          {/* Image Section */}
          <div className={`w-full shrink-0 relative ${isLuxury ? 'h-64 border-b border-[#D4AF37]/20' : (isCafe ? 'h-72 m-2 w-[calc(100%-16px)] rounded-[28px] overflow-hidden' : 'h-80')}`}>
             {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt={item.name_en} /> : <div className="w-full h-full flex items-center justify-center opacity-30">{lang === 'en' ? 'No Image' : 'لا توجد صورة'}</div>}
             {isCafe && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />}
          </div>

          {/* Content Section */}
          <div className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${isCentered ? 'p-8 text-center' : 'p-8'}`}>
             
             {/* Header: Title & Price */}
             <div className={`shrink-0 ${isCentered ? "w-full space-y-3 mb-4" : "flex justify-between items-start gap-4 mb-6"}`}>
                <h2 className={isLuxury ? "text-3xl font-display uppercase tracking-widest text-[#D4AF37]" : isCafe ? `text-3xl font-extrabold tracking-tight font-sans ${isDark ? 'text-[#E5E0D8]' : 'text-[#44403C]'}` : `text-3xl font-bold leading-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>{lang === 'en' ? item.name_en : item.name_ar}</h2>
                <div className={`text-2xl font-bold ${isLuxury ? 'text-[#E5E5E5]' : ''}`} style={isCafe ? { color: accentColor } : {}}>{formattedPrice} <span className="text-sm opacity-70">{currency}</span></div>
             </div>

             {/* Description - UPDATED: Increased font size for default variant */}
             <div className={`flex-1 ${isCentered ? 'flex items-center justify-center' : ''}`}>
                <p className={`leading-relaxed ${isLuxury ? "text-[#A0A0A0] font-luxury italic text-2xl" : `font-medium opacity-80 ${isCafe ? 'text-lg' : 'text-xl'}`}`}>
                  {lang === 'en' ? item.description_en : item.description_ar || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح.")}
                </p>
             </div>
          </div>

          {/* --- FOOTER: ANIMATED BUTTON --- */}
          <div className={`p-6 pt-0 flex justify-center items-center h-24 shrink-0 ${isLuxury ? 'bg-[#080808]' : (isCafe ? '' : `border-t ${isDark ? 'border-white/5' : 'border-gray-100'} bg-opacity-50`)}`}>
             <AnimatePresence mode="wait" initial={false}>
                {quantity === 0 ? (
                    // STATE 1: CIRCLE ADD BUTTON
                    <motion.button 
                        key="add"
                        layoutId="cart-btn"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={handleAdd}
                        style={{ 
                            backgroundColor: !isLuxury && !isCafe ? accentColor : undefined,
                            color: !isLuxury && !isCafe ? dynamicTextColor : undefined 
                        }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform ${btnBaseClass}`}
                    >
                        <Plus size={32} strokeWidth={3} />
                    </motion.button>
                ) : (
                    // STATE 2: EXPANDED PILL (Minus - Qty - Plus)
                    <motion.div 
                        key="controls"
                        layoutId="cart-btn"
                        style={{ 
                            backgroundColor: !isLuxury && !isCafe ? accentColor : undefined,
                            color: !isLuxury && !isCafe ? dynamicTextColor : undefined 
                        }}
                        className={`h-16 px-2 rounded-full flex items-center justify-between min-w-[180px] shadow-xl ${btnBaseClass}`}
                    >
                        <button onClick={handleDec} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 active:scale-90 transition-all">
                            <Minus size={24} strokeWidth={3} />
                        </button>
                        
                        <motion.span 
                            key={quantity}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-black px-4 font-mono"
                        >
                            {quantity}
                        </motion.span>

                        <button onClick={handleInc} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 active:scale-90 transition-all">
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </motion.div>
                )}
             </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ItemModal;