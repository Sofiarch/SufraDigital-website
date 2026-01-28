import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ 
  categories, 
  activeCat, 
  setActiveCat, 
  lang = 'en', 
  isDark = false, 
  accentColor // <--- Prop received here
}) => {
  return (
    <div className={`sticky top-[73px] z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
      isDark ? 'bg-[#121212]/60 border-white/5' : 'bg-white/80 border-gray-100'
    }`}>
      <div className="flex p-4 gap-3 max-w-7xl mx-auto overflow-x-auto no-scrollbar mask-gradient">
        {categories.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button 
              key={cat.id} 
              onClick={() => setActiveCat(cat.id)}
              className="relative px-6 py-2.5 rounded-xl text-[14px] font-bold transition-colors duration-300 isolate"
              style={{
                color: isActive ? '#000' : (isDark ? '#9ca3af' : '#1f2937')
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{ 
                    backgroundColor: accentColor, // <--- Dynamic Color
                    boxShadow: `0 0 15px ${accentColor}40` 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {lang === 'en' ? cat.name_en : cat.name_ar}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;