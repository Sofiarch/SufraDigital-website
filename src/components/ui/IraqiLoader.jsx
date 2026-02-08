import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const IraqiLoader = ({ isDark = true, isLoading = true, onEnter, restaurantName, logo }) => {
  // --- THEME COLORS ---
  const colors = {
    bg: isDark ? '#1C1917' : '#FDF6E3',
    text: isDark ? '#D4AF37' : '#5D4037', 
    subText: isDark ? 'rgba(231, 229, 228, 0.6)' : 'rgba(93, 64, 55, 0.7)',
    descText: isDark ? 'rgba(231, 229, 228, 0.5)' : 'rgba(93, 64, 55, 0.6)',
    pattern: isDark ? '#D4AF37' : '#5D4037',
    btnStart: isDark ? '#D4AF37' : '#5D4037',
    btnEnd: isDark ? '#F59E0B' : '#3E2723',
    btnShadow: isDark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(93, 64, 55, 0.3)'
  };

  return (
    <motion.div 
        // ✅ FIXED: Increased z-index to 9999 to stay above 3D Gallery (z-100)
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-cairo overflow-hidden transition-colors duration-500 text-center px-6"
        style={{ backgroundColor: colors.bg }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8 } }}
    >
      
      {/* 1. BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
         <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${colors.pattern} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
      </div>

      {/* 2. ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none" 
           style={{ backgroundColor: colors.btnStart }} />

      {/* 3. CONTENT CONTAINER */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg">
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Animated Logo Reveal */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-40 h-40 md:w-56 md:h-56"
                    >
                        {logo ? (
                            <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
                        )}
                    </motion.div>

                    {/* Loading Text */}
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl md:text-5xl font-black tracking-wide drop-shadow-lg" style={{ color: colors.text }}>
                            {restaurantName || "حبايبنا"}
                        </h2>
                        
                        {/* Bouncing Dots */}
                        <div className="flex items-center gap-2 justify-center my-4">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>

                        <p className="text-lg md:text-xl font-bold opacity-80" style={{ color: colors.subText }}>
                            يا هلا بيك... دا نحضرلك المكان
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Logo (Static) */}
                    <div className="w-48 h-48 md:w-64 md:h-64 relative mb-2">
                        {logo && <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />}
                    </div>

                    {/* Welcome Messages */}
                    <div className="text-center space-y-4">
                        <h2 className="text-5xl md:text-6xl font-black tracking-wide leading-tight" style={{ color: colors.text }}>
                            أهلاً بك
                        </h2>
                        <h3 className="text-xl md:text-2xl font-bold" style={{ color: colors.text }}>
                            الأكل العراقي على أصوله
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed max-w-md mx-auto" style={{ color: colors.descText }}>
                            تذوق طعم الكرم العراقي الأصيل مع أطباقنا المميزة التي تأخذك في رحلة إلى قلب بغداد.
                        </p>
                    </div>

                    {/* Enter Button */}
                    <button 
                        onClick={onEnter}
                        className="group relative px-10 py-4 mt-4 text-white font-black text-xl rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
                        style={{ 
                            background: `linear-gradient(to right, ${colors.btnStart}, ${colors.btnEnd})`,
                            boxShadow: `0 15px 30px ${colors.btnShadow}`
                        }}
                    >
                        <span className="relative z-10 pb-1">عرض القائمة</span>
                        <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default IraqiLoader;