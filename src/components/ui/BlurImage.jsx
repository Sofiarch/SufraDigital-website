import React, { useState, useEffect } from 'react';

const BlurImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset loading state if src changes
  useEffect(() => {
    setLoading(true);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className} bg-gray-100`}>
      <img
        src={currentSrc}
        alt={alt}
        onLoad={() => setLoading(false)}
        className={`
          w-full h-full object-cover 
          transition-all duration-700 ease-out
          ${isLoading 
            ? 'scale-110 blur-lg grayscale opacity-0' // Start state
            : 'scale-100 blur-0 grayscale-0 opacity-100' // End state
          }
        `}
        {...props}
      />
    </div>
  );
};

export default BlurImage;