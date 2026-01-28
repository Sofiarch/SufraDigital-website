import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlurImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 1.05 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onLoad={() => setLoading(false)}
        className={`w-full h-full object-cover transition-all duration-700 ${isLoading ? 'grayscale blur-lg' : 'grayscale-0 blur-0'}`}
        {...props}
      />
    </div>
  );
};
export default BlurImage;