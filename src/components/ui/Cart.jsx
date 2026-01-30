import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react';
import BlurImage from './BlurImage';

const Cart = ({ cart = [], onUpdateQty, onRemove, onClear, currency = "IQD", lang = 'en', isDark = false, variant = 'default', accentColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formattedTotal = totalPrice.toLocaleString();

  if (totalItems === 0) return null;

  // --- THEME CONFIGURATION ---
  const themes = {
    default: {
      bar: isDark ? 'bg-[#18181B] border-t border-white/10 text-white' : 'bg-white border-t border-gray-200 text-gray-900',
      barShadow: 'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]',
      viewBtn: isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800',
      badge: isDark ? 'bg-red-500 text-white' : 'bg-red-600 text-white',
      modalBg: isDark ? 'bg-[#18181B] text-white' : 'bg-white text-gray-900',
      itemBg: isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100',
      iconBtn: isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-900',
      textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
      clearBtn: 'text-red-500 bg-red-500/10 hover:bg-red-500/20',
    },
    luxury: {
      bar: isDark ? 'bg-[#080808] border-t border-[#D4AF37] text-[#D4AF37]' : 'bg-[#FAF9F6] border-t border-[#D4AF37] text-[#1A1A1A]',
      barShadow: 'shadow-[0_-4px_30px_rgba(212,175,55,0.15)]',
      viewBtn: isDark ? 'bg-[#D4AF37] text-black hover:bg-[#F1C40F]' : 'bg-[#1A1A1A] text-[#D4AF37] hover:bg-black',
      badge: isDark ? 'bg-[#D4AF37] text-black' : 'bg-[#1A1A1A] text-[#D4AF37]',
      modalBg: isDark ? 'bg-[#0C0C0C] border-t border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-[#FAF9F6] border-t border-[#D4AF37]/30 text-[#1A1A1A]',
      itemBg: isDark ? 'bg-[#1A1A1A] border border-[#D4AF37]/20' : 'bg-white border border-[#D4AF37]/20 shadow-sm',
      iconBtn: 'text-[#D4AF37] hover:bg-[#D4AF37]/10',
      textMuted: isDark ? 'text-[#D4AF37]/60' : 'text-[#1A1A1A]/60',
      clearBtn: 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10',
    },
    cafe: {
      bar: isDark 
        ? 'bg-[#2A2624]/95 border-t border-[#6F4E37]/30 text-[#E5E0D8] backdrop-blur-xl' 
        : 'bg-[#F9F7F2]/95 border-t border-[#6F4E37]/20 text-[#44403C] backdrop-blur-xl',
      barShadow: 'shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
      viewBtn: isDark ? 'bg-[#6F4E37] text-[#E5E0D8] hover:bg-[#8D6E63]' : 'bg-[#6F4E37] text-white hover:bg-[#5D4037]',
      
      // --- UPDATED: Changed orange (#C2410C) to Coffee Brown (#6F4E37) ---
      badge: isDark ? 'bg-[#6F4E37] text-[#E5E0D8]' : 'bg-[#6F4E37] text-white', 
      
      modalBg: isDark ? 'bg-[#1E1B18] text-[#E5E0D8]' : 'bg-[#F5F2EA] text-[#44403C]',
      itemBg: isDark ? 'bg-[#2C2826]' : 'bg-white shadow-sm border border-[#E5E0D8]',
      iconBtn: isDark ? 'hover:bg-[#E5E0D8]/10 text-[#E5E0D8]' : 'hover:bg-[#6F4E37]/10 text-[#5D4037]',
      textMuted: isDark ? 'text-[#E5E0D8]/60' : 'text-[#5D4037]/60',
      clearBtn: 'text-[#C2410C] bg-[#C2410C]/10 hover:bg-[#C2410C]/20',
    }
  };

  const theme = themes[variant] || themes.default;

  return (
    <>
      {/* --- FLOATING CART BAR --- */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className={`fixed bottom-0 left-0 right-0 p-4 z-[90] pb-6 sm:pb-4 cursor-pointer ${theme.bar} ${theme.barShadow}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Left: Badge & Total */}
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${theme.badge}`}>
                    {totalItems}
                </div>
                <div className="flex flex-col">
                    <span className={`text-[10px] uppercase tracking-widest font-bold opacity-80 mb-0.5`}>
                        {lang === 'en' ? 'Total' : 'المجموع'}
                    </span>
                    <span className={`text-xl font-bold leading-none`}>
                        {formattedTotal} <span className="text-xs font-normal opacity-80">{currency}</span>
                    </span>
                </div>
            </div>
            
            {/* Right: View Button */}
            <div className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg ${theme.viewBtn}`}>
                <span>{lang === 'en' ? 'View' : 'عرض'}</span>
                <ShoppingBag size={18} />
            </div>
        </div>
      </motion.div>

      {/* --- EXPANDED CART DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                />
                
                {/* Drawer */}
                <motion.div 
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`fixed bottom-0 left-0 right-0 z-[101] rounded-t-[32px] overflow-hidden shadow-2xl max-h-[85vh] flex flex-col ${theme.modalBg}`}
                >
                    {/* Header */}
                    <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                        <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
                            <ShoppingBag size={20} />
                            {lang === 'en' ? 'Your Order' : 'طلباتك'}
                        </h2>
                        <button onClick={() => setIsOpen(false)} className={`p-2 rounded-full transition-colors ${theme.iconBtn}`}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${theme.itemBg}`}>
                                
                                {/* 1. Qty Controls (Compact Vertical) */}
                                <div className={`flex flex-col items-center justify-between h-20 w-8 rounded-full py-1 ${isDark ? 'bg-black/20' : 'bg-black/5'}`}>
                                    <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className={`p-1 transition-colors ${theme.iconBtn}`}><Plus size={14}/></button>
                                    <span className="text-xs font-bold">{item.quantity}</span>
                                    <button onClick={() => item.quantity > 1 ? onUpdateQty(item.id, item.quantity - 1) : onRemove(item.id)} className={`p-1 transition-colors ${theme.iconBtn}`}><Minus size={14}/></button>
                                </div>

                                {/* 2. Image Thumbnail */}
                                <div className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden relative shadow-sm ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                    {item.image_url ? (
                                        <BlurImage src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] opacity-50">IMG</div>
                                    )}
                                </div>

                                {/* 3. Text Details */}
                                <div className="flex-1 min-w-0 px-1">
                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">
                                        {lang === 'en' ? item.name_en : item.name_ar}
                                    </h3>
                                    <div className={`text-xs ${theme.textMuted}`}>
                                        {Number(item.price).toLocaleString()} {currency}
                                    </div>
                                </div>

                                {/* 4. Total & Remove */}
                                <div className="flex flex-col items-end gap-3 pr-1">
                                    <span className="font-bold text-sm">
                                        {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                    <button onClick={() => onRemove(item.id)} className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Total */}
                    <div className={`p-6 border-t safe-area-bottom ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className={`text-sm font-medium ${theme.textMuted}`}>{lang === 'en' ? 'Total Amount' : 'المبلغ الكلي'}</span>
                            <span className="text-2xl font-black tracking-tight">{formattedTotal} <span className="text-sm font-normal opacity-70">{currency}</span></span>
                        </div>
                        <button 
                            onClick={onClear}
                            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 ${theme.clearBtn}`}
                        >
                            {lang === 'en' ? 'Clear Order' : 'مسح القائمة'}
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;