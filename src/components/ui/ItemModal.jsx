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
  
  // Define Theme Colors based on isDark (Matching Menu.jsx)
  const themeColors = {
    bg: isDark ? '#1C1917' : '#FDF6E3',
    card: isDark ? '#292524' : '#FFFBEB',
    text: isDark ? '#E7E5E4' : '#422006',
    border: isDark ? '#44403C' : '#E7E5E4',
    primary: isDark ? '#ECAE36' : '#78350F', // Gold (Dark) / Saddle Brown (Light)
    secondary: isDark ? '#52525B' : '#A67C52'
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newSaved = newStatus ? [...saved, item.id] : saved.filter(id => id !== item.id);
    if (newStatus) await supabase.rpc('increment_likes', { row_id: item.id });
    localStorage.setItem('favorites', JSON.stringify(newSaved));
  };

  const handleAdd = () => onUpdateCart(item, 1);
  const handleInc = () => onUpdateCart(item, quantity + 1);
  const handleDec = () => onUpdateCart(item, quantity - 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-center items-center px-4 font-serif">
        
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        />

        {/* Modal Container */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg flex flex-col shadow-2xl rounded-2xl overflow-hidden border-2"
            style={{ 
                backgroundColor: themeColors.bg, 
                borderColor: themeColors.primary,
                color: themeColors.text
            }}
        >
          {/* Header Pattern Overlay */}
          <div className="absolute top-0 inset-x-0 h-32 opacity-10 pointer-events-none z-0" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${isDark ? 'ECAE36' : '78350F'}' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} 
          />

          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 p-2 rounded-full transition-all active:scale-90 hover:rotate-90 bg-black/10 hover:bg-black/20 text-current backdrop-blur-sm"
          >
            <X size={24} />
          </button>

          {/* Like Button */}
          <button 
            onClick={toggleLike} 
            className={`absolute top-4 left-4 z-20 p-2 rounded-full transition-all active:scale-90 backdrop-blur-md shadow-sm ${isLiked ? 'bg-red-500 text-white' : 'bg-black/10 text-current hover:bg-black/20'}`}
          >
             <Heart size={24} className={isLiked ? 'fill-current' : ''} />
          </button>

          {/* Image Section */}
          <div className="w-full shrink-0 h-64 sm:h-80 relative bg-black/5 border-b" style={{ borderColor: themeColors.border }}>
             {item.image_url ? (
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.name_en} />
             ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">🍽️</div>
             )}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent opacity-50" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col p-6 sm:p-8 relative z-10">
             
             {/* Title & Price */}
             <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-black leading-tight font-cairo" style={{ color: themeColors.primary }}>
                    {lang === 'en' ? item.name_en : item.name_ar}
                </h2>
                <div className="text-2xl font-bold flex justify-center items-baseline gap-1" style={{ color: themeColors.text }}>
                    {formattedPrice} 
                    <span className="text-sm font-normal opacity-70 uppercase tracking-widest">{currency}</span>
                </div>
             </div>

             {/* Description */}
             <div className="flex-1 text-center">
                <p className="text-lg leading-relaxed opacity-80 font-medium" style={{ color: themeColors.text }}>
                  {lang === 'en' ? item.description_en : item.description_ar || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح.")}
                </p>
             </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 pt-0 flex justify-center items-center shrink-0 relative z-10">
             <AnimatePresence mode="wait" initial={false}>
                {quantity === 0 ? (
                    <motion.button 
                        key="add" 
                        layoutId="modal-btn" 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.8, opacity: 0 }} 
                        onClick={handleAdd}
                        style={{ backgroundColor: themeColors.primary, color: isDark ? '#000' : '#FFF' }}
                        className="w-full py-4 rounded-xl flex items-center justify-center shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg font-bold gap-2 uppercase tracking-widest"
                    >
                        <Plus size={24} strokeWidth={3} />
                        {lang === 'en' ? 'Add to Order' : 'أضف للطلب'}
                    </motion.button>
                ) : (
                    <motion.div 
                        key="controls" 
                        layoutId="modal-btn"
                        style={{ backgroundColor: themeColors.primary, color: isDark ? '#000' : '#FFF' }}
                        className="h-16 w-full rounded-xl flex items-center justify-between px-6 shadow-xl"
                    >
                        <button onClick={handleDec} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 active:scale-90 transition-all">
                            <Minus size={24} strokeWidth={3} />
                        </button>
                        
                        <motion.span 
                            key={quantity} 
                            initial={{ y: 10, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            className="text-3xl font-black font-cairo mb-1"
                        >
                            {quantity}
                        </motion.span>
                        
                        <button onClick={handleInc} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 active:scale-90 transition-all">
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