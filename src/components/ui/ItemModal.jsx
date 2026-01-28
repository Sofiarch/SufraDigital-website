import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ItemModal = ({ item, isOpen, onClose, currency = "IQD", lang = 'en', isDark = false, accentColor }) => {
  if (!isOpen || !item) return null;
  const rawPrice = String(item.price).replace(/[^0-9.]/g, '');
  const formattedPrice = isNaN(Number(rawPrice)) ? "0" : Number(rawPrice).toLocaleString();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`${isDark ? 'bg-[#181818]' : 'bg-white'} w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[32px] rounded-t-[32px] overflow-hidden relative shadow-2xl flex flex-col`}>
          
          <button onClick={onClose} className={`absolute top-5 right-5 z-20 p-2 rounded-full border backdrop-blur-md shadow-lg transition-transform active:scale-90 ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/80 text-black border-gray-200'}`}><X size={20} /></button>

          <div className={`w-full h-80 shrink-0 relative ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`}>
             {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-30">No Image</div>}
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-start gap-4 mb-6">
                <h2 className={`text-3xl font-bold leading-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name_en}</h2>
                <div className="text-2xl font-bold tracking-tight whitespace-nowrap" style={{ color: accentColor }}>{formattedPrice} <span className="text-sm font-medium">{currency}</span></div>
             </div>
             <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-[0.15em] opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>{lang === 'en' ? 'Details' : 'التفاصيل'}</h3>
                <p className={`text-lg leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description_en || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح.")}</p>
             </div>
          </div>

          <div className={`p-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} bg-opacity-50`}>
             <button onClick={onClose} style={{ backgroundColor: accentColor, color: isDark ? '#000' : '#fff' }} className="w-full py-4 rounded-2xl text-base font-bold tracking-wide shadow-lg transition-transform active:scale-[0.98]">
                {lang === 'en' ? 'Back to Menu' : 'العودة للقائمة'}
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ItemModal;