import React from 'react';
import { motion } from 'framer-motion';

const SubCategoryCard = ({ subcategory, onClick, lang, accentColor }) => {
  const name = lang === 'en' ? subcategory.name_en : subcategory.name_ar;
  const image = subcategory.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'; 

  return (
    <motion.div onClick={() => onClick(subcategory.id)} whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} className="w-full relative h-[180px] rounded-[24px] overflow-hidden mb-4 cursor-pointer flex-shrink-0 shadow-2xl border border-white/10 group mx-auto">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-0 w-full p-6 text-center">
        <h2 className="text-white z-10 text-xl font-bold tracking-widest uppercase drop-shadow-lg font-sans">{name}</h2>
        <div className="w-8 h-1 mx-auto mt-3 rounded-full opacity-80 group-hover:w-16 transition-all duration-300" style={{ backgroundColor: accentColor }} />
      </div>
    </motion.div>
  );
};
export default SubCategoryCard;