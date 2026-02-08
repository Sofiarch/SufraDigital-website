import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import BlurImage from './BlurImage';

const Cart = ({ cart = [], onUpdateQty, onRemove, onClear, currency = "IQD", lang = 'en', isDark = false, accentColor = "#D4AF37" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formattedTotal = totalPrice.toLocaleString();

  if (totalItems === 0) return null;

  // Colors based on Traditional Theme
  const bgColor = isDark ? '#1C1917' : '#FDF6E3';
  const textColor = isDark ? '#E7E5E4' : '#292524';
  const cardBg = isDark ? '#292524' : '#FFF';
  const borderColor = isDark ? '#44403C' : '#E7E5E4';

  return (
    <>
      {/* --- FLOATING MINIMIZED BAR (Bottom) --- */}
      <AnimatePresence>
        {!isOpen && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-4 right-4 z-50 cursor-pointer"
            >
                <div 
                    className="max-w-2xl mx-auto h-16 rounded-full shadow-2xl flex items-center justify-between px-2 pr-6 border relative overflow-hidden"
                    style={{ 
                        backgroundColor: isDark ? 'rgba(28, 25, 23, 0.95)' : 'rgba(253, 246, 227, 0.95)',
                        borderColor: accentColor,
                        backdropFilter: 'blur(12px)'
                    }}
                >
                    {/* Progress Bar Effect (Optional visual flair) */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 w-full" style={{ color: accentColor }} />

                    {/* Left: Badge */}
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white shadow-lg"
                            style={{ backgroundColor: accentColor }}
                        >
                            {totalItems}
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider" style={{ color: textColor }}>
                                {lang === 'en' ? 'Total' : 'المجموع'}
                            </span>
                            <span className="font-bold text-lg" style={{ color: textColor }}>
                                {formattedTotal} <span className="text-xs font-normal opacity-70">{currency}</span>
                            </span>
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest" style={{ color: accentColor }}>
                        {lang === 'en' ? 'View Cart' : 'عرض السلة'}
                        <ShoppingBag size={18} />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- EXPANDED DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                />
                
                {/* Drawer */}
                <motion.div 
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] rounded-t-[32px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t flex flex-col max-h-[85vh]"
                    style={{ 
                        backgroundColor: bgColor,
                        borderColor: accentColor,
                        color: textColor
                    }}
                >
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center relative" style={{ borderColor }}>
                        {/* Decorative Pattern Background on Header */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
                        
                        <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-3 relative z-10" style={{ color: accentColor }}>
                            <ShoppingBag size={24} />
                            {lang === 'en' ? 'Your Feast' : 'وليمتك'}
                        </h2>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors relative z-10"
                            style={{ color: textColor }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {cart.map(item => (
                            <motion.div 
                                layout
                                key={item.id} 
                                className="flex items-center gap-4 p-3 rounded-2xl border shadow-sm transition-all"
                                style={{ backgroundColor: cardBg, borderColor: borderColor }}
                            >
                                {/* Image */}
                                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                                    {item.image_url ? (
                                        <BlurImage src={item.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs opacity-50">IMG</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base leading-tight mb-1 line-clamp-1">{lang === 'en' ? item.name_en : item.name_ar}</h3>
                                    <div className="text-sm font-medium opacity-60 mb-2">
                                        {Number(item.price).toLocaleString()} {currency}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="font-bold text-base">
                                        {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    
                                    <div className="flex items-center bg-black/5 rounded-full h-8 px-1" style={{ color: textColor }}>
                                        <button 
                                            onClick={() => item.quantity > 1 ? onUpdateQty(item.id, item.quantity - 1) : onRemove(item.id)}
                                            className="w-7 h-full flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                        >
                                            {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                        <button 
                                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                            className="w-7 h-full flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t relative" style={{ borderColor, backgroundColor: bgColor }}>
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm font-bold opacity-60 uppercase tracking-widest">
                                {lang === 'en' ? 'Total to Pay' : 'المبلغ النهائي'}
                            </span>
                            <span className="text-3xl font-black" style={{ color: accentColor }}>
                                {formattedTotal} <span className="text-sm font-medium opacity-70 text-current">{currency}</span>
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={onClear}
                                className="px-6 py-4 rounded-xl font-bold text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors uppercase tracking-wider"
                            >
                                {lang === 'en' ? 'Clear' : 'إفراغ'}
                            </button>
                            <button 
                                className="flex-1 py-4 rounded-xl font-black text-lg text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                                style={{ backgroundColor: accentColor }}
                            >
                                {lang === 'en' ? 'Checkout' : 'إتمام الطلب'}
                                <ArrowRight size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;